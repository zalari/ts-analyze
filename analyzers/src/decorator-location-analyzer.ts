import { FileSystemUtils, RepoAnalysisContext, RepoAnalyzerResultBase, RepoAnalyzerWithOptionsBase } from '@zalari/ts-analyze-base';
import { ClassDecoratorFinder, DecoratorFinderOptions, DecoratorFinderResult } from '@zalari/ts-analyze-common-walkers';
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
    const decoratorFinderOptions: DecoratorFinderOptions = { decoratorNames: this.options.decoratorName };

    context.registerWalker(ClassDecoratorFinder, (results: DecoratorFinderResult[]) => results.forEach(r => this.decoratedNodes.push(r.data.decoratedNode)), decoratorFinderOptions);
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

  getExampleOptions(): DecoratorLocationAnalyzerOptions {
    return {
      decoratorName: 'Test'
    };
  }
}