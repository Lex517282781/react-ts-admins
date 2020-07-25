import React, { PureComponent, Fragment } from 'react'
import {
  Colums
} from '../config/interface'
import styles from '../style.module.styl'

interface PrintBlockProps {
  /* 表格表头字段 */
  colums?: Colums
  /* 表格上部分 */
  head?: React.ReactNode
  /* 表格内容部分 */
  data?: any[]
  /* 表格底部分 */
  foot?: React.ReactNode
  /* 组件内部元素 */
  children?: React.ReactNode
}

class PrintBlock extends PureComponent<PrintBlockProps> {
  render () {
    const { colums = [], head = null, data = [], foot = null } = this.props
    let children = this.props.children
    children = Array.isArray(children)
      ? children
      : [children]

    const count = React.Children.count(children)
    let headContent = null
    let bodyContent = null
    let footContent = null

    if (count === 1) {
      bodyContent = React.Children.map(children, (child, i) => {
        return (
          <Fragment key={i}>
            {child}
          </Fragment>
        )
      })
    } else if (count !== 0) {
      // child中子元素超过1个元素 那么第一个元素作为头部元素 第二个元素作为中间元素, 第三个及以上作为底部元素
      headContent = React.Children.map(
        React.Children.toArray(
          children
        ).slice(0, 1),
        (child, i) => {
          return (
            <Fragment key={i}>
              {child}
            </Fragment>
          )
        }
      )
      bodyContent = React.Children.map(
        React.Children.toArray(
          children
        ).slice(1, 2),
        (child, i) => {
          return (
            <Fragment key={i}>
              {child}
            </Fragment>
          )
        }
      )
      footContent = React.Children.map(
        React.Children.toArray(
          children
        ).slice(2),
        (child, i) => {
          return (
            <Fragment key={i}>
              {child}
            </Fragment>
          )
        }
      )
    }

    return (
      <div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th colSpan={colums.length}>
                <div>{head}</div>
                <div>{headContent}</div>
                {
                  (!!colums.length) && (
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          {
                            colums.map((item) => <th key={item.key}>{item.title}</th>)
                          }
                        </tr>
                      </thead>
                    </table>
                  )
                }
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={colums.length}>
                {
                  (!!data.length) && (
                    <table className={styles.table}>
                      <tbody>
                        {
                          data.map((row: any, i: number) => (
                            <tr key={i}>
                              {
                                colums.map((col, j) => (
                                  <td key={j}>
                                    {
                                      row[col.key]
                                    }
                                  </td>
                                ))
                              }
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  )
                }
                {bodyContent}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={colums.length}>
                {foot}
                {footContent}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    )
  }
}

export default PrintBlock
