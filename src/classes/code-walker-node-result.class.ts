import { Node } from 'ts-morph';
import { CodeWalkerResultBase } from './code-walker-result-base.class';

export class CodeWalkerNodeResult extends CodeWalkerResultBase<Node> {
  constructor(node: Node) {
    super(node);
  }
}
