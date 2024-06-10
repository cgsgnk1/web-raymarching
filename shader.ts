/* Koptelov Nikita, 10-1, 05.06.2024 */

export interface IShaderCode {
  vertexCode: string;
  fragmentCode: string;
}

export class Shader {
  shaderFolder: string; /* Shader folder name */
  shaderProgram: WebGLProgram; /* WebGL program ID */
  shaders: {
    vertex: WebGLShader | null;
    vertexValid: boolean;
    fragment: WebGLShader | null;
    fragmentValid: boolean;
  };
  numOfUBOs: number = 0;
  gl: WebGL2RenderingContext;

  constructor(gl: WebGL2RenderingContext, shaderFolder: string) {
    this.shaderFolder = shaderFolder;
    this.shaderProgram = -1;
    this.shaders = {
      vertex: 0,
      vertexValid: false,
      fragment: 0,
      fragmentValid: false,
    };
    this.gl = gl;
  }

  async load() {
    let vert = await fetch(
      "main_shader/vert.glsl?nocache" + Date.now().toString()
    );
    let shaderv = await vert.text();

    let frag = await fetch(
      "main_shader/frag.glsl?nocache" + Date.now().toString()
    );
    let shaderf = await frag.text();

    this.createShaderProgram({
      vertexCode: shaderv,
      fragmentCode: shaderf,
    });
  }

  use() {
    this.gl.useProgram(this.shaderProgram);
  }

  free() {
    if (this.shaders.vertex) this.gl.deleteShader(this.shaders.vertex);
    if (this.shaders.fragment) this.gl.deleteShader(this.shaders.fragment);
  }

  compileShader(shaderType: number, shaderSource: string): WebGLShader | null {
    const shader = this.gl.createShader(shaderType);
    if (!shader) {
      return null;
    }

    let shaderLog = document.getElementById("shaderLog");

    this.gl.shaderSource(shader, shaderSource);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      // alert(
      //   `An error occurred compiling the shaders: ${this.gl.getShaderInfoLog(shader)}`
      // );
      if (shaderLog) {
        shaderLog.innerText += this.gl.getShaderInfoLog(shader);
      }
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  createShaderProgram(shaderCode: IShaderCode) {
    let table1 = document.getElementById("table1") as HTMLTableElement | null;

    let shaderLog = document.getElementById("shaderLog");
    if (shaderLog) {
      shaderLog.innerText = "";
    }

    /****
     * Vertex shader compilation
     ****/
    {
      this.shaders.vertex = this.compileShader(
        this.gl.VERTEX_SHADER,
        shaderCode.vertexCode
      );
    }

    if (table1) {
      let vertexColor: string, vertexText: string;

      if (!this.shaders.vertex) {
        vertexColor = "#FF0000";
        vertexText = "Failed";
      } else {
        vertexColor = "#00FF00";
        vertexText = "Compiled";
      }

      table1.rows[1].cells[0].innerHTML = vertexText;
      table1.rows[1].cells[0].bgColor = vertexColor;
    }

    /****
     * Fragment shader compilation
     ****/
    {
      this.shaders.fragment = this.compileShader(
        this.gl.FRAGMENT_SHADER,
        shaderCode.fragmentCode
      );
    }

    if (table1) {
      let fragmentColor: string, fragmentText: string;

      if (!this.shaders.fragment) {
        fragmentColor = "#FF0000";
        fragmentText = "Failed";
      } else {
        fragmentColor = "#00FF00";
        fragmentText = "Compiled";
      }

      table1.rows[1].cells[1].innerHTML = fragmentText;
      table1.rows[1].cells[1].bgColor = fragmentColor;
    }

    if (!this.shaders.vertex || !this.shaders.fragment) return;

    /* Create WebGL2 program */
    let shaderProgram = this.gl.createProgram();
    if (!shaderProgram) return;

    this.gl.attachShader(shaderProgram, this.shaders.vertex);
    this.gl.attachShader(shaderProgram, this.shaders.fragment);
    this.gl.linkProgram(shaderProgram);

    if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
      alert(
        `Unable to initialize the shader program: ${this.gl.getProgramInfoLog(
          shaderProgram
        )}`
      );
      shaderProgram = -1;
    } else {
      console.log(
        `Shader ${this.shaderFolder} has been successfully compiled and loaded!`
      );
    }

    this.shaderProgram = shaderProgram;
  }
}
