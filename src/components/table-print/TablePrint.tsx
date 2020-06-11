import React, { PureComponent } from 'react'
import ReactToPrint, { PrintContextConsumer } from 'react-to-print'
import ContentHead from './components/ContentHead'
import ContentFoot from './components/ContentFoot'
import TableTHeadTr from './components/TableTHeadTr'
import TableTbodyTr from './components/TableTbodyTr'
import { chunk } from 'lodash'
import { getA4W, getA4H } from './config/util'
import { Colum } from './config/interface'
import styles from './style.module.styl'

const a4W = getA4W()
const a4H = getA4H()

interface TablePrintProps {
  head?: React.ReactNode
  foot?: React.ReactNode
  colums?: Colum[]
  data?: any[]
  debug?: boolean
}

interface TablePrintState {
  dataSource: any[]
  tableData: any[]
  heights: any
}

class TablePrint extends PureComponent<TablePrintProps, TablePrintState> {
  contentRef: HTMLDivElement | null = null
  state: TablePrintState = {
    dataSource: this.props.data || [],
    tableData: this.props.data ? chunk(this.props.data, this.props.data.length) : [],
    heights: {}
  }

  componentDidMount () {
    this.reRender()
  }

  componentDidUpdate () {
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
    const { head, foot, colums = [], debug = false } = this.props
    const { tableData, heights } = this.state

    return (
      <div>
        <ReactToPrint content={() => this.contentRef}>
          <PrintContextConsumer>
            {({ handlePrint }) => (
              <button onClick={handlePrint}>Print this out!</button>
            )}
          </PrintContextConsumer>
        </ReactToPrint>
        <div
          style={
            debug
              ? {} : {
                position: 'absolute',
                left: '-999999px',
                top: '-999999px',
                visibility: 'hidden',
                zIndex: -999999
              }
          }
        >
          <div
            ref={ref => { this.contentRef = ref }}
            style={{ width: a4W }}
            className={styles['print-content']}
          >
            <div>
              {
                tableData.map((item, i) => (
                  <div key={i}>
                    {
                      <ContentHead data={heights}>
                        {head}
                      </ContentHead>
                    }
                    <div className={styles['content-body']}>
                      <table>
                        <thead>
                          <TableTHeadTr colums={colums} data={heights} />
                        </thead>
                        <tbody>
                          {
                            item.map((innerItem: any, j: number) => (
                              <TableTbodyTr colums={colums} key={j} data={innerItem} />
                            ))
                          }
                        </tbody>
                      </table>
                    </div>
                    <ContentFoot data={heights}>
                      {foot}
                    </ContentFoot>
                    <div style={{ pageBreakAfter: 'always' }} />
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default TablePrint
