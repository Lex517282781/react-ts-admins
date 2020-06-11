import React, { PureComponent } from 'react'
import ReactToPrint, { PrintContextConsumer } from 'react-to-print'
import ContentHead from './components/ContentHead'
import ContentFoot from './components/ContentFoot'
import TableTHeadTr from './components/TableTHeadTr'
import TableTbodyTr from './components/TableTbodyTr'
import { chunk } from 'lodash'
import { getA4W, getA4H } from './config/util'
import { Colum } from './config/interface'
import styles from './style.module.styl'

const a4W = getA4W()
const a4H = getA4H()

console.log(a4H)

interface TablePrintProps {
  /* 内容头部 */
  head?: React.ReactNode
  /* 内容底部 */
  foot?: React.ReactNode
  /* 表格表头 */
  colums?: Colum[]
  /* 表格数据 */
  data?: any[]
  /* 是否调试 */
  debug?: boolean
  /* 表格左边留白 */
  tablePaddingLeft?: number
  /* 表格右边留白 */
  tablePaddingRight?: number
  /* 表格底部留白 */
  tablePaddingBottom?: number
  /* 表格顶部留白 */
  tablePaddingTop?: number
}

interface TablePrintState {
  dataSource: any[]
  tableData: any[]
  heights: {[key: string]: number}
}

class TablePrint extends PureComponent<TablePrintProps, TablePrintState> {
  contentRef: HTMLDivElement | null = null
  state: TablePrintState = {
    dataSource: this.props.data || [],
    tableData: this.props.data ? chunk(this.props.data, this.props.data.length) : [],
    heights: {}
  }

  componentDidMount () {
    this.reRender()
  }

  componentDidUpdate () {
    // this.reRender()
  }

  /* 获取内容到到a4 */
  getContentReachA4Index = (dataSource: any = []) => {
    const { heights } = this.state
    const { tablePaddingTop = 0, tablePaddingBottom = 0 } = this.props
    let sum = Object.values(heights).reduce((pre, next) => pre + next, 0)
    sum += tablePaddingTop + tablePaddingBottom
    for (let i = 0, l = dataSource.length; i < l; i++) {
      const item = dataSource[i]
      sum += item.h
      if (sum > a4H) {
        return i
      }
    }
    return -1
  }

  reRender = () => {
    const { tableData } = this.state
    const length = tableData.length
    const preData = tableData.slice(0, length - 1)
    const lastData = tableData[length - 1]
    const reachIndex = this.getContentReachA4Index(lastData)
    if (reachIndex > 0) {
      this.setState({
        tableData: [
          ...preData,
          lastData.slice(0, reachIndex),
          lastData.slice(reachIndex)
        ]
      })
    }
  }

  render () {
    const {
      head,
      foot,
      colums = [],
      debug = false,
      tablePaddingTop = 0,
      tablePaddingBottom = 0,
      tablePaddingLeft = 0,
      tablePaddingRight = 0
    } = this.props
    const { tableData, heights } = this.state

    console.log(tableData, 'tableData')

    return (
      <div>
        <ReactToPrint content={() => this.contentRef}>
          <PrintContextConsumer>
            {({ handlePrint }) => (
              <button onClick={handlePrint}>Print this out!</button>
            )}
          </PrintContextConsumer>
        </ReactToPrint>
        <div
          style={
            debug
              ? {} : {
                position: 'absolute',
                left: '-999999px',
                top: '-999999px',
                visibility: 'hidden',
                zIndex: -999999
              }
          }
        >
          <div
            ref={ref => { this.contentRef = ref }}
            style={{ width: a4W }}
            className={styles['print-content']}
          >
            <div style={{ background: 'red', width: a4W, height: a4H }}>
              <div style={{ height: 41, background: 'yellow' }}></div>
              <div style={{ height: 874, background: 'green' }}></div>
              <div style={{ height: 200, background: 'pink' }}></div>
              <div style={{ pageBreakAfter: 'always', height: 0 }} />
            </div>
            <div className={styles['print-content-inner']}>
              {
                tableData.map((item, i) => (
                  // 这里设置组合key是为了动态设置key 避免key值没变化 组件就不更新的 这里就是强制需要重新渲染
                  <div title={`第${i + 1}页`} key={`${tableData.length}-${i}`} className={styles['print-content-block']}>
                    {
                      <ContentHead data={heights}>
                        {head}
                        <div>{item.reduce((pre: any, next: any) => pre + next.h, 0)}</div>
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
                            item.map((innerItem: any, j: number) => (
                              <TableTbodyTr colums={colums} key={j} data={innerItem} />
                            ))
                          }
                        </tbody>
                      </table>
                    </div>
                    <ContentFoot data={heights}>
                      {foot}
                    </ContentFoot>
                    <div style={{ pageBreakAfter: 'always' }} />
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default TablePrint
