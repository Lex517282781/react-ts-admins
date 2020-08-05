import React, { PureComponent } from 'react'
import Header from './Header'
import Footer from './Footer'
import ThRow from './ThRow'
import TdRow from './TdRow'
import { PrintItem } from '../config/interface'
import styles from '../style.module.styl'

interface BlockProps {
  index: number
  data: PrintItem
}

class Block extends PureComponent<BlockProps> {
  componentDidMount () {}

  render () {
    const { index, data } = this.props
    const { colums, dataSource } = data

    return (
      <div className={styles.block}>
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
        <div className={styles.footer}>
          <Footer data={data} />
        </div>
      </div>
    )
  }
}

export default Block
