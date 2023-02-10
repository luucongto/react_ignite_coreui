import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import { loginStateSelector, LoginTypes } from '../../../Redux/LoginRedux'
import { alertError } from 'src/Utils/alert.error'
import Header from '../Header'
import { useTranslation } from 'react-i18next'
import CIcon from '@coreui/icons-react'
import { cilLockLocked } from '@coreui/icons'
const Login = (props) => {
  const { t } = useTranslation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [fetching, setFetching] = useState(false)

  const dispatch = useDispatch()
  const loginState = useSelector(loginStateSelector)
  const navigate = useNavigate()
  const _handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      _login()
    }
  }
  useEffect(() => {
    if (fetching && loginState.data) {
      setFetching(false)
      navigate('/home')
    }
    if (fetching && loginState.error) {
      setFetching(false)
      alertError(t(loginState.error.message))
    }
  }, [fetching, loginState, navigate, t])

  const _login = () => {
    setFetching(true)
    dispatch({
      type: LoginTypes.LOGIN_REQUEST,
      params: {
        type: 'local',
        username: username,
        email: username,
        password: password,
      },
    })
  }

  return (
    <div className="app flex-row align-items-center animated fadeIn">
      <Header />
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="6">
            <CCard className="p-4">
              <CCardBody>
                <h1>{t('login')}</h1>
                <CInputGroup className="mb-3">
                  <CInputGroupText>@</CInputGroupText>
                  <CFormInput
                    type="text"
                    placeholder={t('email')}
                    onChange={(event) => setUsername(event.target.value)}
                    value={username}
                  />
                </CInputGroup>
                <CInputGroup className="mb-4">
                  <CInputGroupText>
                    <CIcon icon={cilLockLocked} />
                  </CInputGroupText>
                  <CFormInput
                    type="password"
                    placeholder={t('password')}
                    onChange={(event) => setPassword(event.target.value)}
                    value={password}
                    onKeyPress={_handleKeyPress}
                  />
                </CInputGroup>
                <CRow>
                  <CCol xs="12" lg="auto">
                    <CButton disabled={fetching} color="primary" onClick={() => _login()}>
                      {fetching ? '...' : t('login')}
                    </CButton>
                  </CCol>
                  <CCol>
                    <CButton color="success" onClick={() => navigate('/register')}>
                      {t('register')}
                    </CButton>
                  </CCol>
                  <CCol>
                    <CButton color="danger" onClick={() => navigate('/forgot')}>
                      {t('forgotPassword')}
                    </CButton>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

// const mapStateToProps = (state) => {
//   return {
//     user: state.login.data,
//     error: state.login.error,
//     fetching: state.login.fetching,
//   }
// }

// const mapDispatchToProps = (dispatch) => {
//   return {
//     login: (params) => dispatch(LoginActions.loginRequest(params)),
//   }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(Login)

export default Login
