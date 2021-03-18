# TypeScriptの練習

TypeScriptの型について勉強。

> ## boolean
~~~ts
let bool: boolean = true // ts
let bool = true // js

function returnBoolean (a: boolean) : boolean {
  return a;
}
~~~


> ## number
~~~ts
let num1: number = 1 // ts
let num1 = 1 // js

function returnNum (a: number, b: boolean) : number {
  return a;
}
~~~
> ## string
~~~ts
let string: string = 'string' // ts
let string = 'string' // js

function returnString (a: string, b: string) : string {
  return a + b;
}
~~~


> ## any
<font color="red">基本的には使わない！</font>

~~~ts
let any1: any = 1
let any2: any = 'string'
~~~

> ## void
~~~ts
function returnNothing (a: number, b: boolean) : void {
  console.log(a, b);
}
~~~

> ## array
~~~ts
let strArray: string[] = ['a', 'b', 'c']
let numArray: number[] = [1, 2, 3]
~~~

> ## object
<font color="green">多用します！</font>

~~~ts
interface Hash {
  a: number,
  b: number | null, // bは必須。numberかnull
  // b?: number ← bがはいってこないかも知れない場合、
  // ?をつける（=undefinedかも知れない、キーが無くてもOK）

  // ....
}
let hash: Hash = { a: 10, b: 20 }
~~~

> ## undefined


> ## nullable
