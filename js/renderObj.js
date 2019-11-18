class RenderObj {
  constructor(vertices, shader) {
    this.vertices = []
    if(vertices != null) {
      this.vertices = vertices
    }
    this.shader = shader
  }

  render() {
    return
  }
}