import { RepoAnalyzerBase, CodeWalkerResultHandler, RepoAnalysisContext, RepoAnalyzerResultBase } from '..';
import fs from 'fs';
import path from 'path';
import winston from 'winston';
import { Project } from 'ts-morph';
import { SourceFile, CompilerOptions, ScriptTarget, ModuleKind, ModuleResolutionKind, DiagnosticCategory } from 'typescript';
import { isArray } from 'util';
import { SourceDiscoveryMode } from '../enums/source-discovery-mode.enum';
import { RepoAnalyzerEngineRunOptions } from '../interfaces/repo-analyzer-engine-run-options.interface';

/**
 * Engine for running repo analyzers.
 */
export class RepoAnalyzerEngine {
  private readonly _logger!: winston.Logger;
  private readonly _analyzersToWalkers:  Map<RepoAnalyzerBase<any>, Map<any, { handlers: CodeWalkerResultHandler<any>[], options?: any } >>;  

  constructor(private _repoRootPath: string, logger?: winston.Logger) {
    this._analyzersToWalkers = new Map<RepoAnalyzerBase<any>, Map<any, { handlers: CodeWalkerResultHandler<any>[], options?: any }>>();
    this._logger = logger!;

    if (!this._logger) {
      this._logger = winston.createLogger({
        transports: [
          new winston.transports.Console()
        ]
      });
    }
  }

  run(analyzer: RepoAnalyzerBase<any>, options?: RepoAnalyzerEngineRunOptions): RepoAnalyzerResultBase<any>
  run(analyzers: RepoAnalyzerBase<any>[], options?: RepoAnalyzerEngineRunOptions): Map<RepoAnalyzerBase<any>, RepoAnalyzerResultBase<any>>
  run(analyzerOrArray: RepoAnalyzerBase<any> | RepoAnalyzerBase<any>[], options?: RepoAnalyzerEngineRunOptions): RepoAnalyzerResultBase<any> | Map<RepoAnalyzerBase<any>, RepoAnalyzerResultBase<any>> {
    const respectErrors = options ? options.respectErrors : false;
    const sourceDiscoveryMode = options ? options.sourceDiscoveryMode : SourceDiscoveryMode.TsConfig;

    let analyzers: RepoAnalyzerBase<any>[];
    
    if (!isArray(analyzerOrArray)) {
      analyzers = [analyzerOrArray as RepoAnalyzerBase<any>];
    } else {
      analyzers = analyzerOrArray;
    }

    const result: Map<RepoAnalyzerBase<any>, RepoAnalyzerResultBase<any>> = new Map();

    analyzers.forEach(analyzer => {
      const compilationResult = this.compile(path.join(this._repoRootPath, analyzer.analysisRootPath), analyzer.analysisSearchPaths, sourceDiscoveryMode, respectErrors);
      const context = new RepoAnalysisContext(this, compilationResult.project, analyzer, this._logger);

      analyzer.initialize(context);
     
      compilationResult.files.forEach(sourceFile => {
        const walkersToHandlers = this._analyzersToWalkers.get(analyzer)!;
          walkersToHandlers.forEach((data, walker) => {
            const instance = new walker(sourceFile, 'walker', data.options);
            instance.walk(sourceFile);
            const walkerResults = instance.getResults();
            
            data.handlers.forEach(handler => {
              handler(walkerResults);
            });
          });
        });

        result.set(analyzer, analyzer.getResult());
      });

    if (result.size == 1) {
      return result.get(analyzerOrArray as RepoAnalyzerBase<any>) as RepoAnalyzerResultBase<any>;
    }

    return result;
  }
  

  registerWalker<TWalker extends { new (...args: any[]): InstanceType<TWalker> } & { }, TOptions>(callingAnalyzer: RepoAnalyzerBase<any>, walker: TWalker, handlerOrOptions?: CodeWalkerResultHandler<any> | TOptions, options?: TOptions): void {
    if (!this._analyzersToWalkers.has(callingAnalyzer)) {
      !this._analyzersToWalkers.set(callingAnalyzer, new Map());
    }

    let handler;

    if (this.isResultHandler(handlerOrOptions)) {
      handler = handlerOrOptions;
      options = options;
    } else {
      options = handlerOrOptions;
    }
    
    if (!this._analyzersToWalkers.get(callingAnalyzer)!.has(walker)) {
      this._analyzersToWalkers.get(callingAnalyzer)!.set(walker, { handlers: [], options });
    }
 
    if (handler) {
      this._analyzersToWalkers.get(callingAnalyzer)!.get(walker)!.handlers.push(handler);
    }
  }
  
  private compile(compilationRootPath: string, searchPaths: string[], sourceDiscoveryMode: SourceDiscoveryMode, respectErrors: boolean): { project: Project, files: SourceFile[] } {
    const project: Project = this.compileProject(compilationRootPath, searchPaths, sourceDiscoveryMode, respectErrors);

    return { project, files: project.getSourceFiles().filter(f => !f.isInNodeModules()).map(sourceFile => sourceFile.compilerNode) };
  }

  private compileProject(compilationRootPath: string, relativeSearchPaths: string[], sourceDiscoveryMode: SourceDiscoveryMode, respectErrors: boolean): Project {
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
      const rootWithRelativePath = `${path.join(compilerOptions.rootDir!, searchPath)}`;

      if (sourceDiscoveryMode === SourceDiscoveryMode.TsConfig) {
        const tsConfigPaths = this.searchRecursive(rootWithRelativePath, 'tsconfig.json');

        tsConfigPaths.forEach(p => {
            this._logger.info(`Found tsconfig.json at ${p}. Adding to compilation`);
            project.addSourceFilesFromTsConfig(p);
        })
      } else if (sourceDiscoveryMode === SourceDiscoveryMode.All) {
        const paths = this.searchRecursive(rootWithRelativePath, '.ts');
        project.addExistingSourceFiles(paths);
      }
      // Line below added searched node_modules as of ts-morph 2.0.1 which takes way too long.
      // project.addExistingSourceFiles(`${absoluteSearchPath}/**/*.ts`);
    });

    if (project.getSourceFiles().length === 0) {
      throw new Error('No source files found');
    }

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

  private isResultHandler(arg: any): arg is CodeWalkerResultHandler<any> {
    return typeof arg === 'function';
  }

  private searchRecursive(dir: string, pattern: string) {
    if (dir.endsWith('node_modules')) {
      return [];
    }

    let results: string[] = [];
  
    fs.readdirSync(dir).forEach((dirInner) => {
      dirInner = path.resolve(dir, dirInner);
      const stat = fs.statSync(dirInner);
      if (stat.isDirectory()) {
        results = results.concat(this.searchRecursive(dirInner, pattern));
      }

      if (stat.isFile() && dirInner.endsWith(pattern)) {
        results.push(dirInner);
      }

    });
  
    return results;
  };
}

