import { CodeWalkerImplementationInterface, CodeWalkerResultBase, CodeWalkerDataResult, RepoAnalysisContextImplementation } from '..';
import * as ts from 'typescript';
import * as tsMorph from 'ts-morph';
import { CodeWalkerNodeResult } from './code-walker-node-result.class';
import { CodeWalkerResultKind } from '../enums/code-walker-result-kind.enum';
import { WalkerLanguageService } from './walker-language-service.class';

export class CodeWalkerImplementation implements CodeWalkerImplementationInterface {
  private readonly _results: CodeWalkerResultBase[] = [];
  private readonly _languageService!: WalkerLanguageService;

  constructor(private _context?: RepoAnalysisContextImplementation) {
    if (this._context) {
      this._languageService = new WalkerLanguageService(this._context.project);
    }
  }
  
  get languageService(): WalkerLanguageService {
    return this._languageService;
  } 

  wrap<T extends ts.Node>(node: T): tsMorph.CompilerNodeToWrappedType<T> {
    return tsMorph.createWrappedNode(node);
  }

  attach<T extends tsMorph.Node>(unattachedNode: T): tsMorph.Node {
    return this.languageService.attach(unattachedNode);
  }

  addResult(result: CodeWalkerResultBase): void {
    if (this.isNodeResult(result) && this._context) {
      const attachedNode = this.attach(result.data);
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