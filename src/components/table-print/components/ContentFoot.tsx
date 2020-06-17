import React, { PureComponent } from 'react'
import styles from '../style.module.styl'

interface ContentHeadProps {
  data?: any
  children?: React.ReactNode
  fixed?: boolean
  /* 样式 */
  style?: React.CSSProperties
}

class ContentFoot extends PureComponent<ContentHeadProps> {
  contentFootRef: HTMLDivElement | null = null
  componentDidMount () {
    const { data } = this.props
    if (data) {
      data.contentFoot = this.contentFootRef?.offsetHeight || 0
    }
  }

  render () {
    const { children, fixed, style = {} } = this.props

    let newStyle = { ...style }
    if (fixed) {
      newStyle = {
        ...style,
        position: 'absolute',
        width: '100%',
        bottom: 0,
        left: 0
      }
    }
    return (
      <div
        ref={ ref => { this.contentFootRef = ref } }
        className={styles['content-foot']}
        style={newStyle}
      >
        {children}
      </div>
    )
  }
}

export default ContentFoot
