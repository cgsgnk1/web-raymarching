/* Koptelov Nikita, 10-1, 05.06.2024 */

import { IMaterial, Shape } from "./shapes";
import { Vec3 } from "./mth";
import { Scene } from "./scene";

interface IDynamic {
  [key: string]: any;
}

function colorToDecimal(color: string): Vec3 {
  let res = new Vec3();

  // color: "#834d18"
  res.x = eval("0x" + color[1] + color[2]) / 255.0;
  res.y = eval("0x" + color[3] + color[4]) / 255.0;
  res.z = eval("0x" + color[5] + color[6]) / 255.0;

  return res;
}

function materialGet(): IMaterial {
  const ambient = document.querySelector("#ambientPicker") as HTMLInputElement;
  const diffuse = document.querySelector("#diffusePicker") as HTMLInputElement;
  const spec = document.querySelector("#specularPicker") as HTMLInputElement;
  const trans = document.querySelector("#transPicker") as HTMLInputElement;
  const phong = document.querySelector("#phongPicker") as HTMLInputElement;

  return {
    ambient: colorToDecimal(ambient.value),
    diffuse: colorToDecimal(diffuse.value),
    specular: colorToDecimal(spec.value),
    trans: Number(trans.value),
    phong: Number(phong.value),
  };
}

/* UI class */
export class UI {
  static scene: Scene | undefined = undefined;

