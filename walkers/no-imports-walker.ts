// The walker takes care of all the work.
import { CodeAutoWalkerBase } from '../src/api';
import * as ts from 'typescript';

export class NoImportsWalker extends CodeAutoWalkerBase {
  public visitImportDeclaration(node: ts.ImportDeclaration) {
    // create a failure at the current position
    this.addFailure(this.createFailure(node.getStart(), node.getWidth(), "import statement forbidden"));

    // call the base version of this visitor to actually parse this node
    super.visitImportDeclaration(node);
  }
}