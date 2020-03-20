import React, { PureComponent } from 'react'
import { Result } from './interface'
import { defaultProps } from './config'

type Props = {
  api: (f: File) => Promise<Result>
} & Partial<typeof defaultProps>

interface State {
}

export class ClipUpload extends PureComponent<Props, State> {
  static defaultProps = defaultProps

  state = {}

  render() {
    return (
      <div>
        123
      </div>
    )
  }
}

export default ClipUpload
