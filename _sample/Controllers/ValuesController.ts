
import { Controller, HttpGet, HttpPost, HttpPut, HttpDelete } from "../../lib";

@Controller("api/values")
export default class ValuesController {
  values: string[];
  constructor() {
    this.values = ["value1", "value2"]
  }

  @HttpGet()
  async Get() {
    return Promise.resolve(this.values)
  }

  @HttpGet(":id")
  async GetOne({ id }) {
    return Promise.resolve(this.values[id])
  }

  @HttpPost()
  async Create(_, body) {
    this.values.push(body)
    return Promise.resolve(this.values)
  }

  @HttpPut(":id")
  async Edit({ id }, body) {
    this.values[id] = body
    return Promise.resolve(this.values)
  }

  @HttpDelete(":id")
  async Delete({ id }, body) {
    this.values.splice(id, 1)
    return Promise.resolve(this.values)
  }
}
