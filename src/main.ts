#!/usr/bin/env node
// tslint:disable:no-implicit-dependencies
import * as yargs from 'yargs';
import * as winston from 'winston';
import * as path from 'path';
import * as fs from 'fs';

import { RepoAnalyzerEngine } from './classes/repo-analyzer-engine.class';
import { pascalCase } from 'change-case';
import { RepoAnalyzerWithOptionsBase } from './classes/repo-analyzer-with-options-base.class';
import { RepoAnalyzerBase } from '.';

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(
      { format: winston.format.combine(winston.format.colorize(), winston.format.simple()) })

  ]
});

try {
  yargs
    .command('run-analyzer <analyzer> <path>', 'runs an analyzer on the provided path', (y) => {
      return y
        .positional('analyzer', {
          type: 'string',
          describe: 'analyzer to run'
        })
        .positional('path', {
          type: 'string',
          describe: 'root path to run analyzer on'
        })
        .option('options', {
          type: 'string',
          describe: 'options as JSON string or path to a JSON file to be send to the analyzer'
        })
        .option('sub-paths', {
          type: 'array',
          describe: 'relative (to root path) to apply the analyzer on'
        })
        .option('json', {
          type: 'string',
          describe: 'output analyzer result to specified json file'
        });
    }, (args) => {
      const analyzerName = args.analyzer as string;
      const rootPath = args.path;
      const options = parseOptions(args.options);
      const searchPaths = args.subPaths;

      const loadAnalyzerResult = loadAnalyzer(analyzerName, options, '.', searchPaths);

      const engine = new RepoAnalyzerEngine(path.resolve(rootPath as string), logger);

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

function parseOptions(jsonStringOrPath?: string): object | undefined {
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

  logger.error('Could not read options.');
  process.exit(1);
}

function loadAnalyzer(name: string, options?: any, ...args: any[]) {
  const expectedFilePath = path.join(process.cwd(), 'dist', 'analyzers', `${ name }-analyzer.js`);

  if (!fs.existsSync(expectedFilePath)) {
    throw new Error(`Could not locate analyzer: ${ expectedFilePath }`);
  }

  const analyzerExport = require(expectedFilePath)[pascalCase(`${ name }-analyzer`)];
  const instance = new analyzerExport(...args, options);

  if (isAnalyzerWithOptions(instance)) {    
    const exampleOptions = instance.getExampleOptions();
    const exampleOptionsAsJson = JSON.stringify(exampleOptions, null, 2);

    if (!options) {
      logger.error(`Analyzer requires options. Example Options: ${exampleOptionsAsJson}`);
      process.exit(1);
    }
  }

  return instance;
}

function isAnalyzerWithOptions(arg: any): arg is RepoAnalyzerWithOptionsBase<any, any> {
  return arg.getExampleOptions && typeof arg.getExampleOptions === 'function';
}
