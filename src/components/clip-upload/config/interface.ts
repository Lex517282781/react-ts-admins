/** 图片上传 后端返回类型 */
export interface Result {
  name: string
  url: string
}

export interface CropPos {
  height: number
  width: number
  top: number
  left: number
}

export interface ImgPos {
}

/** 文件类型 */
export interface FileItem {
  uid: string
  name: string
  url: string
  type: string
  needClip: boolean // 是否需要裁切
  hasClip: boolean // 确认裁切
  size: number
  rate: number
  status:
  | 'done'
  | 'error'
  | 'success'
  | 'uploading'
  | 'removed'
  | undefined
  /* 裁剪图片相关位置 */
  cropPos?: CropPos
  /* 裁剪图片相关属性 */
  imgPos?: ImgPos
  width?: number
  height?: number
}

export type FileList = Array<FileItem>

/** 自定义上传文件成功回调集合类型 */
export interface SuccessCollect {
  [uid: string]: () => void
}

export interface ImgWrapProps {
  index: number
  overflow: boolean
  isClip: boolean
  item: { url: string }
  active: boolean
  onItemClick: (index: number) => void
  onRefreshClick: (
    index: number,
    e: React.MouseEvent
  ) => void
}
