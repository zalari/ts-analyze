import { TestAnalyzer } from '../fixtures/test-analyzer';
import { TestUtil } from '../../../utils/test-util';

test('Sanity Check', () => {
  const testAnalyzer = new TestAnalyzer('../../../utils/common-fixtures');
  const result = TestUtil.runAnalyzer(testAnalyzer, false);

  expect(result.data)
    .toHaveLength(1);
});

