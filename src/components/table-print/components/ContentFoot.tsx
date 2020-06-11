import React, { PureComponent } from 'react'
import styles from '../style.module.styl'

interface ContentHeadProps {
  data?: any
  children?: React.ReactNode
}

class ContentFoot extends PureComponent<ContentHeadProps> {
  contentFootRef: HTMLDivElement | null = null
  componentDidMount () {
    const { data } = this.props
    if (data) {
      data.contentFoot = this.contentFootRef?.offsetHeight
    }
  }

  render () {
    const { children } = this.props
    return (
      <div ref={ ref => { this.contentFootRef = ref } } className={styles['content-foot']}>
        {children}
      </div>
    )
  }
}

export default ContentFoot
