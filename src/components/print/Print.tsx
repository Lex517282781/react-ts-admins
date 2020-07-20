import React, { PureComponent, Fragment } from 'react'
import {
  Colums
} from './config/interface'
import styles from './style.module.styl'
import './style.styl'

interface Props {
  /* 表格表头字段 */
  colums?: Colums
  /* 表格上部分 */
  head?: React.ReactNode
  /* 表格内容部分 */
  body?: any[]
  /* 表格底部分 */
  foot?: React.ReactNode
  children?: React.ReactNode
}

class Print extends PureComponent<Props> {
  render () {
    const { colums = [], head = null, body = [], foot = null } = this.props
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
                  (!!body.length) && (
                    <table className={styles.table}>
                      <tbody>
                        {
                          body.map((row: any, i: number) => (
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

export default Print
