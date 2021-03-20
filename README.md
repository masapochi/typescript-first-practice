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

---

## クラスの型

```ts
class Foo {
  method(): void {
    console.log('hello');
  }
}

const obj: Foo = new Foo();
```

```ts
// OK
interface MyFoo {
  method: () => void
}
class Foo {
  method(): void {
    console.log('hello');
  }
}

const obj: MyFoo = new Foo();
const obj: Foo = obj;
```

---

## ジェネリクス

```ts
interface Foo<S, T> {
  foo: S;
  bar: T;
}

const obj: Foo<number, string> = {
  foo: 3,
  bar: 'hi',
};
```
### クラス・関数定義
```ts
// クラス
class Foo<T> {
  constructor(obj: T) {
    console.log('constructed');
  }
}
const obj = new Foo<string>('foo');
// equals to
// const obj: Foo<string> = new Foo<string>('foo');

// 関数
function func<T>(obj: T): void {}

func<number>(3);

const f: <T>(obj: T) => void = func;
```

`func<number>(3)`の`<number>`は省略可能。

```ts
function identity<T>(value: T): T {
  return value;
}

const value = identity(3);
// equals to
// const value: number = identity<number>(3);
// Error: Type '3' is not assignable to type 'string'.
const str: string = value;
```

---

## タプル型

```ts
const foo: [string, number] = ['foo', 3];

const str: string = foo[0];

// Error: Type 'string' is not assignable to type 'number'.
const str: number = foo[0];

function makePair(x: string, y: number): [string, number] {
  return [x, y];
}
```

0要素のタプル型なども作ることが可能（never型）。
```ts
const unit: [] = [];

// Error: Argument of type 'number' is not assignable to parameter of type 'never'.
unit.push(3);
```

### 可変長のタプル型
```ts
type NumberAndStrings = [number, ...string[]];

const a1: NumberAndStrings = [3, 'foo', 'bar'];
const a2: NumberAndStrings = [3];

// Error: Type 'string' is not assignable to type 'number'.
const a3: NumberAndStrings = ['foo', 'foo'];
```

### タプル型を関数の可変長引数の型を表すのに使う場合
```ts
type Args = [string, number, boolean];

const func = (...args: Args) => args[1]; // number型を返す。

const v = func('foo', 3, true);
```
```ts
type Args = [string, ...number[]];

const func = (f: string, ...args: Args) => args[0];
const v1 = func('foo', 'bar');
const v2 = func('foo', 'bar', 1, 2, 3);
```


### オプショナルな要素を持つタプル
```ts
type T = [string, number?];

const t1: T = ['foo'];
// 2番めの要素はあってもなくても良い。またはnumber型。
const t2: T = ['foo', 1];
```
`[string?, number]`のような型定義は駄目。

### 関数呼び出しのspreadとタプル型
```ts
const func = (...args: string[]) => args[0];

const strings: string[] = ['foo', 'bar', 'baz'];

func(...strings);
```

```ts
const func = (str: string, num: number, bool: boolean) => str + num;

const args: [string, number, boolean] = ['foo', 3, false];

func(...args);
```

### タプル型と可変長引数とジェネリクス
```ts
function bind<T, U extends any[], R>(
  func: (arg1: T, ...rest: U) => R,
  value: T,
): ((...args: U) => R) {
  return (...args: U) => func(value, ...args);
}

const add = (x: number, y: number) => x + y;

const add1 = bind(add, 1);

console.log(add1(5)); // 6

// Argument of type '"foo"' is not assignable to parameter of type 'number'.
add1('foo');
```

---

## union型（合併型）
```ts
let value: string | number = 'foo';
value = 100;
value = 'bar';
// Error: Type 'true' is not assignable to type 'string | number'.
value = true;
```

```ts
interface Hoge{
  foo: string,
  bar: number
}

interface Piyo {
  foo: number,
  baz: boolean
}

type HogePiyo = Hoge | Piyo;

const obj:HogePiyo = {
  foo: 'hello',
  bar: 0
}
// これもOK
const obj: Hoge | Piyo = {
  ...
}

```

