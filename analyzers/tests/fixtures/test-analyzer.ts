import { RepoAnalysisContext, RepoAnalyzerBase, RepoAnalyzerResultBase } from '@zalari/repo-analyzers-base';
import { ClassDecoratorFinder, DecoratorFinderOptions, DecoratorFinderResult } from '@zalari/repo-analyzers-common-walkers';
import { PropertyAccessFinder, PropertyAccessFinderOptions, PropertyAccessFinderResult } from '@zalari/repo-analyzers-common-walkers';
import { ClassDeclaration, SyntaxKind } from 'ts-morph';

export class TestAnalyzer extends RepoAnalyzerBase<any> {
  private _messageNameToNode = new Map<string, ClassDeclaration>();

  private _results: { className: string, propertyName: string }[] = [];

  initialize(context: RepoAnalysisContext): void {
    const options: DecoratorFinderOptions = { decoratorName: 'all' };

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
      this._messageNameToNode.set(result.data.node.getName()!, result.data.node as ClassDeclaration);
    });
  }
}