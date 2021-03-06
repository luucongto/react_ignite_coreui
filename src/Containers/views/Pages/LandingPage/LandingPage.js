import React from 'react'
import Helmet from 'react-helmet'

export default () => (
  <div>
    <div className='container__item landing-page-container'>
      <div className='content__wrapper'>
        <div className='ellipses-container'>
          <h2 className='greeting'>Hello</h2>
          <div className='ellipses ellipses__outer--thin'>
            <div className='ellipses ellipses__orbit' />
          </div>
          <div className='ellipses ellipses__outer--thick' />
        </div>
      </div>
    </div>
    <Helmet title='Home' />
    </div>
)
