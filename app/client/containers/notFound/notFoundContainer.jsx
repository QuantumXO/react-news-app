
import './_notFound.sass';

import React, {Fragment} from 'react';
import {Link} from 'react-router-dom'
import HeaderNav from 'components/default/headerNav'
import AuthModal from 'components/default/authModal/authModal'

export default function NotFoundContainer(props) {
  return (
    <Fragment>
      <HeaderNav />
      <div className="not-found">
        <div className="container not-found__container">
          <div className="row">
            <h1 className="not-found__title">Page not found ;(</h1>
            <Link to="/" className="link">Home</Link>
          </div>
        </div>
      </div>

      <AuthModal />
    </Fragment>
  )
}


