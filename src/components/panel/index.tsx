import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'antd'

const defaultPanelProps = {
  title: '这是标题'
}

type PanelProps = {
  children?: React.ReactNode
} & Partial<typeof defaultPanelProps>

export default class Panel extends PureComponent<PanelProps> {
  render () {
    const { title, children } = this.props

    return (
      <Card bordered={false}>
        <Card title={title} extra={<Link to='/'>返回</Link>}>
          {children}
        </Card>
      </Card>
    )
  }
}
