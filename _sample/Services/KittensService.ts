import { ErrorBadRequest } from "../../lib";
import { Kitten } from "../Models/Kitten";
import { guid } from "../../lib/utils/guid";

export class KittensService {
  private kittens: Array<Kitten> = [{
    _id: guid.NewGuid(),
    name: "Garfield"
  }, {
    _id: guid.NewGuid(),
    name: "Felix"
  }, {
    _id: guid.NewGuid(),
    name: "Tom"
  }]
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

  async Create(kitten: Kitten) {
    kitten._id = guid.NewGuid()
    this.kittens.push(kitten)
    return Promise.resolve(kitten)
  }

}