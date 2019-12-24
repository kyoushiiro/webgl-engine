import { Matrix4 } from './Matrix4.js';

export class Renderer {
  constructor(canvas) {
    this.gl = canvas.getContext('webgl2');

    // Setup the GL Context
    this.gl.viewport(0, 0, canvas.width, canvas.height);
    this.gl.clearColor(0, 0, 0, 0);
    // this.gl.enable(this.gl.DEPTH_TEST);
  }

  render(scene, camera) {
    let gl = this.gl;
    this.gl.clear(gl.COLOR_BUFFER_BIT, gl.DEPTH_BUFFER_BIT);

    let currentProgram = '';
    for (let obj of scene) {
      obj.render(); // set up variables specific to this particular obj

      // If the shader being used for this obj is different, swap to it
      // The view and proj matrix doesn't change per object, only per shader.
      if (obj.program.name != currentProgram) {
        this.gl.useProgram(obj.program.shader);
        currentProgram = obj.program.name;

        this.gl.uniformMatrix4fv(
          obj.program.uniforms['u_ProjMatrix'],
          false,
          camera.projMatrix.elements
        );
        this.gl.uniformMatrix4fv(
          obj.program.uniforms['u_ViewMatrix'],
          false,
          camera.viewMatrix.elements
        );
      }

      // Send the model matrix for each obj.
      gl.uniformMatrix4fv(
        obj.program.uniforms['u_ModelMatrix'],
        false,
        obj.modelMatrix.elements
      );

      // Now send the vertex data for each obj
      let vao = this.gl.createVertexArray();
      gl.bindVertexArray(vao);

      let positionBuffer = this.gl.createBuffer();
      this.gl.enableVertexAttribArray(obj.program.attributes['a_Position']);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);

      let size = 3;
      let type = gl.FLOAT;
      let normalize = false;
      let stride = 0;
      let offset = 0;
      gl.vertexAttribPointer(
        obj.program.attributes['a_Position'],
        size,
        type,
        normalize,
        stride,
        offset
      );

      gl.bufferData(gl.ARRAY_BUFFER, obj.vertices, gl.STATIC_DRAW);

      let color = obj.color; // This should be the obj color
      gl.uniform4fv(obj.program.uniforms['u_Color'], color);

      let primitiveType = gl.TRIANGLES;
      offset = 0;
      let count = obj.vertices.length / 3;
      gl.drawArrays(primitiveType, offset, count);
    }
  }
}
