import React, { PureComponent } from 'react'
import { Avatar, Card } from 'antd'
import Panel from '@/components/panel'
import CarouselPreview from '@/components/carousel-preview'

const imgs = [
  'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
  'http://xituan.oss-cn-shenzhen.aliyuncs.com/supplier/809039C5C4EC6EE0.jpg'
]

const imgs2 = [
  {
    label: '这是图片一',
    value:
      'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
  },
  {
    label: '这是图片二',
    value:
      'http://xituan.oss-cn-shenzhen.aliyuncs.com/supplier/809039C5C4EC6EE0.jpg'
  }
]

class CarouselPreviewPage extends PureComponent {
  state = {
    visible: false,
    list: []
  }

  handleImgsPreview = () => {
    this.setState({
      visible: true,
      list: imgs
    })
  }

  handleImgsDescPreview = () => {
    this.setState({
      visible: true,
      list: imgs2
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
        <Card type='inner' title='纯图片展示'>
          <div
            style={{ display: 'inline-block' }}
            onClick={this.handleImgsPreview}
          >
            <Avatar
              size={64}
              shape='square'
              src={imgs[0]}
            />
          </div>
        </Card>
        <Card
          style={{ marginTop: 24 }}
          type='inner'
          title='图片+描述展示'
        >
          <div
            style={{ display: 'inline-block' }}
            onClick={this.handleImgsDescPreview}
          >
            <Avatar
              size={64}
              shape='square'
              src={imgs[0]}
            />
          </div>
        </Card>
        <CarouselPreview
          visible={visible}
          list={list}
          onCancel={this.handleCancel}
        />
      </Panel>
    )
  }
}

export default CarouselPreviewPage
