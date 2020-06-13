/* mm转px */
export const mm2px = (() => {
  const cacheData: {[k: number]: number} = {}
  return (mm: number) => {
    if (cacheData[mm]) {
      return cacheData[mm]
    }

    const el = document.createElement('div')
    el.style.width = `${mm}mm`
    document.body.appendChild(el)
    cacheData[mm] = el.clientWidth
    el.remove()
    return cacheData[mm]
  }
})()

/* a4宽度 */
export const getA4W = () => {
  return mm2px(210)
}

/* a4高度 */
export const getA4H = () => {
  return mm2px(297)
}
