'use-scrict'

import Loadable from 'react-loadable'
import Loading from './Loading'
import Login from '../Containers/views/Pages/Login/Login'
import Register from '../Containers/views/Pages/Register/Register'
import DefaultLayout from '../Containers/containers/DefaultLayout/DefaultLayout'
import LandingPage from  '../Containers/views/Pages/LandingPage/LandingPage'
const AsyncNextPage = Loadable({
  loader: () => import('../Routes/NextPage'),
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
    path: '/',
    name: 'Home',
    component: LandingPage,
    exact: true
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DefaultLayout,
    exact: true
  },
]

export default routes
