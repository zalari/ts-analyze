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
    .command('run-analyzer [analyzer] [path] [searchPathsAndOptions..]', 'runs an analyzer on the provided path', (y) => {
      y.positional('analyzer', {
        describe: 'analyzer to run'
      });

      y.positional('path', {
        describe: 'root path to run analyzer on'
      });

      y.positional('searchPathsAndOptions', {
        describe: 'Allows passing search paths (relative to the root path) and options (as key value pairs) to pass to the parameter.'
      })

      y.option('out',{
        alias: 'o',
        type: 'string',
        describe: 'output analyzer result to file',
      })

      return y;
    }, (args) => {
      const analyzerName = args.analyzer as string;
      const searchPathsAndOptions = parseSearchPathsAndOptions(args.searchPathsAndOptions as string[])

      let searchPaths;
      let options;

      if (searchPathsAndOptions) {
        searchPaths = searchPathsAndOptions.searchPaths;
        options = searchPathsAndOptions.options;        
      }

      const analyzerInstance = loadAnalyzer(analyzerName, '.', searchPaths, options);

      const engine = new RepoAnalyzerEngine(path.resolve(args.path as string), logger);

      const result = engine.run(analyzerInstance);

      if (args.o) {
        fs.writeFileSync(path.resolve(args.o as string), result, { mode: 'w'});
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

function parseSearchPathsAndOptions(rawStrings: string[]): { options: object, searchPaths: string[] } | undefined {
  if (!rawStrings) {
    return undefined;
  }

  if (rawStrings.length === 0) {
    return undefined;
  }

  const options = Object.create(null);
  const searchPaths: string[] = [];
  
  try {
    rawStrings.forEach(s => {
      const [key, value] = s.split('=');
      if (key && value) {      
       options[camelCase(key)] = value;
      } else {
        searchPaths.push(s);
      }
    });
  } catch {
    throw new Error('Invalid options/searchPaths supplied');
  }

  if (searchPaths.length === 0) {
    searchPaths.push('.');
  }

  return { options, searchPaths };
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