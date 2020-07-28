import React, { PureComponent } from 'react'
import Panel from '@/components/panel'
import { Card, Form, Button } from 'antd'
import { FormComponentProps } from 'antd/lib/form/Form'
import RelationCheckbox, { Option, ValuesProp } from '@/components/relation-checkbox'

interface RelationCheckboxPageState {
  list: Option[]
  value: ValuesProp
}
class RelationCheckboxPage extends PureComponent<FormComponentProps, RelationCheckboxPageState> {
  state: RelationCheckboxPageState = {
    list: [
      {
        label: '选项1',
        value: '1',
        children: [...new Array(10)].map((_, i) => ({
          label: `选项1-${i + 1}`,
          value: `1-${i + 1}`
        }))
      },
      {
        label: '选项2',
        value: '2',
        children: [
          {
            label: '选项2-1',
            value: '2-1'
          },
          {
            label: '选项2-2',
            value: '2-2'
          }
        ]
      },
      {
        label: '选项3',
        value: '3'
      }
    ],
    value: ['2']
  }

  handleChange = (value: any) => {
    console.log(value, 'value')
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
    const { list, value } = this.state
    return (
      <Panel title='关联复选'>
        <Card type='inner' title='非受控使用'>
          <RelationCheckbox
            isAll={false}
            options={list}
            onChange={(value: any) => {
              console.log(value, '非受控使用')
            }}
          />
        </Card>
        <Card style={{ marginTop: 24 }} type='inner' title='受控使用'>
          <RelationCheckbox
            options={list}
            value={value}
            onChange={(value: any) => {
              this.setState({
                value
              })
              console.log(value, '受控使用')
            }}
          />
        </Card>
        <Card style={{ marginTop: 24 }} type='inner' title='在表单中使用'>
          <Form onSubmit={this.handleSubmit}>
            <Form.Item>
              {getFieldDecorator('seclectIds')(
                <RelationCheckbox
                  options={list}
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

export default Form.create()(RelationCheckboxPage)
