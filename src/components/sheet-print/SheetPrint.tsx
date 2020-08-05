import React, { PureComponent } from 'react'
import { PrintItem, PrintConfig } from './config/interface'
import Block from './components/Block'
import {
  mm2px,
  getA4W,
  getA4H,
  getTrItemH
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
}

function SheetPrintWrap<T = any> (
  Component: React.ComponentType<T>
) {
  return class SheetPrint extends PureComponent<
    T,
    SheetPrintState
  > {
    state: SheetPrintState = {
      blocks: [],
      preBlocks: [],
      direction: 'portrait',
      debug: false
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
          ...config
        },
        () => {
          this.calculate()
        }
      )
    }

    calculate = () => {
      const { preBlocks } = this.state
      console.log(preBlocks, 'preBlocks')
    }

    render () {
      const { preBlocks, direction } = this.state
      let pageWidth = a4W
      if (direction === 'landscape') {
        pageWidth = a4H
      } else if (direction === 'portrait') {
        pageWidth = a4W
      }
      return (
        <div>
          <Component print={this.print} {...this.props} />
          <div
            style={{
              width: pageWidth
            }}
            className={styles['print-content']}
          >
            {preBlocks.map((item: PrintItem, i) => (
              <Block key={i} data={item} />
            ))}
          </div>
        </div>
      )
    }
  }
}

export default SheetPrintWrap
