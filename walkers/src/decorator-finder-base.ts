import {
  CallExpression,
  ClassDeclaration,
  DecoratableNode,
  Decorator,
  MethodDeclaration,
  PropertyDeclaration,
  Node,
  ts,
  SyntaxKind
} from 'ts-morph';
import { CodeWalkerBase, CodeWalkerOptions, CodeWalkerResultBase } from '@zalari/ts-analyze-base';

export interface DecoratorFinderOptions extends CodeWalkerOptions {
  decoratorNames: string | 'all' | string[];
}

export interface DecoratorFinderResult extends CodeWalkerResultBase<DecoratorFinderResultData> {
}

export interface DecoratorFinderResultData<T = ClassDeclaration | MethodDeclaration | PropertyDeclaration> {
  decoratorName: string;
  decoratorNode: Decorator;
  decoratedNode: T
  callExpression?: CallExpression
}

export abstract class DecoratorFinderBase<TNode extends DecoratableNode> extends CodeWalkerBase<DecoratorFinderOptions> {
  abstract walk(sourceFile: ts.SourceFile): void;

  protected analyze(node: DecoratableNode, expectedDecoratorNames: 'all' | string | string[]) {
    let finderResults: DecoratorFinderResultData<DecoratableNode>[] = [];

    if (expectedDecoratorNames === 'all') {
      finderResults = node.getDecorators()
        .map(decorator => {
          return {
            decoratorName: decorator.getName(),
            decoratedNode: node,
            decoratorNode: decorator,
            callExpression: decorator.getFirstDescendantByKind(SyntaxKind.CallExpression)
          };
        });
    } else {
      if (typeof expectedDecoratorNames === 'string') {
        expectedDecoratorNames = [expectedDecoratorNames];
      }

      expectedDecoratorNames.forEach(expectedDecoratorName => {
        let decorator = node.getDecorator(expectedDecoratorName);

        if (decorator) {
          finderResults.push(
            {
              decoratorName: expectedDecoratorName,
              decoratedNode: this.languageService.attach(node as unknown as Node) as unknown as DecoratableNode,
              decoratorNode: decorator,
              callExpression: decorator.getFirstDescendantByKind(SyntaxKind.CallExpression)
            }
          );
        }

      });
    }

    finderResults.forEach(result => this.addResult(CodeWalkerResultBase.create(result)));
  }
}
