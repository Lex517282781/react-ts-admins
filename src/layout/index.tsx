import React, { PureComponent } from 'react'
import { Link } from "react-router-dom"
import { Collapse, Card } from 'antd'
import { categorys } from './config'

const { Panel } = Collapse

export default class Layout extends PureComponent {
  render() {
    const keys = categorys.map((item) => (item.id))

    return (
      <Card bordered={false}>
        <Collapse defaultActiveKey={keys}>
          {
            categorys.map((citem) => (
              <Panel
                key={citem.id}
                header={citem.text}
              >
                {
                  citem.list.map((innerItem) => (
                    <Link
                      key={innerItem.id}
                      to={innerItem.url}
                    >
                      {innerItem.text}
                    </Link>
                  ))
                }
              </Panel>
            ))
          }
        </Collapse>
      </Card>
    )
  }
}
