import * as ts from 'typescript';
import * as tsMorph from 'ts-morph';
import { CodeWalkerResultBase } from '..';

export interface CodeWalkerImplementationInterface {
  wrap<T extends ts.Node>(node: T): tsMorph.CompilerNodeToWrappedType<T>;

  addResult(result: CodeWalkerResultBase): void;

  getResults(): CodeWalkerResultBase[];
}
