import { CodeWalkerBase, CodeWalkerDataResult, CodeWalkerResultBase } from '../src';
import { SourceFile, SyntaxKind } from 'typescript';
import { CodeWalkerNodeResult } from '../src/classes/code-walker-node-result.class';
import { PropertyAccessExpression } from 'ts-morph';
import { WalkerOptions } from '../src/interfaces/walker-options.interface';

export interface PropertyAccessFinderOptions extends WalkerOptions {
    targets: PropertyAccessFinderTarget[];
}

export class PropertyAccessFinderResult extends CodeWalkerDataResult<PropertyAccessFinderResultData> {

}

interface PropertyAccessFinderResultData extends PropertyAccessFinderTarget {
    propertyAccesssExpression: PropertyAccessExpression;
}

interface PropertyAccessFinderTarget {
    typeName: string;
    propertyName: string;
    kind: 'method' | 'property';
}

export class PropertyAccessFinder extends CodeWalkerBase<PropertyAccessFinderOptions> {

    walk(sourceFile: SourceFile): void {
        const file = this.wrap(sourceFile);
        const options = this.options;

        file.getDescendantsOfKind(SyntaxKind.PropertyAccessExpression).forEach(propertyAccess => {
            const propertyAccessAttached = this.attach(propertyAccess);
            const propertySymbol = propertyAccessAttached.getSymbolOrThrow();

            this.options.targets.forEach(target => {
                if (target.kind === 'method') {
                    const callExpressionParent = propertyAccessAttached.getParentIfKind(SyntaxKind.CallExpression);

                    if (callExpressionParent) {
                        if (propertySymbol.getEscapedName() === target.propertyName) {
                            this.addResult(new PropertyAccessFinderResult({...target, propertyAccesssExpression: propertyAccessAttached as PropertyAccessExpression}));
                        }
                    }
                }
            });

        });
    }
}