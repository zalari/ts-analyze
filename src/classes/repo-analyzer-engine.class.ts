import { RepoAnalyzerBase, CodeWalkerResultHandler, RepoAnalysisContext, RepoAnalyzerResultBase } from '..';
import path from 'path';
import winston from 'winston';
import { Project } from 'ts-morph';
import { SourceFile, CompilerOptions, ScriptTarget, ModuleKind, ModuleResolutionKind, DiagnosticCategory } from 'typescript';
import { isArray } from 'util';

export class RepoAnalyzerEngine {
  private readonly _logger!: winston.Logger;
  private readonly _analyzersToWalkers:  Map<RepoAnalyzerBase, Map<any, CodeWalkerResultHandler[]>>;  

  constructor(private _repoRootPath: string, logger?: winston.Logger) {
    this._analyzersToWalkers = new Map<RepoAnalyzerBase, Map<any, CodeWalkerResultHandler[]>>();
    this._logger = logger!;

    if (!this._logger) {
      this._logger = winston.createLogger({
        transports: [
          new winston.transports.Console()
        ]
      });
    }
  }

  run(analyzer: RepoAnalyzerBase): RepoAnalyzerResultBase<any>
  run(analyzers: RepoAnalyzerBase[]): Map<RepoAnalyzerBase, RepoAnalyzerResultBase<any>>
  run(analyzerOrArray: RepoAnalyzerBase | RepoAnalyzerBase[]): RepoAnalyzerResultBase<any> | Map<RepoAnalyzerBase, RepoAnalyzerResultBase<any>> {
    let analyzers: RepoAnalyzerBase[];
    
    if (!isArray(analyzerOrArray)) {
      analyzers = [analyzerOrArray as RepoAnalyzerBase];
    } else {
      analyzers = analyzerOrArray;
    }

    const result: Map<RepoAnalyzerBase, RepoAnalyzerResultBase<any>> = new Map();

    analyzers.forEach(analyzer => {
      const context = new RepoAnalysisContext(this, analyzer, this._logger);

      analyzer.initialize(context);
      const sourceFiles = this.getCompiledSources(path.join(this._repoRootPath, analyzer.analysisRootPath), analyzer.analysisSearchPaths);

      sourceFiles.forEach(sourceFile => {
        const walkersToHandlers = this._analyzersToWalkers.get(analyzer)!;
          walkersToHandlers.forEach((handlers, walker) => {
            const instance = new walker(sourceFile);
            instance.walk(sourceFile);
            const walkerResults = instance.getResults();
            
            handlers.forEach(handler => {
              handler(walkerResults);
            });

            result.set(analyzer, analyzer.getResult());
          });
        });
      });

    if (result.size == 1) {
      return result.get(analyzerOrArray as RepoAnalyzerBase) as RepoAnalyzerResultBase<any>;
    }

    return result;
  }
  

  registerWalker<T extends { new (...args: any[]): InstanceType<T> }>(callingAnalyzer: RepoAnalyzerBase, walker: T, handler?: CodeWalkerResultHandler): void {  
    if (!this._analyzersToWalkers.has(callingAnalyzer)) {
      !this._analyzersToWalkers.set(callingAnalyzer, new Map());
    }
    
    if (!this._analyzersToWalkers.get(callingAnalyzer)!.has(walker)) {
      this._analyzersToWalkers.get(callingAnalyzer)!.set(walker, []);
    }

    if (handler) {
      this._analyzersToWalkers.get(callingAnalyzer)!.get(walker)!.push(handler);
    }
  }
  
  private getCompiledSources(compilationRootPath: string, searchPaths: string[], respectErrors = false): SourceFile[] {
    const project: Project = this.compileProject(compilationRootPath, searchPaths);

    return project.getSourceFiles().filter(f => !f.isInNodeModules()).map(sourceFile => sourceFile.compilerNode);
  }

  private compileProject(compilationRootPath: string, relativeSearchPaths: string[], respectErrors: boolean = false): Project {
    const compilerOptions: CompilerOptions = {
      rootDir: compilationRootPath,
      target: ScriptTarget.ES5,
      module: ModuleKind.ES2015,
      moduleResolution: ModuleResolutionKind.NodeJs,
      emitDecoratorMetadata: true,
      experimentalDecorators: true,
      importHelpers: true,
      noEmitHelpers: true,
      allowSyntheticDefaultImports: true,
      lib: ['lib.es5.d.ts', 'lib.es2015.d.ts', 'lib.dom.d.ts', 'typescript.d.ts'],
      preserveSymlinks: true
    };

    const project = new Project({ compilerOptions });

    relativeSearchPaths.forEach(searchPath => {
      const absoluteSearchPath = `${path.join(compilerOptions.rootDir!, searchPath)}`;
      this._logger.info(`Adding search path to compilation: ${absoluteSearchPath}`);

      project.addExistingSourceFiles(`${absoluteSearchPath}/**/*.ts`);
    });

    if (respectErrors) {
      const errors = project
        .getPreEmitDiagnostics()
        .filter((diagnostic) => diagnostic.getCategory() === DiagnosticCategory.Error);

      if (errors.length > 0) {
        const messages = errors.map((diagnostic) => ({
          message: diagnostic.getMessageText(),
          file: diagnostic.getSourceFile() ? diagnostic.getSourceFile()!.getFilePath() : undefined
        }));
  
        throw new Error(`Compilation has errors: ${JSON.stringify(messages, null, 2)}`);
      }
    }

    return project;
  }
}