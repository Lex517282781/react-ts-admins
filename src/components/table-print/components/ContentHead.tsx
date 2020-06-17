import React, { PureComponent } from 'react'
import styles from '../style.module.styl'

interface ContentHeadProps {
  data?: any
  children?: React.ReactNode
  /* 样式 */
  style?: React.CSSProperties
}

class ContentHead extends PureComponent<ContentHeadProps> {
  contentHeadRef: HTMLDivElement | null = null
  componentDidMount () {
    const { data } = this.props
    if (data) {
      data.contentHead = this.contentHeadRef?.offsetHeight || 0
    }
  }

  render () {
    const { children, style = {} } = this.props
    return (
      <div style={style} ref={ ref => { this.contentHeadRef = ref } } className={styles['content-head']}>
        {children}
      </div>
    )
  }
}

export default ContentHead
