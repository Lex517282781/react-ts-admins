import React, { PureComponent, Fragment } from 'react'
import ReactToPrint from 'react-to-print'
import Block from './components/Block'
import { PrintItem, PrintConfig } from './config/interface'
import {
  mm2px,
  getA4W,
  getA4H
} from './config/util'
import { defaultConfig } from './config/config'
import styles from './style.module.styl'

const a4W = getA4W()
const a4H = getA4H()
const marginTop = mm2px(10)
const marginRight = mm2px(10)
const marginBottom = mm2px(10)
const marginLeft = mm2px(10)
interface SheetPrintState {
  blocks: PrintItem[]
  preBlocks: PrintItem[]
  direction?: 'landscape' | 'portrait'
  debug?: boolean
  /* 计算完成 */
  finish: boolean
  init: boolean
  margin?: number
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
      direction: 'portrait',
      debug: false,
      finish: false,
      init: false,
      margin: 0
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

      this.setState(
        {
          preBlocks: option,
          ...config,
          finish: false,
          init: true
        },
        () => {
          this.calculate()
        }
      )
    }

    calculate = () => {
      const { preBlocks } = this.state
      const blocks = preBlocks.reduce((pre: any, next: any) => {
        return [
          ...pre,
          ...(this.processBlock(next))
        ]
      }, [])
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

    processBlock = (block: PrintItem) => {
      const { direction } = this.state
      const { dataSource, _headerH = 0, _footerH = 0, _thH = 0 } = block
      let pageHeight = a4H - marginTop - marginBottom
      if (direction === 'landscape') {
        pageHeight = a4W - marginTop - marginBottom
      } else if (direction === 'portrait') {
        pageHeight = a4H - marginTop - marginBottom
      }
      console.log(pageHeight, 'pageHeight')
      const maxTableHeight = pageHeight - _headerH - _footerH - _thH - 1
      const dataSourceDivs: any[] = []
      const l = dataSource.length
      let splitIndex = 0
      let i = 0
      let sum = 0
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
      return dataSourceDivs.map(item => ({
        ...block,
        dataSource: item
      }))
    }

    render () {
      const { preBlocks, blocks, direction, finish, init, margin } = this.state
      let pageWidth = a4W - marginRight - marginLeft
      let size = '210mm 297mm'
      if (direction === 'landscape') {
        pageWidth = a4H - marginRight - marginLeft
        size = '297mm 210mm'
      } else if (direction === 'portrait') {
        pageWidth = a4W - marginRight - marginLeft
        size = '210mm 297mm'
      }

      return (
        <div>
          <Component print={this.print} {...this.props} />
          {
            init && (
              <>
                <ReactToPrint
                  pageStyle={`@page { size: ${size}; margin: ${margin}mm; }`}
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
                    background: 'red'
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
