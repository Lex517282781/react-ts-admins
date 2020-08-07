import React, { PureComponent } from 'react'
import Header from './Header'
import Footer from './Footer'
import ThRow from './ThRow'
import TdRow from './TdRow'
import { PrintItem } from '../config/interface'
import styles from '../style.module.styl'

interface BlockProps {
  pageHeight: number
  index: number
  data: PrintItem
}

class Block extends PureComponent<BlockProps> {
  componentDidMount () {}

  render () {
    const { index, data, pageHeight } = this.props
    const { colums, dataSource, fixed } = data

    return (
      <div
        style={
          fixed ? {
            height: pageHeight
          } : {}
        }
        className={styles.block}
      >
        <div className={styles.header}>
          <Header data={data} />
        </div>
        <div className={styles.content}>
          <table>
            <thead>
              <ThRow colums={colums} data={data} />
            </thead>
            <tbody>
              {dataSource.map((item, j) => {
                return (
                  <TdRow
                    key={index + '-' + j}
                    colums={colums}
                    data={item}
                  />
                )
              })}
            </tbody>
          </table>
        </div>
        <div
          className={styles.footer}
          style={
            fixed ? {
              position: 'absolute',
              width: '100%',
              bottom: 0
            } : {}
          }
        >
          <Footer data={data} />
        </div>
      </div>
    )
  }
}

export default Block
