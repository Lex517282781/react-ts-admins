/* 列表表头字段 */
export interface Colum {
  key: string | number
  title: React.ReactNode
  width?: string
  align?: 'left' | 'center' | 'right'
}

/* 单个打印对象参数 */
export interface PrintItem {
  /* 打印头部 */
  head?: (
    (
      /* 当前页面列表内容 */
      content: any,
      /* 当前打印模块内容 */
      tableData: any[],
      /* 当前打印模块页码 */
      modulePage: number,
      /* 当前打印模块总页码 */
      moduleTotalPage: number,
      /* 模板个数索引 */
      blockIndex: number,
      /* 模块总个数 */
      blockTotalCount: number,
      /* 当前整体页码 */
      globalPage: number,
     /* 整体总页码 */
     globalTotalPage: number
    ) => React.ReactNode
  ) | React.ReactNode
  /* 打印底部 */
  foot?: (
    (
      /* 当前页面列表内容 */
      content: any,
      /* 当前打印模块内容 */
      tableData: any[],
      /* 当前打印模块页码 */
      modulePage: number,
      /* 当前打印模块总页码 */
      moduleTotalPage: number,
      /* 模板个数索引 */
      blockIndex: number,
      /* 模块总个数 */
      blockTotalCount: number,
      /* 当前整体页码 */
      globalPage: number,
     /* 整体总页码 */
     globalTotalPage: number
    ) => React.ReactNode
  ) | React.ReactNode
  /* 打印表格表头 */
  colums?: Colum[]
  /* 打印表格数据 */
  dataSource?: any[]
  /* 表格左边留白 */
  tablePaddingLeft?: number
  /* 表格右边留白 */
  tablePaddingRight?: number
  /* 表格底部留白 */
  tablePaddingBottom?: number
  /* 表格顶部留白 */
  tablePaddingTop?: number
  /* 打印纸张外边距 */
  padding?: number
}

/* 打印参数 */
export type PrintOption = PrintItem | PrintItem[]

export interface PrintConfig {
  /* 初始化 */
  init?: boolean,
  direction?: 'auto' | 'landscape' | 'portrait',
  debug?: boolean,
  /* 固定页面 即页面在最底部显示 */
  fixed?: boolean
  /* 打印后回调 */
  onAfterPrint?: () => void
}

/* 单个打印对象参数 组件内部使用 */
export interface PrintBlockItem extends PrintItem {
  /* 外部dataSource入参转化之后的值 在实际渲染上使用 形式如[[表格数据], [头部高度, 表格高度, 底部高度, 页面高度], [当前页面]] */
  tableData: any[]
  /* 各部分高度储存地方 tableHead contentHead contentFoot */
  heights: { [key: string]: number }
}
