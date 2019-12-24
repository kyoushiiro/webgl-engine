import { RenderObj } from './RenderObj.js';

export class FShape extends RenderObj {
  constructor(prog, x = 0, y = 0) {
    super(prog);
    this.x = x;
    this.y = y;
    this.vertices = this.createVertices(x, y, 30);
  }

  createVertices(x, y, barWidth) {
    let vertices = [
      // left column
      x + 0,
      y + 0,
      0,
      x + barWidth,
      y + 0,
      0,
      x + 0,
      y + 150,
      0,
      x + 0,
      y + 150,
      0,
      x + barWidth,
      y + 0,
      0,
      x + barWidth,
      y + 150,
      0,

      // top rung
      x + 30,
      y + 0,
      0,
      x + 100,
      y + 0,
      0,
      x + 30,
      y + 30,
      0,
      x + 30,
      y + 30,
      0,
      x + 100,
      y + 0,
      0,
      x + 100,
      y + 30,
      0,

      // middle rung
      x + 30,
      y + 60,
      0,
      x + 67,
      y + 60,
      0,
      x + 30,
      y + 90,
      0,
      x + 30,
      y + 90,
      0,
      x + 67,
      y + 60,
      0,
      x + 67,
      y + 90,
      0,
    ];

    return new Float32Array(vertices);
  }

  render() {}
}
