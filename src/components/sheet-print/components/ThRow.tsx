import React, { PureComponent } from 'react'
import { Colum } from '../config/interface'
import styles from '../style.module.styl'

interface ThRowProps {
  data: { _thH?: number; [k: string]: any }
  colums: Colum[]
}

class ThRow extends PureComponent<ThRowProps> {
  thRowRef: HTMLTableRowElement | null = null
  componentDidMount () {
    const { data } = this.props
    data._thH = this.thRowRef?.offsetHeight || 0
  }

  render () {
    const { colums = [], data } = this.props
    const style: React.CSSProperties = {}
    if (data._thH) {
      style.height = data._thH
    }

    return (
      <tr
        className={styles.tr}
        style={style}
        ref={(ref) => {
          this.thRowRef = ref
        }}
      >
        {colums.map((item: Colum) => (
          <th className={styles.td} key={item.key}>{item.title}</th>
        ))}
      </tr>
    )
  }
}

export default ThRow
