import { Project, ts } from "ts-morph";
import { RepoAnalysisContextImplementation, RepoAnalyzerEngine, RepoAnalyzerBase, RepoAnalysisContext, RepoAnalyzerResultBase } from "../src";
import * as winston from 'winston';

export function getStubsForWalker(code: string): GetStubsResult {
    const project = new Project();
    const sourceFile = project.createSourceFile('test-temp.ts', code).compilerNode;
    const context = getContext(project);

    return {
        sourceFile,
        context
    }
}

function getContext(project: Project): RepoAnalysisContextImplementation {
    const engine = new RepoAnalyzerEngine('.');
    const analyzer = new StubAnalyzer('.'); 
    const context = new RepoAnalysisContextImplementation(engine, project, analyzer, winston.createLogger());

    return context;
}

interface GetStubsResult {
    sourceFile: ts.SourceFile;
    context: RepoAnalysisContextImplementation;
}

class StubAnalyzer extends RepoAnalyzerBase<any> {
    initialize(context: RepoAnalysisContext): void {
    } 
    
    getResult(): RepoAnalyzerResultBase<any> {
        return new RepoAnalyzerResultBase({});
    }
}