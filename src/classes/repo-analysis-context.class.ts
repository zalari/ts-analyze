import { RepoAnalyzerEngine, CodeWalkerResultHandler, RepoAnalyzerBase } from '..';
import * as winston from 'winston';
import { LanguageService, Project, Node } from 'ts-morph';

/**
 * Represents the hook for communicating the run-time intent of this analyzer to the analyzer engine.
 */
export class RepoAnalysisContext {
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
  registerWalker<TWalker extends { new (...args: any[]): InstanceType<TWalker> } & { }>(walker: TWalker, handler?: CodeWalkerResultHandler<any>): void
  
  /**
   * Registers a walker that is to be called during analyzation.
   * 
   * @param walker The walker
   * @param options The options object to be supplied to the walker
   */
  registerWalker<TWalker extends { new (...args: any[]): InstanceType<TWalker> } & { }, TOptions extends object>(walker: TWalker, options?: TOptions): void
  
  /**
   * Registers a walker that is to be called during analyzation.
   * 
   * @param walker The walker
   * @param handler A handler to be called with the results of the walker
   * @param options The options object to be supplied to the walker
   */
  registerWalker<TWalker extends { new (...args: any[]): InstanceType<TWalker> } & { }, TOptions extends object>(walker: TWalker, handler?: CodeWalkerResultHandler<any>, options?: TOptions): void
  registerWalker<TWalker extends { new (...args: any[]): InstanceType<TWalker> } & { }, TOptions extends object>(walker: TWalker, handlerOrOptions?: CodeWalkerResultHandler<any> | TOptions, options?: TOptions): void {
    this._runner.registerWalker(this._analyzer, walker, handlerOrOptions, options);
  }

  /**
   * Gets the language service provided by ts-morph.
   */
  getLanguageService(): LanguageService {
    return this._project.getLanguageService();
  }

  /**
   * Provided a ts-morph node that is not attached to the project gets the respective attached node.
   * @param unattachedNode 
   */
  getAttachedNode<T extends Node>(unattachedNode: T): T {
    const sourceFile = this._project.getSourceFileOrThrow(unattachedNode.getSourceFile().getFilePath());
    const child = sourceFile.getDescendantAtStartWithWidth( unattachedNode.getStart(), unattachedNode.getWidth());

    return child as T;
  }
  
  /**
   * Write an info message to the current logger.
   * @param message 
   */
  log(message: string): void {
    this._logger.info(message);
  }
}
