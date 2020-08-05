import React, { PureComponent } from 'react'

interface HeaderProps {
  children?: React.ReactNode
}

class Header extends PureComponent<HeaderProps> {
  headerRef: HTMLDivElement | null = null
  componentDidMount () {
  }

  render () {
    const { children } = this.props

    return (
      <div
        ref={ ref => { this.headerRef = ref } }
      >
        {children}
      </div>
    )
  }
}

export default Header
