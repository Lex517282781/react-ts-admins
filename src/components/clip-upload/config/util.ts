/** 获取唯一值 */
export const getUniqueId = (() => {
  let index: number = 0
  const prefix = 'key_' + new Date().getTime() + '_'
  return () => {
    index++
    const id: string = prefix + index
    return id
  }
})()

/** 生成自然数数组 */
export const makeArray = (length: number) => {
  return Array.from({ length }).map((v, k) => k)
}

/** file转base64 */
export const getBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

/** base64转file */
export const dataURLtoFile = (dataURL: string, filename: string): File => {
  const arr: string[] = dataURL.split(',')
  const mime: string = (arr[0] as any).match(/:(.*?);/)[1]
  const bstr: string = atob(arr[1])
  let n: number = bstr.length
  const u8arr: Uint8Array = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

// /** 图片类型判断 */
export const isPic = (type: string): boolean => {
  const isJPG: boolean = type === 'image/jpeg'
  const isPNG: boolean = type === 'image/png'
  const isBMP: boolean = type === 'image/bmp'
  const isGIF: boolean = type === 'image/gif'
  const isWEBP: boolean = type === 'image/webp'
  const isPicBool: boolean = isJPG || isPNG || isBMP || isGIF || isWEBP
  return isPicBool
}

/** size为n n小于1的 (n*1000)kb n大于等于1 (n)mb，1000kb-1024kb区间不支持设置 */
export const sizeOverflow = (cursize: number, presize: number): boolean => {
  return cursize / 1024 / 1024 > (presize < 1 ? presize / 1.024 : presize)
}

/** 根据图片大小获取大小M和KB值 */
export const getSizeTxt = (size: number) => {
  if (size >= 1) {
    return size + 'MB'
  } else {
    return size * 1000 + 'KB'
  }
}

/** 获取base64尺寸 */
export const getBase64Size = (base64: string): number => {
  base64 = base64.split(',')[1].split('=')[0]
  const strLength: number = base64.length
  const fileLength: number = strLength - strLength / 8 * 2
  return Math.floor(fileLength) // 向下取整
}

/** 从文件url获取文件名 */
export const derivedNameFormUrl = (url: string): string => {
  return (url || '').replace(/(.+)\/(?=.+$)/, '')
}

/** 获取文件扩展名 */
export const getFileExtName = (url: string) => {
  const result = url.match(/.+(\.(.+?))(\?.+)?$/)
  if (result && result[1]) {
    return (result[1].slice(1) || '').trim().toLocaleLowerCase()
  }
  return ''
}
