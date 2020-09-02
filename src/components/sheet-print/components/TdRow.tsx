import React, { PureComponent } from 'react'
import { Colum } from '../config/interface'
import styles from '../style.module.styl'

interface TdRowProps {
  data: { _h?: number; [k: string]: any }
  colums: Colum[]
}

class TdRow extends PureComponent<TdRowProps> {
  tdRowRef: HTMLTableRowElement | null = null
  componentDidMount () {
    const { data } = this.props
    data._h = this.tdRowRef?.offsetHeight || 0
  }

  render () {
    const { colums = [], data } = this.props
    const style: React.CSSProperties = {}
    if (data._h) {
      style.height = data._h
    }

    return (
      <tr
        className={styles.tr}
        style={style}
        ref={(ref) => {
          this.tdRowRef = ref
        }}
      >
        {colums.map((item: Colum) => (
          <td style={{ textAlign: item.align }} className={styles.td} key={item.key}>
            {
              item.render ? item.render(data[item.key], data) : data[item.key]
            }
          </td>
        ))}
      </tr>
    )
  }
}

export default TdRow
