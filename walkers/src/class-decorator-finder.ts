import { SourceFile } from 'typescript';
import { ClassDeclaration } from 'ts-morph';
import { DecoratorFinderBase } from './decorator-finder-base';

export class ClassDecoratorFinder extends DecoratorFinderBase<ClassDeclaration> {
  walk(sourceFile: SourceFile): void {
    const file = this.wrap(sourceFile);
    const { decoratorNames } = this.options;

    file.getClasses()
      .forEach(classNode => {
        this.analyze(classNode, decoratorNames);
      });
  }
}
