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
  handlePrint = () => {
    this.props.print({
      dataSource: data1,
      colums: colums1,
      header: (
        <div>134</div>
      ),
      footer: (
        <div>134</div>
      )
    })
  }

  render () {
    // return (
    //   <div style={{ width: 794, height: 1123, background: 'red' }}>
    //     1111
    //   </div>
    // )
    return (
      <Panel title='sheet打印'>
        <button onClick={this.handlePrint}>print</button>
        <br /><br />
      </Panel>
    )
  }
}

export default SheetPrint(SheetPrintPage)
