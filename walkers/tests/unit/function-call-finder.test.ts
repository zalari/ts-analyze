import { TestUtil } from '../../../utils/test-util';
import { FunctionCallFinder } from '../../src/function-call-finder';
import { RepoAnalysisContextImplementation } from '@zalari/ts-analyze-base/dist';

test('Sanity Check', () => {
  const code = 'function foo() {} foo();';
  const { sourceFile, context } = TestUtil.getStubsForWalker(code);

  const finder = new FunctionCallFinder(sourceFile, '', { functionName: 'foo' }, context as unknown as RepoAnalysisContextImplementation);
  finder.walk(sourceFile);
  const results = finder.getResults();

  expect(results.length)
    .toBe(1);
});

test('Can find export from specific file', () => {
  const code = TestUtil.getCodeForFixture('fixture-1');
  const { sourceFile, context } = TestUtil.getStubsForWalker(code);

  const finder = new FunctionCallFinder(sourceFile, '', { functionName: 'exportedFunction', origin: 'test-temp' }, context as unknown as RepoAnalysisContextImplementation);
  finder.walk(sourceFile);
  const results = finder.getResults();

  expect(results.length)
    .toBe(1);
});
