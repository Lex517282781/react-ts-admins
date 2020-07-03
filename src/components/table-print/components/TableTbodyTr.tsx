import React, { PureComponent } from 'react'
import { Colum } from '../config/interface'

interface TableTbodyTrProps {
  data: any
  colums: Colum[]
}

class TableTbodyTr extends PureComponent<TableTbodyTrProps> {
  trRef: HTMLTableRowElement | null = null
  componentDidMount () {
    const { data } = this.props
    data.h = this.trRef?.offsetHeight || 0
  }

  render () {
    const { colums = [], data } = this.props
    return (
      <tr style={{ height: data.h || 'auto' }} ref={ ref => { this.trRef = ref } }>
        {
          colums.map((col, j) => (
            <td key={j}>
              {
                (
                  String(
                    (data[col.key] !== undefined && data[col.key] !== null) ? data[col.key] : '-'
                  )
                    .trim()
                    .split('') || [])
                  .map((colItem: any, i: number) => (
                    <span key={i}>{colItem}</span>
                  ))
              }
            </td>
          ))
        }
      </tr>
    )
  }
}

export default TableTbodyTr
