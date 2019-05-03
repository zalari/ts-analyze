import { RepoAnalyzerBase, RepoAnalysisContext, RepoAnalyzerResultBase, CodeWalkerDataResult } from "../src/api";
import { DecoratorFinder } from "../walkers/decorator-finder";
import { CodeWalkerNodeResult } from "../src/classes/code-walker-node-result.class";
import { ClassDeclaration, Node } from "ts-morph";
import { PropertyAccessFinder } from "../walkers";
import { PropertyAccessFinderResult } from "../walkers/property-access-finder";

interface MessageDependencyAnalyzerResult {

}

export class MessageDependencyAnalyzer extends RepoAnalyzerBase<MessageDependencyAnalyzerResult> {  
  private _messageNameToNode = new Map<string, ClassDeclaration>();
  private _context!: RepoAnalysisContext

  initialize(context: RepoAnalysisContext): void {
    this._context = context;
    const options = DecoratorFinder.getDefaultOptions();
    options.decoratorName = 'Message';
    
    context.registerWalker(DecoratorFinder, (results: CodeWalkerNodeResult[]) => this.handleDecoratorResults(results), options);
    context.registerWalker(PropertyAccessFinder, (results: PropertyAccessFinderResult[]) => {}, { kind: 'method', name: ''} );
  }

  getResult(): RepoAnalyzerResultBase<MessageDependencyAnalyzerResult> {
    this._messageNameToNode.forEach((value, key) => {
      console.log(value.findReferencesAsNodes().map(node => node.getParent()!.getText()));
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