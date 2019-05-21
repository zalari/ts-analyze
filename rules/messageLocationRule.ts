import * as Lint from 'tslint';
import * as ts from 'typescript';
import { DecoratorFinder } from '../walkers/decorator-finder';
import { FileSystemUtils, CodeWalkerNodeResult } from '../src/api';

export class Rule extends Lint.Rules.AbstractRule {
  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    const decoratorFinderOptions = DecoratorFinder.getDefaultOptions();
    const ruleArguments = this.getOptions().ruleArguments;

    let [decoratorName, expectedPackageName]: string[] = ruleArguments;
    decoratorName = decoratorName || 'Message';
    expectedPackageName = expectedPackageName || 'messages';

    decoratorFinderOptions.decoratorName = decoratorName;

    const decoratorFinder = new DecoratorFinder(sourceFile, 'message-location', decoratorFinderOptions)
    this.applyWithWalker(decoratorFinder);

    const results = decoratorFinder.getResults();
    const failures: Lint.RuleFailure[] = [];

    results.forEach(result => {
      const nodeResult = result as CodeWalkerNodeResult;

      const packageJson = FileSystemUtils.findPackageJsonForFile(nodeResult.data.getSourceFile().getFilePath());

      if (packageJson !== null) {
        const foundPackageName = (packageJson.name as string);

        if (foundPackageName !== expectedPackageName) {
          const failureString = `Message with Decorator @${decoratorName} is expected to be in package ${expectedPackageName} but was found in ${foundPackageName}.`;

          const failure = new Lint.RuleFailure(sourceFile, nodeResult.data.getStart(), nodeResult.data.getEnd(), failureString, 'message-location');
          failures.push(failure);
        }
      }
    });

    return failures;
  }
}
