/* Koptelov Nikita, 10-1, 05.06.2024 */

export const d2r = (x: number): number => {
  return (x * Math.PI) / 180;
};

export const r2d = (x: number): number => {
  return (x * 180) / Math.PI;
};

export class Vec2 {
  x: number;
  y: number;

  constructor(...args: number[]) {
    if (arguments.length == 2) {
      this.x = arguments[0];
      this.y = arguments[1];
    } else if (arguments.length == 1) {
      this.x = this.y = arguments[0];
    } else {
      this.x = this.y = 0;
    }
  }

  add(v: Vec2): Vec2 {
    return new Vec2(this.x + v.x, this.y + v.y);
  }

  sub(v: Vec2): Vec2 {
    return new Vec2(this.x - v.x, this.y - v.y);
  }

  mul(n: number): Vec2 {
    return new Vec2(this.x * n, this.y * n);
  }

  dot(v: Vec2): number {
    return this.x * v.x + this.y * v.y;
  }

  len(): number {
    let len = this.dot(this);

    if (len == 1 || len == 0) {
      return len;
    }
    return Math.sqrt(len);
  }

  len2(): Number {
    return this.dot(this);
  }

  normalize(): Vec2 {
    return this.mul(1 / this.len());
  }

  toArray(): number[] {
    return [this.x, this.y];
  }

  check(): void {
    console.log(this);
  }
}

export function vec2Set(...args: number[]): Vec2 {
  if (arguments.length == 1) {
    let x = arguments[0];

    if (typeof x == "object") {
      return new Vec2(x[0], x[1]);
    } else {
      return new Vec2(x, x);
    }
  } else if (arguments.length == 2) {
    let x = arguments[0],
      y = arguments[1];

    return new Vec2(x, y);
  }
  return new Vec2(0, 0);
}

export class Vec3 {
  x: number;
  y: number;
  z: number;

  constructor(...args: number[]) {
    if (arguments.length == 3) {
      this.x = arguments[0];
      this.y = arguments[1];
      this.z = arguments[2];
    } else if (arguments.length == 1) {
      this.x = this.y = this.z = arguments[0];
    } else {
      this.x = this.y = this.z = arguments[0];
    }
  }

  add(v: Vec3): Vec3 {
    return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  sub(v: Vec3): Vec3 {
    return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z);
  }

  mul(n: number): Vec3 {
    return new Vec3(this.x * n, this.y * n, this.z * n);
  }

  dot(v: Vec3): number {
    return this.x * v.x + this.y * v.y + v.z * this.z;
  }

  cross(v: Vec3): Vec3 {
    return new Vec3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }

  len(): number {
    let len = this.dot(this);

    if (len == 1 || len == 0) {
      return len;
    }
    return Math.sqrt(len);
  }

  len2(): number {
    return this.dot(this);
  }

  normalize(): Vec3 {
    return this.mul(1 / this.len());
  }

  pointTransform(m: Mat4): Vec3 {
    return new Vec3(
      this.x * m.a[0][0] + this.y * m.a[1][0] + this.z * m.a[2][0] + m.a[3][0],
      this.x * m.a[0][1] + this.y * m.a[1][1] + this.z * m.a[2][1] + m.a[3][1],
      this.x * m.a[0][2] + this.y * m.a[1][2] + this.z * m.a[2][2] + m.a[3][2]
    );
  }

  toArray(): number[] {
    return [this.x, this.y, this.z];
  }

  representate(): string {
    return `<${this.x},${this.y},${this.z}>`;
  }

  check(): void {
    console.log(this);
  }
}

export function vec3Set(...args: number[]): Vec3 {
  if (arguments.length == 1) {
    let x = arguments[0];

    if (typeof x == "object") {
      return new Vec3(x[0], x[1], x[2]);
    } else {
      return new Vec3(x, x, x);
    }
  } else if (arguments.length == 3) {
    let x = arguments[0],
      y = arguments[1],
      z = arguments[2];

    return new Vec3(x, y, z);
  }
  return new Vec3(0, 0, 0);
}

export class Vec4 {
  x: number;
  y: number;
  z: number;
  w: number;

  constructor(...args: number[]) {
    if (arguments.length == 4) {
      this.x = arguments[0];
      this.y = arguments[1];
      this.z = arguments[2];
      this.w = arguments[3];
    } else if (arguments.length == 1) {
      this.x = this.y = this.z = this.w = arguments[0];
    } else {
      this.x = this.y = this.z = this.w = 0;
    }
  }

  toArray(): number[] {
    return [this.x, this.y, this.z, this.w];
  }

