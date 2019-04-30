import { RepoAnalyzerBase, RepoAnalysisContext, RepoAnalyzerResultBase } from "../../../src";
import { DecoratorFinder } from "../../../walkers/decorator-finder";
import { PropertyAccessFinder, PropertyAccessFinderOptions, PropertyAccessFinderResult } from "../../../walkers/property-access-finder";
import { CodeWalkerNodeResult } from "../../../src/classes/code-walker-node-result.class";
import { Node, ClassDeclaration, CallExpression, PropertyAccessExpression, SyntaxKind } from 'ts-morph';

export class TestAnalyzer extends RepoAnalyzerBase<any> {
  private _messageNameToNode = new Map<string, ClassDeclaration>();
  private _results: { className: string, propertyName: string }[] = [];

  initialize(context: RepoAnalysisContext): void {
    const options = DecoratorFinder.getDefaultOptions();
    options.decoratorName = 'TestDecorator';

    context.registerWalker(DecoratorFinder, (results: CodeWalkerNodeResult[]) => this.handleDecoratorResults(results), options);
    context.registerWalker(PropertyAccessFinder, (results) => this.handleMethodResults(results), {  targets: [ { kind: 'method', propertyName: 'doWithTypeAsArgument' } ] } as PropertyAccessFinderOptions);
  }

  handleMethodResults(results: PropertyAccessFinderResult[]): void {

    results.forEach(result => {
      result.data.propertyAccesssExpression.getParentIfKindOrThrow(SyntaxKind.CallExpression).getArguments().forEach(arg => {
        const className = arg.getSymbolOrThrow().getEscapedName();

        if (this._messageNameToNode.has(className)) {
          this._results.push({ className, propertyName: result.data.propertyName })
        }

      });
    });
  }

  getResult(): RepoAnalyzerResultBase<any> {
    return new RepoAnalyzerResultBase(this._results);
  }

  private handleDecoratorResults(results: CodeWalkerNodeResult[]) {
    results.forEach(result => {
      const classDeclaration = result.data as ClassDeclaration;
      this._messageNameToNode.set(classDeclaration.getName()!, classDeclaration);
    });
  }
}