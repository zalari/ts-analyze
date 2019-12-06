import { CodeWalkerBase, CodeWalkerResultBase } from '@zalari/ts-analyze-base';
import { SourceFile, SyntaxKind } from 'typescript';
import { CallExpression, ExpressionStatement, PropertyAccessExpression, Symbol } from 'ts-morph';

export interface PropertyAccessFinderOptions extends PropertyAccessFinderTarget {
}

export class PropertyAccessFinderResult extends CodeWalkerResultBase<PropertyAccessFinderResultData> {

}

interface PropertyAccessFinderResultData extends PropertyAccessFinderTarget {
  expression: PropertyAccessExpression;
}

interface PropertyAccessFinderTarget {
  typeName?: string;
  propertyName: string;
  kind: 'method' | 'property';
}

export class PropertyAccessFinder extends CodeWalkerBase<PropertyAccessFinderOptions> {

  walk(sourceFile: SourceFile): void {
    const file = this.wrap(sourceFile);

    const expectedTypeName = this.options.typeName;
    const expectedPropertyName = this.options.propertyName;
    const expectedKind = this.options.kind;

    file.getDescendantsOfKind(SyntaxKind.PropertyAccessExpression)
      .forEach(propertyAccess => {
        const { actualPropertyName, propertySymbol } = this.analyzePropertyAccess(propertyAccess);

        let areConstraintsSatisfied = false;

        if (expectedKind === 'method') {
          const callExpressionParent = propertyAccess.getParentIfKind(SyntaxKind.CallExpression);

          areConstraintsSatisfied = this.areConstraintsSatisfied(callExpressionParent, actualPropertyName, expectedPropertyName, expectedTypeName, propertySymbol);
        } else if (expectedKind === 'property') {
          const expressionStatementParent = propertyAccess.getParentIfKind(SyntaxKind.ExpressionStatement);

          areConstraintsSatisfied = this.areConstraintsSatisfied(expressionStatementParent, actualPropertyName, expectedPropertyName, expectedTypeName, propertySymbol);
        }

        if (areConstraintsSatisfied) {
          this.addResult(new PropertyAccessFinderResult({
            ...this.options,
            expression: this.languageService.attach(propertyAccess) as PropertyAccessExpression
          }));
        }
      });
  }

  private analyzePropertyAccess(propertyAccess: PropertyAccessExpression): { actualPropertyName?: string, propertySymbol?: Symbol } {
    const propertySymbol = this.languageService.getSymbolSafe(propertyAccess);
    let propertyName;

    if (propertySymbol) {
      propertyName = propertySymbol.getEscapedName();
    } else {
      // Attempt to find name based solely on syntax if symbol can not be found
      const identifier = propertyAccess.getLastChildByKind(SyntaxKind.Identifier);
      if (identifier) {
        propertyName = identifier.getText();
      }
    }

    return { actualPropertyName: propertyName, propertySymbol };
  }

  private areConstraintsSatisfied(parent: CallExpression | ExpressionStatement | undefined, actualPropertyName: string | undefined, expectedPropertyName: string, expectedTypeName: string | undefined, propertySymbol: Symbol | undefined): boolean {
    if (!parent) {
      return false;
    }

    if (actualPropertyName !== expectedPropertyName) {
      return false;
    }

    if (expectedTypeName && propertySymbol) {
      const symbol = this.languageService.getDeclaringSymbol(propertySymbol);

      if (symbol && symbol.getEscapedName() !== expectedTypeName) {
        return false;
      }
    }

    return true;
  }
}