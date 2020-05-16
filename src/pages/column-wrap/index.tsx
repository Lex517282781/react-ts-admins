import React, { PureComponent } from 'react'
import { Card } from 'antd'
import Panel from '@/components/panel'
import ColumnWrap from '@/components/column-wrap'

class ColumnWrapPage extends PureComponent {
  render () {
    return (
      <Panel title='表格操作组件'>
        <Card type='inner' title='默认'>
          <ColumnWrap>
          </ColumnWrap>
        </Card>
        <Card style={{ marginTop: 24 }} type='inner' title='控制设置'>
          <ColumnWrap empty='暂无数据'>
          </ColumnWrap>
        </Card>
        <Card style={{ marginTop: 24 }} type='inner' title='数据显示'>
          <ColumnWrap empty='暂无数据'>
            <div>
              数据显示
            </div>
          </ColumnWrap>
        </Card>
      </Panel>
    )
  }
}

export default ColumnWrapPage
