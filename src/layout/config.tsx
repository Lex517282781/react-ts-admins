const makeCategorys = (categorys: any[]) => {
  return categorys.reduce((pre, next, i) => {
    return [
      ...pre,
      {
        ...next,
        id: '' + (i + 1),
        list: next.list.map((item: any, j: number) => ({
          ...item,
          id: '' + (i + 1) + '-' + (j + 1)
        }))
      }
    ]
  }, [])
}

export const categorys = makeCategorys([
  {
    text: '操作',
    list: [
      {
        text: '裁剪上传组件',
        url: '/clip-upload'
      },
      {
        text: '颜色选择组件',
        url: '/color-picker'
      },
      {
        text: '表单组件',
        url: '/form'
      },
      {
        text: '下拉搜索选择组件',
        url: '/select-search-fetch'
      },
      {
        text: '打印',
        url: '/print'
      },
      {
        text: 'React打印',
        url: '/react-print'
      },
      {
        text: '表格打印',
        url: '/table-print'
      },
      {
        text: '关联复选',
        url: '/relation-checkbox'
      }
    ]
  },
  {
    text: '查看',
    list: [
      {
        text: '表格操作',
        url: '/action-view'
      },
      {
        text: '表格列表',
        url: '/list-page'
      },
      {
        text: '轮播预览',
        url: '/carousel-preview'
      },
      {
        text: 'column渲染组件',
        url: '/column-wrap'
      }
    ]
  },
  {
    text: 'DEMO',
    list: [
      {
        text: 'demo',
        url: '/demo'
      }
    ]
  }
])
