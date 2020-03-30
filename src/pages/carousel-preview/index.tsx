import React, { PureComponent } from 'react'
import { Avatar } from 'antd'
import Panel from '@/components/panel'
import CarouselPreview from '@/components/carousel-preview'

const imgs = [
  'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
  'http://xituan.oss-cn-shenzhen.aliyuncs.com/supplier/809039C5C4EC6EE0.jpg'
]

class CarouselPreviewPage extends PureComponent {
  state = {
    visible: false,
    list: []
  }

  handlePreview = () => {
    this.setState({
      visible: true,
      list: imgs
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false,
      list: []
    })
  }

  render () {
    const { visible, list } = this.state

    return (
      <Panel title='轮播预览组件'>
        <CarouselPreview
          visible={visible}
          list={list}
          onCancel={this.handleCancel}
        />
        <div
          style={{ display: 'inline-block' }}
          onClick={this.handlePreview}
        >
          <Avatar size={64} shape='square' src={imgs[0]} />
        </div>
      </Panel>
    )
  }
}

export default CarouselPreviewPage
