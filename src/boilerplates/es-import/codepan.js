import "@babel/standalone";

const { code } = Babel.transform(
  `
  class Point {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  }
`,
  {}
);

console.log(code);
