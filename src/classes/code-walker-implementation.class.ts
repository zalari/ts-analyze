import { CodeWalkerImplementationInterface, CodeWalkerResultBase } from '..';
import * as ts from 'typescript';
import * as tsMorph from 'ts-morph';

export class CodeWalkerImplementation implements CodeWalkerImplementationInterface {
  private readonly _results: CodeWalkerResultBase[] = [];

  wrap<T extends ts.Node>(node: T): tsMorph.CompilerNodeToWrappedType<T> {
    return tsMorph.createWrappedNode(node);
  }

  addResult(result: CodeWalkerResultBase): void {
    this._results.push(result);
  }

  getResults(): CodeWalkerResultBase[] {
    return Array.from(this._results);
  }
}