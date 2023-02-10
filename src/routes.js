import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const routes = [
  { path: '/', exact: true, name: 'Home', element: Dashboard },
  { path: '/dashboard', exact: true, name: 'Dashboard', element: Dashboard },
]

export default routes
