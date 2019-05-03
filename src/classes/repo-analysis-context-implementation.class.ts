import { CodeWalkerResultHandler, RepoAnalyzerBase, RepoAnalyzerEngine } from '..';
import * as winston from 'winston';
import { LanguageService, Node, Project } from 'ts-morph';
import { RepoAnalysisContext } from '../interfaces/repo-analysis-context.interface';

/**
 * Represents the hook for communicating the run-time intent of this analyzer to the analyzer engine.
 */
export class RepoAnalysisContextImplementation implements RepoAnalysisContext {
  constructor(
    private _runner: RepoAnalyzerEngine,
    private _project: Project,
    private _analyzer: RepoAnalyzerBase<any>,
    private _logger: winston.Logger) {
  }

  /**
   * Registers a walker that is to be called during analyzation.
   *
   * @param walker The walker
   * @param handler A handler to be called with the results of the walker
   */
  registerWalker<TWalker extends { new(...args: any[]): InstanceType<TWalker> } & {}>(walker: TWalker, handler?: CodeWalkerResultHandler<any>): void

  /**
   * Registers a walker that is to be called during analyzation.
   *
   * @param walker The walker
   * @param options The options object to be supplied to the walker
   */
  registerWalker<TWalker extends { new(...args: any[]): InstanceType<TWalker> } & {}, TOptions extends object>(walker: TWalker, options?: TOptions): void

  /**
   * Registers a walker that is to be called during analyzation.
   *
   * @param walker The walker
   * @param handler A handler to be called with the results of the walker
   * @param options The options object to be supplied to the walker
   */
  registerWalker<TWalker extends { new(...args: any[]): InstanceType<TWalker> } & {}, TOptions extends object>(walker: TWalker, handler?: CodeWalkerResultHandler<any>, options?: TOptions): void
  registerWalker<TWalker extends { new(...args: any[]): InstanceType<TWalker> } & {}, TOptions extends object>(walker: TWalker, handlerOrOptions?: CodeWalkerResultHandler<any> | TOptions, options?: TOptions): void {
    this._runner.registerWalker(this._analyzer, walker, handlerOrOptions, options);
  }

  /**
   * Gets the language service provided by ts-morph.
   */
  get project(): Project {
    return this._project;
  }

  /**
   * Write an info message to the current logger.
   * @param message
   */
  log(message: string): void {
    this._logger.info(message);
  }
}
