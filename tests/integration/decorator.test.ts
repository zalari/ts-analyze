import { TestAnalyzer } from '../fixtures/decorator/test-analyzer';
import { TestUtil } from '../test-util';

test('Sanity Check', () => {
  const testAnalyzer = new TestAnalyzer('common');
  const result = TestUtil.runAnalyzer(testAnalyzer);

  expect(result.data)
    .toHaveLength(1);
});

