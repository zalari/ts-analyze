import { RepoAnalyzerWithOptionsBase, RepoAnalysisContext, RepoAnalyzerResultBase } from "../src/api";
import { DecoratorFinder } from "../walkers/decorator-finder";
import { CodeWalkerNodeResult } from "../src/classes/code-walker-node-result.class";
import { Node } from "ts-morph";

import fs from 'fs';
import path from 'path';
import os from 'os';


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
    const locations: { package: string, path: string}[] = [];

    this.decoratedNodes.forEach(node => {
        const packageJson = this.findPackageJson(node.getSourceFile().getFilePath());
        
        if (packageJson) {
            locations.push({ package: packageJson.name, path: node.getSourceFile().getFilePath() })
        }
    });

    return new RepoAnalyzerResultBase({locations});

  }

  private findPackageJson(filePath: string): any | null {
    let currentDir = path.dirname(filePath).toLowerCase();
    var fsRoot = (os.platform() === "win32") ? process.cwd().split(path.sep)[0] + '/' : "/"

    while (currentDir !== fsRoot) {
        const directoryContents = fs.readdirSync(currentDir);

        if (directoryContents.includes('package.json')) {
            return JSON.parse(fs.readFileSync(path.join(currentDir, 'package.json'), { encoding: 'utf8'}));
        }

        currentDir = path.join(currentDir, '..');
    }   

    return null;
  }
}