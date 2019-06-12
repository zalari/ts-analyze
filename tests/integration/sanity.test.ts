import { RepoAnalyzerEngine } from '../../src';
import { TemplateAnalyzer } from '../../analyzers/template-analyzer';
import { SourceDiscoveryMode } from '../../src/enums/source-discovery-mode.enum';

const engine = new RepoAnalyzerEngine(process.cwd());

// Do some sanity checks on our own project
test('Sanity Check', () => {
  const enumsDirAnalyzer = new TemplateAnalyzer('/src/enums', ['.'], { decoratorName: 'Test' });
  const classDirAnalyzer = new TemplateAnalyzer('/src/classes', ['.'], { decoratorName: 'Test' });
  const withSearchPathsAnalyzer = new TemplateAnalyzer('.', ['/src/enums', '/src/classes'], { decoratorName: 'Test' });

  const multiResult = engine.run([enumsDirAnalyzer, classDirAnalyzer, withSearchPathsAnalyzer], {
    sourceDiscoveryMode: SourceDiscoveryMode.All,
    respectErrors: false
  });
  const singleResult = engine.run(new TemplateAnalyzer('.', ['.'], { decoratorName: 'Test' }), {
    sourceDiscoveryMode: SourceDiscoveryMode.All,
    respectErrors: false
  });

  // No classes in enums directory
  expect(enumsDirAnalyzer.nameResults.length)
    .toBe(0);

  // Some classes in classes directory
  expect(classDirAnalyzer.nameResults.length)
    .toBeGreaterThan(0);
  expect(withSearchPathsAnalyzer.nameResults.length)
    .toBeGreaterThan(0);

  // 3 analyzers should yield 3 results
  expect(multiResult.size)
    .toBe(3);

  // 1 analyzer should yield 1 result
  expect(singleResult)
    .toBeDefined();
});
