# TypeScriptの練習

TypeScriptの型について勉強（No.2）。

参考：
[Qiita](https://qiita.com/uhyo/items/e2fdef2d3236b9bfe74a)


 ## プリミティブ型
- string
- number
- boolean
- symbol
- biging
- null
- undefined

相互に代入することは不可。
~~~ts
const a: number = 3;
const b: string = a; // エラー: Type 'number' is not assignable to type 'string'.
~~~


ただし、`null`と`undefined`はすべての型に代入が可能。<br>
tsconfig.jsonで`strictNullChecks: true`とすることで、`null`と`undefined`を区別できる。
~~~ts
const a:null = null;
const b:string = a; // Type 'null' is not assignable to type 'string'.
~~~


 ### リテラル型
プリミティブ型∋リテラル型

~~~ts
// NG
const a: 'foo' = 'foo';
const b: 'bar' = 'foo'; // Error: Type '"foo"' is not assignable to type '"bar"'.

// OK
const a:'foo' = 'foo';
const b:string = a;
~~~

### リテラル型と型推論
~~~ts
// NG
const a = 'foo'; // aは'foo'型。
const b: 'bar' = a; // Error: Type '"foo"' is not assignable to type '"bar"'.
~~~
constは変更されないことを前提としているため、自動的にaは`foo`型になる。

~~~ts
// NG
let a = 'foo'; // aはstring型に推論される
const b: string = a;
const c: 'foo' = a; // Error: Type 'string' is not assignable to type '"foo"'.
~~~

letは変更することを意図しているので、型注釈がない場合は、`string型`に型推論される。<br>
`a=string型` `c=foo型`となるため、cには代入できない。

letで宣言する場合も型注釈をつければリテラル型を持つことが出来る。

~~~ts
let a:'foo' = 'foo';
a = 'bar'; // Error: Type '"bar"' is not assignable to type '"foo"'.
~~~

---

## オブジェクト型
```ts
// OK
interface MyObj {
  foo: string,
  bar: number
};

const a:MyObj = {
  foo: 'foo',
  bar: 3
};

// NG
// Error: Type 'string' is not assignable to type 'number'.
const a: MyObj = {
  foo: 'foo',
  bar: 'bar'
};

// Error: Property 'bar' is missing in type '{ foo: string; }' but required in type 'MyObj'.
const b: MyObj = {
  foo: 'foo'
};
```

### 構造的部分型

```ts
interface MyObj {
  foo: string,
  bar: number
};


interface MyObj2 {
  foo: string
};

// OK
// const a: MyObj = { foo: 'foo', bar: 3 };
// const b: MyObj2 = a;

// NG
// Error: Type '{ foo: string; bar: number; }' is not assignable to type 'MyObj2'.
// Object literal may only specify known properties, and 'bar' does not exist in type 'MyObj2'.
const b: MyObj2 = { foo: 'foo', bar: 3 };
```
直接オブジェクトを代入するとNG。一度変数に入れるとOK。<br>
ただし、あまり推奨はされない。<br>
関数も同様。
```ts
interface MyObj2 {
  foo: string
};

// Error:  Argument of type '{ foo: string; bar: number; }' is not assignable to parameter of type 'MyObj2'.
// Object literal may only specify known properties, and 'bar' does not exist in type 'MyObj2'.
func({foo: 'foo', bar: 3});

function func(obj: MyObj2): void {}
```

---

## 配列型
```ts
const foo: number[] = [0, 1, 2, 3];
// または、
// const foo: Array<number> = [0, 1, 2, 3];
foo.push(4);
```

---

## 関数型
```ts
const f: (arg: string) => number = func;

function func(arg: string): number {
  return Number(arg);
}

console.log(f('3'));
// output: 3
```


### 関数の部分型関係
```ts

interface MyObj {
  foo: string,
  bar: number,
}
interface MyObj2 {
  foo: string,
}

// OK
const a: (obj: MyObj2) => void = () => {}
// equals to
// const a: (obj: MyObj2) => void = function() {}
const b: (obj: MyObj) => void = a;
// MyObj ∋ MyObj2

// MyObjとMyObj2が逆だとNG
```

```ts
// OK
const f1: (foo: string) => void = (arg:string): void {};
const f2: (foo: string, bar: number) => void = f1;

// NG
// Error: Expected 1 arguments, but got 2.
const f1: (foo: string) => void = () => {};
f1('foo', 3);
```

### 可変長引数
```js
// JavaScript
const func = (foo, ...bar) => bar;
console.log(func(1,2,3)); // [2,3]
```
```ts
// TypeScript
const func = (foo: string, ...bar: number[]) => bar;
func('foo'); // OK. Nothing is output.
func('bar', 1,2,3); // OK. [2, 3] is output.
func('baz', 'hey', 2, 3) // Error: Argument of type '"hey"' is not assignable to parameter of type 'number'.
```

---

## void型
何も返さない関数（return文が無い、もしくは返り値の無いreturn文で返る）はundefinedを返す。<br>
void型というのはundefinedのみを値にとる型。<br>
void型の変数にundefinedに入れることも可能。ただし、その逆は不可（void型の値をundefined型の変数に代入することはできない）。

```ts
const a: void = undefined;

// Error: Type 'void' is not assignable to type 'undefined'.
const b: undefined = a; // a = void型
```

返り値がvoid型である関数は、値を返さなくてもよい。<br>
それ以外の型の場合（any型を除く）は必ず返り値を返さなければいけない。
```ts
function foo(): void {
  console.log('hello');
}

// エラー: A function whose declared type is neither 'void' nor 'any' must return a value.
function bar(): undefined {
  console.log('world');
  // OK
  // return undefined;
}
```

---

## any型
<font color="red">やむおえないときのみ使う</font>
```ts
const a: any = 3;
const b: string = a; // OK
```
