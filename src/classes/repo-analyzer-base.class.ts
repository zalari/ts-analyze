import { RepoAnalysisContext } from '..';
import { RepoAnalyzerResultBase } from './repo-analyzer-result-base.class';

/**
 * Abstract base class for implementing an analyzer.
 * @template TResult Type returned by {@link getResult()}. 
 */
export abstract class RepoAnalyzerBase<TResult> {
  /**
   * @param analysisRootPath The file system root for the analysis, e.g. ~/my-code/my-project.
   * @param analysisSearchPaths Allows to supplay an array of subdirectories relative to the root path
   * for constraining the search paths. For example with an analysisRootPath of ~/my-code/my-project
   * and analysisSearchPaths ['classes', 'interfaces'] the analysis will only run for:
   * ~/my-code/my-project/classes/* and ~/my-code/my-project/interfaces/*.
   * If omitted, all subpaths of the root path will be used in the analysis. 
   */
  constructor(public analysisRootPath: string, public analysisSearchPaths: string[] = ['.']) {
  }

  /**
   * This method is used for wiring up the parts of this analyzer.
   * Usually this means registering some walkers, processing their results and then aggregate these
   * into an object returned by {@link getResult()}.
   * @param context 
   */
  abstract initialize(context: RepoAnalysisContext): void;

  /**
   * Returns the compiled result that this analyzer has generated after processing.
   */
  abstract getResult(): RepoAnalyzerResultBase<TResult>;
}