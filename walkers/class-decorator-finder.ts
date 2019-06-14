import { SourceFile } from 'typescript';
import { ClassDeclaration } from 'ts-morph';
import { DecoratorFinderBase, DecoratorFinderOptions } from './decorator-finder-base';

export class ClassDecoratorFinder extends DecoratorFinderBase<ClassDeclaration> {
  walk(sourceFile: SourceFile): void {
    const file = this.wrap(sourceFile);
    const { decoratorName } = this.options;
    file.getClasses()
      .forEach(classNode => {
        this.analyze(classNode, decoratorName);
      });
  }
}
