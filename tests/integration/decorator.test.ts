import { RepoAnalyzerEngine } from '../../src';
import { TestAnalyzer } from '../fixtures/decorator/test-analyzer';
import { SourceDiscoveryMode } from '../../src/enums/source-discovery-mode.enum';

test('Sanity Check', () => {
  const engine = new RepoAnalyzerEngine(process.cwd() + '/tests/fixtures/decorator');
  const analyzer = new TestAnalyzer('.', ['.']);

  const result = engine.run(analyzer, { respectErrors: true, sourceDiscoveryMode: SourceDiscoveryMode.All });

  expect(result.data).toHaveLength(1);
});

