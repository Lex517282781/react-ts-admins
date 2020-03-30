import React, { PureComponent } from 'react'
import { Modal, Carousel, Icon } from 'antd'
import { defaultCarouselPreviewProps } from './config/config'
import CarouselItem from './components/CarouselItem'
import { ListItem } from './config/interface'
import styles from './style.module.styl'

type CarouselPreviewProps = {
  onCancel?: (e: React.MouseEvent<HTMLElement>) => void
  afterClose?: () => void
} & Partial<typeof defaultCarouselPreviewProps>

interface CarouselPreviewState {
  activeSlide: number
  list: Array<ListItem>
}

class CarouselPreview extends PureComponent<
  CarouselPreviewProps,
  CarouselPreviewState
> {
  private static defaultProps = defaultCarouselPreviewProps

  private static getDerivedStateFromProps (
    nextProps: CarouselPreviewProps
  ) {
    if (
      nextProps.visible &&
      (nextProps.list && nextProps.list.length)
    ) {
      return {
        list: nextProps.list
      }
    }
    return null
  }

  public state: CarouselPreviewState = {
    activeSlide: 0,
    list: []
  }

  private sliderRef: any

  public handleAfterClose = () => {
    this.setState(
      {
        activeSlide: 0,
        list: []
      },
      () => {
        if (this.props.afterClose) {
          this.props.afterClose()
        }
      }
    )
  }

  /** 图片切换 */
  public handleBeforeChange = (
    current: any,
    next: number
  ) => {
    console.log(current)
    this.setState({
      activeSlide: next
    })
  }

  public handleSlideRef = (ref: any) => {
    this.sliderRef = ref
  }

  render () {
    const { title, visible, onCancel } = this.props
    const { list, activeSlide } = this.state

    return (
      <div>
        <Modal
          visible={visible}
          bodyStyle={{
            padding: '24px 64px 12px'
          }}
          className={styles.slider}
          footer={null}
          title={title}
          onCancel={onCancel}
          afterClose={this.handleAfterClose}
        >
          <Carousel
            dots={false}
            infinite={true}
            beforeChange={this.handleBeforeChange}
            ref={this.handleSlideRef}
          >
            {list.map((item, i) => (
              <CarouselItem key={i} item={item} />
            ))}
          </Carousel>
          <p className={styles.hint}>
            {activeSlide + 1} / {list.length}
          </p>
          {/* <Icon
            className={[styles.action, styles.actionPre]}
            type='left-circle'
            onClick={this.handlePrev.bind(true)}
          />
          <Icon
            className={[styles.action, styles.actionNext]}
            type='right-circle'
            onClick={this.handleNext.bind(true)}
          /> */}
        </Modal>
      </div>
    )
  }
}

export default CarouselPreview
