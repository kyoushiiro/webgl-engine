import { RenderObj } from './RenderObj.js';

export class Obj extends RenderObj {
  constructor(prog, meshData) {
    super(prog);

    [this.vertices, this.indices] = this.createVertices(meshData);
    this.vao = null;
    this.createBuffers();
  }

  createVertices(meshData) {
    // If the mesh contains more indices than a 16bit number,
    // we'll have to use drawArrays rather than drawElements
    if (meshData.indices.some(e => e > 65000)) {
      let vertices = new Float32Array(meshData.indices.length * 9);
      for (let i = 0; i < meshData.indices.length; i++) {
        let j = i * 9;
        let idx = meshData.indices[i] * 3;
        vertices[j] = meshData.vertices[idx];
        vertices[j + 1] = meshData.vertices[idx + 1];
        vertices[j + 2] = meshData.vertices[idx + 2];
        vertices[j + 3] = 0.3;
        vertices[j + 4] = 0.5;
        vertices[j + 5] = 0.6;
        vertices[j + 6] = meshData.vertexNormals[idx];
        vertices[j + 7] = meshData.vertexNormals[idx + 1];
        vertices[j + 8] = meshData.vertexNormals[idx + 2];
      }
      return [vertices, null];
    }

    // Otherwise, save memory usage by returning a vertex array
    // and an index array
    let vertices = new Float32Array(meshData.vertices.length * 3);
    for (let i = 0; i < meshData.vertices.length * 3; i += 9) {
      let j = i / 3;
      vertices[i] = meshData.vertices[j];
      vertices[i + 1] = meshData.vertices[j + 1];
      vertices[i + 2] = meshData.vertices[j + 2];
      vertices[i + 3] = 0.3;
      vertices[i + 4] = 0.5;
      vertices[i + 5] = 0.8;
      vertices[i + 6] = meshData.vertexNormals[j];
      vertices[i + 7] = meshData.vertexNormals[j + 1];
      vertices[i + 8] = meshData.vertexNormals[j + 2];
    }

    let indices = new Uint16Array(meshData.indices.length);
    for (let i = 0; i < indices.length; i++) {
      indices[i] = meshData.indices[i];
    }

    return [vertices, indices];
  }

  render() {}
}
