import { CodeWalkerImplementationInterface, CodeWalkerResultBase, CodeWalkerDataResult, RepoAnalysisContextImplementation } from '..';
import * as ts from 'typescript';
import * as tsMorph from 'ts-morph';
import { CodeWalkerNodeResult } from './code-walker-node-result.class';
import { CodeWalkerResultKind } from '../enums/code-walker-result-kind.enum';

export class CodeWalkerImplementation implements CodeWalkerImplementationInterface {  
  private readonly _results: CodeWalkerResultBase[] = [];
  
  constructor(private _context?: RepoAnalysisContextImplementation) {
  }
  
  wrap<T extends ts.Node>(node: T): tsMorph.CompilerNodeToWrappedType<T> {
    return tsMorph.createWrappedNode(node);
  }

  addResult(result: CodeWalkerResultBase): void {
    if (this.isNodeResult(result) && this._context) {
      const attachedNode = this._context.getAttachedNode(result.data);
      this._results.push(new CodeWalkerNodeResult(attachedNode));
    } else {
      this._results.push(result);
    }
  }

  getResults(): CodeWalkerResultBase[] {
    return Array.from(this._results);
  }

  private isNodeResult(arg: CodeWalkerResultBase): arg is CodeWalkerNodeResult {
    return this.isDataResult(arg) && arg.data.compilerNode;
  }

  private isDataResult(arg: CodeWalkerResultBase): arg is CodeWalkerDataResult<any> {
    return arg.kind === CodeWalkerResultKind.Data;
  }
}