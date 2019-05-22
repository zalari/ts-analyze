import { TestUtil } from '../test-util';
import { PropertyAccessFinder } from '../../walkers/property-access-finder';

test('Sanity Check', () => {
    const code = TestUtil.getCodeForFixture("fixture-1");
    const { sourceFile, context } = TestUtil.getStubsForWalker(code);

    const finder = new PropertyAccessFinder(sourceFile, '', { kind: "method",  typeName: '', propertyName: 'doWithTypeAsArgument' }, context);
    finder.walk(sourceFile);
    const results = finder.getResults();

    expect(results.length).toBe(1);
});