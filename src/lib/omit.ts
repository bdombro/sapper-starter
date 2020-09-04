const omit: OmitFnc = (obj: any, keys: any) => {
  const ret: any = {};
  Object.keys(obj).forEach(key => {
    if (!keys.includes(key))
      ret[key] = obj[key];
  })
  return ret;
}
export default omit


interface OmitFnc {
  <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>
}


// const o = {hello: "world", hello2: "world2"}
// const t1 = omit(o, ['hello'])
// t1.hello2 // should not error
// t1.hello // should error
// t1.hello3 // should error
// console.dir(t1) // test runtime
