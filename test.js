/*'use strict';


function bar() {console.log(this)}

bar();
function Person() {
  // 构造函数 Person() 定义的 `this` 就是新实例对象自己
  this.age = 0;
console.log(this)
  setTimeout(function growUp() {
    console.log(this)
    this.age++; 
  }, 1000);
}

var p = new Person();*/
var a = b => c => {
  console.log(b, c);
}
a(1)(2)