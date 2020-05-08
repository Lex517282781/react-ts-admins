import React, { PureComponent } from 'react'
import { Card } from 'antd'
import Panel from '@/components/panel'
import SelectSearchFetch from '@/components/select-search-fetch'

const fetchData = (data: {
  page: number,
  pageSize: number,
  keyword: number
}) => {
  console.log(data, '查询参数')
  return new Promise((resolve) => {
    setTimeout(() => {
      const records = [...new Array(10)].map((_, i) => {
        const r = +new Date() + i
        return {
          text: (data.page * i) + r + '分页',
          value: r
        }
      })
      resolve({
        records,
        current: data.page,
        pages: 5,
        size: data.pageSize,
        total: 20
      })
    }, 500)
  })
}

const fetchAll = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const res = [...new Array(10)].map((_, i) => {
        const r = +new Date() + i
        return {
          text: r + '全部',
          value: r
        }
      })
      resolve(res)
    }, 500)
  })
}

class SelectSearchFetchPage extends PureComponent {
  render () {
    return (
      <Panel title='下拉搜索组件'>
        <Card type='inner' title='普通使用'>
          <SelectSearchFetch
            api={fetchData}
            // allApi={fetchAll}
            style={{ width: '172px' }}
          />
        </Card>
      </Panel>
    )
  }
}

export default SelectSearchFetchPage
