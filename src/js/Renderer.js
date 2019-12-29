import { Matrix4, Vector3 } from './Matrix4.js';

export class Renderer {
  constructor(canvas, gl) {
    this.gl = gl;
    // Setup the GL Context
    this.gl.viewport(0, 0, canvas.width, canvas.height);
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.currentShader = '';
  }

  render(scene, camera) {
    let gl = this.gl;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for (let shaderType of Object.keys(scene)) {
      let objects = scene[shaderType];
      if (objects === []) {
        continue;
      }
      let obj1 = objects[0];
      gl.useProgram(obj1.program.shader);

      // Camera controls! (view/projection)
      gl.uniformMatrix4fv(
        obj1.program.uniforms['u_ProjMatrix'],
        false,
        camera.getProjMatrix().elements
      );
      gl.uniformMatrix4fv(
        obj1.program.uniforms['u_ViewMatrix'],
        false,
        camera.getViewMatrix().elements
      );

      // Lights! (color, direction, intensity)
      gl.uniform3f(obj1.program.uniforms['u_LightColor'], 1.0, 1.0, 1.0);
      let lightDirection = new Vector3([-2.5, 3.0, 4.0]);
      lightDirection.normalize();
      gl.uniform3fv(
        obj1.program.uniforms['u_LightDir'],
        lightDirection.elements
      );

      gl.uniform3f(obj1.program.uniforms['u_AmbientColor'], 0.15, 0.15, 0.15);
      gl.uniform1f(obj1.program.uniforms['u_Ka'], 1.0);
      gl.uniform1f(obj1.program.uniforms['u_Kd'], 1.0);

      for (let obj of objects) {
        obj.render(); // set up variables specific to this particular obj

        // Send the model matrix for each obj.
        gl.uniformMatrix4fv(
          obj.program.uniforms['u_ModelMatrix'],
          false,
          obj.modelMatrix.elements
        );

        if (obj.vao != null) {
          gl.bindVertexArray(obj.vao);
          if (obj.indexlength > 0) {
            gl.drawElements(
              gl.TRIANGLES,
              obj.indexlength,
              gl.UNSIGNED_SHORT,
              0
            );
          } else {
            gl.drawArrays(gl.TRIANGLES, 0, obj.vertexlength / 9);
          }
          gl.bindVertexArray(null);
        }
      }
    }
  }
}
