import React, { PureComponent } from 'react'
import { Modal, Icon, message, Button, Divider } from 'antd';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import classNames from 'classnames';
import {
  getBase64Size,
  sizeOverflow
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
          src={item.src}
        />
        {
          overflow && <span className={styles[`clip-preview-error`]}>超出大小限制</span>
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
      imgs: [],
      current: 0, // 当前裁剪图片
      preImgs: [],
      isSave: false
    }
  }

  static getDerivedStateFromProps(nextProps, preState) {
    if (nextProps.imgList !== preState.preImgs) {
      // 获取第一张待编辑的索引
      const index = nextProps.imgList.findIndex(item => item.hasClip)

      return {
        imgs: nextProps.imgList,
        preImgs: nextProps.imgList,
        current: index >= 0 ? index : 0
      }
    }
    return null
  }

  /** 切换图片 */
  handleSwitch = (action) => {
    const { current, imgs } = this.state;

    if (action === 'pre') {
      // 上一张
      if (current === 0) return message.warn('已经是第一张了~')
      this.setState({
        current: current - 1
      })
    } else if (action === 'next') {
      // 下一张
      if (current === imgs.length - 1) return message.warn('已经是最后一张了~')
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
    const { imgs, preImgs } = this.state;
    this.setState({
      imgs: [
        ...imgs.slice(0, current),
        preImgs[current],
        ...imgs.slice(current + 1)
      ]
    })
  }


  /** 裁切图片 */
  handleClip = () => {
    if (typeof this.cropper.getCroppedCanvas() === 'undefined') return;
    const { imgs, current } = this.state;
    this.setState({
      imgs: [
        ...imgs.slice(0, current),
        {
          ...imgs[current],
          src: this.cropper.getCroppedCanvas().toDataURL(),
          hasClip: true // 确认裁剪过
        },
        ...imgs.slice(current + 1)
      ]
    })
  }

  /** 判断图片是否超出预定大小 */
  isOverflow = (item) => {
    let overflow = false
    if (item.hasClip) {
      // 对裁剪的图片需要做判断大小
      const size = getBase64Size(item.src);
      if (sizeOverflow(size, this.props.maxSize)) {
        overflow = true
      }
    }
    return overflow
  }

  /** 保存所有图片 */
  handleSave = () => {
    const { onSave } = this.props;
    const { imgs } = this.state;
    const isOverflow = imgs.some(this.isOverflow)
    if (isOverflow) {
      message.warn('有图片超出大小限制, 请裁剪合格之后再保存图片~')
      return;
    }
    onSave && onSave(imgs);
    this.setState({
      isSave: true
    })
  }

  /** 取消保存 */
  handleCancel = () => {
    const { imgs, preImgs } = this.state;
    if (imgs.some((item, i) => item.src !== preImgs[i].src)) {
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
    const { visible, imgs, current, preImgs } = this.state
    const { clipWidth, clipHeigth, loading } = this.props

    const CropperStyleHeight = clipHeigth + 50

    const placeholder = [...Array(ImgMaxCount - imgs.length).keys()]

    let currentSrc;

    if (imgs.length) {
      currentSrc = imgs[current].src || preImgs[current].src
    }

    return (
      <Modal
        width={1000}
        visible={visible}
        className={styles[`clip-wrap`]}
        onCancel={this.handleCancel}
        afterClose={this.handleAfterClose}
        footer={null}
      >
        {/* 图片裁剪区 */}
        <div className={styles[`clip-main`]}>
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
        {/* 图片选择区 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            marginTop: 16
          }}
        >
          {
            imgs.map((item, i) => (
              <ImgWrap key={i}
                index={i}
                overflow={this.isOverflow(item)}
                item={item || preImgs[current]}
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
            确认 ({current + 1} / {imgs.length}) 裁剪
          </Button>
          <Button
            loading={loading}
            onClick={this.handleSave}
            type="primary"
            style={{ marginLeft: 16 }}
          >
            保存所有图片
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