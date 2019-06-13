import { CodeWalkerResultBase, RepoAnalyzerResultBase, RepoAnalyzerWithOptionsBase } from '../src/api';
import { ClassNameCollector } from '../walkers/class-name-collector';
import { DecoratorFinder, DecoratorFinderResult } from '../walkers/decorator-finder';
import { RepoAnalysisContext } from '../src/interfaces/repo-analysis-context.interface';

interface TemplateAnalyzerResult {
  nameResults: CodeWalkerResultBase[];
  decoratorResults: CodeWalkerResultBase[];
}

interface TemplateAnalyzerOptions {
  decoratorName: string;
}

@Test
export class TemplateAnalyzer extends RepoAnalyzerWithOptionsBase<TemplateAnalyzerResult, TemplateAnalyzerOptions> {
  public nameResults: CodeWalkerResultBase[] = [];

  public decoratorResults: CodeWalkerResultBase[] = [];

  public fileNameResults: string[] = [];

  initialize(context: RepoAnalysisContext): void {

    // Register an autowalker
    context.registerWalker(ClassNameCollector, (results: CodeWalkerResultBase[]) => this.handleClassNameResults(results));

    // Register a manual walker
    const options = DecoratorFinder.getDefaultOptions();
    options.decoratorName = this.options.decoratorName;
    context.registerWalker(DecoratorFinder, (results: DecoratorFinderResult[]) => this.handleDecoratorResults(results), options);

    // Register an independent handler
    context.registerHandler(file => {
      this.fileNameResults.push(file.getFilePath());
    });

  }

  getExampleOptions(options?: any): TemplateAnalyzerOptions {
    return {
      decoratorName: 'Test'
    }
  }

  getResult(): RepoAnalyzerResultBase<TemplateAnalyzerResult> {
    return new RepoAnalyzerResultBase({
      nameResults: this.nameResults,
      decoratorResults: this.decoratorResults,
      fileNameResults: this.fileNameResults
    });
  }

  private handleClassNameResults(results: CodeWalkerResultBase[]) {
    results.forEach(r => this.nameResults.push(r));
  }

  private handleDecoratorResults(results: DecoratorFinderResult[]) {
    results.forEach(r => this.decoratorResults.push(CodeWalkerResultBase.create(r.data.node.getSourceFile()
      .getFilePath())));
  }
}

function Test(constructor: Function) {}
