import { FileSystemUtils, RepoAnalysisContext, RepoAnalyzerResultBase, RepoAnalyzerWithOptionsBase } from '../src/api';
import { DecoratorFinder, DecoratorFinderResult } from '../walkers/decorator-finder';
import { Node } from 'ts-morph';

interface DecoratorLocationAnalyzerResult {
  locations: {
    package: string,
    path: string
  }[]
}

interface DecoratorLocationAnalyzerOptions {
  decoratorName: string;
}

export class DecoratorLocationAnalyzer extends RepoAnalyzerWithOptionsBase<DecoratorLocationAnalyzerResult, DecoratorLocationAnalyzerOptions> {
  private decoratedNodes: Node[] = [];

  initialize(context: RepoAnalysisContext): void {
    const decoratorFinderOptions = DecoratorFinder.getDefaultOptions();
    decoratorFinderOptions.decoratorName = this.options.decoratorName;

    context.registerWalker(DecoratorFinder, (results: DecoratorFinderResult[]) => results.forEach(r => this.decoratedNodes.push(r.data.node)), decoratorFinderOptions);
  }

  getResult(): RepoAnalyzerResultBase<DecoratorLocationAnalyzerResult> {
    const locations: { package: string, path: string }[] = [];

    this.decoratedNodes.forEach(node => {
      const packageJson = FileSystemUtils.findPackageJsonForFile(node.getSourceFile()
        .getFilePath());

      if (packageJson) {
        locations.push({
          package: packageJson.name,
          path: node.getSourceFile()
            .getFilePath()
        });
      }
    });

    return new RepoAnalyzerResultBase({ locations });

  }
}