import React, { PureComponent } from 'react'
import { Descriptions } from 'antd'
import styles from './style.module.styl'

interface TableFoot1Props {
  modulePage: number
  moduleTotalPage: number
  blockIndex: number
  blockSize: number
  globalPage: number
  globalTotalPage: number
}

class TableFoot1 extends PureComponent<TableFoot1Props> {
  render () {
    const { modulePage, moduleTotalPage, blockIndex, blockSize, globalPage, globalTotalPage } = this.props

    return (
      <div className={styles.foot}>
        <Descriptions column={2}>
          <Descriptions.Item label='当前模块页码'>
            <span>{modulePage}</span>
          </Descriptions.Item>
          <Descriptions.Item label='当前模块总页码'>
            <span>{moduleTotalPage}</span>
          </Descriptions.Item>
          <Descriptions.Item label='模块'>
            <span>{blockIndex}</span>
          </Descriptions.Item>
          <Descriptions.Item label='模块总个数'>
            <span>{blockSize}</span>
          </Descriptions.Item>
          <Descriptions.Item label='当前整体页码'>
            <span>{globalPage}</span>
          </Descriptions.Item>
          <Descriptions.Item label='整体总页码'>
            <span>{globalTotalPage}</span>
          </Descriptions.Item>
        </Descriptions>
      </div>
    )
  }
}

export default TableFoot1
