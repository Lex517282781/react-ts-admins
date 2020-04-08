import React, { PureComponent } from 'react'
import { Divider, Table } from 'antd'
import Panel from '@/components/panel'
import ActionView from '@/components/action-view'

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text: string) => <a>{text}</a>
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address'
  },
  {
    title: '全部显示',
    key: 'tags',
    dataIndex: 'tags',
    render: () => (
      <ActionView showNum={2}>
        <a>操作一</a>
        <a>操作二</a>
      </ActionView>
    )
  },
  {
    title: 'hover显示',
    key: 'action',
    render: () => (
      <ActionView showNum={1}>
        <a>操作一</a>
        <a>操作二</a>
        <a>操作三</a>
      </ActionView>
    )
  }
]

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park'
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park'
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park'
  }
]

class ActionViewPage extends PureComponent {
  render () {
    return (
      <Panel title='表格操作组件'>
        <h4>预览</h4>
        <ActionView showNum={2}>
          <a>操作一</a>
          <a>操作二</a>
          <a>操作三</a>
        </ActionView>
        <Divider dashed />
        <h4>表格操作</h4>
        <Table columns={columns} dataSource={data} />
      </Panel>
    )
  }
}

export default ActionViewPage
