import React, { PureComponent } from 'react'
import { Colum } from '../config/interface'

interface TableTbodyTrTempProps {
  line?: number
  colums?: Colum[]
}

class TableTbodyTrTemp extends PureComponent<TableTbodyTrTempProps> {
  trRef: HTMLTableRowElement | null = null
  componentDidMount () {
    const { line } = this.props
    // data.h = this.trRef?.offsetHeight || 0
  }

  render () {
    const { colums = [], line = 1 } = this.props
    return (
      <table>
        <tbody>
          <tr ref={ ref => { this.trRef = ref } }>
            {
              [1].map((_, j) => (
                <td key={j}>
                  {/* {
                data[col.key]
              } */}
                  {
                    [...new Array(line)].map((__, i) => (
                      <div key={i}>0</div>
                    ))
                  }
                </td>
              ))
            }
          </tr>
        </tbody>
      </table>
    )
  }
}

export default TableTbodyTrTemp
