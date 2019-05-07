import { Node } from 'ts-morph';
import { CodeWalkerDataResult } from './code-walker-data-result.class';

export class CodeWalkerNodeResult extends CodeWalkerDataResult<Node> {
    static create<TNode>(node: TNode): CodeWalkerDataResult<TNode> {
        return new CodeWalkerDataResult<TNode>(node);
      }

    constructor(node: Node) {
        super(node);
    }
}
