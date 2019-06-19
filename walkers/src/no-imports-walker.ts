// This is an example from TSLint only changed to use our own walker base type.
// The walker takes care of all the work.
import { CodeAutoWalkerBase } from '@zalari/repo-analyzers-base';
import * as ts from 'typescript';

export class NoImportsWalker extends CodeAutoWalkerBase {
  public visitImportDeclaration(node: ts.ImportDeclaration) {
    // create a failure at the current position
    this.addFailure(this.createFailure(node.getStart(), node.getWidth(), 'import statement forbidden'));

    // call the base version of this visitor to actually parse this node
    super.visitImportDeclaration(node);
  }
}