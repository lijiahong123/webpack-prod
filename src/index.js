// 引入字体css
// import "./assets/font/iconfont.css";

import './style/a.scss';
import './style/b.scss';
// import "./style/index.scss";
console.log('index.js文件加载了');

const count = (a, b) => a + b;
console.log(count(2, 5));

const promise = new Promise((resolve) => {
  setTimeout(() => {
    console.log('定时器执行了~');
    resolve();
  }, 1000);
});

console.log(promise, 123);
// @perple
// class Add {
//   constructor(name) {
//     this.name = name
//   }
//   eat() {
//     console.log(this.name + '在吃东西,他有' + this.age + '岁了',);
//   }
// }

// const add = new Add('刘德华')
// add.eat()

// function perple(target) {
//   targrt.prototype.age = 18
// }
