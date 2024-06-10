/* Koptelov Nikita, 10-1, 05.06.2024 */

import { off } from "process";
import { Vec3, Vec4, vec4Set } from "./mth";
import { Scene } from "./scene";

export interface IMaterial {
  ambient: Vec3;
  diffuse: Vec3;
  specular: Vec3;
  trans: number;
  phong: number;
}

interface IDynamic {
  [key: string]: any;
}

export class Shape {
  data: Array<number>; // 24 * 8
  index: number;
  ambient: Vec3 = new Vec3(0);
  diffuse: Vec3 = new Vec3(0);
  specular: Vec3 = new Vec3(0);
  trans: number = 0;
  phong: number = 0;

  static materialSizeInBytes = 48;
  static dataSizeInBytes = 80; // 5 * 4 * 4, 5x vec4
  static sizeInBytes = Shape.materialSizeInBytes + Shape.dataSizeInBytes;
  static amount: number = 0;
  static globalShapeTypes: IDynamic = {
    numbers: [1, 2, 3, 4],
    names: ["Sphere", "Plane", "Box", "Torus"],
    createFromArrayFunctions: [
      createSphereFromArrayAndMaterial,
      createPlaneFromArrayAndMaterial,
      createBoxFromArrayAndMaterial,
      createTorusFromArrayAndMaterial,
    ],
    createFromUBODataFunctions: [
      createSphereFromUBOData,
      createPlaneFromUBOData,
      createBoxFromUBOData,
      createTorusFromUBOData,
    ],
    descriptions: [
      "template: <centerX> <centerY> <centerZ> <radius>",
      "template: <pointX> <pointY> <pointZ> <normalX> <normalY> <normalZ>",
      "template: <centerX> <centerY> <centerZ> <sizeX> <sizeY> <sizeZ>",
      "template: <centerX> <centerY> <centerZ> <bigRadius> <smallRadius>",
    ],
  };

  getRepresentateStringBegin(): string {
    return `[ Shape ${this.index} ]: `;
  }

  static materialLib: IDynamic = {
    red: {
      ambient: new Vec3(0.567, 0, 0),
      diffuse: new Vec3(0.5, 0.5, 0.5),
      specular: new Vec3(0.5, 0.5, 0.5),
      trans: 0,
      phong: 100,
    },
    green: {
      ambient: new Vec3(0, 0.867, 0),
      diffuse: new Vec3(0.5, 0.5, 0.5),
      specular: new Vec3(0.5, 0.5, 0.5),
      trans: 0,
      phong: 10,
    },
    blue: {
      ambient: new Vec3(0, 0, 0.567),
      diffuse: new Vec3(0.5, 0.5, 0.5),
      specular: new Vec3(0.5, 0.5, 0.5),
      trans: 0,
      phong: 10,
    },
  };

  constructor(type: number, data: number[], material?: IMaterial) {
    this.data = new Array(Shape.sizeInBytes / 4);

    if (material != undefined) {
      // Ambient
      this.data[0] = material.ambient.x;
      this.data[1] = material.ambient.y;
      this.data[2] = material.ambient.z;

      // Type
      this.data[3] = type;

      // Diffuse
      this.data[4] = material.diffuse.x;
      this.data[5] = material.diffuse.y;
      this.data[6] = material.diffuse.z;

      // Trans
      this.data[7] = material.trans;

      // Specular
      this.data[8] = material.specular.x;
      this.data[9] = material.specular.y;
      this.data[10] = material.specular.z;

      // Phong
      this.data[11] = material.phong;

      this.ambient = material.ambient;
      this.diffuse = material.diffuse;
      this.specular = material.specular;
      this.trans = material.trans;
      this.phong = material.phong;
    } else {
      for (let i = 0; i < Shape.materialSizeInBytes / 4; i++) {
        this.data[i] = 0;
      }
    }

    // Additional data
    let numOfFloats = (Shape.sizeInBytes - Shape.materialSizeInBytes) / 4;
    let floatsStart = Shape.materialSizeInBytes / 4;
    let i = 0;

    for (; i < Math.min(numOfFloats, data.length); i++) {
      this.data[floatsStart + i] = data[i];
    }

    for (; i < 20; i++) {
      this.data[floatsStart + i] = 0;
    }

    this.index = -1;
  }

  getType(): number {
    return this.data[3];
  }

  getMaterial(): IMaterial {
    return {
      ambient: this.ambient,
      diffuse: this.diffuse,
      specular: this.specular,
      trans: this.trans,
      phong: this.phong,
    };
  }

  representate(scene: Scene): string {
    return "Some shape";
  }
}

export class Sphere extends Shape {
  static amount: number = 0;
  center: Vec3;
  radius: number;

  constructor(center: Vec3, radius: number, material: IMaterial) {
    super(
      1,
      [
        center.x,
        center.y,
        center.z,
        radius,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
      ],
      material
    );
    this.center = center;
    this.radius = radius;
    Sphere.amount++;
  }

  override representate(): string {
    if (this.index == undefined) {
      return "???";
    }
    return (
      this.getRepresentateStringBegin() +
      `type: sphere, center: ${this.center.representate()}, radius: ${this.radius}`
    );
  }
}

