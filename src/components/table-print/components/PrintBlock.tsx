import React, { PureComponent, Fragment } from 'react'
import ContentHead from './ContentHead'
import ContentFoot from './ContentFoot'
import TableTHeadTr from './TableTHeadTr'
import TableTbodyTr from './TableTbodyTr'
import { Colum } from '../config/interface'
import styles from '../style.module.styl'

interface PrintBlockProps {
  /* 打印模块索引 */
  index: number
  /* 模块长度 */
  blockSize: number
  /* 页面长度 */
  pageSize: number
  /* 内容头部 */
  head?: React.ReactNode
  /* 内容底部 */
  foot?: React.ReactNode
  /* 表格表头 */
  colums?: Colum[]
  /* 表格数据 */
  tableData?: any[]
  /* 临时表格数据 */
  tempTableData?: any[]
  /* 表格左边留白 */
  tablePaddingLeft?: number
  /* 表格右边留白 */
  tablePaddingRight?: number
  /* 表格底部留白 */
  tablePaddingBottom?: number
  /* 表格顶部留白 */
  tablePaddingTop?: number
  /* 各部分高度储存地方 tableHead contentHead contentFoot */
  heights?: {[key: string]: number}
  /* 页面纸张宽 */
  pageW?: number
  /* 页面纸张高 */
  pageH?: number
  /* 样式 */
  style?: React.CSSProperties
  fixed?: boolean
  isCalculate?: boolean
  remainFixed?: boolean
}

class PrintBlock extends PureComponent<PrintBlockProps> {
  render () {
    const {
      head,
      foot,
      tableData = [],
      tempTableData = [],
      heights = {},
      tablePaddingTop,
      tablePaddingBottom,
      tablePaddingLeft,
      tablePaddingRight,
      colums = [],
      pageH,
      index,
      blockSize,
      pageSize,
      style = {},
      fixed,
      isCalculate,
      remainFixed
    } = this.props

    const tableDataSize = tableData.length

    let curTableData = tableData

    if (isCalculate) {
      curTableData = tempTableData
    }

    return (
      <div className={styles['print-content-block']}>
        {
          curTableData.map(([content, info, sizes], i) => {
            let headEl = null
            let footEl = null
            if (typeof head === 'function') {
              headEl = head(
                content, // 当前页面列表内容
                tableData, // 当前打印模块内容
                i + 1, // 当前打印模块总页码
                tableDataSize, // 当前打印模块总页码
                index + 1, // 当前模板
                blockSize, // 模块长度
                sizes[0], // 当前整体页码
                pageSize // 当前整体页码数
              )
            } else {
              headEl = head
            }

            if (typeof foot === 'function') {
              footEl = foot(
                content,
                tableData,
                i + 1,
                tableDataSize,
                index + 1,
                blockSize,
                sizes[0],
                pageSize
              )
            } else {
              footEl = foot
            }

            let needRenderHead = (headEl !== undefined) &&
            (headEl !== null)
            let needRenderFoot = (footEl !== undefined) &&
            (footEl !== null)
            let needRenderTableHead = true
            let needDivision = true

            if (heights.contentHead && isCalculate) {
              // 该模块已经有高度值 且 打印在计算过程中 那么head不需要为了获取高度在重写渲染 只需要在计算完毕之后再来渲染即可
              needRenderHead = false
            }

            if (heights.contentFoot && isCalculate) {
              needRenderFoot = false
            }

            if (heights.tableHead && isCalculate) {
              needRenderTableHead = false
            }

            if (fixed) {
              needDivision = false
            } else if (info[3] === pageH) {
              needDivision = false
            }
            return (
              <Fragment key={`${i}`}>
                <div
                  title={
                    `
                    第${index + 1}模块, 共${blockSize}模块; 
                    模块第${i + 1}页, 模块共${tableDataSize}页; 
                    全局第${(sizes[0] || 0) + 1}页, 全局共${pageSize}页; 
                    页面高度: ${info[3]}
                  `
                  }
                  // 这里设置组合key是为了动态设置key 避免key值没变化 组件就不更新的 这里就是强制需要重新渲染
                  // key={`${tableData.length}-${i}`}
                  className={styles['print-content-inner']}
                  style={style}
                >
                  {
                    needRenderHead && (
                      <ContentHead
                        data={heights}
                        remainFixed={remainFixed}
                        style={{ height: info[0] ? info[0] : 'auto' }}
                      >
                        {headEl}
                      </ContentHead>
                    )
                  }
                  <div
                    style={{
                      height: info[1] ? info[1] : 'auto',
                      paddingTop: tablePaddingTop,
                      paddingBottom: tablePaddingBottom,
                      paddingLeft: tablePaddingLeft,
                      paddingRight: tablePaddingRight
                    }}
                    className={styles['content-body']}
                  >
                    <table style={{ width: '100%' }}>
                      <thead>
                        {
                          needRenderTableHead && (
                            <TableTHeadTr colums={colums} data={heights} remainFixed={remainFixed} />
                          )
                        }
                      </thead>
                      <tbody>
                        {
                          content.map((innerItem: any, j: number) => (
                            <TableTbodyTr colums={colums} key={j} data={innerItem} />
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                  {
                    needRenderFoot && (
                      <ContentFoot
                        fixed={fixed}
                        data={heights}
                        remainFixed={remainFixed}
                        style={{ height: info[2] ? info[2] : 'auto' }}
                      >
                        {footEl}
                      </ContentFoot>
                    )
                  }
                </div>
                {
                  needDivision && (
                    <div style={{ pageBreakAfter: 'always' }} />
                  )
                }
              </Fragment>
            )
          })
        }
      </div>
    )
  }
}

export default PrintBlock