### union型の絞り込み（in）
上の`obj`は`Hoge`か`Piyo`かどうかわからない。
```ts
interface Hoge{
  foo: string,
  bar: number
}

interface Piyo {
  foo: number,
  baz: boolean
}

function useHogePiyo(obj: Hoge | Piyo): void {
    // ここではobjはHoge | Piyo型
  if ('bar' in obj) {
    // barプロパティがあるのはHoge型なのでここではobjはHoge型
    console.log('Hoge', obj.bar);
  } else {
    // barプロパティがないのでここではobjはPiyo型
    console.log('Piyo', obj.baz);
  }
}
```
が、問題も…
```ts
const obj: Hoge | Piyo = {
    foo: 123,
    bar: 'bar',
    baz: true,
};

useHogePiyo(obj);

```

### union型の絞り込み（typeof）
```ts
function func(value: string | number): number {
  if ('string' === typeof value) {
    // valueはstring型。lengthプロパティにアクセス可能。
    return value.length;
  } else {
    // valueはnumber型。
    return value;
  }
}
```

### nullチェック
```ts
function func(value: string | null): number {
  if (value !== null) {
    return value.length;
  } else {
    return 0;
  }
}
```
```ts
function func(value: string | null): number {
  return value !== null && value.length || 0;
}
```


### 代数的データ型っぽいパターン
```ts
interface Some<T> {
  type: 'Some',
  value: T
}

interface None {
  type: 'None'
}

type Option<T> = Some<T> | None;

function map<T, U>(obj: Option<T>, f: (obj: T) => U): Option<U> {
  if (obj.type === 'Some') {
    return {
      type: 'Some',
      value: f(obj.value)
    }
  } else {
    return {
      type: 'None'
    }
  }
}

// Equals to
function map<T, U>(obj: Option<T>, f: (obj: T) => U): Option<U> {
  switch (obj.type) {
    case 'Some':
      return {
        type: 'Some',
        value: f(obj.value),
      };
    case 'None':
      return {
        type: 'None'
      }
  }
}

```

### union型オブジェクトのプロパティ
```ts
interface Hoge {
  foo: string,
  bar: number
}
interface Piyo {
  foo: number,
  baz: boolean
}

type HogePiyo = Hoge | Piyo;

function getFoo(obj: HogePiyo): string | number {
  // obj.foo は string | number型
  return obj.foo;
}

```
```ts
const arr: string[] | number[] = [];
// string[] | number[] 型の配列の要素は string | number 型
const elm = arr[0];
```

---

## never型
「属する値が存在しない型」<br>
どんな値もnever型の変数に入れることは不可。

```ts
// Erro: Type '0' is not assignable to type 'never'.
const n: never = 0;
```

never型の値はどんな型にも入れることが可能。
```ts
// never型の値を作る方法が無いのでdeclareで宣言だけする
declare const n: never;

const foo: string = n;
```
```ts
interface Some<T> {
  type: 'Some';
  value: T;
}
interface None {
  type: 'None';
}
type Option<T> = Some<T> | None;

function map<T, U>(obj: Option<T>, f: (obj: T)=> U): Option<U> {
  switch (obj.type) {
    case 'Some':
      return {
        type: 'Some',
        value: f(obj.value),
      };
    case 'None':
      return {
        type: 'None',
      };
    default:
      // ここでobjはnever型になっている
      return obj;
  }
}
```
関数の返り値の型がnever型となるのは、関数が値を返す可能性が無いとき（返り値が無いことを表すvoid型とは異なり、そもそも関数が正常に終了して値が返ってくるということがあり得ない場合）。
```ts
function func(): never {
  throw new Error('Hi');
}

const result: never = func();
```

