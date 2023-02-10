import Header from '../Header'
import React from 'react'
const LandingPage = () => {
  return (
    <div>
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <Header />
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
