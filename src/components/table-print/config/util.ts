export const getA4W = () => {
  const el = document.createElement('div')
  el.style.width = '210mm'
  document.body.appendChild(el)
  const width = el.clientWidth
  el.remove()
  return width
}

export const getA4H = () => {
  const el = document.createElement('div')
  el.style.width = '290mm'
  document.body.appendChild(el)
  const width = el.clientWidth
  el.remove()
  return width
}
