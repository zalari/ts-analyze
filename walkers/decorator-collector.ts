import { CodeWalkerBase, CodeWalkerDataResult } from '../src';
import { SourceFile } from 'typescript';
import { CodeWalkerNodeResult } from '../src/classes/code-walker-node-result.class';

interface DecoratorCollectorOptions {
    decoratorName: string | 'all';
    targets?: {
        classes?: boolean;
        methods?: boolean;
        properties?: boolean;
    }
}

export class DecoratorCollector extends CodeWalkerBase<DecoratorCollectorOptions> {
    walk(sourceFile: SourceFile): void {
        const file = this.wrap(sourceFile);
        const options = this.prepareOptions();

        file.getClasses().forEach(classNode => {
            if (options.targets!.classes) {

                if (classNode.getDecorator(options.decoratorName)) {
                    this.addResult(new CodeWalkerNodeResult(classNode));
                }
            }

            if (options.targets!.methods) {
                classNode.getMethods().forEach(methodNode => {
                    if (methodNode.getDecorator(options.decoratorName)) {
                        this.addResult(new CodeWalkerNodeResult(methodNode));
                    }
                });
            }

            if (options.targets!.properties) {
                classNode.getProperties().forEach(propertyNode => {
                    if (propertyNode.getDecorator(options.decoratorName)) {
                        this.addResult(new CodeWalkerNodeResult(propertyNode));
                    };
                });
            }
        });
    }

    private prepareOptions(): DecoratorCollectorOptions {
        let result: DecoratorCollectorOptions;
        
        if (!this.options) {
            return {
                decoratorName: 'all',
                targets: {
                    classes: true,
                    methods: true,
                    properties: true
                }
            }
        } else {
            const { decoratorName, targets } = this.options;

            let classes = true;
            let methods = true;
            let properties = true;

            if (targets) {
                classes = targets.classes ? true : false;
                methods = targets.methods ? true : false;
                properties = targets.properties ? true: false;
            }

            return {
                decoratorName,
                targets: {
                    classes,
                    methods,
                    properties
                }
            }
        }
    }
}
