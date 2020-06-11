import React, { PureComponent } from 'react'
import { Colum } from '../config/interface'

interface TableTHeadTrProps {
  data: any
  colums: Colum[]
}

class TableTHeadTr extends PureComponent<TableTHeadTrProps> {
  trRef: HTMLTableRowElement | null = null
  componentDidMount () {
    const { data } = this.props
    data.tableHead = this.trRef?.offsetHeight
  }

  render () {
    const { colums = [] } = this.props
    return (
      <tr ref={ ref => { this.trRef = ref } }>
        {
          colums.map((item: Colum) => <th key={item.key}>{item.title}</th>)
        }
      </tr>
    )
  }
}

export default TableTHeadTr
