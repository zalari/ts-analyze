import { RepoAnalyzerBase, CodeWalkerResultBase, RepoAnalysisContext, RepoAnalyzerResultBase, CodeWalkerDataResult } from '../src/api';
import { ClassNameCollector } from '../walkers/class-name-collector';
import { ImportsCollector } from '../walkers/imports-collector';
import { DecoratorCollector } from '../walkers/decorator-collector';
import { CodeWalkerNodeResult } from '../src/classes/code-walker-node-result.class';

@Test
export class TemplateAnalyzer extends RepoAnalyzerBase {
  public nameResults: CodeWalkerResultBase[] = [];
  public importsResults: CodeWalkerResultBase[] = [];
  public decoratorResults: CodeWalkerResultBase[] = [];

  initialize(context: RepoAnalysisContext): void {
    context.registerWalker(ClassNameCollector, (results: CodeWalkerResultBase[]) => this.handleClassNameResults(results));
    context.registerWalker(ImportsCollector, (results: CodeWalkerResultBase[]) => this.handleImportResults(results));
    context.registerWalker(DecoratorCollector, (results: CodeWalkerNodeResult[]) => this.handleDecoratorResults(results), {
      decoratorName: 'Test'
    });
  }

  getResult(): RepoAnalyzerResultBase<{ nameResults: CodeWalkerResultBase[], importResults: CodeWalkerResultBase[] }> {
    return new RepoAnalyzerResultBase({ nameResults: this.nameResults, importResults: this.importsResults, decoratorResults: this.decoratorResults });
  }

  private handleClassNameResults(results: CodeWalkerResultBase[]) {
    results.forEach(r => this.nameResults.push(r));
  }

  private handleDecoratorResults(results: CodeWalkerNodeResult[]) {
    results.forEach(r => this.decoratorResults.push(new CodeWalkerDataResult(r.data.getText())));
  }

  private handleImportResults(results: CodeWalkerResultBase[]) {
    results.forEach(r => this.importsResults.push(r));
  }
}

function Test(constructor: Function) {}
