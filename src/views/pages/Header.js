import CIcon from '@coreui/icons-react'
import { CContainer, CHeader, CHeaderBrand, CHeaderNav, CNavItem, CNavLink } from '@coreui/react'
import { NavLink } from 'react-router-dom'

import { useTranslation } from 'react-i18next'
import { logo } from 'src/assets/brand/logo'
import LangSwitcher from 'src/components/header/LangSwitcher'
import React from 'react'

const Header = () => {
  const { t } = useTranslation()
  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderBrand className="mx-auto d-md-none" to="/">
          <CIcon icon={logo} height={48} alt="Logo" />
        </CHeaderBrand>
        <CHeaderNav className="d-none d-md-flex me-auto">
          <CNavItem>
            <CNavLink to="/" component={NavLink}>
              {t('home')}
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="/#/login">{t('login')}</CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav className="ms-3">
          <LangSwitcher />
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default Header
