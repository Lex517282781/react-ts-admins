import React, { PureComponent } from 'react'
import Panel from '@/components/panel'
import Print, { PrintProps } from '@/components/print'

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

const data = [...new Array(100)].map((_, i) => ({
  a: [...new Array(20)].map(() => 'a').join('') + i,
  b: 'b' + i,
  c: 'c' + i,
  d: 'd' + i,
  e: 'e' + i
}))

type PrintPageProps = PrintProps

class PrintPage extends PureComponent<PrintPageProps> {
  handlePrint = () => {
    this.props.print({
      colums,
      data,
      foot: 123
    })
  }

  render () {
    return (
      <Panel title='打印'>
        <button onClick={this.handlePrint}>Print this out!</button>
      </Panel>
    )
  }
}

export default Print(PrintPage)
