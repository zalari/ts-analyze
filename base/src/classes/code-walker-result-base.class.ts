import { CodeWalkerResultKind } from '..';

export abstract class CodeWalkerResultBase<T = any> {
  constructor(public data: T, public kind: CodeWalkerResultKind = CodeWalkerResultKind.Default) {
  }

  static create<T>(data: T): CodeWalkerResultBase<T> {
    return new CodeWalkerResultBaseDefaultImplementation(data);
  }
}

class CodeWalkerResultBaseDefaultImplementation<T> extends CodeWalkerResultBase<T> {}
