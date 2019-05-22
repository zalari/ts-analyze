import { RepoAnalyzerEngine } from '../../src';
import { TestAnalyzer } from '../fixtures/decorator/test-analyzer';
import { SourceDiscoveryMode } from '../../src/enums/source-discovery-mode.enum';
import { TestUtil } from '../test-util';

test('Sanity Check', () => {
  const testAnalyzer = new TestAnalyzer('common');
  const result = TestUtil.runAnalyzer(testAnalyzer);

  expect(result.data).toHaveLength(1);
});

