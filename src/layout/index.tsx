import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import { List, Collapse, Card } from 'antd'
import { categorys } from './config'

const { Panel } = Collapse
export default class Layout extends PureComponent {
  render () {
    const keys = categorys.map((item) => item.id)

    return (
      <Card bordered={false}>
        <Collapse defaultActiveKey={keys}>
          {categorys.map((citem) => (
            <Panel key={citem.id} header={citem.text}>
              <List
                header={null}
                footer={null}
                bordered={false}
                dataSource={citem.list}
                renderItem={(innerItem) => (
                  <List.Item>
                    <Link to={innerItem.url}>
                      {innerItem.text}
                    </Link>
                  </List.Item>
                )}
              />
            </Panel>
          ))}
        </Collapse>
      </Card>
    )
  }
}
