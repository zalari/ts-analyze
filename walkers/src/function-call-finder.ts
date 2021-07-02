import { CodeWalkerResultBase } from '@zalari/ts-analyze-base';
import { CallExpression, FunctionDeclaration, TypeGuards, ImportSpecifier, ts, SyntaxKind } from 'ts-morph';
import { CodeWalkerBaseTsLint } from '@zalari/ts-analyze-base-walkers-tslint';

export interface FunctionCallFinderOptions extends FunctionCallFinderTarget {
}

export class FunctionCallFinderResult extends CodeWalkerResultBase<FunctionCallFinderResultData> {
}

interface FunctionCallFinderTarget {
  functionName: string;
  origin?: string;
}

interface FunctionCallFinderResultData extends FunctionCallFinderTarget {
  expression: CallExpression;
}

export class FunctionCallFinder extends CodeWalkerBaseTsLint<FunctionCallFinderOptions> {
  walk(sourceFile: ts.SourceFile): void {
    const file = this.wrap(sourceFile);

    file.getDescendantsOfKind(SyntaxKind.CallExpression)
      .forEach(callExpression => {
        const identifier = callExpression.getLastChildByKind(SyntaxKind.Identifier);

        const { functionName, origin } = this.options;

        if (identifier) {
          const identifierSymbol = this.languageService.getSymbolSafe(identifier);

          if (identifierSymbol) {
            const firstDeclaration = identifierSymbol.getDeclarations()[0];

            if (TypeGuards.isFunctionDeclaration(firstDeclaration)) {
              const functionDeclaration = firstDeclaration as FunctionDeclaration;

              if (this.isFunctionNameConstraintSatisfied(functionDeclaration, functionName) &&
                this.isOriginConstraintSatisfied(functionDeclaration, origin)) {

                this.addResult(new FunctionCallFinderResult({
                  ...this.options,
                  expression: this.languageService.attach(callExpression) as CallExpression
                }));
              }
            } else if (TypeGuards.isImportSpecifier(firstDeclaration) &&
              identifierSymbol.getName() == functionName && 
              this.isOriginConstraintSatisfied(firstDeclaration, origin)) {

              this.addResult(new FunctionCallFinderResult({
                ...this.options,
                expression: this.languageService.attach(callExpression) as CallExpression
              }));
            }
          }
        }
      });
  }

  private isFunctionNameConstraintSatisfied(declaration: FunctionDeclaration, functionName: string) {
    return functionName === declaration.getName();
  }

  private isOriginConstraintSatisfied(origin: FunctionDeclaration | ImportSpecifier, exportName?: string) {
    if (!exportName) {
      return true;
    }

    switch (origin.getKind()) {
      case SyntaxKind.FunctionDeclaration: return origin.getSourceFile().getFilePath().includes(exportName);
      case SyntaxKind.ImportSpecifier: {
        const importSpecifier = origin as ImportSpecifier;

        return importSpecifier.getImportDeclaration().getModuleSpecifier().getLiteralValue() === exportName;
      }
      default: return false;
    }
  }
}
