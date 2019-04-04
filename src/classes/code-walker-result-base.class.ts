import { CodeWalkerResultKind } from '..';

export abstract class CodeWalkerResultBase {
  constructor(public kind: CodeWalkerResultKind) {
  }
}