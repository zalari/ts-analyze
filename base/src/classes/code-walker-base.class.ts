import { CodeWalkerImplementation, CodeWalkerImplementationInterface, CodeWalkerResultBase, RepoAnalysisContextImplementation } from '..';
import { CompilerNodeToWrappedType, Node as TsMorphNode } from 'ts-morph';
import { AbstractWalker, Fix } from 'tslint';
import { Node, SourceFile } from 'typescript';
import { WalkerLanguageService } from './walker-language-service.class';

/**
 * Abstract base class for implementing manual code walkers.
 *
 * Works by implementing the {@link walk} method.
 */
export abstract class CodeWalkerBase<TOptions> extends AbstractWalker<TOptions> implements CodeWalkerImplementationInterface {
  private __getWalkerType() { return 'manual'; };

  private readonly _implementation: CodeWalkerImplementation;

  constructor(sourceFile: SourceFile, ruleName: string, options: TOptions, context?: RepoAnalysisContextImplementation) {
    super(sourceFile, ruleName, options);
    this._implementation = new CodeWalkerImplementation(context);
  }

  /**
   * @inheritdoc
   */
  get languageService(): WalkerLanguageService {
    return this._implementation.languageService;
  }

  /**
   * This method is called for every typscript file found during analysis.
   * @param sourceFile The source file object as supplied by the TypesScript API.
   * It is recommended that you use this with {@link wrap} for getting access to the ts-morph-based API.
   */
  abstract walk(sourceFile: SourceFile): void;

  /**
   * @inheritdoc
   */
  addResult(result: CodeWalkerResultBase): void {
    this._implementation.addResult(result);
  }

  /**
   * @inheritdoc
   */
  attach<T extends TsMorphNode>(unattachedNode: T): TsMorphNode {
    return this._implementation.attach(unattachedNode);
  }

  /**
   * @inheritdoc
   */
  getResults<T extends any>(): CodeWalkerResultBase<T>[] {
    return this._implementation.getResults();
  }

  /**
   * @inheritdoc
   */
  wrap<T extends Node>(node: T): CompilerNodeToWrappedType<T> {
    return this._implementation.wrap(node);
  }

  /**
   * @inheritdoc
   */
  addFailureAt(start: number, width: number, failure: string, fix?: Fix): void {
    super.addFailureAt(start, width, failure, fix);
  }

  /**
   * @inheritdoc
   */
  addFailure(start: number, end: number, failure: string, fix?: Fix): void {
    super.addFailure(start, end, failure, fix);
  }

  /**
   * @inheritdoc
   */
  addFailureAtNode(node: Node, failure: string, fix?: Fix): void {
    super.addFailureAtNode(node, failure, fix);
  }
}

