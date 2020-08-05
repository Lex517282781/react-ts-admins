import React, { PureComponent } from 'react'
import { Spin } from 'antd'
import ReactToPrint from 'react-to-print'
import { groupBy } from 'lodash'
import PrintBlock from './components/PrintBlock'
import { mm2px, getA4W, getA4H, getTrItemH } from './config/util'
import * as defaultConfig from './config/config'
import { PrintItem, PrintOption, PrintBlockItem, PrintConfig, Colum } from './config/interface'
import styles from './style.module.styl'
import './style.styl'

const a4W = getA4W()
const a4H = getA4H()
const topH = mm2px(8)
const bottomH = mm2px(4)
const gutterW = mm2px(10)
const newA4W = a4W - gutterW * 2
// const newA4W = a4W
const newA4H = a4H - topH - bottomH

const ZH_W = 12
const EH_W = 8
console.log(a4W, 'a4W', a4H, 'a4H', newA4W, 'newA4W', newA4H, 'newA4H', getTrItemH(1), getTrItemH(3))

export interface TablePrintProps {
  /* 打印方法 */
  print: (option: PrintOption, config?: PrintConfig | boolean) => () => void
}

interface TablePrintState extends PrintItem {
  /* 打印数据参数 */
  printBlocks: PrintBlockItem[]
  /* 模块计数 */
  blockCount: number
  /* 页面计数 */
  pageCount: number
  /* 是否打印完成 */
  end: boolean
  /* 计算和打印loading */
  loading: boolean
  /* 是否计算 计算过程中有些元素计算之后已经有值了就不需要重新计算 那么不需要渲染 */
  isCalculate?: boolean
  /* debug为true展示当前页面打印预览的排版 */
  debug?: boolean
  /* 打印方向 */
  direction?: string,
  /* 固定页面 即页面在最底部显示 */
  fixed?: boolean
  /* 页面宽度 */
  pageW: number
  /* 页面高度 */
  pageH: number
  /* 打印后回调 */
  onAfterPrint?: () => void
  /* 打印功能初始化 */
  init: boolean
  /* 打印开始时间 */
  startTime?: number
  /* 打印结束时间 */
  endTime?: number
  /* 高度缓存 */
  caches?: number
}

