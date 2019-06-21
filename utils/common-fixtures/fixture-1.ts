export function exportedFunction() {};

function TestDecorator(constructor: Function) {}

function TestDecorator2(constructor: Function) {}

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
  private _foo: ExternalClass;

  constructor() {
    this._foo = new ExternalClass();
  }

  bar() {
    const decoratedClassInstance = new DecoratedClass();

    this._foo.doWithInstanceAsArgument(decoratedClassInstance);
    this._foo.doWithTypeAsArgument(DecoratedClass);

    exportedFunction();
  }

}