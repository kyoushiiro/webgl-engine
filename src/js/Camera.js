import { Vector3, Matrix4 } from './Matrix4.js';

export class Camera {
  constructor(eyeX, eyeY, eyeZ, lookX, lookY, lookZ, aspect = 1.0, fov = 60) {
    this.eye = new Vector3([eyeX, eyeY, eyeZ]);
    this.target = new Vector3([lookX, lookY, lookZ]);

    // prettier-ignore
    this.viewMatrix = new Matrix4().setLookAt(
        eyeX, eyeY, eyeZ, 
        lookX, lookY, lookZ, 
        0, 1, 0
    );
    this.projMatrix = new Matrix4().setPerspective(fov, aspect, 0.001, 1000);
  }
}
