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

/* 获取表格高度 */
export const getTrItemH = (() => {
  const cacheData: {[k: number]: number} = {}
  return (line: number) => {
    if (cacheData[line]) {
      return cacheData[line]
    }

    const el = document.createElement('table')
    el.innerHTML = `
      <tbody>
        <tr>
          <td style="font-size: 12px; border: 1px solid red; padding: 0">
            ${[...new Array(line)].map(() => '<div>0</div>').join('')}
          </td>
        </tr>
      </tbody>
    `
    document.body.appendChild(el)
    cacheData[line] = el.getElementsByTagName('tr')[0].offsetHeight
    el.remove()
    return cacheData[line]
  }
})()
