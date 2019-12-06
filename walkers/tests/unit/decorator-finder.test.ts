import { TestUtil } from '../../../utils/test-util';
import { ClassDecoratorFinder } from '../../src/class-decorator-finder';
import { MethodDecoratorFinder } from '../../src/method-decorator-finder';
import { PropertyDecoratorFinder } from '../../src/property-decorator-finder';
import { RepoAnalysisContextImplementation } from '@zalari/ts-analyze-base/dist';
import { DecoratorFinderResultData } from '../../src/decorator-finder-base';

test('Sanity Check', () => {
  const code = TestUtil.getCodeForFixture('fixture-1');
  const { sourceFile, context } = TestUtil.getStubsForWalker(code);

  // TODO: Error without assertion. Find out reason.
  const finder = new ClassDecoratorFinder(sourceFile, '', { decoratorNames: 'TestDecorator' }, context as unknown as RepoAnalysisContextImplementation);
  finder.walk(sourceFile);
  const results = finder.getResults();

  expect(results.length)
    .toBe(1);
});

test('Can get call expression of class decorator', () => {
  const code = TestUtil.getCodeForFixture('fixture-1');
  const { sourceFile, context } = TestUtil.getStubsForWalker(code);

  const finder = new ClassDecoratorFinder(sourceFile, '', { decoratorNames: 'TestDecorator' }, context as unknown as RepoAnalysisContextImplementation);
  finder.walk(sourceFile);
  const results = finder.getResults();

  expect((results[0].data as DecoratorFinderResultData).callExpression).toBeDefined();
});

test('Can get multiple class decorators explicitly', () => {
  const code = TestUtil.getCodeForFixture('fixture-1');
  const { sourceFile, context } = TestUtil.getStubsForWalker(code);

  const finder = new ClassDecoratorFinder(sourceFile, '', { decoratorNames: ['TestDecorator', 'TestDecorator2'] }, context as unknown as RepoAnalysisContextImplementation);
  finder.walk(sourceFile);
  const results = finder.getResults();

  expect(results.length)
    .toBe(2);
});

test('Can get non-existent/without symbol class decorator explicitly', () => {
  const code = TestUtil.getCodeForFixture('fixture-1');
  const { sourceFile, context } = TestUtil.getStubsForWalker(code);

  const finder = new ClassDecoratorFinder(sourceFile, '', { decoratorNames: 'NonExistentDecorator' }, context as unknown as RepoAnalysisContextImplementation);
  finder.walk(sourceFile);
  const results = finder.getResults();

  expect(results.length)
    .toBe(1);
});

test('Can get multiple class decorators implicitly', () => {
  const code = TestUtil.getCodeForFixture('fixture-1');
  const { sourceFile, context } = TestUtil.getStubsForWalker(code);

  const finder = new ClassDecoratorFinder(sourceFile, '', { decoratorNames: 'all' }, context as unknown as RepoAnalysisContextImplementation);
  finder.walk(sourceFile);
  const results = finder.getResults();

  expect(results.length)
    .toBe(3);
});

test('Can get method decorator explicitly', () => {
  const code = TestUtil.getCodeForFixture('fixture-1');
  const { sourceFile, context } = TestUtil.getStubsForWalker(code);

  const finder = new MethodDecoratorFinder(sourceFile, '', { decoratorNames: 'TestDecorator3' }, context as unknown as RepoAnalysisContextImplementation);
  finder.walk(sourceFile);
  const results = finder.getResults();

  expect(results.length)
    .toBe(1);
});

test('Can get property decorator explicitly', () => {
  const code = TestUtil.getCodeForFixture('fixture-1');
  const { sourceFile, context } = TestUtil.getStubsForWalker(code);

  const finder = new PropertyDecoratorFinder(sourceFile, '', { decoratorNames: ['TestDecorator4'] }, context as unknown as RepoAnalysisContextImplementation);
  finder.walk(sourceFile);
  const results = finder.getResults();

  expect(results.length)
    .toBe(1);
});
