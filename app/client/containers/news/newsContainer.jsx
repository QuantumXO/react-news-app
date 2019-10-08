
import './_news.sass'
import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import {getNewsList} from 'helpers/news'
import {reload} from 'helpers/default'
import * as newsAction from 'actions/newsAction'
import * as authAction from 'actions/authAction'

import NewsBtn from 'components/news/NewsBtn'
import HeaderNav from 'components/shared/headerNav'
import AuthModal from 'components/shared/authModal/authModal'

import WithConfirm from 'components/HOCs/withConfirm'

class NewsContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      articles: this.props.newsProps.newsList || [],
    }

    this.props.authAction.handleAuthModalState(true);
  }

  componentDidMount(): void {

    const {newsProps, newsAction} = this.props;

    if(!newsProps.appInited){
      newsAction.setNewsList();
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot): void {

    const {newsList} = this.props.newsProps;
    const {user} = this.props.authProps;

    if(newsList !== prevProps.newsProps.newsList) {
      this.setState(() => ({
        articles: newsList,
      }));

    }else if(
      user !== prevProps.authProps.user
    ){
      return true;
    }
  }

  onReload = () => {
    reload();
  }

  render() {

    const {authProps, authAction, newsAction, newsProps} = this.props;

    let articlesList;

    const articlesItem = newsProps.newsList.map((item) => {

      const {source, title, author, publishedAt, content} = item;
      const {id} = source;

      return (
        <li className="news__item" key={id}>
          <h4 className="news__item__title">
            <Link
              to={'/' + id}
              className={''}
            >
              {title}
            </Link>
          </h4>

          <div className="news__item__actions">
            <NewsBtn
              newsItemId={id}
              title="Edit"
              isPrivate={true}
              url={id + '/edit'}
              classes="btn btn--primary btn--edit"
              authState={authProps.user ? true : false}
              handleModalFunc={authAction.handleAuthModalState}
            />

            <WithConfirm
              title='Delete'
              description="are u sure?"
              actionFunc={() => {newsAction.deleteNewsItem({ newsId: id })}}
              authState={authProps.user ? true : false}
              Component={(...props) => (
                <NewsBtn
                  title="Delete"
                  isPrivate={true}
                  authState={props[0].authState}
                  classes="btn btn--secondary btn--delete"
                  confirmFunc={(e) => props[0].confirmFunc(e)}
                  handleModalFunc={authAction.handleAuthModalState}
                />
              )}
            />

          </div>
          <div className="news__item__info">
            <div className="author">{author || null}</div>
            {author && <span className="ml-05 mr-05">|</span>}
            <div className="date">{publishedAt || null}</div>
          </div>
          <p className="news__item__content mt-1">{content}</p>
        </li>
      )
    });

    if(newsProps.loadingStatus){
      articlesList = (
        <div className="lds-facebook mt-2">
          <div />
          <div />
          <div />
        </div>
      );

    }else if(newsProps.newsErrors) {
      articlesList = (
        <div className='news__error'>
          <p className="news__error__title">{newsProps.newsErrors.message}</p>
          <d>Try again <span className="btn btn--primary" onClick={this.onReload}>Reload</span></d>
        </div>
      );

    }else if(!newsProps.newsListIsEmpty){
      articlesList = (
        <ul className="news__list mt-2">
          {articlesItem}
        </ul>
      )

    }else {
      articlesList = <p className="not-found">Any news not found ;(</p>;
    }

    return (
      <Fragment>
        <HeaderNav />

        <div className="news">
          <div className="container">
            <div className="row">
              <h1 className="title title--default mt-1">News</h1>
              {articlesList}
            </div>
          </div>
        </div>

        <AuthModal />
      </Fragment>
    )

  }
}

const mapStateToProps = state => ({
  authProps: state.authReducer,
  newsProps: state.newsReducer,
})

const mapDispatchToProps = dispatch => ({
  newsAction: bindActionCreators(newsAction, dispatch),
  authAction: bindActionCreators(authAction, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(NewsContainer)


NewsContainer.propTypes = {
  newsProps: PropTypes.shape({
    appInited: PropTypes.bool,
    newsList: PropTypes.array,
    newsItem: PropTypes.object,
    newsListIsEmpty: PropTypes.bool,
    newsErrors: PropTypes.object,
    newsItemError: PropTypes.bool,
  }),
  authProps: PropTypes.shape({
    user: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    modalAuthState: PropTypes.bool,
    authErrors: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    authMethod: PropTypes.string,
  }),
};
