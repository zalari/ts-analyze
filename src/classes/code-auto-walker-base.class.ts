import { CodeWalkerResultBase, CodeWalkerImplementation, CodeWalkerImplementationInterface, RepoAnalysisContextImplementation } from '..';
import { CompilerNodeToWrappedType, Node as TsMorphNode } from 'ts-morph';
import { Fix, RuleFailure, IOptions, RuleWalker } from 'tslint';
import { Node, SourceFile, } from 'typescript';

/**
 * Abstract base class for implementing automatic code walkers.
 * Works by overriding the necessary visitXYZ methods.
 * 
 * NOTE: For performance reasons you should prefer {@link CodeWalkerBase} if possible.
 */
export abstract class CodeAutoWalkerBase extends RuleWalker implements CodeWalkerImplementationInterface {
  private readonly _implementation: CodeWalkerImplementation; 

  constructor(sourceFile: SourceFile, options: IOptions = { ruleName: 'default', ruleArguments: [], ruleSeverity: 'off', disabledIntervals: [] }, context?: RepoAnalysisContextImplementation) {
    super(sourceFile, options);
    this._implementation = new CodeWalkerImplementation(context);
  }

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
  getResults(): CodeWalkerResultBase[] {
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
  addFailure(failure: RuleFailure): void {
    if (this.getSourceFile()) {
      super.addFailure(failure);
    }
  }

  /**
   * @inheritdoc
   */
  addFailureFromStartToEnd(start: number, end: number, failure: string, fix?: Fix): void {
    if (this.getSourceFile()) {
      super.addFailureFromStartToEnd(start, end, failure, fix);
    }
  }

  /**
   * @inheritdoc
   */
  addFailureAtNode(node: Node, failure: string, fix?: Fix): void {
    if (this.getSourceFile()) {
      super.addFailureAtNode(node, failure, fix);
    }
  }
}