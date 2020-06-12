import React, { PureComponent } from 'react'
import { Spin } from 'antd'
import ReactToPrint from 'react-to-print'
import PrintBlock from './components/PrintBlock'
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
  dataSource?: any[]
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
  print: (option: PrintOption | Array<PrintOption>, debug?: boolean) => () => void
}

interface TablePrintItem {
  tableData: any[]
  /* 各部分高度储存地方 tableHead contentHead contentFoot */
  heights: {[key: string]: number}
}

interface TablePrintState extends PrintOption {
  end: boolean
  loading: boolean
  debug?: boolean
  count: number
  printBlocks: Array<TablePrintItem & PrintOption>
}

function TablePrintWrap <T = any> (Wrapper: React.ComponentType<T>) {
  return class TablePrint extends PureComponent<T, TablePrintState> {
    contentRef: HTMLDivElement | null = null
    printRef: any
    state: TablePrintState = {
      printBlocks: [],
      count: 0,
      end: false,
      loading: false,
      debug: false
    }

    componentDidUpdate () {
      this.reRender()
    }

    print = (option: PrintOption | Array<PrintOption>, debug = false) => {
      option = Array.isArray(option) ? option : [option]
      this.setState({
        printBlocks: option.map(item => ({
          ...item,
          tableData: item.dataSource ? [[item.dataSource, []]] : [],
          heights: {}
        })),
        count: 0,
        end: false,
        loading: true,
        debug
      })
    }

    /* 获取内容到到a4 */
    getContentReachA4Index = (data: any = [], info: PrintOption & TablePrintItem) => {
      const { heights, tablePaddingTop = 0, tablePaddingBottom = 0 } = info
      let sum = Object.values(heights).reduce((pre: number, next: number) => pre + next, 0)
      sum += tablePaddingTop + tablePaddingBottom
      const content = data[0]
      data[1][0] = heights.contentHead || 0 // 顶部数据高度
      data[1][2] = heights.contentFoot || 0 // 底部数据高度
      data[1][1] = tablePaddingTop + tablePaddingBottom + (heights.tableHead || 0) // 表格数据高度
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
      const { end, debug, loading, count, printBlocks } = this.state
      if (count === printBlocks.length) {
        this.setState({
          end: true
        })
        // 此处已经渲染计算完毕 可以打印
        if (debug) {
          this.setState({
            loading: false
          })
          console.log(this.state.printBlocks)
          return
        }
        if (loading) {
          this.printRef.handlePrint()
        }
        return
      }
      const curentBlock = printBlocks[count]
      const tableData = curentBlock.tableData
      const length = tableData.length
      // 每次对最后一个元素重新计算 除了最后一个的其他元素全部回塞进新的数组
      const preData = tableData.slice(0, length - 1)
      const lastData = tableData[length - 1]
      const reachIndex = this.getContentReachA4Index(lastData, curentBlock)
      if (reachIndex > 0) {
        this.setState({
          printBlocks: [
            ...printBlocks.slice(0, count),
            {
              ...printBlocks[count],
              tableData: [
                ...preData,
                [lastData[0].slice(0, reachIndex), lastData[1]],
                [lastData[0].slice(reachIndex), []]
              ]
            },
            ...printBlocks.slice(count + 1)
          ]
        })
      } else {
        this.setState({
          printBlocks: [
            ...printBlocks.slice(0, count),
            {
              ...printBlocks[count],
              tableData: [
                ...preData,
                [...lastData]
              ]
            },
            ...printBlocks.slice(count + 1)
          ],
          count: count + 1
        })
      }
    }

    render () {
      const {
        debug = false,
        loading,
        printBlocks
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
                {
                  printBlocks.map((block, i) => {
                    return (
                      <PrintBlock key={i} {...block} />
                    )
                  })
                }
              </div>
            </div>
          </Spin>
        </div>
      )
    }
  }
}

export default TablePrintWrap
