import React, { PureComponent } from 'react'
import { Spin } from 'antd'
import ReactToPrint from 'react-to-print'
import ContentHead from './components/ContentHead'
import ContentFoot from './components/ContentFoot'
import TableTHeadTr from './components/TableTHeadTr'
import TableTbodyTr from './components/TableTbodyTr'
import { getA4W, getA4H } from './config/util'
import { Colum } from './config/interface'
import styles from './style.module.styl'

const a4W = getA4W()
const a4H = getA4H()

export interface PrintOption {
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

export interface TablePrintProps {
  print: (option: PrintOption) => () => void
}

interface TablePrintState extends PrintOption {
  dataSource: any[]
  tableData: any[]
  heights: {[key: string]: number}
  end: boolean
  loading: boolean
}

function TablePrintWrap <T = any> (Wrapper: React.ComponentType<T>) {
  return class TablePrint extends PureComponent<T, TablePrintState> {
    contentRef: HTMLDivElement | null = null
    printRef: any
    state: TablePrintState = {
      dataSource: [],
      tableData: [],
      heights: {},
      end: false,
      loading: false
    }

    componentDidUpdate () {
      this.reRender()
    }

    print = (option: PrintOption) => {
      this.setState({
        dataSource: option.data || [],
        tableData: option.data ? [[option.data, []]] : [],
        head: option.head,
        foot: option.foot,
        colums: option.colums,
        data: option.data,
        debug: option.debug,
        tablePaddingLeft: option.tablePaddingLeft,
        tablePaddingRight: option.tablePaddingRight,
        tablePaddingBottom: option.tablePaddingBottom,
        tablePaddingTop: option.tablePaddingTop,
        end: false,
        loading: true
      })
    }

    /* 获取内容到到a4 */
    getContentReachA4Index = (data: any = []) => {
      const { heights, tablePaddingTop = 0, tablePaddingBottom = 0 } = this.state
      let sum = Object.values(heights).reduce((pre, next) => pre + next, 0)
      sum += tablePaddingTop + tablePaddingBottom
      const content = data[0]
      data[1][0] = heights.contentHead || 0
      data[1][2] = heights.contentFoot || 0
      data[1][1] = tablePaddingTop + tablePaddingBottom + (heights.tableHead || 0)
      for (let i = 0, l = content.length; i < l; i++) {
        const item = content[i]
        sum += item.h
        data[1][1] += item.h
        if (sum > a4H) {
          data[1][1] -= item.h // 因为是截止到当前个数的时候 该个数不在当前的数组范围内 所以需要减去当前的高度
          data[1][3] = data[1][0] + data[1][1] + data[1][2]
          return i
        }
      }
      data[1][3] = data[1][0] + data[1][1] + data[1][2]
      return -1
    }

    reRender = () => {
      const { tableData, end, debug, loading } = this.state
      const length = tableData.length
      // 每次对最后一个元素重新计算 除了最后一个的其他元素全部回塞进新的数组
      const preData = tableData.slice(0, length - 1)
      const lastData = tableData[length - 1]
      const reachIndex = this.getContentReachA4Index(lastData)
      if (end) {
        // 此处已经渲染计算完毕 可以打印
        if (debug) {
          console.log(this.state.tableData)
          return
        }
        if (loading) {
          this.printRef.handlePrint()
        }
        return
      }
      if (reachIndex > 0) {
        this.setState({
          tableData: [
            ...preData,
            [lastData[0].slice(0, reachIndex), lastData[1]],
            [lastData[0].slice(reachIndex), []]
          ]
        })
      } else {
        this.setState({
          tableData: [
            ...preData,
            [...lastData]
          ],
          end: true
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
        tablePaddingRight = 0,
        loading,
        tableData,
        heights
      } = this.state

      return (
        <div>
          <Spin spinning={loading}>
            <Wrapper print={this.print} {...this.props} />
            <ReactToPrint
              ref={ref => { this.printRef = ref }}
              content={() => this.contentRef}
              onBeforePrint={() => {
                this.setState({
                  loading: true
                })
              }}
              onAfterPrint={() => {
                this.setState({
                  loading: false
                })
              }}
            />
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
                <div className={styles['print-content-inner']}>
                  {
                    tableData.map(([content, info], i) => {
                      return (
                        <div
                          title={`第${i + 1}页, 页面高度: ${info[3]}`}
                          // 这里设置组合key是为了动态设置key 避免key值没变化 组件就不更新的 这里就是强制需要重新渲染
                          key={`${tableData.length}-${i}`}
                          className={styles['print-content-block']}
                        >
                          {
                            <ContentHead data={heights}>
                              {head}
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
                            {foot}
                          </ContentFoot>
                          {
                            info[3] !== a4H && (
                              <div style={{ pageBreakAfter: 'always' }} />
                            )
                          }
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            </div>
          </Spin>
        </div>
      )
    }
  }
}

export default TablePrintWrap
