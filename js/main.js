let vertexShaderSource = `#version 300 es
    in vec4 a_Position;
    void main() {
        gl_Position = a_Position;
    }
`;

let fragmentShaderSource = `#version 300 es
    precision mediump float;
    out vec4 outColor;
    void main() {
        outColor = vec4(1, 0, 0.5, 1);
    }
`;

function createShader(gl, type, source) {
    let shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    if(success) {
        return shader
    }

    console.log(gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
}

function createProgram(gl, vertexShader, fragmentShader) {
    let program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    let success = gl.getProgramParameter(program, gl.LINK_STATUS)
    if(success) {
        return program
    }

    console.log(gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
}

function main() {
    let canvas = document.getElementById("canv")
    canvas.width = 400;
    canvas.height = 400;
    let gl = canvas.getContext("webgl2")
    if(!gl) {
        console.log("WebGL2 context not found!")
    }

    let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
    let program = createProgram(gl, vertexShader, fragmentShader)

    let positionAttributeLocation = gl.getAttribLocation(program, "a_Position")
    let positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

    let positions = [0,0, 0,0.5, 0.7,0,]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

    let vao = gl.createVertexArray()
    gl.bindVertexArray(vao)
    gl.enableVertexAttribArray(positionAttributeLocation)

    let size = 2
    let type = gl.FLOAT
    let normalize = false
    let stride = 0
    let offset = 0
    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset)

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.useProgram(program)
    gl.bindVertexArray(vao)

    let primitiveType = gl.TRIANGLES
    let offset2 = 0
    let count = 3
    gl.drawArrays(primitiveType, offset2, count)
}

main()
