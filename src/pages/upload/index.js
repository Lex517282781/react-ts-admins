import React, { PureComponent } from 'react'
import { Upload, Icon, message, Modal } from 'antd';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import Clip from './clip'
import {
  getUniqueId,
  getBase64,
  dataURLtoFile,
  isPic,
  derivedNameFormUrl,
  getFileExtName
} from './config'

const uploadButton = (
  <div>
    <Icon type="plus" />
    <div className="ant-upload-text">上传</div>
  </div>
)

let fileLength = 0 //  已经上传的文件数量 这里fileLength导出引入在同一个文件下 只生成一份数据 所以不能做渲染使用 只能在内部使用

export class UploadPage extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      /** 
       * fileList 格式如下: 
       * {
       *   uid: item.uid,
       *   name: item.name,
       *   url: item.url,
       *   type: item.type,
       *   size: item.size,
       *   hasClip: false // 是否裁剪 假如没有裁剪的话 不需要发送至后端保存图片
       * }
      */
      fileList: [],
      /** 
       * preFileList 保存上次的props 在 getDerivedStateFromProps 做比较使用
      */
      preFileList: [],
      /** 
       * 预览模态框显示状态
      */
      previewVisible: false,
      /** 
       * 预览模态框图片
      */
      previewImage: ''
    }
  }

  static getDerivedStateFromProps(nextProps, preState) {
    const nextUrls = nextProps.fileList || [] // 从父元素传过来的fileList 格式如['xxxx', 'yyy']
    const prelUrls = preState.preFileList.map(item => item.url) // 从之前保存的preFileList 映射获取链接集合 结果如格式['xxxx', 'yyy']

    if (!isEqual(nextUrls, prelUrls)) { // 从父元素实时传输过来的参数链接集合和之前保存的链接集合比较 如果不一样 就要执行以下过程
      const fileList = nextUrls.map((item, i) => { // 转化成upload表单需要的格式
        let uid

        // 已有的图片不需要重新生成新的uid, 以避免重新渲染
        if (preState.fileList[i] && preState.fileList[i].url) {
          uid = preState.fileList[i].uid
        } else {
          uid = getUniqueId()
        }

        return {
          uid,
          name: derivedNameFormUrl(item),
          url: item,
          type: `image/${getFileExtName(item)}`,
          size: 0,
          hasClip: false,
          status: 'done'
        }
      })

      fileLength = fileList.length // 设置上传文件的数量

      return {
        fileList,
        preFileList: fileList
      }
    }
    return null
  }

  /** 储存自定义上传的成功回调, 如订阅发布模式, 可在某一刻再来执行 */
  customRequestSuccessCollect = {}

  /** 裁剪初始化 */
  clipInitial = false

  /** 上传限制 */
  handleBeforeUpload = (file) => {
    const { maxAmount } = this.props
    if (!isPic(file.type)) { // 图片类型限制
      message.warn(`只能上传图片哦~`)
      return false
    }
    if (fileLength >= maxAmount) { // 图片数量限制
      message.warn(`只能最多上传${maxAmount}张图片哦~`)
      return false
    }
    fileLength += 1
    return true
  }

  /** 自定义上传 */
  handleCustomRequest = (options) => {
    const { onProgress, onSuccess } = options
    onProgress()
    if (!this.clipInitial) {
      this.clipInitial = true
      this.clipRef.handleShow()
    }
    this.customRequestSuccessCollect[options.file.uid] = onSuccess
    this.handleDealImage(options)
  }

  /** 处理图片转base64 */
  handleDealImage = ({ file }) => {
    getBase64(file).then((url) => {
      const uid = getUniqueId()
      this.setState({
        fileList: [...this.state.fileList, {
          uid,
          name: file.name,
          url,
          type: file.type,
          hasClip: true,
          size: file.size,
          status: 'uploading'
        }],
      })
    })
  }

  /** 移除图片 */
  handleRemove = (file) => {
    const { fileList } = this.state
    const { onChange } = this.props
    fileLength -= 1
    this.setState({
      fileList: fileList.filter(item => item.uid !== file.uid),
    }, () => {
      onChange && onChange(this.state.fileList.map(item => item.url))
    })
  }

  /** 预览图片 */
  handlePreview = (file) => {
    const { readonly } = this.props
    if (readonly) {
      this.setState({
        previewImage: file.url,
        previewVisible: true
      })
      return
    }
    const index = this.state.fileList.findIndex(item => item.uid === file.uid)
    this.clipRef.handleShow(index)
  }

  /** 预览图片取消 */
  handlePreviewCancel = () => {
    this.setState({
      previewVisible: false
    })
  }

  /** 预览图片彻底消失回调 */
  handlePreviewAfterClose = () => {
    this.setState({
      previewImage: ''
    })
  }

  /** 编辑成功之后的回调 */
  handleSave = (fileList, afterSaveCb) => {
    const { api } = this.props

    // 需要远程保存的图片数量
    let hasClipImgsAmount = fileList.reduce((pre, next) => next.hasClip ? pre + 1 : pre, 0)

    if (!hasClipImgsAmount) {
      // 所有图片没有修改的情况下 不需要任何操作
      this.clipRef.handleHide()
      return
    }

    for (let i = 0, l = fileList.length; i < l; i++) {
      const item = fileList[i]
      if (item.hasClip) {
        // 编辑过的图片需要重新上传
        const file = dataURLtoFile(item.url, item.name) // 把base64图片组转换成file

        api(file)
          // eslint-disable-next-line no-loop-func
          .then(res => {
            const fileList = [
              ...this.state.fileList.slice(0, i),
              {
                ...this.state.fileList[i],
                url: res.url,
                hasClip: false
              },
              ...this.state.fileList.slice(i + 1)
            ]
            this.setState({
              fileList,
            }, () => {
              hasClipImgsAmount = hasClipImgsAmount - 1
              if (hasClipImgsAmount === 0) {
                // 直到需要远程保存的图片成功保存之后才算编辑成功
                message.success('图片编辑成功!')
                afterSaveCb();
                this.clipRef.handleHide()
              }
              this.customRequestSuccessCollect[item.uid] && this.customRequestSuccessCollect[item.uid]()
            })
          })
          // eslint-disable-next-line no-loop-func
          .catch(e => {
            hasClipImgsAmount = hasClipImgsAmount - 1
            if (hasClipImgsAmount === 0) {
              afterSaveCb();
            }
            message.error('图片保存失败, 请点击重新保存')
          })
      }
    }
  }

  /** 编辑消失之后的回调 */
  handleAfterClose = (isSave) => {
    const { preFileList, fileList } = this.state
    const { onChange } = this.props
    fileLength = 0 // fileLength 静态变量导出的时候都引用的同一个值 需要重置该计数器
    this.clipInitial = false
    if (isSave) {
      onChange && onChange(fileList.map(item => item.url))
    } else {
      // 编辑取消保存 重新设置为fileList对应的图片
      this.setState({
        fileList: preFileList
      })
    }
  }

  render() {
    const { fileList, previewVisible, previewImage } = this.state
    const { maxAmount, maxSize, clipWidth, clipHeigth, readonly } = this.props

    return (
      <div>
        <Clip
          ref={ref => this.clipRef = ref}
          fileList={fileList}
          onSave={this.handleSave}
          onAfterClose={this.handleAfterClose}
          maxSize={maxSize}
          clipWidth={clipWidth}
          clipHeigth={clipHeigth}
        />
        <Upload
          accept="image/*"
          multiple
          listType="picture-card"
          fileList={fileList.map(file => ({
            uid: file.uid,
            name: file.name,
            status: file.status,
            url: file.url
          }))}
          beforeUpload={this.handleBeforeUpload}
          customRequest={this.handleCustomRequest}
          onRemove={this.handleRemove}
          onPreview={this.handlePreview}
        >
          {
            readonly ? null : (fileList.length >= maxAmount ? null : uploadButton)
          }
        </Upload>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handlePreviewCancel}
          afterClose={this.handlePreviewAfterClose}
        >
          <img alt="previewImage" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    )
  }
}

UploadPage.defaultProps = {
  clipWidth: 750,
  clipHeigth: 750,
  maxAmount: 3,
  maxSize: .3,
  readonly: true
}

UploadPage.propTypes = {
  clipWidth: PropTypes.number, // 裁剪宽度
  clipHeigth: PropTypes.number, // 裁剪宽度
  maxAmount: PropTypes.number, // 图片数量
  maxSize: PropTypes.number, // 图片大小 maxSize为n n小于1的 (n*1000)kb n大于等于1 (n)mb，1000kb-1024kb区间不支持设置
  readonly: PropTypes.bool, //  是否只读 true表示不能裁剪
  api: PropTypes.func.isRequired // 图片上传后端的接口 需返回一个promise 参数为file 如
  // const api = () => {
  //   return new Promise((r) => {
  //     setTimeout(() => {
  //       r({
  //         url: 'https://assets.hzxituan.com/crm/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8551583809428505.jpg',
  //       })
  //     }, 3000);
  //   })
  // }
};

export default UploadPage
