import React, { PureComponent, Fragment } from 'react'
import ReactToPrint from 'react-to-print'
import Block from './components/Block'
import Decimal from 'decimal.js'
import { PrintItem, PrintConfig, Colum } from './config/interface'
import {
  mm2px,
  getA4W,
  getA4H
} from './config/util'
import { defaultConfig } from './config/config'
import styles from './style.module.styl'

const a4W = getA4W()
const a4H = getA4H()
interface SheetPrintState {
  blocks: PrintItem[]
  preBlocks: PrintItem[]
  direction?: 'landscape' | 'portrait'
  debug?: boolean
  /* 计算完成 */
  finish: boolean
  init: boolean
  /* 打印边距 */
  margin?: number | string
  pageWidth: number
  pageHeight: number
}

function SheetPrintWrap<T = any> (
  Component: React.ComponentType<T>
) {
  return class SheetPrint extends PureComponent<
    T,
    SheetPrintState
  > {
    contentRef: HTMLDivElement | null = null
    printRef: any
    state: SheetPrintState = {
      blocks: [],
      preBlocks: [],
      debug: false,
      finish: false,
      init: false,
      pageWidth: 0,
      pageHeight: 0
    }

    print = (
      option?: PrintItem | PrintItem[],
      config?: PrintConfig | boolean
    ) => {
      if (!option) {
        console.warn('least one parameter needed')
        return false
      }
      option = Array.isArray(option) ? option : [option]
      config = (typeof config === 'boolean'
        ? { ...defaultConfig, debug: config }
        : {
          ...defaultConfig,
          ...config || {}
        }) as PrintConfig

      const [
        marginTop = 0,
        marginRight = 0,
        marginBottom = 0,
        marginLeft = 0
      ] = this.getMargin(config.margin || 0)

      let pageWidth = 0
      let pageHeight = 0
      if (config.direction === 'landscape') {
        pageHeight = a4W - mm2px(marginTop) - mm2px(marginBottom)
        pageWidth = a4H - mm2px(marginRight) - (marginLeft)
      } else if (config.direction === 'portrait') {
        pageHeight = a4H - mm2px(marginTop) - mm2px(marginBottom)
        pageWidth = a4W - mm2px(marginRight) - mm2px(marginLeft)
      }
      this.setState(
        {
          preBlocks: option,
          ...config,
          finish: false,
          init: true,
          pageWidth,
          pageHeight
        },
        () => {
          this.calculate()
        }
      )
    }

    /* 计算自动填充Colums中没有width的值 */
    formatColums = (blocks: PrintItem[], pageWidth: number): PrintItem[] => {
      return blocks.map(({ colums, ...item }) => {
        const noWidthColums = colums.filter((colItem: Colum) => !colItem.width)
        const noWidthColumsNum = noWidthColums.length
        const widthColumsTotalWidth = colums.filter((colItem: Colum) => !!colItem.width).reduce((pre: number, next: Colum) => {
          if (next.width) {
            if ((/%/).test(next.width)) {
              return pre + new Decimal(Number(next.width.replace('%', ''))).dividedBy(100).times(pageWidth).toNumber()
            } else {
              return pre + Number(next.width.replace('px', ''))
            }
          }
          return pre
        }, 0)
        const restColumsWidth = pageWidth - widthColumsTotalWidth
        noWidthColums.forEach(item => {
          item.width = new Decimal(restColumsWidth).times(100).dividedBy(noWidthColumsNum).dividedBy(pageWidth).toNumber() + '%'
        })

        return {
          ...item,
          colums
        }
      })
    }

    /* 计算 */
    calculate = () => {
      const { preBlocks } = this.state
      const moduleTotal = preBlocks.length
      const blocks = preBlocks.reduce((pre: any, next: any, i: number) => {
        return [
          ...pre,
          ...(this.processBlock(next, i + 1, moduleTotal))
        ]
      }, [])
      const globalPages = blocks.length
      blocks.forEach((block, i) => {
        block._globalPage = i + 1
        block._globalPages = globalPages
      })
      this.setState({
        blocks,
        finish: true
      }, () => {
        console.log(this.state.blocks, 999)
        if (this.state.finish) {
          this.printRef.handlePrint()
        }
      })
    }

    /* 每个block计算 */
    processBlock = (block: PrintItem, moduleIndex: number, moduleTotal: number) => {
      const { pageHeight } = this.state
      const { dataSource, _headerH = 0, _footerH = 0, _thH = 0 } = block
      const maxTableHeight = pageHeight - _headerH - _footerH - _thH - 1
      const dataSourceDivs: any[][] = []
      const l = dataSource.length
      let splitIndex = 0
      let i = 0
      let sum = 0
      // 循环dataSource过去 到sum小于maxTableHeight的时候分割数组 再次循环剩下的dataSource 直到分割完成
      while (i < l) {
        const curItem = dataSource[i]
        sum += curItem._h || 0
        if (sum > maxTableHeight) {
          splitIndex++
          sum = 0
        } else {
          dataSourceDivs[splitIndex] = dataSourceDivs[splitIndex] || []
          dataSourceDivs[splitIndex].push(curItem)
          i++
        }
      }
      return dataSourceDivs.map((item, i) => ({
        ...block,
        dataSource: item,
        _modulePage: i + 1,
        _modulePages: dataSourceDivs.length,
        _moduleIndex: moduleIndex,
        _moduleTotal: moduleTotal
      }))
    }

    getMargin = (margin: number | string): [number, number, number, number] => {
      if (typeof margin === 'number') {
        return [margin, margin, margin, margin]
      } else if (typeof margin === 'string') {
        const marginArr = margin.split(' ')
        switch (marginArr.length) {
        case 1:
          return [+marginArr[0], +marginArr[0], +marginArr[0], +marginArr[0]]
        case 2:
          return [+marginArr[0], +marginArr[1], +marginArr[0], +marginArr[1]]
        case 3:
          return [+marginArr[0], +marginArr[1], +marginArr[2], +marginArr[1]]
        default:
          return [+marginArr[0], +marginArr[1], +marginArr[2], +marginArr[3]]
        }
      } else {
        return [0, 0, 0, 0]
      }
    }

    render () {
      const { preBlocks, blocks, direction, finish, init, margin, pageWidth } = this.state
      const [
        marginTop = 0,
        marginRight = 0,
        marginBottom = 0,
        marginLeft = 0
      ] = this.getMargin(margin || 0)

      let size = '210mm 297mm'
      if (direction === 'landscape') {
        size = '297mm 210mm'
      } else if (direction === 'portrait') {
        size = '210mm 297mm'
      }

      return (
        <div>
          <Component print={this.print} {...this.props} />
          {
            init && (
              <>
                <ReactToPrint
                  pageStyle={`@page { size: ${size}; margin: ${marginTop}mm ${marginRight}mm ${marginBottom}mm ${marginLeft}mm; }`}
                  trigger={() => <div />}
                  ref={ref => { this.printRef = ref }}
                  content={() => this.contentRef}
                  onAfterPrint={() => {
                    this.setState({
                      // init: false
                    })
                  }}
                />
                <div
                  style={{
                    width: pageWidth,
                    margin: '0 auto'
                  }}
                  className={styles['print-content']}
                  ref={ref => { this.contentRef = ref }}
                >
                  {(finish ? blocks : preBlocks).map((item: PrintItem, i) => (
                    <Fragment key={i + JSON.stringify(finish)}>
                      <Block index={i} data={item} />
                      <div style={{ pageBreakAfter: 'always' }} />
                    </Fragment>
                  ))}
                </div>
              </>
            )
          }
        </div>
      )
    }
  }
}

export default SheetPrintWrap
