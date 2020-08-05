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
    h?: number,
    [k: string]: any
  }[]
  /* 打印留白 */
  margin?: number
}

export interface PrintConfig {
  debug?: boolean
  direction?: 'landscape' | 'portrait'
}

export interface SheetPrintProps {
  print: (option?: PrintItem | PrintItem[], config?: PrintConfig | boolean) => void
}