## intersection型（交差型）
```ts
interface Hoge {
  foo: string;
  bar: number;
}
interface Piyo {
  foo: string;
  baz: boolean;
}

const obj: Hoge & Piyo = {
  foo: 'foo',
  bar: 3,
  baz: true,
}
```
```ts
interface Hoge {
  type: 'hoge',
  foo: string
}

interface Piyo {
  type: 'piyo',
  bar: number
}

interface Fuga {
  baz: boolean
}

type Obj = (Hoge | Piyo) & Fuga; // Hoge & Fuga または Piyo & Fuga

function func(obj: Obj) {
  // objはFugaなのでbazを参照可能
  console.log(obj.baz);
  if (obj.type === 'hoge') {
    // ここではobjは Hoge & Fuga
    console.log(obj.foo);
  } else {
    // ここではobjはPiyo & Fuga
    console.log(obj.bar);
  }
}
```

### union型を持つ関数との関係

`obj`は`MyObj型`の可能性がある。
関数ではないので実行することはできない。
```ts
// 関数型とオブジェクト型の組み合わせ
// NG
type Func = (arg: number) => number;
interface MyObj {
  prop: string
}

const obj: Func | MyObj = { prop: '' };

// Error: This expression is not callable.
// Type 'MyObj' has no call signatures.
obj(123);
```

`obj`は`StrFunc型（引数は文字列）`または`NumFunc型（引数は数値）`かもしれない。<br>
引数が`文字列かつ数値`であることが同時に要求されている。<br>
文字列であると同時に数値であるような値は存在しない。
```ts
// 関数型と関数型の組み合わせ
// NG
type StrFunc = (arg: string) => string;
type NumFunc = (arg: number) => string;

declare const obj: StrFunc | NumFunc;
// Error: Argument of type '123' is not assignable to parameter of type 'string & number'.
// Type '123' is not assignable to type 'string'.
obj(123);
```
```ts
interface Hoge {
  foo: string;
  bar: number;
}
interface Piyo {
  foo: string;
  baz: boolean;
}

type HogeFunc = (arg: Hoge) => number;
type PiyoFunc = (arg: Piyo) => boolean;

declare const func: HogeFunc | PiyoFunc;

// 引数はHoge型 & Piyo型
// resは number | boolean 型
const res = func({
  foo: 'foo',
  bar: 123,
  baz: false,
});
```

---

## オブジェクト型（+α）

### `?`修飾子（省略可能なプロパティ）
```ts
interface MyObj {
  foo: string,
  bar?: number
}

// barは省略可能
let obj: MyObj = {
  foo: 'string'
}
obj = {
  foo: 'foo',
  bar: 100
}
```
`MyObj`のbarプロパティは`number | undefined`型
```ts
function func(obj: MyObj): number {
  return obj.bar !== null ? obj.bar * 100 : 0;
}
```
?を使わずに自分でbarの型をnumber | undefinedとしても同じ意味にはならない。
```ts
interface MyObj {
  foo: string;
  bar: number | undefined;
}

// Error: Type '{ foo: string; }' is not assignable to type 'MyObj'.
// Property 'bar' is missing in type '{ foo: string; }'.
let obj: MyObj = {
  foo: 'string',
};
```

### `readonly`修飾子（再代入不可）

```ts
interface MyObj {
  readonly foo: string
}
const obj: MyObj = {
  foo: 'Hey'
}
// Error: Cannot assign to 'foo' because it is a read-only property.
obj.foo = 'Hi';
```
ただし、readonlyは過信してはいけない。<br>
readonlyでない型を経由して書き換えが可能。
```ts
interface MyObj {
  readonly foo: string
}
interface MyObj2 {
  foo: string
}

const obj: MyObj = { foo: 'Hey' };
const obj2: MyObj2 = obj;

obj2.foo = 'Hi'

console.log(obj.foo); // 'Hi'

```

---

