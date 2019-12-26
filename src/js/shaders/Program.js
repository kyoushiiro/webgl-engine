export class Program {
  constructor(gl, name, vShader, fShader, uniforms, attributes) {
    let vertexShader = Program.createShader(gl, gl.VERTEX_SHADER, vShader);
    let fragmentShader = Program.createShader(gl, gl.FRAGMENT_SHADER, fShader);
    let program = Program.createProgram(gl, vertexShader, fragmentShader);

    this.shader = program;
    this.name = name;
    this.uniforms = this.getUniforms(gl, uniforms);
    this.attributes = this.getAttributes(gl, attributes);
  }

  getUniforms(gl, uniforms) {
    let res = {};
    for (let u_var of uniforms) {
      let uniformLocation = gl.getUniformLocation(this.shader, u_var);
      if (uniformLocation === null || uniformLocation < 0) {
        console.error(
          `Couldn't locate uniform variable ${u_var} for ${this.name}!`
        );
        continue;
      }
      res[u_var] = uniformLocation;
    }
    return res;
  }

  getAttributes(gl, attributes) {
    let res = {};
    for (let a_var of attributes) {
      let attributeLocation = gl.getAttribLocation(this.shader, a_var);
      if (attributeLocation == null || attributeLocation < 0) {
        console.error(`Couldn't locate attribute variable ${a_var}!`);
        continue;
      }
      res[a_var] = attributeLocation;
    }
    return res;
  }

  static createShader(gl, type, source) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }

    console.log(source);
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }

  static createProgram(gl, vertexShader, fragmentShader) {
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    let success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }

  static createAndSetupTexture(gl) {
    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    return texture;
  }
}
