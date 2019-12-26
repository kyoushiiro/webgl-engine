import { RenderObj } from './RenderObj.js';

export class Rect extends RenderObj {
  constructor(prog, x = 0, y = 0, z = 0, width = 50, height = 50, color) {
    super(prog);
    this.x = x;
    this.y = y;
    this.z = z;
    this.width = width;
    this.height = height;
    this.color = color;
    [this.vertices, this.indices] = this.createVertices(
      x,
      y,
      z,
      width,
      height,
      color
    );
  }

  createVertices(x, y, z, width, height, color) {
    let x1 = x;
    let x2 = x + width;
    let y1 = y;
    let y2 = y + height;

    // prettier-ignore
    let vertices = new Float32Array([
      x1, y1, z, this.color[0], this.color[1], this.color[2], 0, 0, 1,
      x2, y1, z, this.color[0], this.color[1], this.color[2], 0, 0, 1,
      x2, y2, z, this.color[0], this.color[1], this.color[2], 0, 0, 1,
      x1, y2, z, this.color[0], this.color[1], this.color[2], 0, 0, 1,
    ]);

    // prettier-ignore
    let indices = new Uint8Array([
      0, 1, 3,
      3, 1, 2,
    ]);

    return [vertices, indices];
  }

  render() {}
}
