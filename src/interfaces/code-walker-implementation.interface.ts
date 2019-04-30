import * as ts from 'typescript';
import * as tsMorph from 'ts-morph';
import { CodeWalkerResultBase } from '..';
import { CodeWalkerNodeResult } from '../classes/code-walker-node-result.class';

export interface CodeWalkerImplementationInterface {
  attach<T extends tsMorph.Node>(unattachedNode: T): tsMorph.Node;
  
  wrap<T extends ts.Node>(node: T): tsMorph.CompilerNodeToWrappedType<T>;

  addResult(result: CodeWalkerResultBase): void;

  getResults(): CodeWalkerResultBase[];
}
