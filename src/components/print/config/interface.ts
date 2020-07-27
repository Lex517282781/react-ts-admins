export interface ColumsItem {
  key: string
  title: string
  /* 宽度 百分比 或者 px 如: 20% 20px */
  width?: string
  /* 计算宽度 百分比 或者 px 如: 20% 20px */
  calcWidth?: string
  align?: 'left' | 'center' | 'right'
}

export type Colums = Array<ColumsItem>

/* 单个打印对象参数 */
export interface PrintItem {
  /* 表格表头字段 */
  colums?: Colums
  /* 表格上部分 */
  head?: React.ReactNode
  /* 表格内容部分 */
  data?: any[]
  /* 表格底部分 */
  foot?: React.ReactNode
  /* 组件内部元素 */
  children?: React.ReactNode
   /* 组件内部元素 */
   content?: React.ReactNode
}

/* 打印参数 */
export type PrintOption = PrintItem | PrintItem[]

export interface PrintConfig {
  /* 初始化 */
  init?: boolean,
  direction?: 'auto' | 'landscape' | 'portrait',
  margin?: number
  debug?: boolean,
  /* 固定页面 即页面在最底部显示 */
  fixed?: boolean
  /* 打印后回调 */
  onAfterPrint?: () => void
}
