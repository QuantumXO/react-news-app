
import './_footer.sass';

import React, {Fragment} from 'react'

const tagsArr = ['React', 'News App', 'Redux', 'Google OAuth2', 'Redux Thunk', 'React Router', 'HOCs', 'SASS', 'BEM'];

export default function Footer(props) {

  const tagList = tagsArr.map((item, index) => {
     return <li className="footer__item" key={index}>#{item}{(index < tagsArr.length - 1) && ','}</li>
  })

  return (
    <Fragment>
      <div className="footer">
        <div className="container footer__container">
          <div className="row">
            <ul className="footer__list">
              {tagList}
            </ul>
          </div>
        </div>
      </div>
    </Fragment>
  )
}
