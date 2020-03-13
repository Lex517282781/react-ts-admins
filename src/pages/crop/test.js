import React, { PureComponent } from 'react'
import { Form, Upload, Icon, Card } from 'antd'; // Button,
import Viewer from 'react-viewer';

const uploadImgs = (file) => {
  return new Promise((r) => {
    setTimeout(() => {
      const uid = +new Date()

      r({
        name: uid,
        uid: uid,
        url: 'https://assets.hzxituan.com/crm/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8551583809428505.jpg',
        type: '',
        size: 5000,
        status: 'done'
      })
    });
  })
}

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export class UploadPage extends PureComponent {
  state = {
    visible: false,
    loading: false,
    imageUrl: '',
    fileList: [],
    imgList: []
  }

  customRequestSuccessList = [];

  handleBeforeUpload = (file) => {
    return true
  }

  handleCustomRequest = (options) => {
    const { onProgress, onSuccess } = options;
    onProgress()
    this.customRequestSuccessList.push(onSuccess)
    this.handleDealImage(options);
  }

  handleDealImage = ({ file }) => {
    getBase64(file).then((src) => {
      this.setState({
        imgList: [...this.state.imgList, {
          src,
          alt: this.state.imgList.length + ''
        }],
        visible: true
      })
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  normFile = e => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  handleShow = () => {
    this.setState({
      visible: true
    })
  }

  handleClose = () => {
    this.setState({
      visible: false
    }, () => {
      this.customRequestSuccessList.forEach(fn => fn())
    })
  }

  render() {
    // const { getFieldDecorator } = this.props.form;
    const { visible, loading, imageUrl, fileList, imgList } = this.state;

    const uploadButton = (
      <div>
        <Icon type={loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传</div>
      </div>
    );

    // const formItemLayout = {
    //   labelCol: { span: 6 },
    //   wrapperCol: { span: 14 },
    // };

    console.log(imgList)

    return (
      <Card title="上传demo">
        <div>
          <button onClick={this.handleShow}>show</button>
          <Viewer
            visible={visible}
            onClose={this.handleClose}
            images={imgList}
          // images={imgList}
          />
        </div>
        <br />
        <Upload
          name="img"
          multiple
          listType="picture-card"
          beforeUpload={this.handleBeforeUpload}
          customRequest={this.handleCustomRequest}
        // action="https://www.mocky.io/v2/5cc8019d300000980a055e76" listType="picture"
        >
          {
            imageUrl ?
              <img
                src={imageUrl}
                alt="avatar"
                style={{ width: '100%' }}
              /> :
              uploadButton
          }
        </Upload>
        {/* <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="Upload">
            {getFieldDecorator('upload', {
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
            })(
              
            )}
          </Form.Item>
        </Form> */}
        <br />
      </Card>
    )
  }
}

export default Form.create()(UploadPage);
