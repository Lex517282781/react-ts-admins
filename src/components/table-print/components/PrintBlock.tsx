import React, { PureComponent } from 'react'
import ContentHead from './ContentHead'
import ContentFoot from './ContentFoot'
import TableTHeadTr from './TableTHeadTr'
import TableTbodyTr from './TableTbodyTr'
import { Colum } from '../config/interface'
import styles from '../style.module.styl'

interface PrintBlockProps {
  /* 内容头部 */
  head?: React.ReactNode
  /* 内容底部 */
  foot?: React.ReactNode
  /* 表格表头 */
  colums?: Colum[]
  /* 表格数据 */
  tableData?: any[]
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
}

class PrintBlock extends PureComponent<PrintBlockProps> {
  render () {
    const { head, foot, tableData = [], heights = {}, tablePaddingTop, tablePaddingBottom, tablePaddingLeft, tablePaddingRight, colums = [], pageH } = this.props

    return (
      <div className={styles['print-content-block']}>
        {
          tableData.map(([content, info], i) => {
            let headEl = null
            let footEl = null
            if (typeof head === 'function') {
              headEl = head(content, tableData, i, tableData.length)
            } else {
              headEl = head
            }
            if (typeof foot === 'function') {
              footEl = foot(content, tableData, i, tableData.length)
            } else {
              footEl = foot
            }
            return (
              <div
                title={`第${i + 1}页, 页面高度: ${info[3]}`}
                // 这里设置组合key是为了动态设置key 避免key值没变化 组件就不更新的 这里就是强制需要重新渲染
                key={`${tableData.length}-${i}`}
                className={styles['print-content-inner']}
              >
                {
                  <ContentHead data={heights}>
                    {headEl}
                  </ContentHead>
                }
                <div
                  style={{
                    paddingTop: tablePaddingTop,
                    paddingBottom: tablePaddingBottom,
                    paddingLeft: tablePaddingLeft,
                    paddingRight: tablePaddingRight
                  }}
                  className={styles['content-body']}
                >
                  <table>
                    <thead>
                      <TableTHeadTr colums={colums} data={heights} />
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
                <ContentFoot data={heights}>
                  {footEl}
                </ContentFoot>
                {
                  info[3] !== pageH && (
                    <div style={{ pageBreakAfter: 'always' }} />
                  )
                }
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default PrintBlock
