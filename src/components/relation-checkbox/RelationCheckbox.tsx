import React, { PureComponent } from 'react'
import { Checkbox, Divider } from 'antd'
import RelationCheckboxItem from './components/RelationCheckboxItem'
import { Option } from './config/interface'

type ValuesProp = Array<string | number>

interface RelationCheckboxProps {
  options: Option[]
  /* 一级全部显示文案 */
  oneLabel?: React.ReactNode
  /* 二级全部显示文案 */
  twoLabel?: React.ReactNode
  /* 一级全部显示文案是否显示 */
  oneLabelShow?: boolean
  /* 二级全部显示文案是否显示 */
  twoLabelShow?: boolean
  /* 二级label宽度 */
  lableSpan?: number
  /* 二级value宽度 */
  valueSpan?: number
  onChange?: (values: ValuesProp) => void
}

class RelationCheckbox extends PureComponent<RelationCheckboxProps> {
  handleItemChange = (values: ValuesProp) => {
    console.log(values)
  }

  render () {
    const {
      options,
      oneLabel = '全部',
      oneLabelShow = true,
      twoLabel,
      twoLabelShow,
      lableSpan,
      valueSpan
    } = this.props

    return (
      <div>
        {
          oneLabelShow && (
            <>
              <div>
                <Checkbox
                >
                  {oneLabel}
                </Checkbox>
              </div>
              <Divider style={{ margin: '12px 0' }} />
            </>
          )
        }
        {options.map((item) => (
          <RelationCheckboxItem
            key={item.value}
            option={item}
            label={twoLabel}
            labelShow={twoLabelShow}
            lableSpan={lableSpan}
            valueSpan={valueSpan}
            onChange={this.handleItemChange}
          />
        ))}
      </div>
    )
  }
}

export default RelationCheckbox
