import React, { PureComponent } from 'react'
import Panel from '@/components/panel'
import TablePrint from '@/components/table-print'
import { TablePrintProps } from '@/components/table-print/TablePrint'
import TabelHead1 from './TabelHead1'
import { colums1, data1 } from './mock'

type TablePrintPageProps = TablePrintProps

class TablePrintPage extends PureComponent<TablePrintPageProps> {
  contentRef: HTMLDivElement | null = null

  handleClick = () => {
    this.props.print([{
      colums: colums1,
      dataSource: data1,
      tablePaddingLeft: 10,
      tablePaddingRight: 10,
      head: (
        <TabelHead1 />
      ),
      foot: (content, tableData, i, t) => (
        <div style={{ height: '200px', background: 'yellow' }}>{i}-{t}</div>
      )
    }, {
      colums: colums1,
      dataSource: data1,
      head: (
        <div style={{ height: '20px', border: '1px solid red' }}>head2</div>
      ),
      foot: (
        <div style={{ height: '200px', background: 'yellow' }}>foot2</div>
      )
    }], true)
  }

  render () {
    return (
      <Panel title='表格打印'>
        <button onClick={this.handleClick}>打印</button>
      </Panel>
    )
  }
}

export default TablePrint(TablePrintPage)
