import React from 'react'
import Panel from '@/components/panel'
import SheetPrint, {
  SheetPrintProps
} from '@/components/sheet-print'
import Header1 from './header1'
import Footer1 from './footer1'
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
        <Header1 />
      ),
      footer: (
        _modulePage,
        _modulePages,
        _globalPage,
        _globalPages,
        _moduleIndex,
        _moduleTotal
      ) => <Footer1 _modulePage={_modulePage} _modulePages={_modulePages} _moduleIndex={_moduleIndex} _moduleTotal={_moduleTotal} _globalPage={_globalPage} _globalPages={_globalPages} />,
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
          _modulePage,
          _modulePages,
          _globalPage,
          _globalPages,
          _moduleIndex,
          _moduleTotal
        ) => <Footer1 _modulePage={_modulePage} _modulePages={_modulePages} _moduleIndex={_moduleIndex} _moduleTotal={_moduleTotal} _globalPage={_globalPage} _globalPages={_globalPages} />,
        fixed: true
      },
      {
        dataSource: data1,
        colums: colums1,
        header: (
          <div>789</div>
        ),
        footer: (
          _modulePage,
          _modulePages,
          _globalPage,
          _globalPages,
          _moduleIndex,
          _moduleTotal
        ) => <Footer1 _modulePage={_modulePage} _modulePages={_modulePages} _moduleIndex={_moduleIndex} _moduleTotal={_moduleTotal} _globalPage={_globalPage} _globalPages={_globalPages} />
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
