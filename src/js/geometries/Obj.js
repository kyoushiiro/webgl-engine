import { RenderObj } from './RenderObj.js';
import { Matrix4 } from '../Matrix4.js';

export class Obj extends RenderObj {
  constructor(prog, meshData) {
    super(prog);

    [this.vertices, this.indices] = this.createVertices(meshData);
  }

  createVertices(meshData) {
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
