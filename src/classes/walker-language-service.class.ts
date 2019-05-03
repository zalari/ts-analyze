import { Node, Symbol, SyntaxKind, Project } from "ts-morph";

export class WalkerLanguageService {
    constructor(private _project: Project) {
    }

    attach<T extends Node>(unattachedNode: T): Node {
        const sourceFile = this._project.getSourceFileOrThrow(unattachedNode.getSourceFile().getFilePath());
        const child = sourceFile.getDescendantAtStartWithWidth(unattachedNode.getStart(), unattachedNode.getWidth());

        return child as T;
    }

    public getSymbolSafe(node: Node): Symbol | undefined {
        try {
            const symbol = node.getSymbol();
            return symbol;
        } catch {
            try {
                return this.attach(node).getSymbol();
            } catch {
                return undefined;
            }
        }
    }

    public getDeclaringSymbol(symbol: Symbol): Symbol | undefined {
        const declarations = symbol.getDeclarations();

        if (declarations.length === 0) {
            return undefined;
        }

        const firstDeclaration = declarations[0];
        const classDeclaration = firstDeclaration.getParentIfKind(SyntaxKind.ClassDeclaration);

        if (!classDeclaration) {
            return undefined;
        }

        return this.getSymbolSafe(classDeclaration);
    }
}