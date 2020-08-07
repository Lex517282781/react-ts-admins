/* 打印选项其他元素函数入参 */
export type PrintItemRestParam = any[]

export interface Colum {
  key: string
  title: React.ReactNode
  width?: string
  align?: 'left' | 'center' | 'right'
}

export interface PrintItem {
  /* 头部元素 */
  header?: ((...param: PrintItemRestParam) => React.ReactNode) | React.ReactNode
  /* 底部元素 */
  footer?: ((...param: PrintItemRestParam) => React.ReactNode) | React.ReactNode
  /* 表格表头 */
  colums: Colum[]
  /* 表格数据 */
  dataSource: {
    _h?: number,
    [k: string]: any
  }[]
  /* 打印留白 */
  margin?: number
  /* 头部高度 */
  _headerH?: number
  /* 底部高度 */
  _footerH?: number
  /* 表格表头高度 */
  _thH?: number
  /* 当前模块索引 */
  _moduleIndex?: number
  /* 模块总个数 */
  _moduleTotal?: number
  /* 模块页码 */
  _modulePage?: number
  /* 模块总页码 */
  _modulePages?: number
  /* 全局页码 */
  _globalPage?: number
  /* 全局总页码 */
  _globalPages?: number
  /* 是否固定布局 固定布局footer会显示在最底部 */
  fixed?: boolean
}

export interface PrintConfig {
  debug?: boolean
  direction?: 'landscape' | 'portrait'
  /* 打印边距 */
  margin?: number
  /* 是否固定布局 固定布局footer会显示在最底部 */
  fixed?: boolean
}

export interface SheetPrintProps {
  print: (option?: PrintItem | PrintItem[], config?: PrintConfig | boolean) => void
}
