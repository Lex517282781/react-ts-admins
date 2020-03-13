import React, { PureComponent } from 'react'
import { Modal, Icon, message, Button, Divider } from 'antd';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import classNames from 'classnames';
import styles from './style.module.styl'

const { confirm } = Modal;

/** 选择图组件 */
const ImgWrap = ({ index, item, active, onItemClick, onRefreshClick }) => {

  const cls = classNames(
    styles[`img-wrap`],
    styles[`img-wrap-block`],
    { [styles[`img-wrap-active`]]: active }
  )

  return (
    <div
      title='点击切换裁剪图片'
      onClick={onItemClick.bind(null, index)}
      className={cls}
    >
      <img
        className={styles[`img`]}
        alt="img"
        src={item.src}
      />
      <Icon
        title='点击恢复原图'
        onClick={onRefreshClick.bind(null, index)}
        className={styles[`reset`]}
        type="redo"
      />
    </div>
  )
}

/** 选择图占位组件 */
const ImgWrapTemp = () => {
  return (
    <div className={styles[`img-wrap`]}></div>
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
      return {
        imgs: nextProps.imgList,
        preImgs: nextProps.imgList
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

  /** 保存所有图片 */
  handleSave = () => {
    const { onSave } = this.props;
    const { imgs } = this.state;
    onSave && onSave(imgs);
    message.success('图片编辑成功!');
    this.setState({
      visible: false,
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
  handleAfterCloase = () => {
    const { isSave } = this.state
    const { onAfterClose } = this.props
    this.setState({
      current: 0
    }, () => {
      onAfterClose && onAfterClose(isSave)
    })
  }

  /** 模态框显示 */
  handleShow = () => {
    this.setState({
      visible: true
    })
  }

  /** 模态框消失 */
  handleHide = () => {
    this.setState({
      visible: false
    })
  }

  render() {
    const { visible, imgs, current, preImgs } = this.state

    const placeholder = [...Array(ImgMaxCount - imgs.length).keys()]

    let currentSrc;

    if (imgs.length) {
      currentSrc = imgs[current].src || preImgs[current].src
    }

    return (
      <Modal
        width="80%"
        visible={visible}
        className={styles.wrap}
        onCancel={this.handleCancel}
        afterClose={this.handleAfterCloase}
        footer={null}
      >
        {/* 图片裁剪区 */}
        <Cropper
          style={{ height: 500, width: '100%' }}
          // aspectRatio={1 / 1}
          guides={false}
          src={currentSrc}
          ref={cropper => { this.cropper = cropper; }}
        />
        {/* 图片上一张下一章 */}
        <Icon
          className={styles.pre}
          onClick={this.handleSwitch.bind(this, 'pre')}
          type="left"
        />
        <Icon
          className={styles.next}
          onClick={this.handleSwitch.bind(this, 'next')}
          type="right"
        />
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
        <div className={styles.actions}>
          <Button onClick={this.handleClip} type="primary">确认 ({current + 1} / {imgs.length}) 裁剪</Button>
          <Button onClick={this.handleSave} type="primary" style={{ marginLeft: 16 }}>保存所有图片</Button>
          <Button onClick={this.handleCancel} style={{ marginLeft: 16 }}>取消</Button>
        </div>
      </Modal>
    )
  }
}

export default Clip