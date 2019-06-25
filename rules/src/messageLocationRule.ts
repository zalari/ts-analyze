import * as Lint from 'tslint';
import * as ts from 'typescript';
import { ClassDecoratorFinder, DecoratorFinderOptions, DecoratorFinderResult } from '@zalari/ts-analyze-common-walkers';
import { FileSystemUtils } from '@zalari/ts-analyze-base/dist/utils/file-system-utils';

const DEFAULT_DECORATOR_NAME = 'Message';
const DEFAULT_PACKAGE_NAME = 'messages';
const RULE_NAME = 'message-location';

export class Rule extends Lint.Rules.AbstractRule {
  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {

    const ruleArguments = this.getOptions().ruleArguments;

    let [decoratorName, expectedPackageName]: string[] = ruleArguments;
    decoratorName = decoratorName || DEFAULT_DECORATOR_NAME;
    expectedPackageName = expectedPackageName || DEFAULT_PACKAGE_NAME;

    const decoratorFinderOptions: DecoratorFinderOptions = { decoratorNames: decoratorName };

    const decoratorFinder = new ClassDecoratorFinder(sourceFile, RULE_NAME, decoratorFinderOptions);
    this.applyWithWalker(decoratorFinder);

    const results: DecoratorFinderResult[] = decoratorFinder.getResults();
    const failures: Lint.RuleFailure[] = [];

    results.forEach(result => {
      const packageJson = FileSystemUtils.findPackageJsonForFile(result.data.decoratedNode.getSourceFile()
        .getFilePath());

      if (packageJson !== null) {
        const foundPackageName = (packageJson.name as string);

        if (foundPackageName !== expectedPackageName) {
          const failureString = `Message with Decorator "@${ decoratorName }" is expected to be in package "${ expectedPackageName }" but was found in "${ foundPackageName }".`;

          const failure = new Lint.RuleFailure(sourceFile, result.data.decoratedNode.getStart(), result.data.decoratedNode.getEnd(), failureString, RULE_NAME);
          failures.push(failure);
        }
      }
    });

    return failures;
  }
}
