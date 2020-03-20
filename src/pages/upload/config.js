/** 获取唯一值 */
const getUniqueId = (() => {
  let index = 0
  const prefix = 'key_' + new Date().getTime() + '_'
  return () => {
    index++
    const id = prefix + index
    return id
  }
})()

/** file转base64 */
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

/** base64转file */
function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

/** 图片类型判断 */
const isPic = function (type) {
  const isJPG = type === 'image/jpeg';
  const isPNG = type === 'image/png';
  const isBMP = type === 'image/bmp';
  const isGIF = type === 'image/gif';
  const isWEBP = type === 'image/webp';
  const isPic = isJPG || isPNG || isBMP || isGIF || isWEBP;
  return isPic
}

/** size为n n小于1的 (n*1000)kb n大于等于1 (n)mb，1000kb-1024kb区间不支持设置 */
const sizeOverflow = function (cursize, presize) {
  return (cursize / 1024 / 1024) > (presize < 1 ? presize / 1.024 : presize)
}

/** 根据图片大小获取大小M和KB值 */
const getSizeTxt = function (size) {
  if (size >= 1) {
    return size + 'MB'
  } else {
    return size * 1000 + 'KB'
  }
}

/** 获取base64尺寸 */
const getBase64Size = function (base64) {
  base64 = base64.split(",")[1].split("=")[0];
  const strLength = base64.length;
  const fileLength = strLength - (strLength / 8) * 2;
  return Math.floor(fileLength); // 向下取整
}

/** 从文件url获取文件名 */
const derivedNameFormUrl =function (url) {
  return (url || '').replace(/(.+)\/(?=.+$)/, '')
}

/** 获取文件扩展名 */
const getFileExtName = function(url) {
  const result = url.match(/.+(\.(.+?))(\?.+)?$/)
  if (result && result[1]) {
    return (result[1].slice(1) || '').trim().toLocaleLowerCase()
  }
  return '';
}

export {
  getUniqueId,
  getBase64,
  dataURLtoFile,
  isPic,
  sizeOverflow,
  getSizeTxt,
  getBase64Size,
  derivedNameFormUrl,
  getFileExtName
}