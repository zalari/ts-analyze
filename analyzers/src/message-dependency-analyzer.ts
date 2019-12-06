import { RepoAnalysisContext, RepoAnalyzerBase, RepoAnalyzerResultBase, CodeWalkerNodeResult } from '@zalari/ts-analyze-base';
import { ClassDecoratorFinder, DecoratorFinderOptions } from '@zalari/ts-analyze-walkers-common';
import { ClassDeclaration } from 'ts-morph';
import { PropertyAccessFinderResult } from '@zalari/ts-analyze-walkers-common';
import { FunctionCallFinder } from '@zalari/ts-analyze-walkers-common';

interface MessageDependencyAnalyzerResult {

}

export class MessageDependencyAnalyzer extends RepoAnalyzerBase<MessageDependencyAnalyzerResult> {
  private _messageNameToNode = new Map<string, ClassDeclaration>();

  private _context!: RepoAnalysisContext;

  initialize(context: RepoAnalysisContext): void {
    this._context = context;
    const options: DecoratorFinderOptions = { decoratorNames: 'Message' };

    context.registerWalker(ClassDecoratorFinder, (results: CodeWalkerNodeResult[]) => this.handleDecoratorResults(results), options);
    context.registerWalker(FunctionCallFinder, (results: PropertyAccessFinderResult[]) => {}, { kind: 'method', name: '' });
  }

  getResult(): RepoAnalyzerResultBase<MessageDependencyAnalyzerResult> {

    this._messageNameToNode.forEach((value, key) => {
      console.log(value.findReferencesAsNodes()
        .map(node => node.getParent()!.getText()));
    });

    return new RepoAnalyzerResultBase({});
  }

  private handleDecoratorResults(results: CodeWalkerNodeResult[]) {
    results.forEach(result => {
      const classDeclaration = result.data as ClassDeclaration;
      this._messageNameToNode.set(classDeclaration.getName()!, classDeclaration);
    });
  }
}