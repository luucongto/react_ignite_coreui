import React from 'react'
import { useLocation } from 'react-router-dom'

import { PRIVATE_ROUTES_LOCATION, routes } from '../routes'

import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname

  const getRouteName = (pathname, routes) => {
    const currentRoute = routes.find((route) => route.path === pathname)
    return currentRoute ? currentRoute.name : false
  }

  const getBreadcrumbs = (location) => {
    console.log('localtion', location)
    const breadcrumbs = []
    location
      .replace(PRIVATE_ROUTES_LOCATION, '')
      .split('/')
      .reduce((prev, curr, index, array) => {
        const currentPathname = `${prev}/${curr}`
        const routeName = getRouteName(currentPathname, routes)
        routeName &&
          breadcrumbs.push({
            pathname: PRIVATE_ROUTES_LOCATION + currentPathname,
            name: routeName,
            active: index + 1 === array.length ? true : false,
          })
        return currentPathname
      })
    console.log('breadcrumbs', breadcrumbs)
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)

  return (
    <CBreadcrumb className="m-0 ms-2">
      <CBreadcrumbItem href={'#' + PRIVATE_ROUTES_LOCATION}>Home</CBreadcrumbItem>
      {breadcrumbs.map((breadcrumb, index) => {
        return (
          <CBreadcrumbItem
            {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
            key={index}
          >
            {breadcrumb.name}
          </CBreadcrumbItem>
        )
      })}
    </CBreadcrumb>
  )
}

export default React.memo(AppBreadcrumb)
