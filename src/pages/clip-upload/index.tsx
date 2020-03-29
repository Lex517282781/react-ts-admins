import React, { PureComponent } from 'react'
import { Form, Button, Card } from 'antd'
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

class ClipUploadPage extends PureComponent<
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

  handleChange = (fileList: string[]) => {
    console.log(fileList)
  }

  render () {
    const { getFieldDecorator } = this.props.form

    const imgs = [
      'https://assets.hzxituan.com/crm/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8551583809428505.jpg'
    ]

    return (
      <Panel title='裁剪上传组件'>
        <Card type='inner' title='普通使用'>
          <Upload
            api={uploadImgs}
            readonly={false}
            onChange={this.handleChange}
          />
        </Card>
        <Card
          type='inner'
          title='在表单中使用'
          style={{ marginTop: 24 }}
        >
          <Form onSubmit={this.handleSubmit}>
            <Form.Item label='上传主图'>
              {getFieldDecorator('imgs2')(
                <Upload
                  clipWidth={750}
                  clipHeigth={740}
                  api={uploadImgs}
                  readonly={false}
                />
              )}
            </Form.Item>
            <Form.Item label='上传主图(有默认值)'>
              {getFieldDecorator('imgs', {
                initialValue: imgs
              })(
                <Upload
                  api={uploadImgs}
                  readonly={false}
                  help={['1. 这是指导一', '2. 这是指导二']}
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

export default Form.create()(ClipUploadPage)
