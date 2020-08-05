/* 打印选项其他元素函数入参 */
export type PrintItemRestParam = []

export interface Colum {
  key: string
  title: React.ReactNode
  width?: string | number
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
  _headerH?: number
  _footerH?: number
  _thH?: number
}

export interface PrintConfig {
  debug?: boolean
  direction?: 'landscape' | 'portrait'
  /* 打印边距 */
  margin?: number
}

export interface SheetPrintProps {
  print: (option?: PrintItem | PrintItem[], config?: PrintConfig | boolean) => void
}
