import { RenderObj } from './RenderObj.js';

export class Rect extends RenderObj {
  constructor(prog, x = 0, y = 0, width = 50, height = 50, color) {
    super(prog);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.vertices = this.createVertices(x, y, width, height);
    this.color = color;
  }

  createVertices(x, y, width, height) {
    let x1 = x;
    let x2 = x + width;
    let y1 = y;
    let y2 = y + height;

    let vertices = [
      x1,
      y1,
      0,
      x2,
      y1,
      0,
      x1,
      y2,
      0,
      x1,
      y2,
      0,
      x2,
      y1,
      0,
      x2,
      y2,
      0,
    ];

    return new Float32Array(vertices);
  }

  render() {}
}
