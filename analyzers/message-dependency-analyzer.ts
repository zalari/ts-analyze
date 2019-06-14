import { RepoAnalysisContext, RepoAnalyzerBase, RepoAnalyzerResultBase } from '../src/api';
import { ClassDecoratorFinder, DecoratorFinderOptions } from '../walkers';
import { CodeWalkerNodeResult } from '../src/classes/code-walker-node-result.class';
import { ClassDeclaration } from 'ts-morph';
import { PropertyAccessFinderResult } from '../walkers/property-access-finder';
import { FunctionCallFinder } from '../walkers/function-call-finder';

interface MessageDependencyAnalyzerResult {

}

export class MessageDependencyAnalyzer extends RepoAnalyzerBase<MessageDependencyAnalyzerResult> {
  private _messageNameToNode = new Map<string, ClassDeclaration>();

  private _context!: RepoAnalysisContext;

  initialize(context: RepoAnalysisContext): void {
    this._context = context;
    const options: DecoratorFinderOptions = { decoratorName: 'Message' };

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