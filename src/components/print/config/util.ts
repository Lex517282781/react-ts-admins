/* cm转px */
export const cm2px = (() => {
  let width = 0
  const cachedata: {[k: number]: number} = {}
  return (cm: number) => {
    if (cachedata[cm]) {
      return cachedata[cm]
    }

    if (width) {
      cachedata[cm] = width * cm
      return cachedata[cm]
    }

    const el = document.createElement('div')
    el.style.width = '1cm'
    document.body.appendChild(el)
    width = el.clientWidth
    cachedata[cm] = width * cm
    el.remove()
    return cachedata[cm]
  }
})()
