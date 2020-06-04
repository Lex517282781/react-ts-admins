import React, { PureComponent } from 'react'
import ReactToPrint, { PrintContextConsumer } from 'react-to-print'
import Panel from '@/components/panel'
import Print from '@/components/print'
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

const data = [...new Array(100)].map((_, i) => ({
  a: [...new Array(20)].map(() => 'a').join('') + i,
  b: 'b' + i,
  c: 'c' + i,
  d: 'd' + i,
  e: 'e' + i
}))

const pageStyle = {
  '@page:right': {
    '@top-right': {
      'border-top': '.25pt solid #666',
      content: '123'
    },
    'margin-left': '4cm'
  }
}

class ComponentToPrint extends React.Component {
  render () {
    return (
      <div>
        <Print>
          <div style={{ padding: '20px 20px 0' }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  {
                    colums.map((item) => <th key={item.key}>{item.title}</th>)
                  }
                </tr>
              </thead>
            </table>
          </div>
          <table className={styles.table}>
            <tbody>
              {
                data.map((row: any, i: number) => (
                  <tr key={i}>
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
                ))
              }
            </tbody>
          </table>
          <div style={{ border: '1px solid red' }}>底部</div>
        </Print>
      </div>
    )
  }
}

class PrintPage extends PureComponent {
  componentRef: any
  render () {
    return (
      <Panel title='打印'>
        <ReactToPrint pageStyle={JSON.stringify(pageStyle)} content={() => this.componentRef}>
          <PrintContextConsumer>
            {({ handlePrint }) => (
              <button onClick={handlePrint}>Print this out!</button>
            )}
          </PrintContextConsumer>
        </ReactToPrint>
        <div style={{ display: 'none' }}>
          <ComponentToPrint ref={el => (this.componentRef = el)} />
        </div>
        {/* <Print /> */}
      </Panel>
    )
  }
}

export default PrintPage
