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
    color
  ) {
    super(prog);
    this.x = x;
    this.y = y;
    this.z = z;
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.vertices = this.createVertices(x, y, z, width, height, depth);
    this.color = color;
  }

  createVertices(x, y, z, width, height, depth) {
    let bl = [x, y, z];
    let br = [x + width, y, z];
    let tr = [x + width, y + height, z];
    let tl = [x, y + height, z];
    let bbl = [x, y, z - depth];
    let bbr = [x + width, y, z - depth];
    let btr = [x + width, y + height, z - depth];
    let btl = [x, y + height, z - depth];

    // prettier-ignore
    let vertices = [
      // Front face
      bl[0], bl[1], bl[2],
      tr[0], tr[1], tr[2],
      tl[0], tl[1], tl[2],
      bl[0], bl[1], bl[2],
      br[0], br[1], br[2],
      tr[0], tr[1], tr[2],
      // Right face
      br[0], br[1], br[2],
      btr[0], btr[1], btr[2],
      tr[0], tr[1], tr[2],
      br[0], br[1], br[2],
      bbr[0], bbr[1], bbr[2],
      btr[0], btr[1], btr[2],
      // Back face
      bbr[0], bbr[1], bbr[2],
      btl[0], btl[1], btl[2],
      btr[0], btr[1], btr[2],
      bbr[0], bbr[1], bbr[2],
      bbl[0], bbl[1], bbl[2],
      btl[0], btl[1], btl[2],
      // Left face
      bbl[0], bbl[1], bbl[2],
      tl[0], tl[1], tl[2],
      btl[0], btl[1], btl[2],
      bbl[0], bbl[1], bbl[2],
      bl[0], bl[1], bl[2],
      tl[0], tl[1], tl[2],
      // Top face
      tl[0], tl[1], tl[2],
      tr[0], tr[1], tr[2],
      btr[0], btr[1], btr[2],
      tl[0], tl[1], tl[2],
      btr[0], btr[1], btr[2],
      btl[0], btl[1], btl[2],
      // Bot face
      br[0], br[1], br[2],
      bl[0], bl[1], bl[2],
      bbl[0], bbl[1], bbl[2],
      br[0], br[1], br[2],
      bbl[0], bbl[1], bbl[2],
      bbr[0], bbr[1], bbr[2],
    ];

    return new Float32Array(vertices);
  }

  render() {}
}
