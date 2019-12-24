import { Matrix4 } from '../Matrix4.js';

export class RenderObj {
  constructor(prog) {
    this.vertices = new Float32Array();
    this.program = prog;
    this.shader = prog.shader;
    this.modelMatrix = new Matrix4();
    this.color = [0, 0, 0, 1];
  }

  render() {
    return;
  }
}
