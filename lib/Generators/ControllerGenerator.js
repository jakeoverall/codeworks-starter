const inquirer = require('inquirer');
const fs = require('fs');
const CURR_DIR = process.cwd();
let controllersPath = CURR_DIR + '/'

const QUESTIONS = [
  {
    name: "ControllerPath",
    type: 'input',
    message: `
from the current directory where should I put this:
CurrentPath: ${controllersPath}
Path: `
  },
  {
    name: 'ControllerName',
    type: 'input',
    message: `
I will append Controller to the end of your input:
ControllerName: ex (Values -> ValuesController)
Name: `
  }
];


inquirer.prompt(QUESTIONS)
  .then(answers => {
    controllersPath += answers.ControllerPath
    let firstLetter = answers.ControllerName[0].toUpperCase()
    const controller = firstLetter + answers.ControllerName.slice(1) + "Controller";
    try {
      fs.mkdirSync(controllersPath);
    } catch (e) { }
    try {
      fs.writeFileSync(`${controllersPath}/${controller}.ts`,
        `
import { Controller, HttpGet, HttpPost, HttpPut, HttpDelete } from "../../lib";
import BaseController from "../../lib/BaseController";

@Controller("api/${answers.ControllerName}")
export default class ${controller} extends BaseController {
  values: string[];
  constructor() {
    super();
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
`)
    } catch (e) {
      console.warn("FAILED TO CREATE CONTROLLER", e.message)
      throw e
    }
    try {
      fs.unlinkSync(controllersPath + '/index.ts')
    } catch (e) { }
    try {
      let index = ''
      fs.readdirSync(controllersPath).forEach(file => {
        let test = new RegExp(/controller/, 'ig')
        if (!test.test(file)) return;
        let c = file.slice(0, file.lastIndexOf('.'))
        index += `
import ${c} from "./${c}";
export {${c}};
        `
      })
      fs.writeFileSync(controllersPath + '/index.ts', index)
    } catch (e) {
      console.warn("FAILED TO UPDATE INDEX", e.message)
    }
  });