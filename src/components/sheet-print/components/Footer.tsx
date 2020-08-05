import React, { PureComponent } from 'react'

interface FooterProps {
  children?: React.ReactNode
}

class Footer extends PureComponent<FooterProps> {
  footerRef: HTMLDivElement | null = null
  componentDidMount () {
  }

  render () {
    const { children } = this.props

    return (
      <div
        ref={ ref => { this.footerRef = ref } }
      >
        {children}
      </div>
    )
  }
}

export default Footer
