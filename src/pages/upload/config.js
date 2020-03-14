const getUniqueId = (() => {
  let index = 0
  const prefix = 'key_' + new Date().getTime() + '_'
  return () => {
    index++
    const id = prefix + index
    return id
  }
})()

const uploadImgs = () => {
  return new Promise((r) => {
    setTimeout(() => {
      r({
        url: 'https://assets.hzxituan.com/crm/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8551583809428505.jpg',
      })
    }, 3000);
  })
}

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

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

const getSizeTxt = function (size) {
  if (size >= 1) {
    return size + 'MB'
  } else {
    return size * 1000 + 'KB'
  }
}

const getBase64Size = function (base64) {
  base64 = base64.split(",")[1].split("=")[0];
  const strLength = base64.length;
  const fileLength = strLength - (strLength / 8) * 2;
  return Math.floor(fileLength); // 向下取整
}

export {
  getUniqueId,
  uploadImgs,
  getBase64,
  dataURLtoFile,
  isPic,
  sizeOverflow,
  getSizeTxt,
  getBase64Size
}