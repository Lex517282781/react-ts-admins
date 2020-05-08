import React, { PureComponent } from 'react'
import { Form, Button, Card } from 'antd'
import Panel from '@/components/panel'
import ColorPicker from '@/components/color-picker'
import { FormComponentProps } from 'antd/lib/form/Form'

const color = 'rgba(255, 113, 24, 1)'

class ColorPickerPage extends PureComponent<
  FormComponentProps
> {
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

  handleChange = (color: string) => {
    console.log(color)
  }

  render () {
    const { getFieldDecorator } = this.props.form

    return (
      <Panel title='颜色选择组件'>
        <Card type='inner' title='普通使用'>
          <ColorPicker onChange={this.handleChange} />
        </Card>
        <Card
          style={{ marginTop: 24 }}
          type='inner'
          title='在表单中使用'
        >
          <Form onSubmit={this.handleSubmit}>
            <Form.Item label='选择颜色'>
              {getFieldDecorator('color')(<ColorPicker />)}
            </Form.Item>
            <Form.Item label='选择颜色(有默认值)'>
              {getFieldDecorator('color2', {
                initialValue: color
              })(<ColorPicker />)}
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

export default Form.create()(ColorPickerPage)
