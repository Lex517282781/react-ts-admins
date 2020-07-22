import React, { PureComponent } from 'react'
import { Checkbox, Row, Col } from 'antd'
import { Option } from '../config/interface'

const CheckboxGroup = Checkbox.Group

interface RelationCheckboxItemProps {
  option: Option
  label?: React.ReactNode | ((text: React.ReactNode) => React.ReactNode)
  labelShow?: boolean
  /* 二级label宽度 */
  lableSpan?: number
  /* 二级value宽度 */
  valueSpan?: number
  onChange?: (values: Array<string | number>) => void
}

class RelationCheckboxItem extends PureComponent<RelationCheckboxItemProps> {
  state = {
    checkedList: [],
    indeterminate: false,
    checkAll: false
  }

  onChange = (checkedList: any[]) => {
    const { option: { children = [] }, onChange } = this.props
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && checkedList.length < children.length,
      checkAll: checkedList.length === children.length
    }, () => {
      if (typeof onChange === 'function') {
        onChange(checkedList)
      }
    })
  }

  onCheckAllChange = (e: any) => {
    const { option: { children = [] } } = this.props
    this.setState({
      checkedList: e.target.checked ? children.map(item => item.value) : [],
      indeterminate: false,
      checkAll: e.target.checked
    })
  }

  render () {
    const {
      option: { label, children = [] },
      label: externalLabel,
      labelShow = true,
      lableSpan = 2,
      valueSpan = 22
    } = this.props
    let labelEL: any = label

    if (typeof externalLabel === 'function') {
      labelEL = externalLabel(label) || labelEL
    } else {
      labelEL = externalLabel || labelEL
    }

    return (
      <div style={{ marginBottom: 8 }}>
        <Row>
          {
            labelShow && (
              <Col span={lableSpan}>
                <Checkbox
                  indeterminate={this.state.indeterminate}
                  onChange={this.onCheckAllChange}
                  checked={this.state.checkAll}
                >
                  {labelEL}
                </Checkbox>
              </Col>
            )
          }
          <Col span={labelShow ? valueSpan : 24}>
            <CheckboxGroup
              options={children}
              value={this.state.checkedList}
              onChange={this.onChange}
            />
          </Col>
        </Row>
      </div>
    )
  }
}

export default RelationCheckboxItem
