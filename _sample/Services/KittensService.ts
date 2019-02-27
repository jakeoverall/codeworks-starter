import { ErrorBadRequest } from "../../lib";

export class KittensService {
  kittens: Array<any> = [{ name: "Garfield" }, { name: "Felix" }, { name: "Tom" }]
  constructor() { }

  async Find() {
    return this.kittens
  }

  async FindOne(id: string) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let kitten = this.kittens[id]
        if (!kitten) { reject(new ErrorBadRequest("Invalid ID")) }
        resolve(this.kittens[id])
      }, 1000)
    })
  }
}