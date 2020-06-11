import React, { PureComponent } from 'react'
import styles from '../style.module.styl'

interface ContentHeadProps {
  data?: any
  children?: React.ReactNode
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
    const { children } = this.props
    return (
      <div ref={ ref => { this.contentHeadRef = ref } } className={styles['content-head']}>
        {children}
      </div>
    )
  }
}

export default ContentHead
