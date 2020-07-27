import React, { PureComponent } from 'react'
import ReactToPrint from 'react-to-print'
import PrintBlock from './components/PrintBlock'
import {
  PrintItem,
  PrintOption,
  PrintConfig
} from './config/interface'
import * as defaultConfig from './config/config'

export interface PrintProps {
  print: (option: PrintOption, config?: PrintConfig | boolean) => void
}

interface PrintState {
  printBlocks: PrintItem[]
  /* 打印方向 */
  direction?: string
  margin?: number
  init?: boolean
  debug?: boolean
  onAfterPrint?: () => void
}

function PrintWrap <T = any> (Wrapper: React.ComponentType<T>) {
  return class Print extends PureComponent<T, PrintState> {
    contentRef: HTMLDivElement | null = null
    printRef: any
    state: PrintState = {
      printBlocks: [],
      init: false,
      debug: false
    }

    print = (option: PrintOption, config?: PrintConfig | boolean) => {
      option = Array.isArray(option) ? option : [option]
      config = typeof config === 'boolean'
        ? { ...defaultConfig, debug: config }
        : { ...defaultConfig, ...(config || {}) }
      this.setState({
        printBlocks: option,
        init: true,
        ...config
      }, () => {
        if (this.printRef && (!this.state.debug)) {
          this.printRef.handlePrint()
        }
      })
    }

    render () {
      const { printBlocks, debug, direction, margin } = this.state

      return (
        <div>
          <Wrapper print={this.print} {...this.props} />
          <ReactToPrint
            pageStyle={`
              @page { size: ${direction}; margin: ${margin}mm; } 
              @media print { body { -webkit-print-color-adjust: exact; } }`
            }
            ref={ref => { this.printRef = ref }}
            content={() => this.contentRef}
            trigger={() => <div />}
            onBeforePrint={() => {}}
            onAfterPrint={() => {}}
          />
          <div
            style={
              debug ? {} : {
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
            >
              {
                printBlocks.map((item: PrintItem, i: number) => {
                  return (
                    <PrintBlock key={i} {...item} />
                  )
                })
              }
            </div>
          </div>
        </div>
      )
    }
  }
}

export default PrintWrap
