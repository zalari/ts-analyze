import { TestUtil } from '../test-util';
import { PropertyAccessFinder } from '../../walkers/property-access-finder';

test('Can find method for specified class', () => {
    const code = TestUtil.getCodeForFixture("fixture-1");
    const { sourceFile, context } = TestUtil.getStubsForWalker(code);

    const finder = new PropertyAccessFinder(sourceFile, '', { kind: "method",  typeName: 'ExternalClass', propertyName: 'doWithTypeAsArgument' }, context);
    finder.walk(sourceFile);
    const results = finder.getResults();

    expect(results.length).toBe(1);
});

test('Can find method for unspecified class', () => {
    const code = TestUtil.getCodeForFixture("fixture-1");
    const { sourceFile, context } = TestUtil.getStubsForWalker(code);

    const finder = new PropertyAccessFinder(sourceFile, '', { kind: "method", propertyName: 'doWithTypeAsArgument' }, context);
    finder.walk(sourceFile);
    const results = finder.getResults();

    expect(results.length).toBe(1);
});
