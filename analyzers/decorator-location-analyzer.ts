import { FileSystemUtils, RepoAnalysisContext, RepoAnalyzerResultBase, RepoAnalyzerWithOptionsBase } from '../src/api';
import { DecoratorFinder } from '../walkers/decorator-finder';
import { CodeWalkerNodeResult } from '../src/classes/code-walker-node-result.class';
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

    context.registerWalker(DecoratorFinder, (results: CodeWalkerNodeResult[]) => results.forEach(r => this.decoratedNodes.push(r.data)), decoratorFinderOptions);
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