import { CodeWalkerResultHandler } from '..';
import { CodeWalkerOptions } from './code-walker-options.interface';
import { CodeWalkerResultBase } from '../classes/code-walker-result-base.class';
import { SourceFileHandler } from '../types/source-file-handler.type';

/**
 * Represents the hook for communicating the run-time intent of this analyzer to the analyzer engine.
 */
export interface RepoAnalysisContext {

  /**
   * Registers a handler that is to be called for each source file during analyzation.
   * @param handler
   */
  registerHandler(handler: SourceFileHandler): void;

  /**
   * Registers a walker that is to be called during analyzation.
   *
   * @param walker The walker
   * @param handler A handler to be called with the results of the walker
   * @param options An optional options object to be supplied to the walker
   */
  registerWalker<TWalker extends { new(...args: any[]): InstanceType<TWalker> }, TResult extends CodeWalkerResultBase, TOptions extends CodeWalkerOptions>(walker: TWalker, handler: CodeWalkerResultHandler<TResult>, options?: TOptions): void;

  /**
   * Write an info message to the current logger.
   * @param message
   */
  log(message: string): void;

  /**
   * TODO:
   * It would be great to offer an API that infers the correct TOption and TResult type
   * depending on the class type passed to the registration functions so the client does not
   * have to do this manually. AFAIK this is not possible with the current approach that works by
   * passing the class constructor (see the links below for example).
   *
   * https://stackoverflow.com/questions/52655236/typescript-instancetype-with-generic-parameter
   */
}

