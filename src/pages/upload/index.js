import React, { PureComponent } from 'react'
import { Upload, Icon, message } from 'antd';
import { isEqual } from 'lodash';
import Clip from './clip'
// import Cropper from 'react-cropper';
// import 'cropperjs/dist/cropper.css';
// import styles from './style.module.styl'

const getUniqueId = (() => {
  let index = 0
  const prefix = 'key_' + new Date().getTime() + '_'
  return () => {
    index++
    const id = prefix + index
    return id
  }
})()

const uploadImgs = () => {
  return new Promise((r) => {
    setTimeout(() => {
      r({
        url: 'https://assets.hzxituan.com/crm/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8551583809428505.jpg',
      })
    }, 200);
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

function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

const uploadButton = (
  <div>
    <Icon type="plus" />
    <div className="ant-upload-text">上传</div>
  </div>
);

const maxSize = 3;
let fileLength = 0; // 已经上传的文件数量

export class UploadPage extends PureComponent {
  state = {
    fileList: [], // 保存之后的文件
    /** 
     * imgList 格式如下: 
     * {
     *   src: item.url,
     *   name: item.uid,
     *   uid: item.uid,
     *   hasClip: false // 是否裁剪 假如没有裁剪的话 不需要发送至后端保存图片
     * }
    */
    imgList: [],
    /** 
     * preFileList 保存上次的props 在 getDerivedStateFromProps 做比较使用
    */
    preFileList: []
  }

  static getDerivedStateFromProps(nextProps, preState) {
    const nextUrls = nextProps.fileList // 从父元素传过来的fileList 格式如['xxxx', 'yyy']
    const prelUrls = preState.preFileList.map(item => item.url) // 从之前保存的preFileList 映射获取链接集合 结果如格式['xxxx', 'yyy']

    if (!isEqual(nextUrls, prelUrls)) { // 从父元素实时传输过来的参数链接集合和之前保存的链接集合比较 如果不一样 就要执行以下过程
      const fileList = nextProps.fileList.map((item, i) => { // 转化成upload表单需要的格式
        let uid;

        // 已有的图片不需要重新生成新的uid, 以避免重新渲染
        if (preState.imgList[i] && preState.imgList[i].src) {
          uid = preState.imgList[i].uid
        } else {
          uid = getUniqueId();
        }

        return {
          uid,
          name: uid,
          url: item,
          type: ''
        }
      })

      fileLength = fileList.length;

      return {
        fileList,
        imgList: fileList.map(item => ({
          src: item.url,
          name: item.uid,
          uid: item.uid,
          hasClip: false // 是否裁剪 假如没有裁剪的话 不需要发送至后端保存图片
        })),
        preFileList: fileList
      }
    }
    return null
  }

  /** 储存自定义上传的成功回调, 如订阅发布模式, 可在某一刻再来执行 */
  customRequestSuccessCollect = {};

  /** 上传限制 */
  handleBeforeUpload = () => {
    if (fileLength >= maxSize) {
      message.warn(`只能最多上传${maxSize}张图片哦~`)
      return false
    }
    fileLength += 1;
    return true
  }

  /** 自定义上传 */
  handleCustomRequest = (options) => {
    const { onProgress, onSuccess } = options;
    onProgress()
    this.clipRef.handleShow();
    this.customRequestSuccessCollect[options.file.uid] = onSuccess
    this.handleDealImage(options);
  }

  /** 处理图片转base64 */
  handleDealImage = ({ file }) => {
    getBase64(file).then((src) => {
      const uid = getUniqueId();
      this.setState({
        imgList: [...this.state.imgList, {
          src,
          name: uid,
          uid,
          hasClip: true
        }],
      })
    })
  }

  /** 移除图片 */
  handleRemove = (file) => {
    const { fileList, imgList } = this.state;
    const { onChange } = this.props;
    fileLength--;
    this.setState({
      fileList: fileList.filter(item => item.uid !== file.uid),
      imgList: imgList.filter(item => item.uid !== file.uid)
    }, () => {
      onChange && onChange(this.state.fileList.map(item => item.url))
    })
  }

  /** 预览图片 */
  handlePreview = (file) => {
    const index = this.state.imgList.findIndex(item => item.uid === file.uid)
    this.clipRef.handleShow(index);
  }

  /** 编辑成功之后的回调 */
  handleSave = (imgs) => {
    const { onChange } = this.props

    imgs.forEach((item) => {
      if (item.hasClip) {
        // 编辑过的图片需要重新上传
        const file = dataURLtoFile(item.src, item.name) // 把base64图片组转换成file
        uploadImgs(file).then(res => {
          item.src = res.url
          item.hasClip = false
          this.setState({
            imgList: [...imgs],
            fileList: imgs.map(item => ({
              uid: item.uid,
              name: item.name,
              url: res.url,
              type: ''
            }))
          }, () => {
            console.log(item.uid)
            onChange && onChange(this.state.fileList.map(item => item.url))
            this.customRequestSuccessCollect[item.uid] && this.customRequestSuccessCollect[item.uid]()
          })
        }).catch(e => {
          console.log(e)
          message.error('图片保存失败, 请点击重新保存');
        })
      } else {
        // 没有编辑过的图片不需要操作处理
        onChange && onChange(this.state.fileList.map(item => item.url))
      }
    })
  }

  /** 编辑消失之后的回调 */
  handleAfterClose = (isSave) => {
    const { fileList, imgList } = this.state;
    fileLength = fileList.length // 这里需要确认上传的数量
    if (!isSave) {
      // 编辑取消保存 重新设置为fileList对应的图片
      this.setState({
        imgList: fileList.map((_, i) => imgList[i])
      })
    }
  }

  render() {
    const { imgList, fileList } = this.state;

    return (
      <div>
        <Clip
          ref={ref => this.clipRef = ref}
          imgList={imgList}
          onSave={this.handleSave}
          onAfterClose={this.handleAfterClose}
        />
        <Upload
          name="img"
          multiple
          listType="picture-card"
          fileList={fileList}
          beforeUpload={this.handleBeforeUpload}
          customRequest={this.handleCustomRequest}
          onRemove={this.handleRemove}
          onPreview={this.handlePreview}
        >
          {fileList.length >= maxSize ? null : uploadButton}
        </Upload>
      </div>
    )
  }
}

export default UploadPage;
