import React from 'react'
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
      colums: colums1
    })
  }

  render () {
    return (
      <div>
        <button onClick={this.handlePrint}>print</button>
      </div>
    )
  }
}

export default SheetPrint(SheetPrintPage)
