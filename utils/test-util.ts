import { Project, ts } from 'ts-morph';
import { RepoAnalysisContext, RepoAnalysisContextImplementation, RepoAnalyzerBase, RepoAnalyzerEngine, RepoAnalyzerResultBase } from '../base/dist';
import * as winston from 'winston';
import * as fs from 'fs';
import * as path from 'path';
import { SourceDiscoveryMode } from '../base/dist/enums/source-discovery-mode.enum';

export class TestUtil {
  public static getCodeForFixture(fixture: CommonFixtures): string {
    return fs.readFileSync(path.join(__dirname, `common-fixtures/${ fixture }.ts`), { encoding: 'utf8' });
  }

  public static getStubsForWalker(code: string): GetStubsResult {
    const project = new Project();
    const sourceFile = project.createSourceFile('test-temp.ts', code).compilerNode;
    const context = TestUtil.getContext(project);

    return {
      sourceFile,
      context
    };
  }

  public static runAnalyzer<T extends any>(analyzer: RepoAnalyzerBase<any>, respectErrors: boolean = true): RepoAnalyzerResultBase<T> {
    const engine = new RepoAnalyzerEngine(path.join(process.cwd() + '/tests/fixtures'));
    const result = engine.run(analyzer, { respectErrors, sourceDiscoveryMode: SourceDiscoveryMode.All });

    return result;
  }

  private static getContext(project: Project): RepoAnalysisContextImplementation {
    const engine = new RepoAnalyzerEngine('.');
    const analyzer = new StubAnalyzer('.');
    const context = new RepoAnalysisContextImplementation(engine, project, analyzer, winston.createLogger());

    return context;
  }
}

type CommonFixtures = 'fixture-1';

interface GetStubsResult {
  sourceFile: ts.SourceFile;
  context: RepoAnalysisContextImplementation;
}

class StubAnalyzer extends RepoAnalyzerBase<any> {
  initialize(context: RepoAnalysisContext): void {
  }

  getResult(): RepoAnalyzerResultBase<any> {
    return new RepoAnalyzerResultBase({});
  }
}
