import React, { PureComponent, Fragment } from 'react'
import { defaultColumnWrapProps } from './config/config'

type ColumnWrapProps = {
  children?: React.ReactNode
} & Partial<typeof defaultColumnWrapProps>

class ColumnWrap extends PureComponent<ColumnWrapProps> {
  private static defaultProps = defaultColumnWrapProps

  render () {
    let { children, empty } = this.props
    children = Array.isArray(children)
      ? children
      : [children]

    /* 过滤控制 null 或者 '' */
    const validChildren = (children as Array<
      React.ReactNode
    >).filter(
      (item) => !['', null, undefined].includes(item as any)
    )

    const validChildrenCount: number = React.Children.count(
      validChildren
    )

    if (!validChildrenCount) {
      return empty
    }

    return (
      <div>
        {
          React.Children.map(children, (child, i) => {
            return (
              <Fragment key={i}>
                {child}
              </Fragment>
            )
          })
        }
      </div>
    )
  }
}

export default ColumnWrap
