import React, { PureComponent } from 'react'
import ReactToPrint from 'react-to-print'
import PrintBlock from './components/PrintBlock'
import {
  PrintItem,
  PrintOption,
  PrintConfig
} from './config/interface'
import styles from './style.module.styl'
import './style.styl'

export interface PrintProps {
  print: (option: PrintOption, config?: PrintConfig | boolean) => void
}

interface PrintState {
  printBlocks: PrintItem[]
  debug?: boolean
  onAfterPrint?: () => void
}

function PrintWrap <T = any> (Wrapper: React.ComponentType<T>) {
  return class Print extends PureComponent<T, PrintState> {
    contentRef: HTMLDivElement | null = null
    printRef: any
    state: PrintState = {
      printBlocks: [],
      debug: false
    }

    print = (option: PrintOption, config?: PrintConfig | boolean) => {
      option = Array.isArray(option) ? option : [option]
      config = typeof config === 'boolean'
        ? { debug: config }
        : { ...(config || {}) }
      this.setState({
        printBlocks: option
      }, () => {
        if (this.printRef) {
          this.printRef.handlePrint()
        }
      })
    }

    render () {
      const { printBlocks } = this.state
      const direction = 'landscape'
      return (
        <div>
          <Wrapper print={this.print} {...this.props} />
          <ReactToPrint
            pageStyle={`@page { size: ${direction}; margin: 10mm; } @media print { body { -webkit-print-color-adjust: exact; } }`}
            ref={ref => { this.printRef = ref }}
            content={() => this.contentRef}
            trigger={() => <div />}
            onBeforePrint={() => {}}
            onAfterPrint={() => {}}
          />
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
      )
    }
  }
}

export default PrintWrap
