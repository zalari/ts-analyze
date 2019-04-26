import { CodeWalkerResultBase, CodeWalkerImplementation, CodeWalkerImplementationInterface, RepoAnalysisContextImplementation } from '..';
import { CompilerNodeToWrappedType } from 'ts-morph';
import { Fix, AbstractWalker} from 'tslint';
import { Node, SourceFile, } from 'typescript';
import { CodeWalkerNodeResult } from './code-walker-node-result.class';

/**
 * Abstract base class for implementing manual code walkers.
 * 
 * Works by implementing the {@link walk} method.
 */
export abstract class CodeWalkerBase<TOptions> extends AbstractWalker<TOptions> implements CodeWalkerImplementationInterface {
  private readonly _implementation: CodeWalkerImplementation;
  
  constructor(sourceFile: SourceFile, ruleName: string, options: TOptions, context: RepoAnalysisContextImplementation) {
    super(sourceFile, ruleName, options);
    this._implementation = new CodeWalkerImplementation(context);
  }

  /**
   * This method is called for every typscript file found during analysis. 
   * @param sourceFile The source file object as supplied by the TypesScript API.
   * It is recommended that you use this with {@link wrap} for getting access to the ts-morph-based API.
   */
  abstract walk(sourceFile: SourceFile): void;

  /**
   * Adds a result that can be used by an analyzer.
   * 
   * @param result
   */
  addResult(result: CodeWalkerResultBase): void {
    this._implementation.addResult(result);
  }

  /**
   * Returns all added results.
   * 
   */
  getResults(): CodeWalkerResultBase[] {
    return this._implementation.getResults();
  }

  /**
   * Converts an a TypeScript-API-based AST node to its ts-morph-based equivalent.
   * 
   * @param node The node to convert.
   * 
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

