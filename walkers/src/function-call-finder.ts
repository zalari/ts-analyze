import { CodeWalkerBase, CodeWalkerResultBase } from '@zalari/repo-analyzers-base';
import { SourceFile, SyntaxKind } from 'typescript';
import { CallExpression, FunctionDeclaration, TypeGuards } from 'ts-morph';

export interface FunctionCallFinderOptions extends FunctionCallFinderTarget {
}

export class FunctionCallFinderResult extends CodeWalkerResultBase<FunctionCallFinderResultData> {
}

interface FunctionCallFinderTarget {
  functionName: string;
  exportedFrom?: string;
}

interface FunctionCallFinderResultData extends FunctionCallFinderTarget {
  expression: CallExpression;
}

export class FunctionCallFinder extends CodeWalkerBase<FunctionCallFinderOptions> {
  walk(sourceFile: SourceFile): void {
    const file = this.wrap(sourceFile);

    file.getDescendantsOfKind(SyntaxKind.CallExpression)
      .forEach(callExpression => {
        const identifier = callExpression.getLastChildByKind(SyntaxKind.Identifier);

        const { functionName, exportedFrom } = this.options;

        if (identifier) {
          const identifierSymbol = this.languageService.getSymbolSafe(identifier);

          if (identifierSymbol) {
            const firstDeclaration = identifierSymbol.getDeclarations()[0];

            if (TypeGuards.isFunctionDeclaration(firstDeclaration)) {
              const functionDeclaration = firstDeclaration as FunctionDeclaration;

              if (this.isFunctionNameConstraintSatisfied(functionDeclaration, functionName) &&
                this.isExportConstraintSatisfied(functionDeclaration, exportedFrom)) {
                this.addResult(new FunctionCallFinderResult({
                  ...this.options,
                  expression: this.languageService.attach(callExpression) as CallExpression
                }));
              }
            }
          }
        }
      });
  }

  private isFunctionNameConstraintSatisfied(declaration: FunctionDeclaration, functionName: string) {
    return functionName === declaration.getName();
  }

  private isExportConstraintSatisfied(declaration: FunctionDeclaration, exportName?: string) {
    if (!exportName) {
      return true;
    }

    return declaration.getSourceFile()
      .getFilePath()
      .includes(exportName);
  }
}
