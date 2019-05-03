import { CodeWalkerBase, CodeWalkerDataResult, CodeWalkerResultBase } from '../src';
import { SourceFile, SyntaxKind } from 'typescript';
import { CodeWalkerNodeResult } from '../src/classes/code-walker-node-result.class';
import { PropertyAccessExpression, MethodDeclaration, ClassDeclaration, InterfaceDeclaration, Symbol, Node } from 'ts-morph';
import { WalkerOptions } from '../src/interfaces/walker-options.interface';

export interface PropertyAccessFinderOptions extends PropertyAccessFinderTarget {
}

export class PropertyAccessFinderResult extends CodeWalkerDataResult<PropertyAccessFinderResultData> {

}

interface PropertyAccessFinderResultData extends PropertyAccessFinderTarget {
    expression: PropertyAccessExpression;
}

interface PropertyAccessFinderTarget {
    typeName: string;
    propertyName: string;
    kind: 'method' | 'property';
}

export class PropertyAccessFinder extends CodeWalkerBase<PropertyAccessFinderOptions> {

    walk(sourceFile: SourceFile): void {
        const file = this.wrap(sourceFile);

        file.getDescendantsOfKind(SyntaxKind.PropertyAccessExpression).forEach(propertyAccess => {
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

            if (this.options.kind === 'method') {
                const callExpressionParent = propertyAccess.getParentIfKind(SyntaxKind.CallExpression);

                if (callExpressionParent) {
                    //const declaringSymbol = this.getDeclaringSymbol(propertySymbol);
                    // declaringSymbol && declaringSymbol.getName() === this.options.typeName && 
                    if (propertyName === this.options.propertyName) {
                        this.addResult(new PropertyAccessFinderResult({ ...this.options, expression: this.languageService.attach(propertyAccess) as PropertyAccessExpression }));
                    }
                }
            }

        });
    }
}