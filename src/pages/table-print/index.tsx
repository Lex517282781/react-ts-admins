import React, { PureComponent } from 'react'
import Panel from '@/components/panel'
import TablePrint from '@/components/table-print'
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

const data = [...new Array(200)].map((_, i) => {
  let c = ''
  if (i === 20) {
    c = [...new Array(200)].map(() => '你好').join('') + i
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

interface TablePrintPageState {
  dataSource: any[],
  tableData: any[],
  heights: any
}

class TablePrintPage extends PureComponent<any, TablePrintPageState> {
  contentRef: HTMLDivElement | null = null
  state: TablePrintPageState = {
    dataSource: data,
    tableData: chunk(data, data.length),
    heights: {}
  }

  render () {
    return (
      <Panel title='表格打印'>
        <TablePrint
          colums={colums}
          data={data}
          head={(
            <>head</>
          )}
          foot={(
            <>foot</>
          )}
        />
      </Panel>
    )
  }
}

export default TablePrintPage