  check(): void {
    console.log(this);
  }

  add(v: Vec4): Vec4 {
    return new Vec4(this.x + v.x, this.y + v.y, this.z + v.z, this.w + v.w);
  }

  mul(n: number): Vec4 {
    return new Vec4(this.x * n, this.y * n, this.z * n, this.w * n);
  }
}

export function vec4Set(...args: number[]): Vec4 {
  if (arguments.length == 1) {
    let x = arguments[0];

    return new Vec4(x, x, x, x);
  } else if (arguments.length == 4) {
    let x = arguments[0],
      y = arguments[1],
      z = arguments[2],
      w = arguments[3];

    return new Vec4(x, y, z, w);
  }
  return new Vec4(0, 0, 0, 0);
}

export class Mat4 {
  a: number[][];

  constructor(...args: number[]) {
    if (arguments.length != 16) {
      if (arguments.length == 1) {
        let arr = arguments[0];

        this.a = [
          [arr[0], arr[1], arr[2], arr[3]],
          [arr[4], arr[5], arr[6], arr[7]],
          [arr[8], arr[9], arr[10], arr[11]],
          [arr[12], arr[13], arr[14], arr[15]],
        ];
      }
      this.a = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ];
      return;
    }
    this.a = [
      [arguments[0], arguments[1], arguments[2], arguments[3]],
      [arguments[4], arguments[5], arguments[6], arguments[7]],
      [arguments[8], arguments[9], arguments[10], arguments[11]],
      [arguments[12], arguments[13], arguments[14], arguments[15]],
    ];
  }

  static createFromArray(arr: number[]): Mat4 {
    let m = new Mat4();
    m.a = [
      [arr[0], arr[1], arr[2], arr[3]],
      [arr[4], arr[5], arr[6], arr[7]],
      [arr[8], arr[9], arr[10], arr[11]],
      [arr[12], arr[13], arr[14], arr[15]],
    ];

    return m;
  }

  static determ3x3(
    a00: number,
    a01: number,
    a02: number,
    a10: number,
    a11: number,
    a12: number,
    a20: number,
    a21: number,
    a22: number
  ): number {
    return (
      a00 * a11 * a22 +
      a01 * a12 * a20 +
      a02 * a10 * a21 -
      a00 * a12 * a21 -
      a01 * a10 * a22 -
      a02 * a11 * a20
    );
  }

  mul(obj: Mat4): Mat4 {
    let r = new Mat4();

    r.a[0][0] =
      this.a[0][0] * obj.a[0][0] +
      this.a[0][1] * obj.a[1][0] +
      this.a[0][2] * obj.a[2][0] +
      this.a[0][3] * obj.a[3][0];

    r.a[0][1] =
      this.a[0][0] * obj.a[0][1] +
      this.a[0][1] * obj.a[1][1] +
      this.a[0][2] * obj.a[2][1] +
      this.a[0][3] * obj.a[3][1];

    r.a[0][2] =
      this.a[0][0] * obj.a[0][2] +
      this.a[0][1] * obj.a[1][2] +
      this.a[0][2] * obj.a[2][2] +
      this.a[0][3] * obj.a[3][2];

    r.a[0][3] =
      this.a[0][0] * obj.a[0][3] +
      this.a[0][1] * obj.a[1][3] +
      this.a[0][2] * obj.a[2][3] +
      this.a[0][3] * obj.a[3][3];

    r.a[1][0] =
      this.a[1][0] * obj.a[0][0] +
      this.a[1][1] * obj.a[1][0] +
      this.a[1][2] * obj.a[2][0] +
      this.a[1][3] * obj.a[3][0];

    r.a[1][1] =
      this.a[1][0] * obj.a[0][1] +
      this.a[1][1] * obj.a[1][1] +
      this.a[1][2] * obj.a[2][1] +
      this.a[1][3] * obj.a[3][1];

    r.a[1][2] =
      this.a[1][0] * obj.a[0][2] +
      this.a[1][1] * obj.a[1][2] +
      this.a[1][2] * obj.a[2][2] +
      this.a[1][3] * obj.a[3][2];

    r.a[1][3] =
      this.a[1][0] * obj.a[0][3] +
      this.a[1][1] * obj.a[1][3] +
      this.a[1][2] * obj.a[2][3] +
      this.a[1][3] * obj.a[3][3];

    r.a[2][0] =
      this.a[2][0] * obj.a[0][0] +
      this.a[2][1] * obj.a[1][0] +
      this.a[2][2] * obj.a[2][0] +
      this.a[2][3] * obj.a[3][0];

    r.a[2][1] =
      this.a[2][0] * obj.a[0][1] +
      this.a[2][1] * obj.a[1][1] +
      this.a[2][2] * obj.a[2][1] +
      this.a[2][3] * obj.a[3][1];

    r.a[2][2] =
      this.a[2][0] * obj.a[0][2] +
      this.a[2][1] * obj.a[1][2] +
      this.a[2][2] * obj.a[2][2] +
      this.a[2][3] * obj.a[3][2];

    r.a[2][3] =
      this.a[2][0] * obj.a[0][3] +
      this.a[2][1] * obj.a[1][3] +
      this.a[2][2] * obj.a[2][3] +
      this.a[2][3] * obj.a[3][3];

    r.a[3][0] =
      this.a[3][0] * obj.a[0][0] +
      this.a[3][1] * obj.a[1][0] +
      this.a[3][2] * obj.a[2][0] +
      this.a[3][3] * obj.a[3][0];

    r.a[3][1] =
      this.a[3][0] * obj.a[0][1] +
      this.a[3][1] * obj.a[1][1] +
      this.a[3][2] * obj.a[2][1] +
      this.a[3][3] * obj.a[3][1];

    r.a[3][2] =
      this.a[3][0] * obj.a[0][2] +
      this.a[3][1] * obj.a[1][2] +
      this.a[3][2] * obj.a[2][2] +
      this.a[3][3] * obj.a[3][2];

    r.a[3][3] =
      this.a[3][0] * obj.a[0][3] +
      this.a[3][1] * obj.a[1][3] +
      this.a[3][2] * obj.a[2][3] +
      this.a[3][3] * obj.a[3][3];

    return r;
  }

  determ(): number {
    return (
      +this.a[0][0] *
        Mat4.determ3x3(
          this.a[1][1],
          this.a[1][2],
          this.a[1][3],
          this.a[2][1],
          this.a[2][2],
          this.a[2][3],
          this.a[3][1],
          this.a[3][2],
          this.a[3][3]
        ) +
      -this.a[0][1] *
        Mat4.determ3x3(
          this.a[1][0],
          this.a[1][2],
          this.a[1][3],
          this.a[2][0],
          this.a[2][2],
          this.a[2][3],
          this.a[3][0],
          this.a[3][2],
          this.a[3][3]
        ) +
      +this.a[0][2] *
        Mat4.determ3x3(
          this.a[1][0],
          this.a[1][1],
          this.a[1][3],
          this.a[2][0],
          this.a[2][1],
          this.a[2][3],
          this.a[3][0],
          this.a[3][1],
          this.a[3][3]
        ) +
      -this.a[0][3] *
        Mat4.determ3x3(
          this.a[1][0],
          this.a[1][1],
          this.a[1][2],
          this.a[2][0],
          this.a[2][1],
          this.a[2][2],
          this.a[3][0],
          this.a[3][1],
          this.a[3][2]
        )
    );
  }

  transpose(): Mat4 {
    let m = new Mat4();

    m.a[0][0] = this.a[0][0];
    m.a[0][1] = this.a[1][0];
    m.a[0][2] = this.a[2][0];
    m.a[0][3] = this.a[3][0];

    m.a[1][0] = this.a[0][1];
    m.a[1][1] = this.a[1][1];
    m.a[1][2] = this.a[2][1];
    m.a[1][3] = this.a[3][1];

    m.a[2][0] = this.a[0][2];
    m.a[2][1] = this.a[1][2];
    m.a[2][2] = this.a[2][2];
    m.a[2][3] = this.a[3][2];

    m.a[3][0] = this.a[0][3];
    m.a[3][1] = this.a[1][3];
    m.a[3][2] = this.a[2][3];
    m.a[3][3] = this.a[3][3];

    return m;
  }

  inverse(): Mat4 {
    let m = new Mat4(),
      det = this.determ();

    if (det == 0) {
      return Mat4.identity();
    }

    m.a[0][0] =
      +Mat4.determ3x3(
        this.a[1][1],
        this.a[1][2],
        this.a[1][3],
        this.a[2][1],
        this.a[2][2],
        this.a[2][3],
        this.a[3][1],
        this.a[3][2],
        this.a[3][3]
      ) / det;

    m.a[1][0] =
      -Mat4.determ3x3(
        this.a[1][0],
        this.a[1][2],
        this.a[1][3],
        this.a[2][0],
        this.a[2][2],
        this.a[2][3],
        this.a[3][0],
        this.a[3][2],
        this.a[3][3]
      ) / det;

    m.a[2][0] =
      +Mat4.determ3x3(
        this.a[1][0],
        this.a[1][1],
        this.a[1][3],
        this.a[2][0],
        this.a[2][1],
        this.a[2][3],
        this.a[3][0],
        this.a[3][1],
        this.a[3][3]
      ) / det;

    m.a[3][0] =
      +Mat4.determ3x3(
        this.a[1][0],
        this.a[1][1],
        this.a[1][2],
        this.a[2][0],
        this.a[2][1],
        this.a[2][2],
        this.a[3][0],
        this.a[3][1],
        this.a[3][2]
      ) / det;

    m.a[0][1] =
      -Mat4.determ3x3(
        this.a[0][1],
        this.a[0][2],
        this.a[0][3],
        this.a[2][1],
        this.a[2][2],
        this.a[2][3],
        this.a[3][1],
        this.a[3][2],
        this.a[3][3]
      ) / det;

    m.a[1][1] =
      +Mat4.determ3x3(
        this.a[0][0],
        this.a[0][2],
        this.a[0][3],
        this.a[2][0],
        this.a[2][2],
        this.a[2][3],
        this.a[3][0],
        this.a[3][2],
        this.a[3][3]
      ) / det;

    m.a[2][1] =
      -Mat4.determ3x3(
        this.a[0][0],
        this.a[0][1],
        this.a[0][3],
        this.a[2][0],
        this.a[2][1],
        this.a[2][3],
        this.a[3][0],
        this.a[3][1],
        this.a[3][3]
      ) / det;

    m.a[3][1] =
      -Mat4.determ3x3(
        this.a[0][0],
        this.a[0][1],
        this.a[0][2],
        this.a[2][0],
        this.a[2][1],
        this.a[2][2],
        this.a[3][0],
        this.a[3][1],
        this.a[3][2]
      ) / det;

    m.a[0][2] =
      +Mat4.determ3x3(
        this.a[0][1],
        this.a[0][2],
        this.a[0][3],
        this.a[1][1],
        this.a[1][2],
        this.a[1][3],
        this.a[3][1],
        this.a[3][2],
        this.a[3][3]
      ) / det;

    m.a[1][2] =
      -Mat4.determ3x3(
        this.a[0][0],
        this.a[0][2],
        this.a[0][3],
        this.a[1][0],
        this.a[1][2],
        this.a[1][3],
        this.a[3][0],
        this.a[3][2],
        this.a[3][3]
      ) / det;

    m.a[2][2] =
      +Mat4.determ3x3(
        this.a[0][0],
        this.a[0][1],
        this.a[0][3],
        this.a[1][0],
        this.a[1][1],
        this.a[1][3],
        this.a[3][0],
        this.a[3][1],
        this.a[3][3]
      ) / det;

    m.a[3][2] =
      +Mat4.determ3x3(
        this.a[0][0],
        this.a[0][1],
        this.a[0][2],
        this.a[1][0],
        this.a[1][1],
        this.a[1][2],
        this.a[3][0],
        this.a[3][1],
        this.a[3][2]
      ) / det;

    m.a[0][3] =
      +Mat4.determ3x3(
        this.a[0][1],
        this.a[0][2],
        this.a[0][3],
        this.a[1][1],
        this.a[1][2],
        this.a[1][3],
        this.a[2][1],
        this.a[2][2],
        this.a[2][3]
      ) / det;

    m.a[1][3] =
      -Mat4.determ3x3(
        this.a[0][0],
        this.a[0][2],
        this.a[0][3],
        this.a[1][0],
        this.a[1][2],
        this.a[1][3],
        this.a[2][0],
        this.a[2][2],
        this.a[2][3]
      ) / det;

    m.a[2][3] =
      +Mat4.determ3x3(
        this.a[0][0],
        this.a[0][1],
        this.a[0][3],
        this.a[1][0],
        this.a[1][1],
        this.a[1][3],
        this.a[2][0],
        this.a[2][1],
        this.a[2][3]
      ) / det;

    m.a[3][3] =
      +Mat4.determ3x3(
        this.a[0][0],
        this.a[0][1],
        this.a[0][2],
        this.a[1][0],
        this.a[1][1],
        this.a[1][2],
        this.a[2][0],
        this.a[2][1],
        this.a[2][2]
      ) / det;

    return m;
  }

  static identity(): Mat4 {
    let m = new Mat4();

    m.a[0] = [1, 0, 0, 0];
    m.a[1] = [0, 1, 0, 0];
    m.a[2] = [0, 0, 1, 0];
    m.a[3] = [0, 0, 0, 1];

    return m;
  }

  static scale(v: Vec3): Mat4 {
    let m = new Mat4();

    m.a[0] = [v.x, 0, 0, 0];
    m.a[1] = [0, v.y, 0, 0];
    m.a[2] = [0, 0, v.z, 0];
    m.a[3] = [0, 0, 0, 1];

    return m;
  }

  static translate(v: Vec3): Mat4 {
    let m = new Mat4();

    m.a[0] = [1, 0, 0, 0];
    m.a[1] = [0, 1, 0, 0];
    m.a[2] = [0, 0, 1, 0];
    m.a[3] = [v.x, v.y, v.z, 1];

    return m;
  }

  static rotateX(angle: number): Mat4 {
    let m = new Mat4();

    let a = d2r(angle),
      s = Math.sin(a),
      c = Math.cos(a);
    m = Mat4.identity();

    m.a[1][1] = c;
    m.a[1][2] = s;
    m.a[2][1] = -s;
    m.a[2][2] = c;

    return m;
  }

  static rotateY(angle: number): Mat4 {
    let m = new Mat4();

    let a = d2r(angle),
      s = Math.sin(a),
      c = Math.cos(a);
    m = Mat4.identity();

    m.a[0][0] = c;
    m.a[0][2] = -s;
    m.a[2][0] = s;
    m.a[2][2] = c;

    return m;
  }

  static rotateZ(angle: number): Mat4 {
    let m = new Mat4();

    let a = d2r(angle),
      s = Math.sin(a),
      c = Math.cos(a);
    m = Mat4.identity();

    m.a[0][0] = c;
    m.a[0][2] = s;
    m.a[2][0] = -s;
    m.a[2][2] = c;

    return m;
  }

  static rotate(v: Vec3, angle: number): Mat4 {
    let m = new Mat4();

    let a = d2r(angle),
      s = Math.sin(a),
      c = Math.cos(a);
    let r = v.normalize();

    m.a[0][0] = c + r.x * r.x * (1 - c);
    m.a[0][1] = r.x * r.y * (1 - c) + r.z * s;
    m.a[0][2] = r.x * r.z * (1 - c) - r.y * s;
    m.a[0][3] = 0;

    m.a[1][0] = r.y * r.x * (1 - c) - r.z * s;
    m.a[1][1] = c + r.y * r.y * (1 - c);
    m.a[1][2] = r.y * r.z * (1 - c) + r.z * s;
    m.a[1][3] = 0;

    m.a[2][0] = r.z * r.x * (1 - c) + r.y * s;
    m.a[2][1] = r.z * r.y * (1 - c) - r.x * s;
    m.a[2][2] = c + r.z * r.z * (1 - c);
    m.a[2][3] = 0;

    m.a[3][0] = 0;
    m.a[3][1] = 0;
    m.a[3][2] = 0;
    m.a[3][3] = 1;

    return m;
  }

  static view(loc: Vec3, at: Vec3, up1: Vec3): Mat4 {
    let m = new Mat4();

    let dir = at.sub(loc).normalize(),
      right = dir.cross(up1).normalize(),
      up = right.cross(dir);

    m.a[0] = [right.x, up.x, -dir.x, 0];
    m.a[1] = [right.y, up.y, -dir.y, 0];
    m.a[2] = [right.z, up.z, -dir.z, 0];
    m.a[3] = [-loc.dot(right), -loc.dot(up), loc.dot(dir), 1];

    return m;
  }

  static frustum(
    l: number,
    r: number,
    b: number,
    t: number,
    n: number,
    f: number
  ): Mat4 {
    let m = new Mat4();

    m.a[0] = [(2 * n) / (r - l), 0, 0, 0];
    m.a[1] = [0, (2 * n) / (t - b), 0, 0];
    m.a[2] = [(r + l) / (r - l), (t + b) / (t - b), (f + n) / (n - f), -1];
    m.a[3] = [0, 0, (2 * n * f) / (n - f), 0];

    return m;
  }

  toArray(): number[] {
    return [
      this.a[0][0],
      this.a[0][1],
      this.a[0][2],
      this.a[0][3],
      this.a[1][0],
      this.a[1][1],
      this.a[1][2],
      this.a[1][3],
      this.a[2][0],
      this.a[2][1],
      this.a[2][2],
      this.a[2][3],
      this.a[3][0],
      this.a[3][1],
      this.a[3][2],
      this.a[3][3],
    ];
  }

  check(): void {
    console.log(this.a[0], this.a[1], this.a[2], this.a[3]);
  }
}
