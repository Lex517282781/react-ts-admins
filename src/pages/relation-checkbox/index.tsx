import React, { PureComponent } from 'react'
import Panel from '@/components/panel'
import RelationCheckbox from '@/components/relation-checkbox'

const list = [
  {
    label: '选项1',
    value: '1',
    children: [...new Array(10)].map((_, i) => ({
      label: `选项1-${i + 1}`,
      value: `1-${i + 1}`
    }))
  },
  {
    label: '选项2',
    value: '2',
    children: [
      {
        label: '选项2-1',
        value: '2-1'
      },
      {
        label: '选项2-2',
        value: '2-2'
      }
    ]
  }
]

class RelationCheckboxPage extends PureComponent {
  render () {
    return (
      <Panel title='关联复选'>
        <RelationCheckbox options={list} />
      </Panel>
    )
  }
}

export default RelationCheckboxPage
