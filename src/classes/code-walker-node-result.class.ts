import { Node } from 'ts-morph';
import { CodeWalkerDataResult } from './code-walker-data-result.class';
export class CodeWalkerNodeResult extends CodeWalkerDataResult<Node> {
    constructor(node: Node) {
        super(node);
    }
}
