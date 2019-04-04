#!/usr/bin/env node
// tslint:disable:no-implicit-dependencies
import * as yargs from 'yargs';
import * as winston from 'winston';
import * as path from 'path';
import * as fs from 'fs';

import { RepoAnalyzerEngine } from './classes/repo-analyzer-engine.class';
import { TemplateAnalyzer } from '../analyzers/template-analyzer';
import { pascalCase } from 'change-case';

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(
      { format: winston.format.combine(winston.format.colorize(), winston.format.simple()) })

  ]
});

const engine = new RepoAnalyzerEngine('C:/Users/Christian/source/infrastructure-test', logger);

try {
  yargs
    .command('run-analyzer [analyzer]', 'runs an analyzer', (y) => {
        y.positional('analyzer', {
            describe: 'analyzer to run'
        });

        return y;
    }, (args) => {

        const analyzerName = args.analyzer as string;
        const analyzerInstance = loadAnalyzer(analyzerName, '.');

        const result = engine.run(analyzerInstance);

        console.log(result.asJson());
    })
    .demandCommand(1, 'Please provide a command')
    .help()
    .argv;

} catch (e) {
  logger.error(`Execution stopped due to an error.\n${e}`);
  process.exit(1);
}

process.exit(0);

function loadAnalyzer(name: string, ...args: any[]): any {
  const expectedFilePath = path.join(process.cwd(), 'dist', 'analyzers', `${name}-analyzer.js`);

  if (!fs.existsSync(expectedFilePath)) {
    throw new Error(`Could not find locate analyzer: ${expectedFilePath}`);
  }

  const analyzerExport = require(expectedFilePath)[pascalCase(`${name}-analyzer`)];
  const instance = new analyzerExport(...args);

  return instance;
}