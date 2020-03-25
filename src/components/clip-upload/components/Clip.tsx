import React, { PureComponent } from 'react'
import { Modal, Icon, message, Tooltip, Button, Divider } from 'antd'
import Cropper from 'react-cropper'
import ImgWrap from './ImgWrap'
import ImgWrapTemp from './ImgWrapTemp'
import { FileItem, FileList } from '../config/interface'
import { getBase64Size, sizeOverflow, makeArray } from '../config/util'
import 'cropperjs/dist/cropper.css'
import styles from '../style.module.styl'

const { confirm } = Modal

interface ClipProps {
  fileList: FileList
  onSave: (arr: FileList, cb: () => void) => void
  onAfterClose: (isSave: boolean) => void
  maxSize: number
  clipWidth: number
  clipHeigth: number,
  help: string[]
}

interface ClipState {
  visible: boolean
  fileList: FileList
  preFileList: FileList
  current: number
  isSave: boolean
  loading: boolean
}

const ImgMaxCount = 9

class Clip extends PureComponent<ClipProps, ClipState> {
  private static getDerivedStateFromProps (nextProps: ClipProps, preState: ClipState) {
    if (nextProps.fileList === preState.preFileList) {
      return null
    }
    // 获取第一张待编辑的索引
    const index: number = nextProps.fileList.findIndex((item) => item.hasClip)

    return {
      fileList: nextProps.fileList,
      preFileList: nextProps.fileList,
      current: index >= 0 ? index : 0
    }
  }

  public state: ClipState = {
    visible: false,
    fileList: [],
    current: 0, // 当前裁剪图片
    preFileList: [],
    isSave: false,
    loading: false
  }

  private cropperRef: any

  /** 切换图片 */
  public handleSwitch = (action: string) => {
    const { current, fileList } = this.state
    if (action === 'pre') {
      // 上一张
      if (current === 0) {
        message.warn('已经是第一张了~')
        return
      }
      this.setState({
        current: current - 1
      })
    } else if (action === 'next') {
      // 下一张
      if (current === fileList.length - 1) {
        message.warn('已经是最后一张了~')
        return
      }
      this.setState({
        current: current + 1
      })
    }
  }

  /** 点击图片 */
  public handleImg = (current: number) => {
    this.setState({
      current
    })
  }

  /** 重置图片 */
  public handleRefresh = (current: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const { fileList, preFileList } = this.state
    this.setState({
      fileList: [
        ...fileList.slice(0, current),
        preFileList[current],
        ...fileList.slice(current + 1)
      ]
    })
  }

  /** 裁切图片 */
  public handleClip = () => {
    if (!this.cropperRef.getCroppedCanvas()) {
      return
    }
    const { fileList, current } = this.state
    this.setState({
      fileList: [
        ...fileList.slice(0, current),
        {
          ...fileList[current],
          url: this.cropperRef.getCroppedCanvas().toDataURL(),
          hasClip: true // 确认裁剪过
        },
        ...fileList.slice(current + 1)
      ]
    })
  }

  /** 判断图片是否超出预定大小 */
  public isOverflow = (item: FileItem) => {
    let overflow = false
    if (item.hasClip) {
      // 对裁剪的图片需要做判断大小
      const size = getBase64Size(item.url)
      if (sizeOverflow(size, this.props.maxSize)) {
        overflow = true
      }
    }
    return overflow
  }

  /** 保存所有图片 */
  public handleSave = () => {
    const { onSave } = this.props
    const { fileList } = this.state
    this.setState({
      loading: true,
      isSave: true
    }, () => {
      const isOverflow = fileList.some(this.isOverflow)
      if (isOverflow) {
        message.warn('有图片超出大小限制, 请裁剪合格之后再保存图片~')
        this.setState({
          loading: false
        })
        return
      }
      if (onSave) {
        onSave(fileList, () => {
          this.setState({
            loading: false
          })
        })
      }
    })
  }

