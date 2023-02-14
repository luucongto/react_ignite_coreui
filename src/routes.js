import React from 'react'
import i18n from './I18n'
import ListOrder from './views/Order/ListOrder'
import { CNavGroup, CNavItem } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPuzzle } from '@coreui/icons'
import DetailOrder from './views/Order/DetailOrder'
import CreateForm from './views/Order/CreateForm'

export const navs = [
  {
    component: CNavGroup,
    name: i18n.t('orders'),
    to: '/home/orders',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: i18n.t('list_order'),
        to: '/home/orders/list',
      },
      {
        component: CNavItem,
        name: i18n.t('create_order'),
        to: '/home/orders/create',
      },
    ],
  },
]

export const PRIVATE_ROUTES_LOCATION = '/home'
export const routes = [
  { path: '/', exact: true, name: i18n.t('orders'), element: ListOrder },
  { path: '/orders', exact: true, name: i18n.t('order'), element: ListOrder },
  { path: '/orders/list', exact: true, name: i18n.t('list_order'), element: ListOrder },
  { path: '/orders/list/:id', exact: true, name: i18n.t('detail_order'), element: DetailOrder },
  { path: '/orders/create', exact: true, name: i18n.t('create_order'), element: CreateForm },
]
