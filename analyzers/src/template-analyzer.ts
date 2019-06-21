import { CodeWalkerResultBase, RepoAnalyzerResultBase, RepoAnalyzerWithOptionsBase } from '@zalari/repo-analyzers-base';
import { ClassNameCollector } from '@zalari/repo-analyzers-common-walkers';
import { ClassDecoratorFinder, DecoratorFinderOptions, DecoratorFinderResult } from '@zalari/repo-analyzers-common-walkers';
import { RepoAnalysisContext } from '@zalari/repo-analyzers-base';

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
    const options: DecoratorFinderOptions = { decoratorNames: this.options.decoratorName };
    context.registerWalker(ClassDecoratorFinder, (results: DecoratorFinderResult[]) => this.handleDecoratorResults(results), options);

    // Register an independent handler
    context.registerHandler(file => {
      this.fileNameResults.push(file.getFilePath());
    });

  }

  getExampleOptions(): TemplateAnalyzerOptions {
    return {
      decoratorName: 'Test'
    };
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
    results.forEach(r => this.decoratorResults.push(CodeWalkerResultBase.create(r.data.decoratedNode.getSourceFile()
      .getFilePath())));
  }
}

function Test(constructor: Function) {}