  /** 取消保存 */
  public handleCancel = () => {
    const { fileList, preFileList } = this.state
    if (fileList.some((item, i) => item.url !== preFileList[i].url)) {
      return confirm({
        title: '发现你有裁剪图片, 确认不保存吗?',
        okText: '不保存',
        cancelText: '返回编辑',
        onOk: () => {
          this.setState({
            visible: false,
            isSave: false
          })
        }
      })
    }
    this.setState({
      visible: false,
      isSave: false
    })
  }

  /** 模态框消失回调 */
  public handleAfterClose = () => {
    const { isSave } = this.state
    const { onAfterClose } = this.props
    this.setState({
      current: 0
    }, () => {
      if (onAfterClose) {
        onAfterClose(isSave)
      }
    })
  }

  /** 模态框显示 */
  public handleShow = (index: number) => {
    const state = {
      visible: true,
      current: 0
    }
    if (index !== undefined) {
      state.current = index
    }
    this.setState(state)
  }

  /** 模态框消失 */
  public handleHide = () => {
    this.setState({
      visible: false
    })
  }

  public handleCropperRef = (ref: any) => {
    this.cropperRef = ref
  }

  public render () {
    const { visible, fileList, current, preFileList, loading } = this.state
    const { clipWidth, clipHeigth, help } = this.props

    const CropperStyleHeight: number = clipHeigth + 50

    const placeholder = makeArray(ImgMaxCount - fileList.length)

    let currentSrc: string = ''

    if (fileList.length) {
      currentSrc = fileList[current].url || preFileList[current].url
    }

    return (
      <Modal
        width={700}
        visible={visible}
        className={styles[`clip-wrap`]}
        onCancel={this.handleCancel}
        afterClose={this.handleAfterClose}
        footer={null}
      >
        {/* 图片裁剪区 */}
        <div
          className={styles[`clip-main`]}
          style={{
            zoom: `${652 / 952}`
          }}
        >
          <Cropper
            style={{ height: CropperStyleHeight, width: '100%' }}
            guides={false}
            dragMode='move'
            src={currentSrc}
            minContainerWidth={952}
            minContainerHeight={CropperStyleHeight}
            minCropBoxWidth={clipWidth}
            minCropBoxHeight={clipHeigth}
            cropBoxResizable={false}
            cropBoxMovable={false}
            ref={this.handleCropperRef}
          />
          <Icon
            className={styles[`clip-pre`]}
            onClick={this.handleSwitch.bind(this, 'pre')}
            type='left'
          />
          <Icon
            className={styles[`clip-next`]}
            onClick={this.handleSwitch.bind(this, 'next')}
            type='right'
          />
        </div>
        {/* 图片信息区 */}
        <div className={styles[`clip-info`]}>
          {current + 1} / {fileList.length}
          <Tooltip
            title={help.map((item, i) => <p key={i}>{item}</p>)}
            placement='bottom'
          >
            <Button className={styles[`clip-help`]} type='link'>
              <Icon type='info-circle' />
            </Button>
          </Tooltip>
        </div>
        {/* 图片选择区 */}
        <div className={styles[`clip-options`]}>
          {
            fileList.map((item, i) => (
              <ImgWrap
                key={i}
                index={i}
                overflow={this.isOverflow(item)}
                item={item || preFileList[current]}
                active={current === i}
                onItemClick={this.handleImg}
                onRefreshClick={this.handleRefresh}
              />
            ))
          }
          {
            placeholder.map((i: number) => (
              <ImgWrapTemp key={i} />
            ))
          }
        </div>
        <Divider />
        {/* 操作区 */}
        <div className={styles[`clip-actions`]}>
          <Button
            onClick={this.handleClip}
            type='primary'
          >
            确认裁剪
          </Button>
          <Button
            loading={loading}
            onClick={this.handleSave}
            type='primary'
            style={{ marginLeft: 16 }}
          >
            保存图片
          </Button>
          <Button
            onClick={this.handleCancel}
            style={{ marginLeft: 16 }}
          >
            取消
          </Button>
        </div>
      </Modal>
    )
  }
}

export default Clip
