import { RepoAnalyzerBase } from './repo-analyzer-base.class';

/**
 * @inheritdoc
 */
export abstract class RepoAnalyzerWithOptionsBase<TResult, TOptions> extends RepoAnalyzerBase<TResult> {
  /**
  * @param analysisRootPath The file system root for the analysis, e.g. ~/my-code/my-project.
  * @param analysisSearchPaths Allows to supplay an array of subdirectories relative to the root path
  * for constraining the search paths. For example with an analysisRootPath of ~/my-code/my-project
  * and analysisSearchPaths ['classes', 'interfaces'] the analysis will only run for:
  * ~/my-code/my-project/classes/* and ~/my-code/my-project/interfaces/*.
  * If omitted, all subpaths of the root path will be used in the analysis.
  * @param options Options required by this analyzer.
  */
  constructor(public analysisRootPath: string, public analysisSearchPaths: string[] = ['.'], protected options: TOptions) {
    super(analysisRootPath, analysisSearchPaths);
    if (!this.options) {
      throw new Error('Analyzer requiring options was not supplied with options');
    }
  }
}
