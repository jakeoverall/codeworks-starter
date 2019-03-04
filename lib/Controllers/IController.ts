import { Dictionary } from "../utils/Dictionary";

export interface IController extends Function {
  endpoint: string
  config: any
  methods: Dictionary<string>
  // [prop: string]: (...args: any[]) => any;
}