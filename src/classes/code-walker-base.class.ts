import { CodeWalkerResultBase, CodeWalkerImplementation, CodeWalkerImplementationInterface } from '..';
import { CompilerNodeToWrappedType } from 'ts-morph';
import { Fix, AbstractWalker} from 'tslint';
import { Node, SourceFile, } from 'typescript';

export abstract class CodeWalkerBase<TOptions> extends AbstractWalker<TOptions> implements CodeWalkerImplementationInterface {
  private readonly _implementation: CodeWalkerImplementation = new CodeWalkerImplementation();
  
  abstract walk(sourceFile: SourceFile): void;

  addResult(result: CodeWalkerResultBase): void {
    this._implementation.addResult(result);
  }

  getResults(): CodeWalkerResultBase[] {
    return this._implementation.getResults();
  }

  wrap<T extends Node>(node: T): CompilerNodeToWrappedType<T> {
    return this._implementation.wrap(node);
  }

  addFailureAt(start: number, width: number, failure: string, fix?: Fix): void {
    super.addFailureAt(start, width, failure, fix);
  }

  addFailure(start: number, end: number, failure: string, fix?: Fix): void {
    super.addFailure(start, end, failure, fix);
  }

  addFailureAtNode(node: Node, failure: string, fix?: Fix): void {
    super.addFailureAtNode(node, failure, fix);
  }
}

