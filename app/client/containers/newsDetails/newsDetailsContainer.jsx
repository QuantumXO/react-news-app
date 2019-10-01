
import './_newsDetails.sass'

import React, {Component, Fragment} from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {Redirect} from 'react-router-dom'
import PropTypes from 'prop-types';
import * as newsAction from 'actions/newsAction'
import * as authAction from 'actions/authAction'

import NewsBtn from 'components/news/NewsBtn'
import HeaderNav from 'components/default/headerNav'
import WithConfirm from 'components/HOCs/withConfirm'
import AuthModal from 'components/default/authModal/authModal'

class NewsDetailsContainer extends Component {

  constructor(props){
    super(props);

    const {newsProps} = this.props;

    this.state = {
      newsItem: newsProps.newsItem || {},
    };

    this.props.authAction.handleAuthModalState(true);
  }

  componentDidMount(): void {
    const {newsProps, newsAction, match} = this.props;

    newsAction.getNewsItem({newsId: match.params.id, appInited: newsProps.appInited});
  }

  componentDidUpdate(prevProps, prevState, snapshot) {

    const { newsProps } = this.props;

    if(newsProps.newsItem !== prevProps.newsProps.newsItem) {
      this.setState(() => ({
        newsItem: newsProps.newsItem,
      }));
    }
  }

  render() {

    const {authProps, authAction, newsAction, newsProps} = this.props;

    if(newsProps.newsItemError && newsProps.appInited){
      return (
        <Fragment>
          <Redirect to="/" />
        </Fragment>
      )
    }

    const {title, content, author, publishedAt, source, contentFull} = this.state.newsItem || {};
    const {id} = source || 0;

    let detailsBody;

    if(newsProps.loadingStatus){
      detailsBody = (
        <div className="lds-facebook mt-2">
          <div />
          <div />
          <div />
        </div>
      )
    }else if(!newsProps.newsItemError && newsProps.appInited){
      detailsBody = (
        <Fragment>
          <h1 className="title details__title title--default mt-1">{title}</h1>
          <div className="details__block">
            <div className="details__info">
              <div className="author">{author || null}</div>
              {author && <span className="ml-05 mr-05">|</span>}
              <div className="date">{publishedAt || null}</div>

              <div className="details__actions">
                <NewsBtn
                  title="Edit"
                  newsItemId={id}
                  isPrivate={true}
                  url={'/' + id + '/edit'}
                  classes="btn btn--primary btn--edit"
                  authState={authProps.user ? true : false}
                  handleModalFunc={authAction.handleAuthModalState}
                />
                <WithConfirm
                  title='Delete'
                  description="are u sure?"
                  actionFunc={() => {newsAction.deleteNewsItem({ newsId: id, })}}
                  authState={authProps.user ? true : false}
                  Component={(...props) => (
                    <NewsBtn
                      title="Delete"
                      isPrivate={true}
                      authState={props[0].authState}
                      handleModalFunc={authAction.handleAuthModalState}
                      confirmFunc={(e) => props[0].confirmFunc(e)}
                      classes="btn btn--secondary btn--delete"
                    />
                  )}
                />
              </div>
            </div>
            <p className="details__content mt-1">{contentFull}</p>
          </div>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <HeaderNav />

        <div className="details">
          <div className="container details__container">
            <div className="row">
              <div className="details__inner">
                {detailsBody}
              </div>
            </div>
          </div>
        </div>

        <AuthModal />
      </Fragment>

    )
  }
}

const mapStateToProps = state => ({
  newsProps: state.newsReducer,
  authProps: state.authReducer,
})

const mapDispatchToProps = dispatch => ({
  newsAction: bindActionCreators(newsAction, dispatch),
  authAction: bindActionCreators(authAction, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(NewsDetailsContainer)


NewsDetailsContainer.proptypes = {
  newsProps: PropTypes.shape({
    appInited: PropTypes.bool,
    newsList: PropTypes.array,
    newsItem: PropTypes.object,
    newsListIsEmpty: PropTypes.bool,
    newsErrors: PropTypes.object,
    newsItemError: PropTypes.bool,
  }),
}
