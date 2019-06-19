import { TestUtil } from '../../../utils/test-util';
import { FunctionCallFinder } from '../../src/function-call-finder';

test('Sanity Check', () => {
  const code = 'function foo() {} foo();';
  const { sourceFile, context } = TestUtil.getStubsForWalker(code);

  const finder = new FunctionCallFinder(sourceFile, '', { functionName: 'foo' }, context);
  finder.walk(sourceFile);
  const results = finder.getResults();

  expect(results.length)
    .toBe(1);
});

test('Can find export from specific file', () => {
  const code = TestUtil.getCodeForFixture('fixture-1');
  const { sourceFile, context } = TestUtil.getStubsForWalker(code);

  const finder = new FunctionCallFinder(sourceFile, '', { functionName: 'exportedFunction', exportedFrom: 'test-temp' }, context);
  finder.walk(sourceFile);
  const results = finder.getResults();

  expect(results.length)
    .toBe(1);
});
