import { Matrix4 } from '../Matrix4.js';

export class RenderObj {
  constructor(prog) {
    this.vertices = null;
    this.program = prog;
    this.shader = prog.shader;
    this.modelMatrix = new Matrix4();
    this.color = [0.5, 0.5, 0.5, 1];
    this.vertices = null;
    this.indices = null;
    this.vao = null;
    this.vertexlength = 0;
    this.indexlength = 0;
  }

  createBuffers() {
    if (this.vertices == null) {
      console.error('Cannot create buffers for object with no vertex data!');
      return;
    }

    let gl = this.program.gl;
    let vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    let FSIZE = this.vertices.BYTES_PER_ELEMENT;
    let size = 3;
    let type = gl.FLOAT;
    let normalize = false;
    let stride = Object.keys(this.program.attributes).length * 3 * FSIZE;
    let offset = 0;

    for (let attr of Object.values(this.program.attributes)) {
      gl.enableVertexAttribArray(attr);
      gl.vertexAttribPointer(attr, size, type, normalize, stride, offset);
      offset += 3 * FSIZE;
    }

    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

    offset = 0;
    if (this.indices != null) {
      let indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
      this.indexlength = this.indices.length;
      this.indices = null;
    }

    this.vao = vao;
    gl.bindVertexArray(null);

    this.vertexlength = this.vertices.length / 3;
    this.vertices = null;
  }

  render() {
    return;
  }
}
