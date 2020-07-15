import React, { PureComponent } from 'react'
import { Colum } from '../config/interface'

interface TableTHeadTrProps {
  data: any
  remainFixed?: boolean
  colums: Colum[]
}

class TableTHeadTr extends PureComponent<TableTHeadTrProps> {
  trRef: HTMLTableRowElement | null = null
  componentDidMount () {
    const { data, remainFixed } = this.props
    if (!remainFixed) {
      data.tableHead = this.trRef?.offsetHeight
    }
  }

  render () {
    const { colums = [], data } = this.props
    return (
      <tr style={{ height: data.tableHead || 'auto' }} ref={ ref => { this.trRef = ref } }>
        {
          colums.map((item: Colum) => (
            <th
              key={item.key}
              style={{ width: item.width || item.calcWidth || 'auto' }}
            >
              {item.title}
            </th>
          ))
        }
      </tr>
    )
  }
}

export default TableTHeadTr
