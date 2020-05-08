/* 对象是否有自身属性 */
export const hasOwnProperty = (obj: object, key: string | number) => {
  return Object.prototype.hasOwnProperty.call(obj, key)
}
