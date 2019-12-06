import { Matrix4 } from './cuon-matrix.js';

export class RenderObj {
  constructor(shader) {
    this.vertices = new Float32Array() 
    this.shader = shader
    this.modelMatrix = new Matrix4()
  }

  render() {
    return
  }
}
