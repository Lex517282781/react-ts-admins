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
      foot: (_, __, modulePage, moduleTotalPage, blockIndex, blockSize, globalPage, globalTotalPage) => (
        <div>
          当前模块页码{modulePage}<br />
          当前模块总页码{moduleTotalPage}<br />
          模块{blockIndex}<br />
          模块总个数{blockSize}<br />
          当前整体页码{globalPage}<br />
          整体总页码{globalTotalPage}
        </div>
      )
    }], true)
  }

  handleClickFIxed = () => {
    this.props.print([{
      colums: colums1,
      dataSource: data1,
      tablePaddingLeft: 10,
      tablePaddingRight: 10,
      head: (
        <TabelHead1 />
      ),
      foot: (_, __, modulePage, moduleTotalPage, blockIndex, blockSize, globalPage, globalTotalPage) => (
        <div style={{ background: 'red' }}>
          当前模块页码{modulePage}<br />
          当前模块总页码{moduleTotalPage}<br />
          模块{blockIndex}<br />
          模块总个数{blockSize}<br />
          当前整体页码{globalPage}<br />
          整体总页码{globalTotalPage}
        </div>
      )
    }], {
      debug: false,
      fixed: true
    })
  }

  render () {
    return (
      <Panel title='表格打印'>
        <button onClick={this.handleClick}>流式打印</button>
        <br /><br />
        <button onClick={this.handleClickFIxed}>底部固定打印</button>
      </Panel>
    )
  }
}

export default TablePrint(TablePrintPage)
