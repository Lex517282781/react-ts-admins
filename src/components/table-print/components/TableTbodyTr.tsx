import React, { PureComponent } from 'react'
import { Colum } from '../config/interface'

const ZH_W = 14
const EH_W = 10

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
          colums.map((col, j) => {
            const colStr = String(
              (data[col.key] !== undefined && data[col.key] !== null) ? data[col.key] : '-'
            )
            const width = /[\u4e00-\u9fa5]+/.test(colStr) ? ZH_W : EH_W

            return (
              <td key={j}>
                {
                  (
                    colStr
                      .split('') || [])
                    .map((colItem: any, i: number) => (
                      <span
                        style={{ width }}
                        key={i}
                      >
                        {colItem}
                      </span>
                    ))
                }
              </td>
            )
          })
        }
      </tr>
    )
  }
}

export default TableTbodyTr
