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
    data.h = this.trRef?.offsetHeight
  }

  render () {
    const { colums = [], data } = this.props
    return (
      <tr ref={ ref => { this.trRef = ref } }>
        {
          colums.map((col, j) => (
            <td key={j}>
              {
                data[col.key]
              }
            </td>
          ))
        }
      </tr>
    )
  }
}

export default TableTbodyTr
