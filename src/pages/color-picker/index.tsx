import React, { PureComponent } from 'react'
import { Form, Button, Card, Popover } from 'antd'
import { SketchPicker, ColorResult } from 'react-color'
import Panel from '@/components/panel'
import Upload from '@/components/clip-upload'
import { Result } from '@/components/clip-upload/config/interface'
import { FormComponentProps } from 'antd/lib/form/Form'

const uploadImgs = (file: File) => {
  return new Promise<Result>((resolve) => {
    setTimeout(() => {
      resolve({
        url:
          'https://assets.hzxituan.com/crm/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8551583809428505.jpg',
        name: '1111'
      })
    }, 1500)
  })
}

interface ColorPickerState {
  color: ColorResult
}

class ColorPickerPage extends PureComponent<
  FormComponentProps,
  ColorPickerState
> {
  public state: ColorPickerState = {
    color: {} as ColorResult
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

  handleChangeComplete = (color: ColorResult) => {
    console.log(color)
  }

  render () {
    const { getFieldDecorator } = this.props.form

    return (
      <Panel title='颜色选择组件'>
        <Card type='inner' title='在表单中使用'>
          <Form onSubmit={this.handleSubmit}>
            <Form.Item label='上传主图'>
              {getFieldDecorator('imgs3')(
                <Popover
                  placement='right'
                  content={
                    <SketchPicker
                      onChangeComplete={
                        this.handleChangeComplete
                      }
                    />
                  }
                >
                  <Button
                    style={{
                      width: 60,
                      height: 60
                    }}
                    type='primary'
                  />
                </Popover>
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

export default Form.create()(ColorPickerPage)
