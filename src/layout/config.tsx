import asyncComponent from '@/components/async-component'

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
        url: '/clip-upload',
        component: asyncComponent(() => import('@/pages/clip-upload'))
      },
      {
        text: '颜色选择组件',
        url: '/color-picker',
        component: asyncComponent(() => import('@/pages/color-picker'))
      },
      {
        text: '表单组件',
        url: '/form',
        component: asyncComponent(() => import('@/pages/form'))
      },
      {
        text: '下拉搜索选择组件',
        url: '/select-search-fetch',
        component: asyncComponent(() => import('@/pages/select-search-fetch'))
      },
      {
        text: '打印',
        url: '/print',
        component: asyncComponent(() => import('@/pages/print'))
      },
      {
        text: 'React打印',
        url: '/react-print',
        component: asyncComponent(() => import('@/pages/react-print'))
      },
      {
        text: '表格打印',
        url: '/table-print',
        component: asyncComponent(() => import('@/pages/table-print'))
      },
      {
        text: '关联复选',
        url: '/relation-checkbox',
        component: asyncComponent(() => import('@/pages/relation-checkbox'))
      }
    ]
  },
  {
    text: '查看',
    list: [
      {
        text: '表格操作',
        url: '/action-view',
        component: asyncComponent(() => import('@/pages/action-view'))
      },
      {
        text: '表格列表',
        url: '/list-page',
        component: asyncComponent(() => import('@/pages/list-page'))
      },
      {
        text: '轮播预览',
        url: '/carousel-preview',
        component: asyncComponent(() => import('@/pages/carousel-preview'))
      },
      {
        text: 'column渲染组件',
        url: '/column-wrap',
        component: asyncComponent(() => import('@/pages/column-wrap'))
      }
    ]
  },
  {
    text: 'DEMO',
    list: [
      {
        text: 'demo',
        url: '/demo',
        component: asyncComponent(() => import('@/pages/demo'))
      }
    ]
  }
])
