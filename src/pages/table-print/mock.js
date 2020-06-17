export const colums1 = [
  {
    key: 'a',
    title: '表头1'
  },
  {
    key: 'b',
    title: '表头2'
  },
  {
    key: 'c',
    title: '表头3'
  },
  {
    key: 'd',
    title: '表头4'
  },
  {
    key: 'e',
    title: '表头5'
  }
]

export const data1 = [...new Array(100)].map((_, i) => {
  let c = ''
  if (i === 20) {
    c = [...new Array(40)].map(() => '你好').join('') + i
  } else {
    c = 'c' + i
  }

  return {
    i,
    a: [...new Array(20)].map(() => 'a').join('') + i,
    b: 'b' + i,
    c,
    d: 'd' + i,
    e: 'e' + i,
    h: 0,
    page: false
  }
})
