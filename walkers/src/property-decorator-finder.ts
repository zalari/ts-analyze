import { ClassDeclaration, SourceFile, ts } from 'ts-morph';
import { DecoratorFinderBase } from './decorator-finder-base';

export class PropertyDecoratorFinder extends DecoratorFinderBase<ClassDeclaration> {

  walk(sourceFile: ts.SourceFile): void {
    const file = this.wrap(sourceFile);
    const { decoratorNames } = this.options;
    file.getClasses()
      .forEach(classNode => {
        classNode.getProperties()
          .forEach(propertyNode => {
            this.analyze(propertyNode, decoratorNames);
          });
      });
  }
}
