/** 图片上传 后端返回类型 */
export interface Result {
  name: string
  url: string
}

/** 文件类型 */
export interface FileItem {
  uid: string
  name: string
  url: string
  type: string
  needClip: boolean // 是否需要裁切
  initClip: boolean // 第一次裁切
  size: number
  rate: number
  status:
  | 'done'
  | 'error'
  | 'success'
  | 'uploading'
  | 'removed'
  | undefined
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
