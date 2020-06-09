import React, { PureComponent } from 'react'
import ReactToPrint, { PrintContextConsumer } from 'react-to-print'
import Panel from '@/components/panel'
import ReactPrint from '@/components/react-print'
import { cm2px } from '@/components/react-print/config/util'
import { chunk, flatten } from 'lodash'
import styles from './style.module.styl'

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

const data = [...new Array(100)].map((_, i) => {
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

class TableTbodyTr extends PureComponent<any> {
  trRef: HTMLTableRowElement | null = null
  componentDidMount () {
    const { row } = this.props
    row.h = this.trRef?.offsetHeight
  }

  render () {
    const { row } = this.props

    return (
      <tr ref={ ref => { this.trRef = ref } }>
        {
          colums.map((col, j) => (
            <td key={j}>
              {
                row[col.key]
              }
            </td>
          ))
        }
      </tr>
    )
  }
}

class ReactPrintPage extends PureComponent {
  tableRef: HTMLDivElement | null = null
  state = {
    tableData: [data]
  }

  componentDidMount () {
    this.compareSize()
  }

  compareSize = () => {
    const { tableData } = this.state
    // const tableH = this.tableRef?.offsetHeight || 0
    const a4H = cm2px(29.7)
    const tableDataH = flatten(tableData).reduce((pre, next) => (pre + next.h), 0)
    if (tableDataH > a4H) {
      this.computeData()
    }
  }

  computeData = () => {
    const a4H = cm2px(29.7)
    const { tableData } = this.state
    let splitIndex = data.length
    let h = 0
    for (let i = 0, l = flatten(tableData).length; i < l; i++) {
      const item = flatten(tableData)[i]
      h += item.h
      if (h + 23 > a4H) {
        item.page = true
        splitIndex = item.i
        break
      }
    }
    this.setState({
      tableData: chunk(data, splitIndex - 10)
    })
    console.log(splitIndex)
  }

  render () {
    const { tableData } = this.state

    return (
      <Panel title='React打印'>
        <ReactToPrint content={() => this.tableRef}>
          <PrintContextConsumer>
            {({ handlePrint }) => (
              <button onClick={handlePrint}>Print this out!</button>
            )}
          </PrintContextConsumer>
        </ReactToPrint>
        <div
          ref={ref => { this.tableRef = ref }}
          style={{ width: cm2px(22) }}
          className={styles['table-wrap']}
        >
          {
            tableData.map((item, i) => (
              <div key={i} className={styles['table-inner']}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      {
                        colums.map((item) => <th key={item.key}>{item.title}</th>)
                      }
                    </tr>
                  </thead>
                  <tbody>
                    {
                      item.map((row: any, i: number) => (
                        <TableTbodyTr key={i} row={row} />
                      ))
                    }
                  </tbody>
                </table>
                <div style={{ pageBreakAfter: 'always' }}></div>
              </div>
            ))
          }
        </div>
        <ReactPrint />
      </Panel>
    )
  }
}

export default ReactPrintPage
