import React, { PureComponent } from 'react'
import { Form, Button, Card } from 'antd'
import Panel from '@/components/panel'
import SelectSearchFetch from '@/components/select-search-fetch'
import { FormComponentProps } from 'antd/lib/form/Form'

let defaultSelectId: number = 1

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
        if (i === 0) {
          defaultSelectId = r
        }
        return {
          text: r + '分页',
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

interface SelectSearchFetchPageState {
  value: any
}

class SelectSearchFetchPage extends PureComponent<FormComponentProps, SelectSearchFetchPageState> {
  state: SelectSearchFetchPageState = {
    value: undefined
  }

  handleSubmit = (e: any) => {
    e.preventDefault()
    this.props.form.validateFields(
      (err: any, values: any) => {
        if (!err) {
          console.log('Received values of form: ', values)
        }
      }
    )
  }

  render () {
    const { getFieldDecorator } = this.props.form
    console.log('受控的值', this.state.value)

    return (
      <Panel title='下拉搜索组件'>
        <Card type='inner' title='非受控使用'>
          <SelectSearchFetch
            api={fetchData}
            // allApi={fetchAll}
            style={{ width: '172px' }}
            onChange={value => {
              console.log('非受控使用的值', value)
            }}
          />
        </Card>
        <Card style={{ marginTop: 24 }} type='inner' title='受控使用'>
          <SelectSearchFetch
            api={fetchData}
            // allApi={fetchAll}
            value={this.state.value}
            style={{ width: '172px' }}
            onChange={value => {
              this.setState({
                value
              })
            }}
          />
        </Card>
        <Card style={{ marginTop: 24 }} type='inner' title='在表单中使用'>
          <Form onSubmit={this.handleSubmit}>
            <Form.Item label='选择'>
              {getFieldDecorator('seclectId')(
                <SelectSearchFetch
                  api={fetchData}
                  // allApi={fetchAll}
                  style={{ width: '172px' }}
                />
              )}
            </Form.Item>
            <Form.Item label='选择(有默认值)'>
              {getFieldDecorator('seclectId2', {
                initialValue: defaultSelectId
              })(
                <SelectSearchFetch
                  api={fetchData}
                  // allApi={fetchAll}
                  style={{ width: '172px' }}
                />
              )}
            </Form.Item>
            <Form.Item wrapperCol={{ span: 12 }}>
              <Button type='primary' htmlType='submit'>
                提交
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Panel>
    )
  }
}

export default Form.create()(SelectSearchFetchPage)
