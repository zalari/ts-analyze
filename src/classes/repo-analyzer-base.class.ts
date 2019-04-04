import winston from 'winston';
import { RepoAnalysisContext } from '..';
import { RepoAnalyzerResultBase } from './repo-analyzer-result-base.class';

export abstract class RepoAnalyzerBase {
  private readonly _logger!: winston.Logger;

  constructor(public analysisRootPath: string, public analysisSearchPaths: string[] = ['.']) {
  }

  abstract initialize(context: RepoAnalysisContext): void;
  abstract getResult(): RepoAnalyzerResultBase<any>;
}