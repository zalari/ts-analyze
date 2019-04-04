import { CodeWalkerResultKind } from '../enums/code-walker-result-kind.enum';
import { CodeWalkerResultBase } from './code-walker-result-base.class';

export class CodeWalkerDataResult<T> extends CodeWalkerResultBase {
  constructor(public data: T) {
    super(CodeWalkerResultKind.Data);
  }
}