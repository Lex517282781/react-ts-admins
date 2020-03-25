import React, { PureComponent } from 'react'
import { Upload, Icon, message, Modal, Empty } from 'antd'
import { UploadFile } from 'antd/lib/upload/interface'
import { isEqual } from 'lodash'
import Clip from './components/Clip'
import { Result, FileList, FileItem, SuccessCollect } from './config/interface'
import { getUniqueId, derivedNameFormUrl, getFileExtName, isPic, getBase64, dataURLtoFile } from './config/util'
import { defaultClipUploadProps } from './config/config'

const uploadButton = (
  <div>
    <Icon type='plus' />
    <div className='ant-upload-text'>上传</div>
  </div>
)

type ClipUploadProps = {
  api: (f: File) => Promise<Result>
  onChange?: (fileList: string[]) => void,
  value?: string[]
} & Partial<typeof defaultClipUploadProps>

interface ClipUploadState {
  /** 裁剪的文件列表 */
  fileList: FileList
  /** 保存外部传进来的fileList */
  preFileList: FileList
  /** 预览模态框显示状态 */
  previewVisible: boolean
  /** 预览模态框图片 */
  previewImage: string
}

export class ClipUpload extends PureComponent<ClipUploadProps, ClipUploadState> {
  private static defaultProps = defaultClipUploadProps

