import { CodeWalkerBase, CodeWalkerDataResult } from '../src';
import { SourceFile, SyntaxKind } from 'typescript';
import { FunctionDeclaration, TypeGuards, CallExpression } from 'ts-morph';

export interface FunctionCallFinderOptions extends FunctionCallFinderTarget {
}

export class FunctionCallFinderResult extends CodeWalkerDataResult<FunctionCallFinderResultData> {
}

interface FunctionCallFinderTarget {
    functionName: string;
}

interface FunctionCallFinderResultData extends FunctionCallFinderTarget {
    expression: CallExpression;
}

export class FunctionCallFinder extends CodeWalkerBase<FunctionCallFinderOptions> {
    walk(sourceFile: SourceFile): void {
        const file = this.wrap(sourceFile);
        
        file.getDescendantsOfKind(SyntaxKind.CallExpression).forEach(callExpression => {
            const identifier = callExpression.getLastChildByKind(SyntaxKind.Identifier);
            
            if (identifier) {
                const identifierSymbol = this.languageService.getSymbolSafe(identifier);
                
                if (identifierSymbol) {
                    const firstDeclaration = identifierSymbol.getDeclarations()[0];
                    
                    if (TypeGuards.isFunctionDeclaration(firstDeclaration)) {
                        const functionDeclaration = firstDeclaration as FunctionDeclaration;
                        
                        if (this.options.functionName === functionDeclaration.getName()) {
                            this.addResult(new FunctionCallFinderResult({ ...this.options, expression: this.languageService.attach(callExpression) as CallExpression }));
                        }
                    }
                }
            }
        });
    }
}
