import React, { PureComponent } from 'react'
import Panel from '@/components/panel'
import TablePrint from '@/components/table-print'
import { TablePrintProps } from '@/components/table-print/TablePrint'
import { chunk } from 'lodash'

const colums = [
  {
    key: 'a',
    title: '表头1'
  },
  {
    key: 'b',
    title: '表头2'
  },
  {
    key: 'c',
    title: '表头3'
  },
  {
    key: 'd',
    title: '表头4'
  },
  {
    key: 'e',
    title: '表头5'
  }
]

const data = [...new Array(120)].map((_, i) => {
  let c = ''
  if (i === 20) {
    c = [...new Array(222)].map(() => '你好').join('') + i
  } else {
    c = 'c' + i
  }

  return {
    i,
    a: [...new Array(20)].map(() => 'a').join('') + i,
    b: 'b' + i,
    c,
    d: 'd' + i,
    e: 'e' + i,
    h: 0,
    page: false
  }
})

type TablePrintPageProps = TablePrintProps

interface TablePrintPageState {
  dataSource: any[],
  tableData: any[],
  heights: any
}

class TablePrintPage extends PureComponent<TablePrintPageProps, TablePrintPageState> {
  contentRef: HTMLDivElement | null = null
  state: TablePrintPageState = {
    dataSource: data,
    tableData: chunk(data, data.length),
    heights: {}
  }

  handleClick = () => {
    this.props.print({
      // debug: true,
      colums,
      data,
      head: (
        <div style={{ height: '20px', border: '1px solid red' }}>head</div>
      ),
      foot: (
        <div style={{ height: '200px', background: 'yellow' }}>foot</div>
      )
    })
  }

  render () {
    return (
      <Panel title='表格打印'>
        {/* <TablePrint
          debug
          colums={colums}
          data={data}
          head={(
            <div style={{ height: '20px', border: '1px solid red' }}>head</div>
          )}
          foot={(
            <div style={{ height: '200px', background: 'yellow' }}>foot</div>
          )}
        /> */}
        <button onClick={this.handleClick}>打印</button>
      </Panel>
    )
  }
}

export default TablePrint(TablePrintPage)
