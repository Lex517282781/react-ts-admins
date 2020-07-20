import React, { PureComponent } from 'react'
import { Spin } from 'antd'
import ReactToPrint from 'react-to-print'
import PrintBlock from './components/PrintBlock'
import { getA4W, getA4H, getTrItemH } from './config/util'
import * as defaultConfig from './config/config'
import { PrintItem, PrintOption, PrintBlockItem, PrintConfig, Colum } from './config/interface'
import styles from './style.module.styl'

const a4W = getA4W()
const a4H = getA4H()

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
      pageW: a4W,
      pageH: a4H,
      init: false
    }

    componentDidUpdate (preProps: T, preState: TablePrintState) {
      const { pageCount } = this.state
      const { pageCount: prePageCount } = preState
      if (pageCount && (prePageCount === pageCount)) {
        return
      }
      if (pageCount && (pageCount % 50 === 0)) {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          // 这里需要注意在setTimeout里面调用setState因为state不再自动合并, 尽量手动合并, 使用一次
          // 注意：https://segmentfault.com/q/1010000015805834
          this.reRender()
        }, 30)
      } else {
        this.reRender()
      }
    }

    /* 打印 */
    print = (option: PrintOption, config?: PrintConfig | boolean) => {
      option = Array.isArray(option) ? option : [option]
      config = typeof config === 'boolean'
        ? { ...defaultConfig, debug: config }
        : { ...defaultConfig, ...(config || {}) }
      const printBlocks = option.map(item => ({
        ...item,
        tableData: item.dataSource ? [[item.dataSource, [], [], []]] : [],
        heights: {}
      }))
      const state = {
        printBlocks,
        blockCount: 0,
        pageCount: 0,
        end: false,
        isCalculate: true,
        startTime: +new Date(),
        ...config,
        loading: !!config.init
      } as TablePrintState

      if (config.direction === 'portrait') {
        state.pageW = a4W
        state.pageH = a4H
      } else if (config.direction === 'landscape') {
        state.pageW = a4H
        state.pageH = a4W
      }

      if (config?.onAfterPrint) {
        state.onAfterPrint = config.onAfterPrint
      }

      this.setState(state)
    }

    /* 获取内容到到a4 计算获得该内容的内部索引 */
    getContentReachA4Index = (data: any = [], info: PrintBlockItem, pageCount: number) => {
      const { heights, tablePaddingTop = 0, tablePaddingBottom = 0, padding = 0 } = info
      let sum = Object.values(heights).reduce((pre: number, next: number) => pre + next, 0)
      sum += tablePaddingTop + tablePaddingBottom + padding * 2
      const content = data[0]
      data[1][0] = heights.contentHead || 0 // 顶部数据高度
      data[1][2] = heights.contentFoot || 0 // 底部数据高度
      data[1][1] = tablePaddingTop + tablePaddingBottom + (heights.tableHead || 0) // 表格数据高度
      data[2][0] = pageCount
      for (let i = 0, l = content.length; i < l; i++) {
        const item = content[i]
        sum += item.h
        data[1][1] += item.h
        if (sum > this.state.pageH) {
          data[1][1] -= item.h // 因为是截止到当前个数的时候 该个数不在当前的数组范围内 所以需要减去当前的高度
          data[1][3] = data[1][0] + data[1][1] + data[1][2] // 赋值当前页面数据高度
          return i
        }
      }
      data[1][3] = data[1][0] + data[1][1] + data[1][2] // 赋值当前页面数据高度
      return -1
    }

    reRender = () => {
      const { debug, blockCount, pageCount, printBlocks, end, startTime = 0 } = this.state
      if (end) {
        // 打印完成
        return
      }
      if (blockCount === printBlocks.length) {
        // 此处已经渲染计算完毕 可以打印
        if (debug) {
          this.setState({
            loading: false,
            isCalculate: false
          })
          const endTime = +new Date()
          console.log(this.state.printBlocks, startTime, endTime, endTime - startTime)
          return
        }
        this.setState({
          isCalculate: false
        })
        if (this.printRef) {
          this.printRef.handlePrint()
        }
        return
      }
      const curentBlock = printBlocks[blockCount]
      const tableData = curentBlock.tableData
      const length = tableData.length
      // 每次对最后一个元素重新计算 除了最后一个的其他元素全部回塞进新的数组
      const preData = tableData.slice(0, length - 1)
      const lastData = tableData[length - 1]
      const reachIndex = this.getContentReachA4Index(lastData, curentBlock, pageCount)
      const newState: any = {
        pageCount: pageCount + 1
      }
      if (reachIndex > 0) {
        newState.printBlocks = [
          ...printBlocks.slice(0, blockCount),
          {
            ...printBlocks[blockCount],
            tableData: [
              ...preData,
              [lastData[0].slice(0, reachIndex), lastData[1], lastData[2]], // 塞入reachIndex之前计算的数据
              [lastData[0].slice(reachIndex), [], []] // 继续把分割的数据塞入后面, 下一次reRender会计算
            ]
          },
          ...printBlocks.slice(blockCount + 1)
        ]
      } else {
        // 计算完成了 只需要重新塞入数据即可 只需要重新渲染
        newState.printBlocks = [
          ...printBlocks.slice(0, blockCount),
          {
            ...printBlocks[blockCount],
            tableData: [
              ...preData,
              [...lastData]
            ]
          },
          ...printBlocks.slice(blockCount + 1)
        ]
        newState.blockCount = blockCount + 1
      }
      this.setState(newState)
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

      console.log(printBlocks, init, 'render')

      return (
        <div>
          <Spin spinning={loading}>
            {loading && '加载数据中...'}
            <Wrapper print={this.print} {...this.props} />
            {
              init && (
                <>
                  <ReactToPrint
                    pageStyle={`@page { size: ${direction}; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact; } }`}
                    ref={ref => { this.printRef = ref }}
                    trigger={() => <div />}
                    content={() => this.contentRef}
                    onBeforePrint={() => {
                      this.setState({
                        loading: true
                      })
                    }}
                    onAfterPrint={() => {
                      this.setState({
                        loading: false,
                        blockCount: 0,
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