function TablePrintWrap <T = any> (Wrapper: React.ComponentType<T>) {
  return class TablePrint extends PureComponent<T, TablePrintState> {
    contentRef: HTMLDivElement | null = null
    timer:any = null
    printRef: any
    state: TablePrintState = {
      printBlocks: [],
      blockCount: 0,
      pageCount: 0,
      end: false,
      loading: false,
      debug: false,
      fixed: true,
      pageW: newA4W,
      pageH: newA4H,
      init: false
    }

    componentDidUpdate (_: T, preState: TablePrintState) {
      const { pageCount, blockCount, printBlocks, init } = this.state
      const { blockCount: preBlockCount } = preState
      console.log(preBlockCount, 'preBlockCount', blockCount, 'blockCount')
      if (!init) {
        return
      }
      if ((blockCount !== 0) && (blockCount === preBlockCount)) {
        return
      }
      if (printBlocks.length === blockCount) {
        return
      }
      const curentBlock = printBlocks[blockCount]
      console.log(curentBlock.remainFixed)
      if (curentBlock.remainFixed) {
        return
      }
      if (
        (blockCount && (blockCount % 50 === 0))
      ) {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          // 这里需要注意在setTimeout里面调用setState因为state不再自动合并, 尽量手动合并, 使用一次
          // 注意：https://segmentfault.com/q/1010000015805834
          this.split(printBlocks, pageCount)
        }, 30)
      } else {
        this.split(printBlocks, pageCount)
      }
    }

    /* 打印 */
    print = (option: PrintOption, config?: PrintConfig | boolean) => {
      option = Array.isArray(option) ? option : [option]
      config = typeof config === 'boolean'
        ? { ...defaultConfig, debug: config }
        : { ...defaultConfig, ...(config || {}) }
      let pageW = newA4W
      let pageH = newA4H
      if (config.direction === 'portrait') {
        pageW = newA4W
        pageH = newA4H
      } else if (config.direction === 'landscape') {
        pageW = a4H - gutterW * 2
        pageH = a4W - topH - bottomH
      }
      const printBlocks = option.map((item: any) => {
        const { dataSource = [], colums = [], padding = 0, tablePaddingLeft = 0, tablePaddingRight = 0 } = item
        const tableW = pageW - padding * 2 - tablePaddingLeft - tablePaddingRight
        dataSource.forEach((dataItem: any) => {
          const noWidthColums = colums.filter((colItem: Colum) => !colItem.width).length
          const widthColumsTotal = colums.filter((colItem: Colum) => !!colItem.width).reduce((pre: number, next: Colum) => {
            if (next.width) {
              if ((/%/).test(next.width)) {
                return pre + Number(next.width.replace('%', '')) / 100 * tableW
              } else {
                return pre + Number(next.width.replace('px', ''))
              }
            }
            return pre
          }, 0)
          dataItem.lines = colums.map((colItem: Colum) => {
            let colItemW = 0
            if (colItem.width) {
              if (/%/.test(colItem.width)) {
                colItemW = Math.floor(Number(colItem.width.replace('%', '')) / 100 * tableW)
              } else {
                colItemW = Math.floor(Number(colItem.width.replace('px', '')))
              }
            } else {
              colItem.calcWidth = ((tableW - widthColumsTotal) / noWidthColums) / tableW * 100 + '%'
              colItemW = Math.floor(Number(colItem.calcWidth.replace('%', '')) / 100 * tableW)
            }
            const colItemStr = String(dataItem[colItem.key] || '-')
            const strWidth = /[\u4e00-\u9fa5]+/.test(colItemStr) ? ZH_W : EH_W
            const colItemNum = Math.floor((colItemW - 8) / strWidth) // 8 是td padding * 2的值
            const line = Math.ceil((colItemStr.length || 0) / colItemNum)
            return line
          })
        })
        return {
          ...item,
          tableData: [[item.dataSource, [], [], []]],
          tempTableData: [[[item.dataSource[0] || []], [], [], []]],
          heights: {
            contentHead: item.headH || 0,
            contentFoot: item.footH || 0,
            tableHead: item.tableHeadH || 0
          }
        }
      })
      const firstRemainFixed = printBlocks[0]?.remainFixed
      const state = {
        blockCount: 0,
        pageCount: 1,
        end: false,
        isCalculate: true,
        startTime: +new Date(),
        pageW,
        pageH,
        ...config,
        loading: config.init
      } as TablePrintState

      if (!firstRemainFixed) {
        state.printBlocks = printBlocks
      }

      if (config.onAfterPrint) {
        state.onAfterPrint = config.onAfterPrint
      }

      this.setState(state, () => {
        if (firstRemainFixed) {
          this.split(printBlocks, this.state.pageCount)
        }
      })
    }

    /* 获取内容到到a4 计算获得该内容的内部索引 */
    getContentReachA4Index = (data: any = [], info: PrintBlockItem, pageCount: number, blockSplit?: boolean) => {
      const { heights, tablePaddingTop = 0, tablePaddingBottom = 0, padding = 0, onlyTopShow } = info
      let sum = Object.values(heights).reduce((pre: number, next: number) => pre + next, 0)
      if (onlyTopShow && (!blockSplit)) {
        // 只显示顶部且不是分割时候需要减去头部高度
        sum -= heights.contentHead
      }
      sum += tablePaddingTop + tablePaddingBottom + padding * 2
      const content = data[0]
      data[1][0] = onlyTopShow ? (
        // 只要显示顶部的时候 每次确认block分割了 才赋值高度
        blockSplit ? heights.contentHead : 0
      )
        : (heights.contentHead || 0) // 顶部数据高度
      data[1][0] = heights.contentHead || 0 // 顶部数据高度
      data[1][2] = heights.contentFoot || 0 // 底部数据高度
      data[1][1] = tablePaddingTop + tablePaddingBottom + (heights.tableHead || 0) // 表格数据高度
      data[2][0] = pageCount
      // 表格宽度
      for (let i = 0, l = content.length; i < l; i++) {
        const item = content[i]
        const maxLine = Math.max.apply(null, item.lines)
        sum += getTrItemH(maxLine)
        data[1][1] += getTrItemH(maxLine)
        if (sum > this.state.pageH) {
          data[1][1] -= getTrItemH(maxLine) // 因为是截止到当前个数的时候 该个数不在当前的数组范围内 所以需要减去当前的高度
          data[1][3] = data[1][0] + data[1][1] + data[1][2] // 赋值当前页面数据高度
          return i
        }
      }
      data[1][3] = data[1][0] + data[1][1] + data[1][2] // 赋值当前页面数据高度
      return -1
    }

    split = (printBlocks: any, pageCount: number = 0, blockCount?: number, blockSplit?: boolean) => {
      const { debug = false, end, startTime = 0, blockCount: blockCountState = 0 } = this.state
      if (end) {
        // 打印完成
        return
      }
      const blockIndex = blockCount === undefined ? blockCountState : blockCount

      // console.log(printBlocks, blockIndex, pageCount)
      if (blockIndex === printBlocks.length) {
        // 只有remainFixed为true的时候才会进入此运行
        this.setData(pageCount, blockIndex, printBlocks, false, debug, startTime)
        return
      }

      const curentBlock = printBlocks[blockIndex]
      const tableData = curentBlock.tableData
      const length = tableData.length
      // 每次对最后一个元素重新计算 除了最后一个的其他元素全部回塞进新的数组
      const preData = tableData.slice(0, length - 1)
      const lastData = tableData[length - 1]
      const reachIndex = this.getContentReachA4Index(lastData, curentBlock, pageCount, blockSplit)
      let newPrintBlocks: any = []
      if (reachIndex > 0) {
        newPrintBlocks = [
          ...printBlocks.slice(0, blockIndex),
          {
            ...printBlocks[blockIndex],
            tableData: [
              ...preData,
              [lastData[0].slice(0, reachIndex), lastData[1], lastData[2]], // 塞入reachIndex之前计算的数据
              [lastData[0].slice(reachIndex), [], []] // 继续把分割的数据塞入后面, 下一次reRender会计算
            ]
          },
          ...printBlocks.slice(blockIndex + 1)
        ]
        if (pageCount && (pageCount % 1000 === 0)) {
          setTimeout(() => {
            this.split(newPrintBlocks, pageCount + 1, blockIndex, false)
          }, 0)
        } else {
          this.split(newPrintBlocks, pageCount + 1, blockIndex, false)
        }
      } else {
        // 计算完成了 只需要重新塞入数据即可 只需要重新渲染
        newPrintBlocks = [
          ...printBlocks.slice(0, blockIndex),
          {
            ...printBlocks[blockIndex],
            tableData: [
              ...preData,
              [...lastData]
            ]
          },
          ...printBlocks.slice(blockIndex + 1)
        ]

        // 是否还需要计算
        const isCalculate = blockIndex + 1 !== newPrintBlocks.length

        if (curentBlock.remainFixed) {
          // 假如没有计算完成 且 固定顶高度 底高 表头高 不需要为了计算高度值重新setState
          this.split(newPrintBlocks, pageCount, blockIndex + 1, true)
          return
        }

        // 计算完成之后 需要重新setState
        this.setData(pageCount, blockIndex + 1, newPrintBlocks, isCalculate, debug, startTime)
      }
    }

    setData = (pageCount: number, blockCount: number, printBlocks: any, isCalculate: boolean, debug: boolean, startTime: number) => {
      if (!isCalculate) {
        const endTime = +new Date()
        console.log(this.state.printBlocks, startTime, endTime, endTime - startTime, 'end')
      }
      this.setState({
        pageCount,
        blockCount,
        printBlocks: this.formatPrintBlocksByWrapIndex(printBlocks),
        loading: isCalculate,
        isCalculate
      }, () => {
        if (this.state.isCalculate) {
          // 还在计算的话 就不需要运行下面的方法
          return
        }
        if (debug) {
          const endTime = +new Date()
          console.log(this.state.printBlocks, startTime, endTime, endTime - startTime, 'end')
          return
        }
        if (this.printRef) {
          this.printRef.handlePrint()
        }
      })
    }

    formatPrintBlocksByWrapIndex = (printBlocks: any[]) => {
      const printBlocksMap = groupBy(printBlocks, 'wrapIndex')
      const tableDataMap: { [k: number]: any } = Object.entries(printBlocksMap).reduce((pre, [k, v]) => {
        return {
          ...pre,
          [k]: v.reduce((collect, item) => {
            return [...collect, ...(item.tableData.map((tableItem: any) => tableItem[0]))]
          }, [])
        }
      }, {})
      return printBlocks.reduce((pre, next) => {
        if (next.wrapIndex === undefined) {
          return [
            ...pre,
            next
          ]
        }
        const currentWrap = tableDataMap[next.wrapIndex]
        return [
          ...pre,
          {
            ...next,
            tableData: next.tableData.map((tableItem: any) => {
              tableItem[3] = [
                (currentWrap.findIndex((item: any) => item === tableItem[0]) || 0) + 1,
                currentWrap.length
              ]
              return tableItem
            })
          }
        ]
      }, [])
    }

    render () {
      const {
        debug,
        fixed,
        loading,
        printBlocks,
        direction,
        pageCount,
        pageW,
        pageH,
        onAfterPrint,
        init,
        isCalculate
      } = this.state

      const blockSize = printBlocks.length

      console.log(printBlocks, loading, 'render')

      return (
        <div>
          <Spin spinning={loading}>
            <Wrapper print={this.print} {...this.props} />
            {
              init && (
                <>
                  <ReactToPrint
                    pageStyle={`@page { size: ${direction}; } @media print { body { -webkit-print-color-adjust: exact; } }`}
                    ref={ref => { this.printRef = ref }}
                    trigger={() => <div />}
                    content={() => this.contentRef}
                    onBeforePrint={() => {
                      // this.setState({
                      //   loading: true
                      // })
                    }}
                    onAfterPrint={() => {
                      this.setState({
                        loading: false,
                        blockCount: 0,
                        pageCount: 0,
                        end: true,
                        init: false
                      }, () => {
                        if (onAfterPrint) {
                          onAfterPrint()
                        }
                      })
                    }}
                  />
                  <div
                    style={
                      debug
                        ? {} : {
                          // position: 'absolute',
                          // left: '-999999px',
                          // top: '-999999px',
                          // visibility: 'hidden',
                          // zIndex: -999999
                        }
                    }
                  >
                    <div
                      ref={ref => { this.contentRef = ref }}
                      style={{ width: pageW }}
                      className={styles['print-content']}
                    >
                      {
                        printBlocks.map(({ padding, ...block }, i) => {
                          return (
                            <PrintBlock
                              {...block}
                              isCalculate={isCalculate}
                              fixed={fixed}
                              key={i}
                              index={i}
                              blockSize={blockSize}
                              pageSize={pageCount}
                              pageW={pageW}
                              pageH={pageH}
                              style={{
                                height: fixed ? pageH : 'auto',
                                padding
                              }}
                            />
                          )
                        })
                      }
                    </div>
                  </div>
                </>
              )
            }
          </Spin>
        </div>
      )
    }
  }
}

export default TablePrintWrap
