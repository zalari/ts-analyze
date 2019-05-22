#!/usr/bin/env node
// tslint:disable:no-implicit-dependencies
import * as yargs from 'yargs';
import * as winston from 'winston';
import * as path from 'path';
import * as fs from 'fs';

import { RepoAnalyzerEngine } from './classes/repo-analyzer-engine.class';
import { pascalCase, camelCase } from 'change-case';

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
          type: 'array',
          describe: 'options as key:value pairs to be send to the analyzer',
        })
        .option('sub-paths', {
          type: 'array',
          describe: 'relative (to root path) to apply the analyzer on',
        })
        .option('json', {
          type: 'string',
          describe: 'output analyzer result to specified json file',
        })
    }, (args) => {
      const analyzerName = args.analyzer as string;
      const rootPath = args.path;
      const options = parseOptions(args.options as string[])
      const searchPaths = args.subPaths;
  
      const analyzerInstance = loadAnalyzer(analyzerName, '.', searchPaths, options);

      const engine = new RepoAnalyzerEngine(path.resolve(rootPath as string), logger);

      const result = engine.run(analyzerInstance);

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

function parseOptions(rawStrings: string[]): object | undefined {
  if (!rawStrings) {
    return undefined;
  }

  if (rawStrings.length === 0) {
    return undefined;
  }

  const options = Object.create(null);

  try {
    rawStrings.forEach(s => {
      const [key, value] = s.split('=');
      if (key && value) {
        options[camelCase(key)] = value;
      }
    });
  } catch {
    throw new Error('Invalid options supplied');
  }

  return options;
}

function loadAnalyzer(name: string, ...args: any[]): any {
  const expectedFilePath = path.join(process.cwd(), 'dist', 'analyzers', `${name}-analyzer.js`);

  if (!fs.existsSync(expectedFilePath)) {
    throw new Error(`Could not locate analyzer: ${expectedFilePath}`);
  }

  const analyzerExport = require(expectedFilePath)[pascalCase(`${name}-analyzer`)];
  const instance = new analyzerExport(...args);

  return instance;
}
