import React, { PureComponent } from 'react'
import ReactToPrint, { PrintContextConsumer } from 'react-to-print'
import Panel from '@/components/panel'
import { cm2px } from '@/components/react-print/config/util'
import { chunk } from 'lodash'
import styles from './style.module.styl'

// const a4W = cm2px(21)
// const a4H = cm2px(29.7)
const getA4W = () => {
  const el = document.createElement('div')
  el.style.width = '210mm'
  document.body.appendChild(el)
  const width = el.clientWidth - 10
  el.remove()
  return width
}

const getA4H = () => {
  const el = document.createElement('div')
  el.style.width = '297mm'
  document.body.appendChild(el)
  const width = el.clientWidth - 10
  el.remove()
  return width
}

const a4W = getA4W()
const a4H = getA4H()
console.log(a4W, a4H)
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

interface TableTbodyTrProps {
  data: any
}

class TableTbodyTr extends PureComponent<TableTbodyTrProps> {
  trRef: HTMLTableRowElement | null = null
  componentDidMount () {
    const { data } = this.props
    data.h = this.trRef?.offsetHeight
  }

  render () {
    const { data } = this.props
    return (
      <tr ref={ ref => { this.trRef = ref } }>
        {
          colums.map((col, j) => (
            <td key={j}>
              {
                data[col.key]
              }
            </td>
          ))
        }
      </tr>
    )
  }
}

interface TableTHeadTrProps {
  data: any
}

class TableTHeadTr extends PureComponent<TableTHeadTrProps> {
  trRef: HTMLTableRowElement | null = null
  componentDidMount () {
    const { data } = this.props
    data.tableHead = this.trRef?.offsetHeight
  }

  render () {
    return (
      <tr ref={ ref => { this.trRef = ref } }>
        {
          colums.map((item) => <th key={item.key}>{item.title}</th>)
        }
      </tr>
    )
  }
}

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

  componentDidMount () {
    console.log(this.contentRef?.offsetHeight)
    this.reRender()
  }

  componentDidUpdate () {
    console.log(this.contentRef?.offsetHeight)
    this.reRender()
  }

  /* 获取内容到到a4 */
  getContentReachA4Index = (dataSource: any = []) => {
    const { heights } = this.state
    for (let i = 0, l = dataSource.length, sum = heights.tableHead || 0; i < l; i++) {
      const item = dataSource[i]
      sum += item.h
      if (sum > a4H) {
        return i
      }
    }
    return -1
  }

  reRender = () => {
    const { tableData } = this.state
    const length = tableData.length
    const preData = tableData.slice(0, length - 1)
    const lastData = tableData[length - 1]
    const reachIndex = this.getContentReachA4Index(lastData)
    if (reachIndex > 0) {
      this.setState({
        tableData: [
          ...preData,
          lastData.slice(0, reachIndex),
          lastData.slice(reachIndex)
        ]
      })
    }
  }

  render () {
    const { tableData, heights } = this.state

    console.log(tableData)

    return (
      <Panel title='表格打印'>
        <ReactToPrint content={() => this.contentRef}>
          <PrintContextConsumer>
            {({ handlePrint }) => (
              <button onClick={handlePrint}>Print this out!</button>
            )}
          </PrintContextConsumer>
        </ReactToPrint>
        <div
          ref={ref => { this.contentRef = ref }}
          style={{ width: a4W }}
          className={styles['print-content']}
        >
          {
            tableData.map((item, i) => (
              <div key={i}>
                <table>
                  <thead>
                    <TableTHeadTr data={heights} />
                  </thead>
                  <tbody>
                    {
                      item.map((innerItem: any, j: number) => (
                        <TableTbodyTr key={j} data={innerItem} />
                      ))
                    }
                  </tbody>
                </table>
                <div style={{ pageBreakAfter: 'always' }} />
              </div>
            ))
          }
        </div>
        <div
          style={{
            background: 'red',
            height: '29.7cm'
          }}
        >
          1
        </div>
      </Panel>
    )
  }
}

export default TablePrintPage
