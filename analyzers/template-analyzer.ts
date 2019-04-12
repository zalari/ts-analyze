import { RepoAnalyzerBase, CodeWalkerResultBase, RepoAnalysisContext, RepoAnalyzerResultBase, CodeWalkerDataResult } from '../src/api';
import { ClassNameCollector } from '../walkers/class-name-collector';
import { DecoratorFinder } from '../walkers/decorator-finder';
import { CodeWalkerNodeResult } from '../src/classes/code-walker-node-result.class';

interface TemplateAnalyzerResult {
  nameResults: CodeWalkerResultBase[];
  decoratorResults: CodeWalkerResultBase[];
}

@Test
export class TemplateAnalyzer extends RepoAnalyzerBase<TemplateAnalyzerResult> {
  public nameResults: CodeWalkerResultBase[] = [];
  public decoratorResults: CodeWalkerResultBase[] = [];

  initialize(context: RepoAnalysisContext): void {

    // TODO: Mechanism/Typings to allow for automatic specific subtype that the handler will receive
    context.registerWalker(ClassNameCollector, (results: CodeWalkerResultBase[]) => this.handleClassNameResults(results));
    
    // TODO: Mechanism to get options passed from outside (from command line for example)
    const options = DecoratorFinder.getDefaultOptions();
    options.decoratorName = 'Test';

    context.registerWalker(DecoratorFinder, (results: CodeWalkerNodeResult[]) => this.handleDecoratorResults(results), options);
  }

  getResult(): RepoAnalyzerResultBase<TemplateAnalyzerResult> {
    return new RepoAnalyzerResultBase({ nameResults: this.nameResults, decoratorResults: this.decoratorResults });
  }

  private handleClassNameResults(results: CodeWalkerResultBase[]) {
    results.forEach(r => this.nameResults.push(r));
  }

  private handleDecoratorResults(results: CodeWalkerNodeResult[]) {
    results.forEach(r => this.decoratorResults.push(CodeWalkerDataResult.create(r.data.getSourceFile().getFilePath())));
  }
}

function Test(constructor: Function) {}
