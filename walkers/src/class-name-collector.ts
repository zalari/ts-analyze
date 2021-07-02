import { ts } from "ts-morph";
import { CodeWalkerResultBase } from '@zalari/ts-analyze-base';
import { CodeAutoWalkerBaseTsLint } from '@zalari/ts-analyze-base-walkers-tslint';

export class ClassNameCollector extends CodeAutoWalkerBaseTsLint {
  visitClassDeclaration(classDeclaration: ts.ClassDeclaration): void {
    const className = this.wrap(classDeclaration)
      .getName();

    if (className) {
      const result = CodeWalkerResultBase.create(className);
      this.addResult(result);
    }
  }
}
