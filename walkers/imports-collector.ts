import { CodeWalkerBase, CodeWalkerDataResult } from '../src/api';
import { SourceFile } from 'typescript';

export class ImportsCollector extends CodeWalkerBase<any> {
  walk(sourceFile: SourceFile): void {
    const sourceFileTsMorph = this.wrap(sourceFile);
    const imports = sourceFileTsMorph.getImportDeclarations();

    this.addResult(new CodeWalkerDataResult(imports.map(v => v.getText())));
  }
}