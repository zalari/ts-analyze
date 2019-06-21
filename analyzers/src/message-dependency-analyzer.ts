import { RepoAnalysisContext, RepoAnalyzerBase, RepoAnalyzerResultBase, CodeWalkerNodeResult } from '@zalari/repo-analyzers-base';
import { ClassDecoratorFinder, DecoratorFinderOptions } from '@zalari/repo-analyzers-common-walkers';
import { ClassDeclaration } from 'ts-morph';
import { PropertyAccessFinderResult } from '@zalari/repo-analyzers-common-walkers';
import { FunctionCallFinder } from '@zalari/repo-analyzers-common-walkers';

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