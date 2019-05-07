import * as Lint from 'tslint';
import * as ts from 'typescript';
import { NoImportsWalker } from '../walkers/no-imports-walker';

export class NoImportsRule extends Lint.Rules.AbstractRule {
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoImportsWalker(sourceFile, this.getOptions()));
    }
}
