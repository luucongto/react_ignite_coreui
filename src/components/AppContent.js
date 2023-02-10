import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// routes config
import { routes } from '../routes'
import { loginTokenSelector } from 'src/Redux/LoginRedux'
import { useSelector } from 'react-redux'

const AppContent = () => {
  const isAuthenticated = useSelector(loginTokenSelector)
  console.log('isAuthenticated', isAuthenticated)
  return (
    <CContainer lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={
                    isAuthenticated ? (
                      <route.element />
                    ) : (
                      <Navigate to="/login" replace relative="route" />
                    )
                  }
                />
              )
            )
          })}
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
