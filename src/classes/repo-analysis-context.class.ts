import { RepoAnalyzerEngine,  CodeWalkerResultHandler, RepoAnalyzerBase } from '..';
import * as winston from 'winston';

export class RepoAnalysisContext {
  constructor(
    private _runner: RepoAnalyzerEngine,
    private _analyzer: RepoAnalyzerBase,
    private _logger: winston.Logger) { 
  }

  registerWalker<T extends { new (...args: any[]): InstanceType<T> } & { }>(walker: T, handler?: CodeWalkerResultHandler): void {
    this._runner.registerWalker(this._analyzer, walker, handler);
  }

  log(message: string) {
    this._logger.info(message);
  }
}
