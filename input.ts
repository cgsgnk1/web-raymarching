/* Koptelov Nikita, 10-1, 07.06.2024 */

interface IDynamic {
  [key: string]: any;
}

export class Input {
  keys: IDynamic;
  keysClick: IDynamic;

  constructor() {
    this.keys = {};
    this.keysClick = {};

    window.addEventListener("keydown", (event) => {
      this.keys[event.key] = true;
    });
    window.addEventListener("keyup", (event) => {
      this.keys[event.key] = false;
      this.keysClick[event.key] = false;
    });
  }

  response() {
    for (let key in this.keys) {
      if (!this.keys[key] && !this.keysClick[key]) {
        this.keysClick[key] = true;
      } else {
        this.keysClick[key] = false;
      }
    }
  }

  checkKeys(key: string): boolean {
    if (!this.keys[key]) {
      return false;
    }
    return true;
  }

  checkKeysClick(key: string): boolean {
    if (!this.keysClick[key]) {
      return false;
    }
    return true;
  }
}
