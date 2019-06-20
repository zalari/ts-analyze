import { SourceFile, SyntaxKind } from 'typescript';
import { ClassDeclaration, DecoratableNode, MethodDeclaration, PropertyDeclaration, Decorator, CallExpression } from 'ts-morph';
import { CodeWalkerOptions } from '@zalari/repo-analyzers-base';
import { CodeWalkerBase, CodeWalkerResultBase } from '@zalari/repo-analyzers-base';

export interface DecoratorFinderOptions extends CodeWalkerOptions {
  decoratorName: string | 'all';
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
  abstract walk(sourceFile: SourceFile): void;

  protected analyze(node: DecoratableNode, expectedDecoratorName: 'all' | string) {
    let finderResults: DecoratorFinderResultData<DecoratableNode>[];

    if (expectedDecoratorName === 'all') {
      finderResults = node.getDecorators()
        .map(decorator => {
          return {
            decoratorName: expectedDecoratorName,
            decoratedNode: node,
            decoratorNode: decorator,
            callExpression: decorator.getFirstDescendantByKind(SyntaxKind.CallExpression)
          };
        });
    } else {
      let decorator = node.getDecorator(expectedDecoratorName);

      if (decorator) {
        finderResults = [
          {
            decoratorName: expectedDecoratorName,
            decoratedNode: node,
            decoratorNode: decorator,
            callExpression: decorator.getFirstDescendantByKind(SyntaxKind.CallExpression)
          }
        ];
      } else {
        finderResults = [];
      }
    }

    finderResults.forEach(result => this.addResult(CodeWalkerResultBase.create(result)));
  }
}