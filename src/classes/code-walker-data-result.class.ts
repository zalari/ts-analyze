import { CodeWalkerResultKind } from '../enums/code-walker-result-kind.enum';
import { CodeWalkerResultBase } from './code-walker-result-base.class';

export class CodeWalkerDataResult<TData> extends CodeWalkerResultBase {
  static create<T>(data: T): CodeWalkerDataResult<T> {
    return new CodeWalkerDataResult<T>(data);
  }

  constructor(public data: TData) {
    super(CodeWalkerResultKind.Data);
  }
}

