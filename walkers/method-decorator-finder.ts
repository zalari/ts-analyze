import { SourceFile } from 'typescript';
import { ClassDeclaration, MethodDeclaration } from 'ts-morph';
import { DecoratorFinderBase, DecoratorFinderOptions } from './decorator-finder-base';

export class MethodDecoratorFinder extends DecoratorFinderBase<MethodDeclaration> {
    walk(sourceFile: SourceFile): void {
        const file = this.wrap(sourceFile);
        const { decoratorName } = this.options;
        file.getClasses()
            .forEach(classNode => {
                classNode.getMethods()
                    .forEach(methodNode => {
                        this.analyze(methodNode, decoratorName);
                    });
            });
    }
}
