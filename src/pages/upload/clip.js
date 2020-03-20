import React, { PureComponent } from 'react'
import { Modal, Icon, message, Button, Divider, Tooltip } from 'antd';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import classNames from 'classnames';
import {
  getBase64Size,
  sizeOverflow,
  helpInfos
} from './config'
import styles from './style.module.styl'

const { confirm } = Modal;

/** 选择图组件 */
const ImgWrap = ({ index, overflow, item, active, onItemClick, onRefreshClick }) => {

  const cls = classNames(
    styles[`clip-preview-wrap`],
    styles[`clip-preview-wrap-content`],
    { [styles[`clip-preview-wrap-active`]]: active }
  )

  return (
    <div className={cls}>
      <div
        title='点击切换裁剪图片'
        onClick={onItemClick.bind(null, index)}
        className={styles[`clip-preview-img-wrap`]}
      >
        <img
          className={styles[`clip-preview-img`]}
          alt="img"
          src={item.url}
        />
        {
          overflow && 
          <div className={styles[`clip-preview-error`]}>
            <span className={styles[`clip-preview-error-inner`]}>超出大小</span>
          </div>
        }
      </div>
      <div onClick={onRefreshClick.bind(null, index)} className={styles[`clip-preview-text`]}>
        恢复原图
      </div>
    </div>
  )
}

/** 选择图占位组件 */
const ImgWrapTemp = () => {
  return (
    <div className={styles[`clip-preview-wrap`]}></div>
  )
}

const ImgMaxCount = 9;

class Clip extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      fileList: [],
      current: 0, // 当前裁剪图片
      preFileList: [],
      isSave: false,
      loading: false
    }
  }

  static getDerivedStateFromProps(nextProps, preState) {
    if (nextProps.fileList !== preState.preFileList) {
      // 获取第一张待编辑的索引
      const index = nextProps.fileList.findIndex(item => item.hasClip)

      return {
        fileList: nextProps.fileList,
        preFileList: nextProps.fileList,
        current: index >= 0 ? index : 0
      }
    }
    return null
  }

  /** 切换图片 */
  handleSwitch = (action) => {
    const { current, fileList } = this.state;

    if (action === 'pre') {
      // 上一张
      if (current === 0) return message.warn('已经是第一张了~')
      this.setState({
        current: current - 1
      })
    } else if (action === 'next') {
      // 下一张
      if (current === fileList.length - 1) return message.warn('已经是最后一张了~')
      this.setState({
        current: current + 1
      })
    }
  }

  /** 点击图片 */
  handleImg = (current) => {
    this.setState({
      current
    })
  }

  /** 重置图片 */
  handleRefresh = (current, e) => {
    e.stopPropagation();
    const { fileList, preFileList } = this.state;
    this.setState({
      fileList: [
        ...fileList.slice(0, current),
        preFileList[current],
        ...fileList.slice(current + 1)
      ]
    })
  }


  /** 裁切图片 */
  handleClip = () => {
    if (!this.cropper.getCroppedCanvas()) return;
    const { fileList, current } = this.state;
    this.setState({
      fileList: [
        ...fileList.slice(0, current),
        {
          ...fileList[current],
          url: this.cropper.getCroppedCanvas().toDataURL(),
          hasClip: true // 确认裁剪过
        },
        ...fileList.slice(current + 1)
      ]
    })
  }

  /** 判断图片是否超出预定大小 */
  isOverflow = (item) => {
    let overflow = false
    if (item.hasClip) {
      // 对裁剪的图片需要做判断大小
      const size = getBase64Size(item.url);
      if (sizeOverflow(size, this.props.maxSize)) {
        overflow = true
      }
    }
    return overflow
  }

  /** 保存所有图片 */
  handleSave = () => {
    const { onSave } = this.props;
    const { fileList } = this.state;
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
        return;
      }
      onSave && onSave(fileList, () => {
        this.setState({
          loading: false
        })
      });
    })
  }

  /** 取消保存 */
  handleCancel = () => {
    const { fileList, preFileList } = this.state;
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
      });
    }
    this.setState({
      visible: false,
      isSave: false
    })
  }

  /** 模态框消失回调 */
  handleAfterClose = () => {
    const { isSave } = this.state
    const { onAfterClose } = this.props
    this.setState({
      current: 0
    }, () => {
      onAfterClose && onAfterClose(isSave)
    })
  }

  /** 模态框显示 */
  handleShow = (index) => {
    const state = {
      visible: true
    }
    if (index !== undefined) state.current = index
    this.setState(state)
  }

  /** 模态框消失 */
  handleHide = () => {
    this.setState({
      visible: false
    })
  }

  render() {
    const { visible, fileList, current, preFileList, loading } = this.state
    const { clipWidth, clipHeigth } = this.props

    const CropperStyleHeight = clipHeigth + 50

    const placeholder = [...Array(ImgMaxCount - fileList.length).keys()]

    let currentSrc;

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
            dragMode="move"
            src={currentSrc}
            minContainerWidth={952}
            minContainerHeight={CropperStyleHeight}
            minCropBoxWidth={clipWidth}
            minCropBoxHeight={clipHeigth}
            cropBoxResizable={false}
            cropBoxMovable={false}
            ref={cropper => { this.cropper = cropper; }}
          />
          <Icon
            className={styles[`clip-pre`]}
            onClick={this.handleSwitch.bind(this, 'pre')}
            type="left"
          />
          <Icon
            className={styles[`clip-next`]}
            onClick={this.handleSwitch.bind(this, 'next')}
            type="right"
          />
        </div>
        {/* 图片信息区 */}
        <div className={styles[`clip-info`]}>
          {current + 1} / {fileList.length}
          <Tooltip
            title={helpInfos.map((item, i) => <p key={i}>{item}</p>)}
            placement="bottom"
          >
            <Button className={styles[`clip-help`]} type="link">
              <Icon type="info-circle" />
            </Button>
          </Tooltip>
        </div>
        {/* 图片选择区 */}
        <div className={styles[`clip-options`]}>
          {
            fileList.map((item, i) => (
              <ImgWrap key={i}
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
            placeholder.map((i) => (
              <ImgWrapTemp key={i} />
            ))
          }
        </div>
        <Divider />
        {/* 操作区 */}
        <div className={styles[`clip-actions`]}>
          <Button
            onClick={this.handleClip}
            type="primary"
          >
            确认裁剪
          </Button>
          <Button
            loading={loading}
            onClick={this.handleSave}
            type="primary"
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