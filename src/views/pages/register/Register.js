import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked } from '@coreui/icons'
import { alertError, alertSuccess } from 'src/Utils/alert.error'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { registerSelector, RegisterTypes } from 'src/Redux/RegisterRedux'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [fetching, setFetching] = useState(false)
  const registerState = useSelector(registerSelector)
  const dispatch = useDispatch()
  const _handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRegister()
    }
  }
  const handleRegister = () => {
    if (!email) {
      alertError(t('invalid_email'))
      return
    }

    if (!password) {
      alertError(t('invalid_password'))
      return
    } else if (password !== repeatPassword) {
      alertError(t('password_not_match'))
      return
    }
    setFetching(true)
    dispatch({
      type: RegisterTypes.REGISTER_REQUEST,
      params: {
        email: email,
        password: password,
      },
    })
  }

  useEffect(() => {
    if (fetching && registerState.data) {
      setFetching(false)
      alertSuccess(t('user_created'))
      navigate('/login')
    }
    if (fetching && registerState.error) {
      setFetching(false)
      alertError(t(registerState.error.message))
    }
  }, [fetching, navigate, registerState, t])

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm>
                  <h1>{t('register')}</h1>
                  <p className="text-muted">{t('register_note')}</p>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      type="text"
                      placeholder="Email"
                      onChange={(event) => setEmail(event.target.value)}
                      value={email}
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder={t('password')}
                      autoComplete="new-password"
                      onChange={(event) => setPassword(event.target.value)}
                      value={password}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder={t('confirmPassword')}
                      autoComplete="new-password"
                      onChange={(event) => setRepeatPassword(event.target.value)}
                      value={repeatPassword}
                      onKeyPress={_handleKeyPress}
                    />
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton
                      color="success"
                      onClick={() => {
                        handleRegister()
                      }}
                    >
                      {' '}
                      {t('create_account')}
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