  static initialize(): void {
    /* HTML elements query select */
    const shapeSelect1 = document.querySelector(
      "#shapeSelect1"
    ) as HTMLInputElement | null;

    const shapeEditButton = document.querySelector(
      "#shapeEditButton"
    ) as HTMLButtonElement | null;

    const shapeDeleteButton = document.querySelector(
      "#shapeDeleteButton"
    ) as HTMLButtonElement | null;

    // const helpTextParagraph = document.querySelector(
    //   "#helpText"
    // ) as HTMLParagraphElement | null;

    const sceneSaveButton = document.querySelector(
      "#sceneSaveButton"
    ) as HTMLParagraphElement | null;

    const sceneSelect = document.querySelector(
      "#sceneSelect"
    ) as HTMLSelectElement | null;

    const shapeTemplates = document.querySelector(
      "#shapeTemplates"
    ) as HTMLParagraphElement | null;

    if (
      !shapeSelect1 ||
      !shapeEditButton ||
      !shapeDeleteButton ||
      // !helpTextParagraph ||
      !sceneSaveButton ||
      !sceneSelect ||
      !shapeTemplates
    ) {
      return;
    }
    /* End of 'HTML elements query select' */

    /**********
     * * * * *
     * * * * *
     * Templates load
     * * * * *
     * * * * *
     * * * * *
     **********/
    let tmpl: string = "";
    for (let i = 0; i < Shape.globalShapeTypes.names.length; i++) {
      tmpl +=
        Shape.globalShapeTypes.names[i] +
        ": " +
        Shape.globalShapeTypes.descriptions[i] +
        "\n";
    }

    shapeTemplates.innerText = tmpl;

    /**********
     * * * * *
     * * * * *
     * Scenes load
     * * * * *
     * * * * *
     * * * * *
     **********/
    let forbidden = [
      "length",
      "clear",
      "getItem",
      "key",
      "removeItem",
      "setItem",
    ];

    for (const scene in window.localStorage) {
      let b = forbidden.find((value) => {
        return value == scene;
      });

      if (!b) {
        sceneSelect.options.add(new Option(scene));
      }
    }

    // Set first scene as default
    if (sceneSelect.options.length != 0) {
      sceneSelect.options[sceneSelect.options.length - 1].selected = true;
    }

    /**********
     * * * * *
     * * * * *
     * Shape select input
     * * * * *
     * * * * *
     * * * * *
     **********/
    shapeSelect1.addEventListener("change", (event) => {
      const shapeSelectDiv = document.querySelector(
        "#shapeSelectDiv"
      ) as HTMLDivElement | null;

      if (!shapeSelectDiv) {
        return;
      }

      if (shapeSelect1.value == "new...") {
        if (document.getElementById("justBr") == null) {
          let a = document.createElement("a");
          a.innerHTML = "&nbsp";
          a.id = "justBr";

          shapeSelectDiv.appendChild(a);

          const shapeSelect2 = document.createElement("select");
          shapeSelect2.className = "bigText";
          shapeSelect2.id = "shapeSelect2";

          let names = Shape.globalShapeTypes.names;

          for (let name of names) {
            let opt = document.createElement("option");
            opt.text = name;
            shapeSelect2.prepend(opt);
          }
          shapeSelectDiv.appendChild(shapeSelect2);

          /*
          shapeSelect2.addEventListener("change", (event) => {
            for (let i = 0; i < Shape.globalShapeTypes.names.length; i++) {
              if (shapeSelect2.value == Shape.globalShapeTypes.names[i]) {
                helpTextParagraph.textContent =
                  Shape.globalShapeTypes.descriptions[i];
              }
            }
          });

          shapeSelect2.dispatchEvent(new Event("change"));
          */
        }
      } else {
        const shapeSelect2 = document.querySelector(
          "#shapeSelect2"
        ) as HTMLSelectElement | null;
        const justBr = document.querySelector("#justBr") as HTMLElement | null;

        if (shapeSelect2) {
          shapeSelectDiv.removeChild(shapeSelect2);
        }
        if (justBr) {
          shapeSelectDiv.removeChild(justBr);
        }
      }
    });
    /* End of 'ShapeSelect1 add event listener' */

    /**********
     * * * * *
     * * * * *
     * Shape edit button
     * * * * *
     * * * * *
     * * * * *
     **********/
    shapeEditButton.addEventListener("click", (event) => {
      if (UI.scene == undefined) {
        return;
      }

      const shapeSelect1 = document.querySelector(
        "#shapeSelect1"
      ) as HTMLSelectElement | null;

      if (!shapeSelect1) {
        return;
      }

      const shapeEditInput = document.querySelector(
        "#shapeEditInput"
      ) as HTMLInputElement | null;

      if (!shapeEditInput) {
        return;
      }

      const userData = shapeEditInput.value.split(" ").map((value) => {
        return Number(value);
      });

      if (shapeSelect1.value != "new...") {
        // shapeSelect1.value != "new..."
        let idx = Number(shapeSelect1.value.split(" ")[2]);
        let type = UI.scene.globalShapes[idx].getType();
        let editedShape: Shape | undefined;

        for (let i = 0; i < Shape.globalShapeTypes.numbers.length; i++) {
          if (type == Shape.globalShapeTypes.numbers[i]) {
            this.editShape(
              Shape.globalShapeTypes.createFromArrayFunctions[i](
                userData,
                materialGet()
              ),
              idx
            );
          }
        }
      } else {
        // shapeSelect1.value == "new..."
        const shapeSelect2 = document.querySelector(
          "#shapeSelect2"
        ) as HTMLSelectElement | null;

        if (!shapeSelect2) {
          return;
        }

        let type = shapeSelect2.value;
        let createdShape: Shape | undefined;

        for (let i = 0; i < Shape.globalShapeTypes.names.length; i++) {
          if (type == Shape.globalShapeTypes.names[i]) {
            this.addShapeToScene(
              Shape.globalShapeTypes.createFromArrayFunctions[i](
                userData,
                materialGet()
              )
            );
          }
        }

        let newOption = document.getElementById(
          "new"
        ) as HTMLOptionElement | null;

        if (newOption) {
          newOption.selected = true;
          shapeSelect1.dispatchEvent(new Event("change"));
        }
      }
    });

    shapeDeleteButton.addEventListener("click", (event) => {
      const shapeSelect1 = document.querySelector(
        "#shapeSelect1"
      ) as HTMLSelectElement | null;

      if (!shapeSelect1 || shapeSelect1.value == "new...") {
        return;
      }

      let idx = Number(shapeSelect1.value.split(" ")[2]);

      this.deleteShapeFromScene(idx);
    });

    /***
     * Format of saving scene:
     *   - first of (Scene.maxShapes * Shape.sizeInBytes / 4) numbers - shape data
     *   - next to it, (Camera.sizeInBytes / 4) numbers - camera data
     ***/
    sceneSaveButton.addEventListener("click", (event) => {
      if (UI.scene == undefined) {
        return;
      }

      const sceneNameInput = document.querySelector(
        "#sceneNameInput"
      ) as HTMLInputElement | null;

      if (!sceneNameInput || sceneNameInput.value == "") {
        return;
      }

      if (window.localStorage.getItem(sceneNameInput.value) == undefined) {
        let opt = new Option(sceneNameInput.value);
        opt.selected = true;

        sceneSelect.options.add(new Option(sceneNameInput.value));
      }

      window.localStorage.setItem(
        sceneNameInput.value,
        UI.scene.shapesUBOArray.concat(UI.scene.cameraUBOArray).toString()
      );
    });

    sceneSelect.addEventListener("change", (event) => {
      if (UI.scene == undefined) {
        return;
      }

      const received = window.localStorage.getItem(sceneSelect.value);
      if (!received) {
        return;
      }

      const shapesAndCameraData = received.split(",").map((str) => {
        return Number(str);
      });

      let i = 0;
      let n = 0;

      UI.clear();

      for (
        ;
        i < (Scene.maxShapes * Shape.sizeInBytes) / 4;
        i += Shape.sizeInBytes / 4
      ) {
        const type = shapesAndCameraData[i + 3];
        console.log(type);

        if (type == 0) {
          break;
        }
        let arr = shapesAndCameraData.slice(i, i + Shape.sizeInBytes / 4);
        console.log(arr);

        UI.addShapeToScene(
          Shape.globalShapeTypes.createFromUBODataFunctions[type - 1](arr)
        );

        n++;
      }
      console.log(`"Shapes loaded: ${n}"`);
      UI.scene.cameraUBOArray = shapesAndCameraData.slice(
        (Scene.maxShapes * Shape.sizeInBytes) / 4
      );
      UI.scene.camera.updateFromArray(UI.scene.cameraUBOArray);
      UI.scene.cameraUpdate();

      shapeSelect1.dispatchEvent(new Event("change"));
    });

    // Let's have some fun

    /*
    const planeCheckerButton = document.querySelector(
      "#planeCheckerButton"
    ) as HTMLButtonElement;

    planeCheckerButton.addEventListener("click", (event) => {
      if (UI.scene == undefined) {
        return;
      }
      UI.scene.globalShapes.forEach((shape) => {
        if (shape.data[3] == 2) {
          if (shape.data[Shape.materialSizeInBytes / 4 + 7] == 0) {
            shape.data[Shape.materialSizeInBytes / 4 + 7] = 1;
          } else {
            shape.data[Shape.materialSizeInBytes / 4 + 7] = 0;
          }
        }
      });
    });
    */
  }

