import { SourceDiscoveryMode } from '../enums/source-discovery-mode.enum';

export interface RepoAnalyzerEngineRunOptions {
    respectErrors: boolean;
    sourceDiscoveryMode: SourceDiscoveryMode;
}
