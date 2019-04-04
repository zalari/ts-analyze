import { CodeWalkerResultBase, CodeWalkerImplementation, CodeWalkerImplementationInterface } from '..';
import { CompilerNodeToWrappedType } from 'ts-morph';
import { Fix, RuleFailure, IOptions, RuleWalker } from 'tslint';
import { Node, SourceFile, } from 'typescript';

export abstract class CodeAutoWalkerBase extends RuleWalker implements CodeWalkerImplementationInterface {
  private readonly implementation = new CodeWalkerImplementation();

  constructor(sourceFile: SourceFile, options: IOptions = { ruleName: 'default', ruleArguments: [], ruleSeverity: 'off', disabledIntervals: [] }) {
    super(sourceFile, options);
  }

  addResult(result: CodeWalkerResultBase): void {
    this.implementation.addResult(result);
  }

  getResults(): CodeWalkerResultBase[] {
    return this.implementation.getResults();
  }

  wrap<T extends Node>(node: T): CompilerNodeToWrappedType<T> {
    return this.implementation.wrap(node);
  }

  addFailure(failure: RuleFailure): void {
    if (this.getSourceFile()) {
      super.addFailure(failure);
    }
  }

  addFailureFromStartToEnd(start: number, end: number, failure: string, fix?: Fix): void {
    if (this.getSourceFile()) {
      super.addFailureFromStartToEnd(start, end, failure, fix);
    }
  }

  addFailureAtNode(node: Node, failure: string, fix?: Fix): void {
    if (this.getSourceFile()) {
      super.addFailureAtNode(node, failure, fix);
    }
  }
}