  private static getDerivedStateFromProps(nextProps: ClipUploadProps, preState: ClipUploadState) {
    const nextUrls: Array<string> = nextProps.value || [] // 从父元素传过来的fileList 格式如['xxxx', 'yyy']
    const prelUrls: Array<string> = preState.preFileList.map((item) => item.url) // 从之前保存的preFileList 映射获取链接集合 结果如格式['xxxx', 'yyy']
    if (isEqual(nextUrls, prelUrls)) {
      return null
    }
    // 从父元素实时传输过来的参数链接集合和之前保存的链接集合比较 如果不一样 就要执行以下过程
    const fileList: FileList = nextUrls.map((item, i) => {
      let uid: string

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
    return {
      fileList,
      preFileList: fileList
    }
  }

  public state: ClipUploadState = {
    fileList: [],
    preFileList: [],
    previewVisible: false,
    previewImage: ''
  }

  private clipRef: any
  /** 储存自定义上传的成功回调, 如订阅发布模式, 可在某一刻再来执行 */
  private customRequestSuccessCollect: SuccessCollect = {}
  /** 裁剪初始化 */
  private clipInitial: boolean = false
  /** 文件上传的数量 */
  private fileLength: number = 0
  /** 上传限制 */
  public handleBeforeUpload = (file: File): boolean => {
    const preLength = (this.props.value || []).length
    const { maxAmount = 0 } = this.props
    if (!isPic(file.type)) { // 图片类型限制
      message.warn(`只能上传图片哦~`)
      return false
    }
    if (!this.clipInitial) {
      this.clipInitial = true
      this.fileLength = preLength // 这里需要添加外部传进来的值 且只执行一次
    }
    console.log(this.fileLength)
    if (this.fileLength >= maxAmount) { // 图片数量限制
      message.warn(`只能最多上传${maxAmount}张图片哦~`)
      return false
    }
    this.clipRef.handleShow()
    this.fileLength += 1
    return true
  }

  /** 自定义上传 */
  public handleCustomRequest = (options: any) => {
    const { onProgress, onSuccess } = options
    onProgress()
    this.customRequestSuccessCollect[options.file.uid] = onSuccess
    this.handleDealImage(options)
  }

  /** 处理图片转base64 */
  public handleDealImage = ({ file }: { file: File }) => {
    getBase64((file)).then((url: any) => {
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
        }]
      })
    })
  }

  /** 移除图片 */
  public handleRemove = (file: UploadFile) => {
    const { fileList } = this.state
    const { onChange } = this.props
    this.setState({
      fileList: fileList.filter((item: FileItem) => item.uid !== file.uid)
    }, () => {
      this.fileLength -= 1
      if (onChange) {
        onChange(this.state.fileList.map((item: FileItem) => item.url))
      }
    })
  }

  /** 预览图片 */
  public handlePreview = (file: UploadFile) => {
    const { readonly } = this.props
    if (readonly) {
      this.setState({
        previewImage: file.url as string,
        previewVisible: true
      })
      return
    }
    const index = this.state.fileList.findIndex((item: FileItem) => item.uid === file.uid)
    this.clipRef.handleShow(index)
  }

  /** 预览图片取消 */
  public handlePreviewCancel = () => {
    this.setState({
      previewVisible: false
    })
  }

  /** 预览图片彻底消失回调 */
  public handlePreviewAfterClose = () => {
    this.setState({
      previewImage: ''
    })
  }

  /** 编辑成功之后的回调 */
  public handleSave = (fileList: FileList, afterSaveCb: () => void) => {
    const { api } = this.props

    // 需要远程保存的图片数量
    let hasClipImgsAmount = fileList.reduce((pre, next) => next.hasClip ? pre + 1 : pre, 0)

    if (!hasClipImgsAmount) {
      // 所有图片没有修改的情况下 不需要任何操作
      this.clipRef.handleHide()
      afterSaveCb()
      return
    }

    for (let i = 0, l = fileList.length; i < l; i++) {
      const item = fileList[i]
      if (item.hasClip) {
        // 编辑过的图片需要重新上传
        const file = dataURLtoFile(item.url, item.name) // 把base64图片组转换成file

        api(file)
          // eslint-disable-next-line no-loop-func
          .then((res) => {
            const newFileList: FileList = [
              ...this.state.fileList.slice(0, i),
              {
                ...(this.state.fileList[i] as FileItem),
                url: res.url,
                hasClip: false,
                status: 'done'
              },
              ...this.state.fileList.slice(i + 1)
            ]
            this.setState({
              fileList: newFileList
            }, () => {
              hasClipImgsAmount = hasClipImgsAmount - 1
              if (hasClipImgsAmount === 0) {
                // 直到需要远程保存的图片成功保存之后才算编辑成功
                message.success('图片编辑成功!')
                afterSaveCb()
                this.clipRef.handleHide()
              }
              if (this.customRequestSuccessCollect[item.uid]) {
                this.customRequestSuccessCollect[item.uid]()
              }
            })
          })
          // eslint-disable-next-line no-loop-func
          .catch(() => {
            hasClipImgsAmount = hasClipImgsAmount - 1
            if (hasClipImgsAmount === 0) {
              afterSaveCb()
            }
            message.error('图片保存失败, 请点击重新保存')
          })
      }
    }
  }

  /** 编辑消失之后的回调 */
  public handleAfterClose = (isSave: boolean) => {
    const { preFileList, fileList } = this.state
    const { onChange } = this.props
    if (isSave) {
      this.fileLength = fileList.length
      if (onChange) {
        onChange(fileList.map((item: FileItem) => item.url))
      }
    } else {
      // 编辑取消保存 重新设置为fileList对应的图片
      this.fileLength = preFileList.length
      this.setState({
        fileList: preFileList
      })
    }
  }

  public handleClipRef = (ref: any) => {
    this.clipRef = ref
  }

  public render() {
    const { fileList, previewVisible, previewImage } = this.state
    const { maxAmount, maxSize, clipWidth, clipHeigth, readonly, help } = this.props

    /** readonly 为true 且 fileList 数组为空的话 预览的时候只需要显示为空 */
    const empty = (!fileList.length) && readonly

    return (
      <div>
        <Clip
          ref={this.handleClipRef}
          fileList={fileList}
          maxSize={maxSize!}
          clipWidth={clipWidth!}
          clipHeigth={clipHeigth!}
          help={help!}
          onSave={this.handleSave}
          onAfterClose={this.handleAfterClose}
        />
        {
          empty ?
            <div style={{ width: 200 }}>
              <Empty />
            </div>
            :
            <Upload
              accept='image/*'
              multiple
              listType='picture-card'
              fileList={fileList.map((file: FileItem) => ({
                uid: file.uid,
                name: file.name,
                status: file.status,
                url: file.url,
                size: file.size,
                type: file.type
              }))}
              beforeUpload={this.handleBeforeUpload}
              customRequest={this.handleCustomRequest}
              onRemove={this.handleRemove}
              onPreview={this.handlePreview}
              showUploadList={{
                showPreviewIcon: true,
                showRemoveIcon: !readonly
              }}
            >
              {
                readonly ? null : (fileList.length >= maxAmount! ? null : uploadButton)
              }
            </Upload>
        }
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handlePreviewCancel}
          afterClose={this.handlePreviewAfterClose}
        >
          <img alt='previewImage' style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    )
  }
}

export default ClipUpload
