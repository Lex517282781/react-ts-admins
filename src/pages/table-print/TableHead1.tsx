import React, { PureComponent } from 'react'
import { Descriptions } from 'antd'
import Barcode from './barcode'
import styles from './style.module.styl'

class TabelHead1 extends PureComponent {
  render () {
    return (
      <div className={styles.head}>
        <div className={styles.title}>
          出库汇总信息 OS1234567891515
          <Barcode
            className={styles.barcode}
            height={44}
            width={1.5}
            margin={2}
            label='OS1234567891515'
          />
        </div>
        <div className={styles.content}>
          <Descriptions>
            <Descriptions.Item label="UserName">Zhou Maomao</Descriptions.Item>
            <Descriptions.Item label="Telephone">1810000000</Descriptions.Item>
            <Descriptions.Item label="Live">Hangzhou, Zhejiang</Descriptions.Item>
            <Descriptions.Item label="Remark">empty</Descriptions.Item>
            <Descriptions.Item label="Address">
              No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    )
  }
}

export default TabelHead1
