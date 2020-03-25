import React, { Component } from 'react'
import { Form, Button } from 'antd'
// import Upload from '../upload'
import Upload from '@/components/clip-upload'
import { Result } from '@/components/clip-upload/config/interface'
import { FormComponentProps } from "antd/lib/form/Form"

// const file: File = new File(["foo"], "foo.txt", {
//   type: "text/plain",
// })

const uploadImgs = (file: File) => {
  return new Promise<Result>((r) => {
    setTimeout(() => {
      r({
        url: 'https://assets.hzxituan.com/crm/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8551583809428505.jpg',
        name: '1111'
      })
    }, 1500)
  })
}

class Demo extends Component<FormComponentProps> {
  normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e
    }
    return e && e.fileList
  }

  handleSubmit = (e: any) => {
    e.preventDefault()
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        console.log('Received values of form: ', values)
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form

    const imgs = ["https://assets.hzxituan.com/crm/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8551583809428505.jpg"]

    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Form.Item label="上传主图">
            {getFieldDecorator('imgs', {
              // valuePropName: 'fileList',
              // getValueFromEvent: this.normFile,
              initialValue: imgs
            })(
              <Upload api={uploadImgs} readonly={false} />
            )}
          </Form.Item>
          <Form.Item label="上传主图">
            {getFieldDecorator('imgs2', {
              // valuePropName: 'fileList',
              // getValueFromEvent: this.normFile
            })(
              <Upload clipWidth={750} clipHeigth={320} api={uploadImgs} readonly={false} />
            )}
          </Form.Item>
          <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default Form.create()(Demo)
