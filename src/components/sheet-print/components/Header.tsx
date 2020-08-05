import React, { PureComponent } from 'react'
import { PrintItem } from '../config/interface'
interface HeaderProps {
  data: PrintItem
}

class Header extends PureComponent<HeaderProps> {
  headerRef: HTMLDivElement | null = null
  componentDidMount () {
    const { data } = this.props
    data._headerH = this.headerRef?.offsetHeight || 0
  }

  render () {
    const { data } = this.props
    const { header } = data
    const style: React.CSSProperties = {}
    let headEl = null
    if (data._headerH) {
      style.height = data._headerH
    }
    if (typeof header === 'function') {
      headEl = header()
    } else {
      headEl = header
    }
    return (
      <div
        style={style}
        ref={ ref => { this.headerRef = ref } }
      >
        {headEl}
      </div>
    )
  }
}

export default Header
