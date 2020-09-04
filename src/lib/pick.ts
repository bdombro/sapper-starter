const pick: PickFnc = (obj: any, keys: any[]) => {
  const ret: any = {};
  keys.forEach(key => {
    ret[key] = obj[key];
  })
  return ret;
}
export default pick


interface PickFnc {
  <T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>
}