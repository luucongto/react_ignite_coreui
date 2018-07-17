'use-scrict'

import Loadable from 'react-loadable'
import Loading from './Loading'
import Login from '../Containers/views/Pages/Login/Login'
import Register from '../Containers/views/Pages/Register/Register'
import DefaultLayout from '../Containers/containers/DefaultLayout/DefaultLayout'

const AsyncNextPage = Loadable({
  loader: () => import('../Routes/NextPage'),
  loading: Loading
});

const Dashboard = Loadable({
  loader: () =>import ('../Containers/views/Dashboard/Dashboard'),
  loading: Loading
});

const routes = [
  {
    title: 'Login',
    path: '/login',
    component: Login,
    exact: true
  },
  {
    title: 'Register',
    path: '/register',
    component: Register,
    exact: true
  },
  {
    title: 'Register',
    path: '/register',
    component: Register,
    exact: true
  },
  {
    title: 'NextPage',
    path: '/next-page',
    component: AsyncNextPage,
    exact: true
  },
  {
    path: '/',
    name: 'Home',
    component: DefaultLayout,
  },
]

export default routes
