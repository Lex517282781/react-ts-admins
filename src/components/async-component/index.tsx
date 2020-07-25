import React, { PureComponent } from 'react'
import { Spin } from 'antd'

function PageLoading () {
  return (
    <div style={{ paddingTop: 100, textAlign: 'center' }}>
      <Spin size="large" />
    </div>
  )
}

export default function asyncComponent (importComponent: any) {
  class AsyncComponent extends PureComponent {
    _isMounted = false
    state = {
      component: null
    }

    async componentDidMount () {
      this._isMounted = true
      const { default: component } = await importComponent()
      if (!this._isMounted) return
      this.setState({
        component: component
      })
    }

    componentWillUnmount () {
      this._isMounted = false
    }

    render () {
      const Component: any = this.state.component

      return Component ? <Component {...this.props} /> : <PageLoading />
    }
  }

  return AsyncComponent
}
