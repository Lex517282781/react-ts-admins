import React, { PureComponent } from 'react'
import { Descriptions } from 'antd'
import styles from './style.module.styl'

interface TableFoot1Props {
  _modulePage: number
  _modulePages: number
  _moduleIndex: number
  _moduleTotal: number
  _globalPage: number
  _globalPages: number
}

class TableFoot1 extends PureComponent<TableFoot1Props> {
  render () {
    const { _modulePage, _modulePages, _moduleIndex, _moduleTotal, _globalPage, _globalPages } = this.props

    return (
      <div className={styles.foot}>
        <Descriptions column={2}>
          <Descriptions.Item label='当前模块页码'>
            <span>{_modulePage}</span>
          </Descriptions.Item>
          <Descriptions.Item label='当前模块总页码'>
            <span>{_modulePages}</span>
          </Descriptions.Item>
          <Descriptions.Item label='模块'>
            <span>{_moduleIndex}</span>
          </Descriptions.Item>
          <Descriptions.Item label='模块总个数'>
            <span>{_moduleTotal}</span>
          </Descriptions.Item>
          <Descriptions.Item label='当前整体页码'>
            <span>{_globalPage}</span>
          </Descriptions.Item>
          <Descriptions.Item label='整体总页码'>
            <span>{_globalPages}</span>
          </Descriptions.Item>
        </Descriptions>
      </div>
    )
  }
}

export default TableFoot1
