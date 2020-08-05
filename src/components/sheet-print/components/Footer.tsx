import React, { PureComponent } from 'react'
import { PrintItem } from '../config/interface'
interface FooterProps {
  data: PrintItem
}

class Footer extends PureComponent<FooterProps> {
  footerRef: HTMLDivElement | null = null
  componentDidMount () {
    const { data } = this.props
    data._footerH = this.footerRef?.offsetHeight || 0
  }

  render () {
    const { data } = this.props
    const { footer } = data
    const style: React.CSSProperties = {}
    let footerEl = null
    if (data._footerH) {
      style.height = data._footerH
    }
    if (typeof footer === 'function') {
      footerEl = footer()
    } else {
      footerEl = footer
    }
    return (
      <div
        style={style}
        ref={ ref => { this.footerRef = ref } }
      >
        {footerEl}
      </div>
    )
  }
}

export default Footer
