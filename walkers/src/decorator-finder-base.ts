import { SourceFile } from 'typescript';
import { ClassDeclaration, DecoratableNode, MethodDeclaration, PropertyDeclaration } from 'ts-morph';
import { CodeWalkerOptions } from '@zalari/repo-analyzers-base';
import { CodeWalkerBase, CodeWalkerResultBase } from '@zalari/repo-analyzers-base';

export interface DecoratorFinderOptions extends CodeWalkerOptions {
  decoratorName: string | 'all';
}

export interface DecoratorFinderResult extends CodeWalkerResultBase<DecoratorFinderResultData> {
}

export interface DecoratorFinderResultData<T = ClassDeclaration | MethodDeclaration | PropertyDeclaration> {
  decoratorName: string;
  node: T
}

export abstract class DecoratorFinderBase<TNode extends DecoratableNode> extends CodeWalkerBase<DecoratorFinderOptions> {
  abstract walk(sourceFile: SourceFile): void;

  protected analyze(node: DecoratableNode, expectedDecoratorName: 'all' | string) {
    let finderResults: DecoratorFinderResultData<DecoratableNode>[];

    if (expectedDecoratorName === 'all') {
      finderResults = node.getDecorators()
        .map(v => { return { decoratorName: expectedDecoratorName, node }; });
    } else {
      if (node.getDecorator(expectedDecoratorName)) {
        finderResults = [{ decoratorName: expectedDecoratorName, node }];
      } else {
        finderResults = [];
      }
    }

    finderResults.forEach(result => this.addResult(CodeWalkerResultBase.create(result)));
  }
}