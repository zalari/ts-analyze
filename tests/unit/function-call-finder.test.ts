import { TestUtil} from '../test-util';
import { FunctionCallFinder } from '../../walkers/function-call-finder';

test('Sanity Check', () => {
    const code = 'function foo() {} foo();';
    const { sourceFile, context } = TestUtil.getStubsForWalker(code);

    const finder = new FunctionCallFinder(sourceFile, '', { functionName: 'foo' }, context);
    finder.walk(sourceFile);
    const results = finder.getResults();

    expect(results.length).toBe(1);
});