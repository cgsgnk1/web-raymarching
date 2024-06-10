/* Koptelov Nikita, 10-1, 06.06.2024 */

import { Vec4, vec4Set, Vec3, vec3Set, Mat4 } from "./mth";
import { IArrayChanger } from "./tools";

export class Camera {
  projSize: number;
  projDist: number;
  projFarClip: number;
  frameW: number;
  frameH: number;
  /* wp: number;
     hp: number; */
  matrView: Mat4;
  matrProj: Mat4;
  matrVP: Mat4;
  loc: Vec3;
  at: Vec3;
  dir: Vec3;
  up: Vec3;
  right: Vec3;
  angleY: number;
  angleXZ: number;
  static sizeinBytes: number = 272;

  constructor(w: number, h: number) {
    this.projSize = 0.1;
    this.projDist = 0.1;
    this.projFarClip = 50000;

    this.frameW = w;
    this.frameH = h;
    /* this.wp = 0.1;
    this.hp = 0.1; */

    this.matrView = new Mat4();
    this.matrProj = new Mat4();
    this.matrVP = new Mat4();

    this.loc = new Vec3();
    this.at = new Vec3();
    this.dir = new Vec3();
    this.up = new Vec3();
    this.right = new Vec3();

    this.angleY = 0;
    this.angleXZ = 0;
  }

  set(loc: Vec3, at: Vec3, up: Vec3): void {
    this.matrView = Mat4.view(loc, at, up);
    this.loc = loc;
    this.at = at;
    this.dir = vec3Set(
      -this.matrView.a[0][2],
      -this.matrView.a[1][2],
      -this.matrView.a[2][2]
    );
    this.up = vec3Set(
      this.matrView.a[0][1],
      this.matrView.a[1][1],
      this.matrView.a[2][1]
    );
    this.right = vec3Set(
      this.matrView.a[0][0],
      this.matrView.a[1][0],
      this.matrView.a[2][0]
    );

    this.matrVP = this.matrView.mul(this.matrProj);
  }

  proj(): void {
    let rx, ry;

    rx = this.projSize;
    ry = rx;

    if (this.frameW > this.frameH) {
      rx *= this.frameW / this.frameH;
    } else {
      ry *= this.frameH / this.frameW;
    }

    this.matrProj = Mat4.frustum(
      -rx / 2,
      rx / 2,
      -ry / 2,
      ry / 2,
      this.projDist,
      this.projFarClip
    );
    this.matrVP = this.matrView.mul(this.matrProj);
  }

  resize(nw: number, nh: number): void {
    this.frameW = nw;
    this.frameH = nh;
    this.proj();
  }

  updateFromArray(arr: number[]): void {
    this.loc = new Vec3(arr[0], arr[1], arr[2]);
    this.frameW = arr[3];

    this.dir = new Vec3(arr[4], arr[5], arr[6]);
    this.frameH = arr[7];

    this.at = new Vec3(arr[8], arr[9], arr[10]);
    this.projDist = arr[11];

    this.right = new Vec3(arr[12], arr[13], arr[14]);
    this.angleY = arr[15];

    this.up = new Vec3(arr[16], arr[17], arr[18]);
    this.angleXZ = arr[19];

    let mat4Arr = new Array<number>(16);

    for (let i = 20; i < 36; i++) {
      mat4Arr[20 - i] = arr[i];
    }
    this.matrView = Mat4.createFromArray(mat4Arr);

    for (let i = 36; i < 52; i++) {
      mat4Arr[36 - i] = arr[i];
    }
    this.matrProj = Mat4.createFromArray(mat4Arr);

    for (let i = 52; i < 68; i++) {
      mat4Arr[52 - i] = arr[i];
    }
    this.matrVP = Mat4.createFromArray(mat4Arr);
  }

  toArray(change: IArrayChanger, offset: number): void {
    change.arr[offset + 0] = this.loc.x;
    change.arr[offset + 1] = this.loc.y;
    change.arr[offset + 2] = this.loc.z;
    change.arr[offset + 3] = this.frameW;

    change.arr[offset + 4] = this.dir.x;
    change.arr[offset + 5] = this.dir.y;
    change.arr[offset + 6] = this.dir.z;
    change.arr[offset + 7] = this.frameH;

    change.arr[offset + 8] = this.at.x;
    change.arr[offset + 9] = this.at.y;
    change.arr[offset + 10] = this.at.z;
    change.arr[offset + 11] = this.projDist;

    change.arr[offset + 12] = this.right.x;
    change.arr[offset + 13] = this.right.y;
    change.arr[offset + 14] = this.right.z;
    change.arr[offset + 15] = this.angleY;

    change.arr[offset + 16] = this.up.x;
    change.arr[offset + 17] = this.up.y;
    change.arr[offset + 18] = this.up.z;
    change.arr[offset + 19] = this.angleXZ;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        change.arr[offset + 20 + row * 4 + col] = this.matrView.a[row][col];
      }
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        change.arr[offset + 35 + row * 4 + col] = this.matrProj.a[row][col];
      }
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        change.arr[offset + 51 + row * 4 + col] = this.matrVP.a[row][col];
      }
    }
  }
}
