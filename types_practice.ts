function foo(): void {
  console.log('hello');
}

// エラー: A function whose declared type is neither 'void' nor 'any' must return a value.
function bar(): undefined | void {
  console.log('world');
}