export class Plane extends Shape {
  point: Vec3;
  normal: Vec3;

  constructor(point: Vec3, normal: Vec3, material: IMaterial) {
    super(
      2,
      [
        point.x,
        point.y,
        point.z,
        0,
        normal.x,
        normal.y,
        normal.z,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
      ],
      material
    );

    this.point = point;
    this.normal = normal;
  }

  override representate(scene: Scene): string {
    if (this.index == undefined) {
      return "???";
    }
    return (
      this.getRepresentateStringBegin() +
      `type: plane, point: ${this.point.representate()}, normal: ${this.normal.representate()}`
    );
  }
}

export class Box extends Shape {
  center: Vec3;
  box: Vec3;

  constructor(center: Vec3, box: Vec3, material: IMaterial) {
    super(
      3,
      [
        center.x,
        center.y,
        center.z,
        0,
        box.x,
        box.y,
        box.z,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
      ],
      material
    );

    this.center = center;
    this.box = box;
  }

  override representate(scene: Scene): string {
    if (this.index == undefined) {
      return "???";
    }
    return (
      this.getRepresentateStringBegin() +
      `type: box, center: ${this.center.representate()}, box: ${this.box.representate()}`
    );
  }
}

export class Torus extends Shape {
  center: Vec3;
  r1: number;
  r2: number;

  constructor(center: Vec3, r1: number, r2: number, material: IMaterial) {
    super(
      4,
      [
        center.x,
        center.y,
        center.z,
        0,
        r1,
        r2,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
      ],
      material
    );

    this.center = center;
    this.r1 = r1;
    this.r2 = r2;
  }

  override representate(scene: Scene): string {
    if (this.index == undefined) {
      return "???";
    }
    return (
      this.getRepresentateStringBegin() +
      `type: torus, center: ${this.center.representate()}, r1: ${this.r1}, r2: ${this.r2}`
    );
  }
}

/*****
 * Functions of creating from array and UBO
 *****/

function createMaterialFromUBOData(arr: number[]): IMaterial {
  return {
    ambient: new Vec3(arr[0], arr[1], arr[2]),
    diffuse: new Vec3(arr[4], arr[5], arr[6]),
    specular: new Vec3(arr[8], arr[9], arr[10]),
    trans: arr[7],
    phong: arr[11],
  };
}

function createSphereFromArrayAndMaterial(
  arr: number[],
  material: IMaterial
): Sphere | undefined {
  if (arr.length != 4) {
    return undefined;
  }
  return new Sphere(new Vec3(arr[0], arr[1], arr[2]), arr[3], material);
}

function createSphereFromUBOData(arr: number[]): Sphere | undefined {
  if (arr.length != Shape.sizeInBytes / 4) {
    return undefined;
  }
  let off = Shape.materialSizeInBytes / 4;
  return new Sphere(
    new Vec3(arr[off + 0], arr[off + 1], arr[off + 2]),
    arr[off + 3],
    createMaterialFromUBOData(arr)
  );
}

function createPlaneFromArrayAndMaterial(
  arr: number[],
  material: IMaterial
): Plane | undefined {
  if (arr.length != 6) {
    return undefined;
  }
  return new Plane(
    new Vec3(arr[0], arr[1], arr[2]),
    new Vec3(arr[3], arr[4], arr[5]),
    material
  );
}

function createPlaneFromUBOData(arr: number[]): Plane | undefined {
  if (arr.length != Shape.sizeInBytes / 4) {
    return undefined;
  }
  let off = Shape.materialSizeInBytes / 4;
  return new Plane(
    new Vec3(arr[off + 0], arr[off + 1], arr[off + 2]),
    new Vec3(arr[off + 4], arr[off + 5], arr[off + 6]),
    createMaterialFromUBOData(arr)
  );
}

function createBoxFromArrayAndMaterial(
  arr: number[],
  material: IMaterial
): Box | undefined {
  if (arr.length != 6) {
    return undefined;
  }
  return new Box(
    new Vec3(arr[0], arr[1], arr[2]),
    new Vec3(arr[3], arr[4], arr[5]),
    material
  );
}

function createBoxFromUBOData(arr: number[]): Box | undefined {
  if (arr.length != Shape.sizeInBytes / 4) {
    return undefined;
  }
  let off = Shape.materialSizeInBytes / 4;
  return new Box(
    new Vec3(arr[off + 0], arr[off + 1], arr[off + 2]),
    new Vec3(arr[off + 4], arr[off + 5], arr[off + 6]),
    createMaterialFromUBOData(arr)
  );
}

function createTorusFromArrayAndMaterial(
  arr: number[],
  material: IMaterial
): Torus | undefined {
  if (arr.length != 5) {
    return undefined;
  }
  return new Torus(new Vec3(arr[0], arr[1], arr[2]), arr[3], arr[4], material);
}

function createTorusFromUBOData(arr: number[]): Torus | undefined {
  if (arr.length != Shape.sizeInBytes / 4) {
    return undefined;
  }
  let off = Shape.materialSizeInBytes / 4;
  return new Torus(
    new Vec3(arr[off + 0], arr[off + 1], arr[off + 2]),
    arr[off + 4],
    arr[off + 5],
    createMaterialFromUBOData(arr)
  );
}
