import React, { Component } from 'react'
import Barcode from 'jsbarcode'

interface Props {
  width?: number
  height?: number
  quite?: number
  format?: string
  displayValue?: boolean
  margin?: number
  label?: string
  className?: any
}

class Main extends Component<Props> {
  public barcode: any
  public componentDidMount () {
    this.createBarcode()
  }

  public createBarcode = () => {
    if (!this.barcode) {
      return
    }
    const {
      width = 2, height = 10, margin = 5, label, displayValue = false
    } = this.props
    if (!label) {
      return
    }
    Barcode(this.barcode, label, {
      format: 'CODE128',
      displayValue,
      width,
      height,
      margin
    })
  }

  public render () {
    const {
      className
    } = this.props
    return (
      <div className={className}>
        <svg
          style={{ width: '100%', height: '100%' }}
          ref={(ref) => {
            this.barcode = ref
          }}
        />
      </div>
    )
  }
}
export default Main
