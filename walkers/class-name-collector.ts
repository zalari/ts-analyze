import { CodeAutoWalkerBase, CodeWalkerResultBase } from '../src/api';
import { ClassDeclaration } from 'typescript';

export class ClassNameCollector extends CodeAutoWalkerBase {
  visitClassDeclaration(classDeclaration: ClassDeclaration): void {
    const className = this.wrap(classDeclaration)
      .getName();

    if (className) {
      const result = CodeWalkerResultBase.create(className);
      this.addResult(result);
    }
  }
}