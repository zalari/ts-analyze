import { getStubsForWalker } from '../test-util';
import { PropertyAccessFinder } from '../../walkers/property-access-finder';
import { readFileSync } from 'fs';
import * as path from 'path';

test('Sanity Check', () => {
    const code = readFileSync(path.join(process.cwd(), 'tests/fixtures/decorator/fixture.ts'), { encoding: 'utf8' });
    const { sourceFile, context } = getStubsForWalker(code);

    const finder = new PropertyAccessFinder(sourceFile, '', { kind: "method",  typeName: '', propertyName: 'doWithTypeAsArgument' }, context);
    finder.walk(sourceFile);
    const results = finder.getResults();

    expect(results.length).toBe(1);
});