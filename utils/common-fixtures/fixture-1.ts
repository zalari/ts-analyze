export function exportedFunction() {};

function TestDecorator(constructor: Function) {}
function TestDecorator2(constructor: Function) {}

function TestDecorator3(value: object) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value = value;
  };
}

function TestDecorator4(target: any) {}

@TestDecorator('foo', 'bar')
@TestDecorator2
export class DecoratedClass {
}

export class ExternalClass {
  public doWithInstanceAsArgument(arg: object) {

  }

  public doWithTypeAsArgument(arg: any) {

  }
}

export class UsingClass {

  @TestDecorator4('foo')
  private _foo: ExternalClass;

  constructor() {
    this._foo = new ExternalClass();
  }


  @TestDecorator3({})
  bar() {
    const decoratedClassInstance = new DecoratedClass();

    this._foo.doWithInstanceAsArgument(decoratedClassInstance);
    this._foo.doWithTypeAsArgument(DecoratedClass);

    exportedFunction();
  }

}