const BASE_VERTEX_SOURCE = `#version 300 es
  in vec4 a_Position;
  in vec4 a_Color;
  in vec4 a_Normal;

  out vec4 v_Color;

  uniform mat4 u_ModelMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjMatrix;

  uniform float u_Ka;
  uniform float u_Kd;

  uniform vec3 u_LightColor; // Light color for diffuse
  uniform vec3 u_LightDir; // World coordinate, normalized
  uniform vec3 u_AmbientColor;

  void main() {
    gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
    vec3 normal = normalize(vec3(a_Normal));
    float nDotL = max(dot(u_LightDir, normal), 0.0);
    vec3 diffuse = u_LightColor * vec3(a_Color) * nDotL;

    v_Color = vec4(u_Kd * diffuse + u_Ka * u_AmbientColor + 0.1*vec3(a_Color), a_Color.a);
  }
`;

const BASE_FRAGMENT_SOURCE = `#version 300 es
  precision mediump float;
  
  uniform vec4 u_Color;
  in vec4 v_Color;

  out vec4 outColor;

  void main() {
    outColor =  v_Color;
  }
`;

export { BASE_VERTEX_SOURCE, BASE_FRAGMENT_SOURCE };
