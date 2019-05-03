import { Node, Symbol, SyntaxKind, Project } from "ts-morph";

export class WalkerLanguageService {
    constructor(private _project: Project) {
    }

    /**
     * Gets the respective project-attached node for a given unattached node.
     * 
     * @param unattachedNode
     */
    attach<T extends Node>(unattachedNode: T): Node {
        const sourceFile = this._project.getSourceFileOrThrow(unattachedNode.getSourceFile().getFilePath());
        const child = sourceFile.getDescendantAtStartWithWidth(unattachedNode.getStart(), unattachedNode.getWidth());

        return child as T;
    }

    /**
     * Tries to get a symbol for a given node suppressing exceptions.
     * 
     * @param node 
     */
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

    /**
     * Tries to get the symbol that declares the given symbol (for example the class declaring a method).
     * 
     * @param symbol 
     */
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