import { CodeWalkerResultBase, CodeWalkerResultHandler, RepoAnalyzerBase, RepoAnalyzerEngine } from '..';
import * as winston from 'winston';
import { Project } from 'ts-morph';
import { RepoAnalysisContext } from '../interfaces/repo-analysis-context.interface';
import { CodeWalkerOptions } from '../interfaces/code-walker-options.interface';
import { SourceFileHandler } from '../types/source-file-handler.type';

export class RepoAnalysisContextImplementation implements RepoAnalysisContext {

  constructor(
    private _engine: RepoAnalyzerEngine,
    private _project: Project,
    private _analyzer: RepoAnalyzerBase<any>,
    private _logger: winston.Logger) {
  }

  registerHandler(handler: SourceFileHandler): void {
    this._engine.registerIndependentHandler(this._analyzer, handler);
  }

  registerWalker<TWalker extends { new(...args: any[]): InstanceType<TWalker> }, TResult extends CodeWalkerResultBase, TOptions extends CodeWalkerOptions>(walker: TWalker, handler: CodeWalkerResultHandler<TResult>, options?: TOptions): void {
    this._engine.registerWalker(this._analyzer, walker, handler, options);
  }

  get project(): Project {
    return this._project;
  }

  log(message: string): void {
    this._logger.info(message);
  }
}