  static bindScene(scene: Scene): void {
    UI.scene = scene;
  }

  static addShapeToScene(shape: Shape | undefined): void {
    if (UI.scene == undefined || shape == undefined) {
      return;
    }

    UI.scene.add(shape);

    const shapeSelect1 = document.querySelector(
      "#shapeSelect1"
    ) as HTMLSelectElement;

    let option = document.createElement("option");
    option.text = shape.representate(UI.scene);
    option.id = shape.representate(UI.scene);
    option.defaultSelected = true;

    shapeSelect1.prepend(option);
  }

  static editShape(shape: Shape | undefined, idx: number): void {
    if (UI.scene == undefined || shape == undefined) {
      return;
    }
    let id = UI.scene.globalShapes[idx].representate(UI.scene);
    let optionToChange = document.getElementById(
      id
    ) as HTMLOptionElement | null;

    UI.scene.edit(shape, idx);

    if (optionToChange) {
      optionToChange.text = optionToChange.id = UI.scene.globalShapes[
        idx
      ].representate(UI.scene);
    }
  }

  static deleteShapeFromScene(deleteIndex: number): void {
    if (UI.scene == undefined || deleteIndex > UI.scene.amountOfShapes - 1) {
      return;
    }

    const shapeSelect1 = document.querySelector(
      "#shapeSelect1"
    ) as HTMLSelectElement;

    let optionsArray = [];

    for (let option of shapeSelect1.options) {
      if (option.value != "new...") {
        optionsArray.push(option);
      }
    }

    for (let option of optionsArray) {
      let idx = Number(option.text.split(" ")[2]);

      if (idx > deleteIndex) {
        UI.scene.globalShapes[idx].index--;

        option.text = option.id = UI.scene.globalShapes[idx].representate(
          UI.scene
        );
      } else if (idx == deleteIndex) {
        shapeSelect1.removeChild(option);
      }
    }
    UI.scene.remove(deleteIndex);

    shapeSelect1.dispatchEvent(new Event("change"));
    // console.log(optionsArray);
  }

  static saveSceneToLocalStorage(name: string): void {
    if (window.localStorage.getItem(name) != undefined) {
      return;
    }

    const sceneSaveButton = document.querySelector(
      "#sceneSaveButton"
    ) as HTMLInputElement | null;
    const sceneNameInput = document.querySelector(
      "#sceneNameInput"
    ) as HTMLInputElement | null;

    if (!sceneSaveButton || !sceneNameInput) {
      return;
    }

    sceneNameInput.value = name;
    sceneSaveButton.dispatchEvent(new Event("click"));
  }

  static clear(): void {
    if (UI.scene == undefined) {
      return;
    }

    let am = UI.scene.amountOfShapes;
    for (let i = 0; i < am; i++) {
      UI.deleteShapeFromScene(0);
    }
  }
}
