import { SourceFile } from 'ts-morph';

export type SourceFileHandler = (sourceFile: SourceFile) => void;
