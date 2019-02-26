export const getFromPath = (nestedObj: any = {}, path: string = "") => {
  let pathArr = path.split('.')
  return pathArr.reduce((obj, key) =>
    (obj && obj[key] !== 'undefined') ? obj[key] : undefined, nestedObj);
}