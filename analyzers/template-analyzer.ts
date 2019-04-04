import { RepoAnalyzerBase, CodeWalkerResultBase, RepoAnalysisContext, RepoAnalyzerResultBase } from '../src/api';
import { ClassNameCollector } from '../walkers/class-name-collector';
import { ImportsCollector } from '../walkers/imports-collector';

export class TemplateAnalyzer extends RepoAnalyzerBase {
  public nameResults: CodeWalkerResultBase[] = [];
  public importsResults: CodeWalkerResultBase[] = [];

  initialize(context: RepoAnalysisContext): void {
    context.registerWalker(ClassNameCollector, (results) => this.handleClassNameResults(results));
    context.registerWalker(ImportsCollector, (results) => this.handleImportResults(results));
  }

  getResult(): RepoAnalyzerResultBase<{ nameResults: CodeWalkerResultBase[], importResults: CodeWalkerResultBase[] }> {
    return new RepoAnalyzerResultBase({ nameResults: this.nameResults, importResults: this.importsResults });
  }

  private handleClassNameResults(results: CodeWalkerResultBase[]) {
    results.forEach(r => this.nameResults.push(r));
  }

  private handleImportResults(results: CodeWalkerResultBase[]) {
    results.forEach(r => this.importsResults.push(r));
  }
}