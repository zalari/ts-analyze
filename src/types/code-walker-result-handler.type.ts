import { CodeWalkerResultBase } from '..';

export type CodeWalkerResultHandler<T extends CodeWalkerResultBase> = (results: T[]) => void