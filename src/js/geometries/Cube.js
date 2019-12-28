import { RenderObj } from './RenderObj.js';

export class Cube extends RenderObj {
  constructor(
    prog,
    x = 0,
    y = 0,
    z = 0,
    width = 50,
    height = 50,
    depth = 50,
    color = [1, 1, 1]
  ) {
    super(prog);
    this.x = x;
    this.y = y;
    this.z = z;
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.color = color;
    [this.vertices, this.indices] = this.createVertices(
      x,
      y,
      z,
      width,
      height,
      depth,
      color
    );
  }

  createVertices(x, y, z, width, height, depth, color) {
    let [xbl, ybl, zbl] = [x, y, z];
    let [xbr, ybr, zbr] = [x + width, y, z];
    let [xtr, ytr, ztr] = [x + width, y + height, z];
    let [xtl, ytl, ztl] = [x, y + height, z];
    let [xbbl, ybbl, zbbl] = [x, y, z - depth];
    let [xbbr, ybbr, zbbr] = [x + width, y, z - depth];
    let [xbtr, ybtr, zbtr] = [x + width, y + height, z - depth];
    let [xbtl, ybtl, zbtl] = [x, y + height, z - depth];

    // prettier-ignore
    let vertices = [
      // Front
      xbl, ybl, zbl, color[0], color[1], color[2], 0, 0, 1,
      xbr, ybr, zbr, color[0], color[1], color[2], 0, 0, 1,
      xtr, ytr, ztr, color[0], color[1], color[2], 0, 0, 1,
      xtl, ytl, ztl, color[0], color[1], color[2], 0, 0, 1,
      // Right
      xbr, ybr, zbr, color[0], color[1], color[2], 1, 0, 0,
      xbbr, ybbr, zbbr, color[0], color[1], color[2], 1, 0, 0,
      xbtr, ybtr, zbtr, color[0], color[1], color[2], 1, 0, 0,
      xtr, ytr, ztr, color[0], color[1], color[2], 1, 0, 0,
      // Back
      xbbr, ybbr, zbbr, color[0], color[1], color[2], 0, 0, -1,
      xbbl, ybbl, zbbl, color[0], color[1], color[2], 0, 0, -1,
      xbtl, ybtl, zbtl, color[0], color[1], color[2], 0, 0, -1,
      xbtr, ybtr, zbtr, color[0], color[1], color[2], 0, 0, -1,
      // Left
      xbbl, ybbl, zbbl, color[0], color[1], color[2], -1, 0, 0,
      xbl, ybl, zbl, color[0], color[1], color[2], -1, 0, 0,
      xtl, ytl, ztl, color[0], color[1], color[2], -1, 0, 0,
      xbtl, ybtl, zbtl, color[0], color[1], color[2], -1, 0, 0,
      // Top
      xtl, ytl, ztl, color[0], color[1], color[2], 0, 1, 0,
      xtr, ytr, ztr, color[0], color[1], color[2], 0, 1, 0,
      xbtr, ybtr, zbtr, color[0], color[1], color[2], 0, 1, 0,
      xbtl, ybtl, zbtl, color[0], color[1], color[2], 0, 1, 0,
      // Bot
      xbbl, ybbl, zbbl, color[0], color[1], color[2], 0, -1, 0,
      xbbr, ybbr, zbbr, color[0], color[1], color[2], 0, -1, 0,
      xbr, ybr, zbr, color[0], color[1], color[2], 0, -1, 0,
      xbl, ybl, zbl, color[0], color[1], color[2], 0, -1, 0,
    ];

    // prettier-ignore
    let indices = [
      0, 1, 2, 0, 2, 3,
      4, 5, 6, 4, 6, 7,
      8, 9, 10, 8, 10, 11,
      12, 13, 14, 12, 14, 15,
      16, 17, 18, 16, 18, 19,
      20, 21, 22, 20, 22, 23,
    ];

    return [new Float32Array(vertices), new Uint16Array(indices)];
  }

  render() {}
}
