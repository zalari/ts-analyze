import { RepoAnalysisContext, RepoAnalyzerBase, RepoAnalyzerResultBase } from '@zalari/ts-analyze-base';
import { ClassDecoratorFinder, DecoratorFinderOptions, DecoratorFinderResult, PropertyAccessFinder, PropertyAccessFinderOptions, PropertyAccessFinderResult } from '@zalari/ts-analyze-walkers-common';
import { ClassDeclaration, SyntaxKind } from 'ts-morph';

export class TestAnalyzer extends RepoAnalyzerBase<any> {
  private _messageNameToNode = new Map<string, ClassDeclaration>();

  private _results: { className: string, propertyName: string }[] = [];

  initialize(context: RepoAnalysisContext): void {
    const options: DecoratorFinderOptions = { decoratorNames: 'all' };

    context.registerWalker(ClassDecoratorFinder, (results: DecoratorFinderResult[]) => this.handleDecoratorResults(results), options);
    context.registerWalker(PropertyAccessFinder, (results: PropertyAccessFinderResult[]) => this.handleMethodResults(results), {
      kind: 'method',
      propertyName: 'doWithTypeAsArgument',
      typeName: 'ExternalClass'
    } as PropertyAccessFinderOptions);
  }

  handleMethodResults(results: PropertyAccessFinderResult[]): void {
    results.forEach(result => {
      result.data.expression.getParentIfKindOrThrow(SyntaxKind.CallExpression)
        .getArguments()
        .forEach(arg => {
          const className = arg.getSymbolOrThrow()
            .getEscapedName();

          if (this._messageNameToNode.has(className)) {
            this._results.push({ className, propertyName: result.data.propertyName });
          }

        });
    });
  }

  getResult(): RepoAnalyzerResultBase<any> {
    return new RepoAnalyzerResultBase(this._results);
  }

  private handleDecoratorResults(results: DecoratorFinderResult[]) {
    results.forEach(result => {
      this._messageNameToNode.set(result.data.decoratedNode.getName()!, result.data.decoratedNode as ClassDeclaration);
    });
  }
}