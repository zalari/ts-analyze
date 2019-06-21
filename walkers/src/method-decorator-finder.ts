import { SourceFile } from 'typescript';
import { MethodDeclaration } from 'ts-morph';
import { DecoratorFinderBase } from './decorator-finder-base';

export class MethodDecoratorFinder extends DecoratorFinderBase<MethodDeclaration> {
  walk(sourceFile: SourceFile): void {
    const file = this.wrap(sourceFile);
    const { decoratorNames } = this.options;
    file.getClasses()
      .forEach(classNode => {
        classNode.getMethods()
          .forEach(methodNode => {
            this.analyze(methodNode, decoratorNames);
          });
      });
  }
}
