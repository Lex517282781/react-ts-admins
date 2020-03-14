import React, { PureComponent } from 'react'
import { Upload, Icon, message } from 'antd';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import Clip from './clip'
import {
  getUniqueId,
  uploadImgs,
  getBase64,
  dataURLtoFile,
  isPic
} from './config'

const uploadButton = (
  <div>
    <Icon type="plus" />
    <div className="ant-upload-text">上传</div>
  </div>
);

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
    preFileList: [],
    loading: false
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

      fileLength = fileList.length; // 设置上传文件的数量

      return {
        fileList,
        imgList: fileList.map(item => ({
          src: item.url,
          name: item.uid,
          uid: item.uid,
          hasClip: false, // 是否裁剪 假如没有裁剪的话 不需要发送至后端保存图片
          size: 0
        })),
        preFileList: fileList
      }
    }
    return null
  }

  /** 储存自定义上传的成功回调, 如订阅发布模式, 可在某一刻再来执行 */
  customRequestSuccessCollect = {};

  /** 上传限制 */
  handleBeforeUpload = (file) => {
    const { maxAmount } = this.props;
    if (!isPic(file.type)) { // 图片类型限制
      message.warn(`只能上传图片哦~`)
      return false
    }
    if (fileLength >= maxAmount) { // 图片数量限制
      message.warn(`只能最多上传${maxAmount}张图片哦~`)
      return false
    }
    fileLength += 1; // 上传文件的数量添加
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
          hasClip: true,
          size: file.size
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

    // 需要远程保存的图片数量
    let hasClipImgsAmount = imgs.reduce((pre, next) => next.hasClip ? pre + 1 : pre, 0)

    this.setState({
      loading: true
    })

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
            })),
            loading: false
          }, () => {
            hasClipImgsAmount = hasClipImgsAmount - 1
            if (hasClipImgsAmount === 0) {
              // 直到需要远程保存的图片成功保存之后才算编辑成功
              message.success('图片编辑成功!');
              this.setState({
                loading: false
              })
              this.clipRef.handleHide();
            }
            onChange && onChange(this.state.fileList.map(item => item.url))
            this.customRequestSuccessCollect[item.uid] && this.customRequestSuccessCollect[item.uid]()
          })
        }).catch(e => {
          hasClipImgsAmount = hasClipImgsAmount - 1
          if (hasClipImgsAmount === 0) {
            this.setState({
              loading: false
            })
          }
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
    const { imgList, fileList, loading } = this.state;
    const { maxAmount, maxSize, clipWidth, clipHeigth } = this.props;

    return (
      <div>
        <Clip
          ref={ref => this.clipRef = ref}
          imgList={imgList}
          onSave={this.handleSave}
          onAfterClose={this.handleAfterClose}
          maxSize={maxSize}
          clipWidth={clipWidth}
          clipHeigth={clipHeigth}
          loading={loading}
        />
        <Upload
          accept="image/*"
          multiple
          listType="picture-card"
          fileList={fileList}
          beforeUpload={this.handleBeforeUpload}
          customRequest={this.handleCustomRequest}
          onRemove={this.handleRemove}
          onPreview={this.handlePreview}
        >
          {fileList.length >= maxAmount ? null : uploadButton}
        </Upload>
      </div>
    )
  }
}

UploadPage.defaultProps = {
  clipWidth: 750,
  clipHeigth: 750,
  maxAmount: 9,
  maxSize: .3
};

UploadPage.propTypes = {
  clipWidth: PropTypes.number, // 裁剪宽度
  clipHeigth: PropTypes.number, // 裁剪宽度
  maxAmount: PropTypes.number, // 图片数量
  maxSize: PropTypes.number // 图片大小 maxSize为n n小于1的 (n*1000)kb n大于等于1 (n)mb，1000kb-1024kb区间不支持设置 
};

export default UploadPage;