## asによるダウンキャスト
valueはstring型、すなわち文字列かもしれないので、安全ではない。
```ts
const value = rand();

const str = value as number;
console.log(str * 10);

function rand(): string | number {
    if (Math.random() < 0.5) {
        return 'hello';
    } else {
        return 123;
    }
}
```
asを使っても全く関係ない2つの値を変換することはできない。
```ts
const value = 'foo';
// Error: Type 'string' cannot be converted to type 'number'.
const str = value as number;
```

---

## readonlyな配列とタプル
```ts
const arr: readonly number[] = [1, 2, 3];
// Equals to
// const arr: ReadonlyArray<number> = [1, 2, 3];

// Error: Index signature in type 'readonly number[]' only permits reading.
console.log(arr);
arr[0] = 100;

// Error: Property 'push' does not exist on type 'readonly number[]'.
arr.push(4);
```
```ts
const tuple: readonly [string, number] = ['foo', 123];
// Error: Cannot assign to '0' because it is a read-only property.
tuple[0] = 'bar';
```
---

## as const
その値が書き換えを意図していない値であることを表す。
```ts
// foo は string型
var foo = '123';

// foo2 は "123"型
var foo2 = '123' as const;
```

- 文字列・数値・真偽値リテラルはそれ自体のリテラル型を持つものとして推論される。（例： "foo" as constは"foo"型）
- オブジェクトリテラルは各プロパティがreadonlyを持つようになる。
- 配列リテラルの型はreadonlyタプル型になる。
```ts
// objは、{ foo: string, bar: number[] }型
const obj = {
  foo: '123',
  bar: [1,2,3]
}
// obj2は、{
//   readonly foo: '123',
//   readonly bar: [1,2,3]
// }型
const obj2 = {
  foo: '123',
  bar: [1,2,3]
} as const;
```

---

## object型と{}型
プリミティブ以外の値の型。
例：`Object.create`はオブジェクトまたはnullのみを受け取る
```ts
// Error: Argument of type '3' is not assignable to parameter of type 'object | null'.
Object.create(3);
```

`{}`は何もプロパティがないオブジェクト型です。構造的部分型により、{foo: string}のような型を持つオブジェクトも{}型として扱うことができる。
```ts
const obj = { foo: 'foo' };
const obj2 = obj;
```
`{}`という型指定は、オブジェクト以外も受付けてしまうので、安全ではない。
`{}`はundefinedとnull以外は何でも受け入れてしまうようなとても弱い型。
```ts
const o: {} = 3;
```
```ts
interface Length {
  length: number
}
const o: Length = 'foobar';
```

---

### unknown
```ts
const u1: unknown = 3;
const u2: unknown = null;
const u3: unknown = (foo: string) => true;
```
```ts
const u:unknown = 3;
// Error: Object is of type 'unknown'.
const sum = u + 5;
// Error: Object is of type 'unknown'.
const p = u.prop;
```

```ts
const u: unknown = 3;
if (typeof u === 'number') {
  // この中でuはunknown型
  const foo = u + 5;
}
```

```ts
const u: unknown = 3;

class MyClass {
  public prop: number = 10;
}

if (u instanceof MyClass) {
  // ここではuはMyClass型
  u.prop;
}
```

---

## typeof

```ts
let foo = 'str';
type FooType = typeof foo; // FooType = string

const str: FooType = 'abc';
```

---

## keyof
```ts
interface Hoge {
  foo: string,
  bar: number
}

let key: keyof Hoge;
key = 'foo';
key = 'bar';

// Error: Type '"baz"' is not assignable to type '"foo" | "bar"'.
key = 'baz';
```
---

## Lookup Types `T[K]`
```ts
interface MyObj {
  foo: string,
  bar: number
}

// strはstring型
const str: MyObj['foo'] = '123';
```

```ts
function pick<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const obj = {
  foo: 'string',
  bar: 123,
};

const str: string = pick(obj, 'foo');
const num: number = pick(obj, 'bar');
// エラー: Argument of type '"baz"' is not assignable to parameter of type '"foo" | "bar"'.
pick(obj, 'baz');
```
