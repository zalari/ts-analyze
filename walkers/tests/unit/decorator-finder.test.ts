import { TestUtil } from '../../../utils/test-util';
import { ClassDecoratorFinder } from '../../src/class-decorator-finder';
import { RepoAnalysisContextImplementation } from '@zalari/repo-analyzers-base/dist';
import { DecoratorFinderResultData } from '../../src/decorator-finder-base';

test('Sanity Check', () => {
  const code = TestUtil.getCodeForFixture('fixture-1');
  const { sourceFile, context } = TestUtil.getStubsForWalker(code);

  // TODO: Error without assertion. Find out reason.
  const finder = new ClassDecoratorFinder(sourceFile, '', { decoratorName: 'TestDecorator' }, context as unknown as RepoAnalysisContextImplementation);
  finder.walk(sourceFile);
  const results = finder.getResults();

  expect(results.length)
    .toBe(1);
});

test('Can get call expression of decorator', () => {
  const code = TestUtil.getCodeForFixture('fixture-1');
  const { sourceFile, context } = TestUtil.getStubsForWalker(code);

  const finder = new ClassDecoratorFinder(sourceFile, '', { decoratorName: 'TestDecorator' }, context as unknown as RepoAnalysisContextImplementation);
  finder.walk(sourceFile);
  const results = finder.getResults();

  expect((results[0].data as DecoratorFinderResultData).callExpression).toBeDefined();
});