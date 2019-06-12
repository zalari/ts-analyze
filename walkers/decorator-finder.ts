import { CodeWalkerBase, CodeWalkerResultBase } from '../src';
import { SourceFile } from 'typescript';
import { ClassDeclaration, MethodDeclaration, PropertyDeclaration, SyntaxKind } from 'ts-morph';
import { WalkerOptions } from '../src/interfaces/walker-options.interface';

export interface DecoratorFinderOptions extends WalkerOptions {
  decoratorName: string | 'all';
  targets?: {
    classes?: boolean;
    methods?: boolean;
    properties?: boolean;
  }
}

export interface DecoratorFinderResult extends CodeWalkerResultBase<DecoratorFinderResultData> {

}

interface DecoratorFinderResultData {
  decoratorName: string;
  node: ClassDeclaration | MethodDeclaration | PropertyDeclaration;
  nodeKind: SyntaxKind;
}

/**
 * Common purpose walker that locates decorators and returns the decorated nodes.
 */
export class DecoratorFinder extends CodeWalkerBase<DecoratorFinderOptions> {
  static getDefaultOptions(): DecoratorFinderOptions {
    return DecoratorFinder.prepareOptions();
  }

  walk(sourceFile: SourceFile): void {
    const file = this.wrap(sourceFile);
    const options = DecoratorFinder.prepareOptions(this.options);

    const { decoratorName, targets } = options;
    file.getClasses()
      .forEach(classNode => {
        if (targets!.classes) {
          this.analyze(classNode, decoratorName);
        }

        if (targets!.methods) {
          classNode.getMethods()
            .forEach(methodNode => {
              this.analyze(methodNode, decoratorName);
            });
        }

        if (targets!.properties) {
          classNode.getProperties()
            .forEach(propertyNode => {
              this.analyze(propertyNode, decoratorName);
            });
        }
      });
  }

  private analyze(node: ClassDeclaration | MethodDeclaration | PropertyDeclaration, decoratorName: 'all' | string) {
    let finderResults: DecoratorFinderResultData[];

    if (decoratorName === 'all') {
      finderResults = node.getDecorators()
        .map(v => { return { decoratorName, node, nodeKind: node.getKind() }; });
    } else {
      if (node.getDecorator(decoratorName)) {
        finderResults = [{ decoratorName, node, nodeKind: node.getKind() }];
      } else {
        finderResults = [];
      }
    }

    finderResults.forEach(result => this.addResult(CodeWalkerResultBase.create(result)));
  }

  private static prepareOptions(options?: DecoratorFinderOptions): DecoratorFinderOptions {
    if (!options) {
      return {
        decoratorName: 'all',
        targets: {
          classes: true,
          methods: true,
          properties: true
        }
      };
    } else {
      const { decoratorName, targets } = options;

      let classes = true;
      let methods = true;
      let properties = true;

      if (targets) {
        classes = targets.classes ? true : false;
        methods = targets.methods ? true : false;
        properties = targets.properties ? true : false;
      }

      return {
        decoratorName,
        targets: {
          classes,
          methods,
          properties
        }
      };
    }
  }
}
