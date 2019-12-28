import { Matrix4, Vector3 } from './Matrix4.js';

export class Renderer {
  constructor(canvas, gl) {
    this.gl = gl;
    // Setup the GL Context
    this.gl.viewport(0, 0, canvas.width, canvas.height);
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
  }

  render(scene, camera) {
    let gl = this.gl;
    this.gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let currentProgram = '';
    for (let obj of scene) {
      obj.render(); // set up variables specific to this particular obj

      // If the shader being used for this obj is different, swap to it
      // The view and proj matrix doesn't change per object, only per shader.
      if (obj.program.name != currentProgram) {
        this.gl.useProgram(obj.program.shader);
        currentProgram = obj.program.name;

        // Camera controls! (view/projection)
        this.gl.uniformMatrix4fv(
          obj.program.uniforms['u_ProjMatrix'],
          false,
          camera.getProjMatrix().elements
        );
        this.gl.uniformMatrix4fv(
          obj.program.uniforms['u_ViewMatrix'],
          false,
          camera.getViewMatrix().elements
        );

        // Lights! (color, direction, intensity)
        this.gl.uniform3f(obj.program.uniforms['u_LightColor'], 1.0, 1.0, 1.0);
        let lightDirection = new Vector3([-3.5, 3.0, 4.0]);
        lightDirection.normalize();
        gl.uniform3fv(
          obj.program.uniforms['u_LightDir'],
          lightDirection.elements
        );

        this.gl.uniform3f(
          obj.program.uniforms['u_AmbientColor'],
          0.1,
          0.1,
          0.1
        );
        this.gl.uniform1f(obj.program.uniforms['u_Ka'], 1.0);
        this.gl.uniform1f(obj.program.uniforms['u_Kd'], 1.0);
      }

      // Send

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
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);

      let FSIZE = obj.vertices.BYTES_PER_ELEMENT;
      let size = 3;
      let type = gl.FLOAT;
      let normalize = false;
      let stride = Object.keys(obj.program.attributes).length * 3 * FSIZE;
      let offset = 0;

      for (let attr of Object.values(obj.program.attributes)) {
        gl.enableVertexAttribArray(attr);
        gl.vertexAttribPointer(attr, size, type, normalize, stride, offset);
        offset += 3 * FSIZE;
      }

      gl.bufferData(gl.ARRAY_BUFFER, obj.vertices, gl.STATIC_DRAW);

      let primitiveType = gl.TRIANGLES;
      offset = 0;
      let count = obj.vertices.length / 6;
      if (obj.indices != null) {
        let indexBuffer = this.gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, obj.indices, gl.STATIC_DRAW);
        console.log(gl.UNSIGNED_BYTE);
        gl.drawElements(gl.TRIANGLES, obj.indices.length, gl.UNSIGNED_SHORT, 0);
      } else {
        gl.drawArrays(primitiveType, offset, count);
      }
    }
  }
}
