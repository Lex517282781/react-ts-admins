import React from 'react'
import Panel from '@/components/panel'
import SheetPrint, {
  SheetPrintProps
} from '@/components/sheet-print'
import { colums1, data1 } from './mock'

interface SheetPrintPageProps extends SheetPrintProps {}

class SheetPrintPage extends React.Component<
  SheetPrintPageProps
> {
  handlePrint1 = () => {
    this.props.print({
      dataSource: data1,
      colums: colums1,
      header: (
        <div>134</div>
      ),
      footer: (
        <div>134</div>
      ),
      fixed: true
    }, {
      debug: true
    })
  }

  handlePrint2 = () => {
    this.props.print([
      {
        dataSource: data1,
        colums: colums1,
        header: (
          <div>123</div>
        ),
        footer: (
          <div>456</div>
        ),
        fixed: true
      },
      {
        dataSource: data1,
        colums: colums1,
        header: (
          <div>789</div>
        ),
        footer: (
          <div>012</div>
        )
      }
    ])
  }

  render () {
    return (
      <Panel title='sheet打印'>
        <button onClick={this.handlePrint1}>Single print</button>
        <br /><br />
        <button onClick={this.handlePrint2}>Multi print</button>
      </Panel>
    )
  }
}

export default SheetPrint(SheetPrintPage)
