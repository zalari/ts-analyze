import { CodeWalkerResultHandler } from '..';
import { WalkerOptions } from './walker-options.interface';

export interface RepoAnalysisContext {
  /**
   * Registers a walker that is to be called during analyzation.
   *
   * @param walker The walker
   * @param handler A handler to be called with the results of the walker
   */
  registerWalker<TWalker extends { new(...args: any[]): InstanceType<TWalker> } & {}>(walker: TWalker, handler?: CodeWalkerResultHandler<any>): void;

  /**
   * Registers a walker that is to be called during analyzation.
   *
   * @param walker The walker
   * @param options The options object to be supplied to the walker
   */
  registerWalker<TWalker extends { new(...args: any[]): InstanceType<TWalker> } & {}, TOptions extends WalkerOptions>(walker: TWalker, options?: TOptions): void;

  /**
   * Registers a walker that is to be called during analyzation.
   *
   * @param walker The walker
   * @param handler A handler to be called with the results of the walker
   * @param options The options object to be supplied to the walker
   */
  registerWalker<TWalker extends { new(...args: any[]): InstanceType<TWalker> } & {}, TOptions extends WalkerOptions>(walker: TWalker, handler?: CodeWalkerResultHandler<any>, options?: TOptions): void;

  registerWalker<TWalker extends { new(...args: any[]): InstanceType<TWalker> } & {}, TOptions extends WalkerOptions>(walker: TWalker, handlerOrOptions?: CodeWalkerResultHandler<any> | TOptions, options?: TOptions): void;

  /**
   * Write an info message to the current logger.
   * @param message
   */
  log(message: string): void;
}