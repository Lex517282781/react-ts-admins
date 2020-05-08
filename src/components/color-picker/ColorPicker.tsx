import React, { PureComponent } from 'react'
import { Button, Popover } from 'antd'
import {
  SketchPicker,
  RGBColor,
  ColorResult
} from 'react-color'
import { defaultColorPickerProps } from './config/config'

const colorStrReg = /^rgba\((\d+),\s+(\d+),\s+(\d+)(?:,\s+(\d+))?\)$/

type ColorPickerProps = {
  value?: string
  onChange?: (color: string) => void
} & Partial<typeof defaultColorPickerProps>

interface ColorPickerState {
  rgbColor: RGBColor
}

class ColorPicker extends PureComponent<
  ColorPickerProps,
  ColorPickerState
> {
  private static getDerivedStateFromProps (
    nextProps: ColorPickerProps,
    preState: ColorPickerState
  ) {
    console.log(nextProps, preState)
    if (!nextProps.value) return null
    const matchColor = colorStrReg.exec(nextProps.value)
    if (!matchColor) return null
    return null
  }

  public state: ColorPickerState = {
    rgbColor: {
      r: 24,
      g: 144,
      b: 255,
      a: 1
    }
  }

  public handleChangeComplete = ({ rgb }: ColorResult) => {
    const { onChange } = this.props
    this.setState(
      {
        rgbColor: {
          r: rgb.r,
          g: rgb.g,
          b: rgb.b,
          a: rgb.a
        }
      },
      () => {
        if (onChange) {
          const rgbColorStr = this.formatRgbColor(rgb)
          onChange(rgbColorStr)
        }
      }
    )
  }

  public formatRgbColor = (rgbColor: RGBColor) => {
    const rgbColorStr = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${rgbColor.a})`
    return rgbColorStr
  }

  render () {
    const { rgbColor } = this.state

    const rgbColorStr = this.formatRgbColor(rgbColor)

    return (
      <Popover
        placement='right'
        content={
          <SketchPicker
            color={rgbColorStr}
            onChangeComplete={this.handleChangeComplete}
          />
        }
      >
        <Button
          style={{
            width: 60,
            height: 60,
            background: rgbColorStr
          }}
        />
      </Popover>
    )
  }
}

export default ColorPicker
