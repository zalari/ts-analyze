import * as ts from 'typescript';
import * as tsMorph from 'ts-morph';
import { CodeWalkerResultBase } from '..';
import { CodeWalkerNodeResult } from '../classes/code-walker-node-result.class';

export interface CodeWalkerImplementationInterface {

  /**
   * Attaches the given node to the underlying compiled project.
   * This is necessary to perform operations that require symbol analysis.
   * 
   * @param unattachedNode An unattached node.
   * @returns The same node in attached state.
   */
  attach<T extends tsMorph.Node>(unattachedNode: T): tsMorph.Node;
  
  /**
   * Converts an a TypeScript-API-based AST node to its ts-morph-based equivalent.
   * 
   * @param node The node to wrap.
   * @returns The wrapped node.
   */
  wrap<T extends ts.Node>(node: T): tsMorph.CompilerNodeToWrappedType<T>;

   /**
   * Adds a result that can be used by an analyzer.
   * 
   * @param result
   */
  addResult(result: CodeWalkerResultBase): void;

  /**
   * Returns all added results.
   */
  getResults(): CodeWalkerResultBase[];
}
