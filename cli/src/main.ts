#!/usr/bin/env node
// tslint:disable:no-implicit-dependencies
import * as yargs from 'yargs';
import * as winston from 'winston';
import * as path from 'path';
import * as fs from 'fs';

import { RepoAnalyzerEngine } from '@zalari/repo-analyzers-base/dist/index';
import { pascalCase } from 'change-case';
import { RepoAnalyzerWithOptionsBase } from '@zalari/repo-analyzers-base';

class Main {
  private readonly logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      transports: [
        new winston.transports.Console(
          { format: winston.format.combine(winston.format.colorize(), winston.format.simple()) })

      ]
    });
  }

  run() {
    try {
      yargs
        .command('run-analyzer <analyzer> <analysis-root>', 'runs an analyzer on the provided path', (y) => {
          return y
            .positional('analyzer', {
              type: 'string',
              describe: 'analyzer to run'
            })
            .positional('analysis-root', {
              type: 'string',
              describe: 'root path to run analyzer on'
            })
            .option('options', {
              alias: 'o',
              type: 'string',
              describe: 'options as JSON string or path to a JSON file to be send to the analyzer'
            })
            .option('sub-paths', {
              alias: 'p',
              type: 'array',
              describe: 'relative (to root path) to apply the analyzer on'
            })
            .option('json', {
              alias: 'j',
              type: 'string',
              describe: 'output analyzer result to specified json file'
            })
            .option('analyzers-root', {
              type: 'string',
              describe: 'root path where transpiled analyzers are located',
              default: path.join(process.cwd(), './dist/analyzers')
            });
        }, (args) => {

          const rootPath = args['analysis-root'];
          const options = this.parseOptions(args.options);
          const searchPaths = args.subPaths;
          const analyzersRoot = args['analyzers-root'];

          if (typeof args.analyzer !== 'string') {
            throw new Error();
          }

          let pathToAnalyzer;

          if (args.analyzer.endsWith('.js')) {
            pathToAnalyzer = path.resolve(args.analyzer);
          } else {
            pathToAnalyzer = path.resolve(analyzersRoot, `${ args.analyzer }-analyzer.js`);
          }

          const loadAnalyzerResult = this.loadAnalyzer(pathToAnalyzer, options, '.', searchPaths);

          const engine = new RepoAnalyzerEngine(path.resolve(rootPath as string), this.logger);

          const result = engine.run(loadAnalyzerResult);

          if (args.json) {
            fs.writeFileSync(path.resolve(args.json as string), result.asJson());
          } else {
            console.log(result.asJson());
          }

        })
        .demandCommand(1, 'Please provide a command')
        .help()
        .argv;

    } catch (e) {
      console.error(e);
      process.exit(1);
    }

    process.exit(0);
  }

  private loadAnalyzer(expectedFilePath: string, options?: any, ...args: any[]) {
    if (!fs.existsSync(expectedFilePath)) {
      throw new Error(`Could not locate analyzer: ${ expectedFilePath }`);
    }

    const fileName = path.basename(expectedFilePath);
    const expectedClassName = fileName.substring(0, fileName.length - 3);

    const analyzerExport = require(expectedFilePath)[pascalCase(expectedClassName)];
    const instance = new analyzerExport(...args, options);

    if (Main.isAnalyzerWithOptions(instance)) {
      const exampleOptions = instance.getExampleOptions();
      const exampleOptionsAsJson = JSON.stringify(exampleOptions, null, 2);

      if (!options) {
        this.logger.error(`Analyzer requires options. Example Options: ${ exampleOptionsAsJson }`);
        process.exit(1);
      }
    }

    return instance;
  }

  private static isAnalyzerWithOptions(arg: any): arg is RepoAnalyzerWithOptionsBase<any, any> {
    return arg.getExampleOptions && typeof arg.getExampleOptions === 'function';
  }

  private parseOptions(jsonStringOrPath?: string): object | undefined {
    if (!jsonStringOrPath) {
      return undefined;
    }

    const tryParseJson = (json: string) => {
      try {
        return JSON.parse(json);
      } catch (e) {
        return undefined;
      }
    };

    const tryReadJsonFile = (filePath: string) => {
      try {
        return fs.readFileSync(path.join(process.cwd(), filePath), { encoding: 'utf8' });
      } catch (e) {
        return undefined;
      }
    };

    let options;
    options = tryParseJson(jsonStringOrPath);

    if (options) {
      return options;
    }

    options = tryReadJsonFile(jsonStringOrPath);

    if (options) {
      options = tryParseJson(options);
    }

    if (options) {
      return options;
    }

    this.logger.error('Could not read options.');
    process.exit(1);
  }
}

const main = new Main();
main.run();