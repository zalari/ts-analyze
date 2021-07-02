// This is an example from TSLint only changed to use our own walker base type.
// The walker takes care of all the work.
import { CodeAutoWalkerBaseTsLint } from '@zalari/ts-analyze-base-walkers-tslint';
import * as ts from 'typescript';

export class NoImportsWalker extends CodeAutoWalkerBaseTsLint {
  public visitImportDeclaration(node: ts.ImportDeclaration) {
    // create a failure at the current position
    this.addFailure(this.createFailure(node.getStart(), node.getWidth(), 'import statement forbidden'));

    // call the base version of this visitor to actually parse this node
    super.visitImportDeclaration(node);
  }
}
