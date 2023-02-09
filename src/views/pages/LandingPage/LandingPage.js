import { CContainer, CHeader, CHeaderNav } from '@coreui/react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import LangSwitcher from 'src/components/header/LangSwitcher'
import React from 'react'

const LandingPage = () => {
  const { t } = useTranslation()
  return (
    <div>
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <CHeader position="sticky" className="mb-4">
          <CContainer fluid>
            <CHeaderNav className="ms-3">
              <Link to={'/login'}>{t('login')}</Link>
              <LangSwitcher />
            </CHeaderNav>
          </CContainer>
        </CHeader>
        <div className="body flex-grow-1 px-3">
          <main className="main">
            <div className="container__item landing-page-container">
              <div className="content__wrapper">
                <div className="ellipses-container">
                  <h2 className="greeting">Hello</h2>
                  <div className="ellipses ellipses__outer--thin">
                    <div className="ellipses ellipses__orbit" />
                  </div>
                  <div className="ellipses ellipses__outer--thick" />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
