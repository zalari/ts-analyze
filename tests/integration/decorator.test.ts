import { RepoAnalyzerEngine, RepoAnalyzerBase, RepoAnalysisContext, RepoAnalyzerResultBase } from '../../src';
import { ClassDeclaration, Node, ScriptTarget, Project } from 'ts-morph';
import { DecoratorFinder } from '../../walkers/decorator-finder';
import { CodeWalkerNodeResult } from '../../src/classes/code-walker-node-result.class';
import { ModuleKind, ModuleResolutionKind, CompilerOptions } from 'typescript';
import { TestAnalyzer } from '../fixtures/decorator/test-analyzer';
import { SourceDiscoveryMode } from '../../src/enums/source-discovery-mode.enum';

test('Decorator Test', () => {
  const engine = new RepoAnalyzerEngine(process.cwd() + '/tests/fixtures/decorator');
  const analyzer = new TestAnalyzer('.', ['.']);

  const result = engine.run(analyzer, { respectErrors: true, sourceDiscoveryMode: SourceDiscoveryMode.All });

  expect(result.data).toHaveLength(1);
});

