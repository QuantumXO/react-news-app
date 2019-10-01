
import './_newsEdit.sass'

import React, {Component, Fragment} from 'react'
import { bindActionCreators } from 'redux'
import { Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import classnames from 'classnames'
import {trimString} from 'helpers/default'

import { getNewsList } from 'helpers/news'

import * as newsAction from 'actions/newsAction'
import * as authAction from 'actions/authAction'

import NewsBtn from 'components/news/NewsBtn'
import HeaderNav from 'components/default/headerNav'
import WithConfirm from 'components/HOCs/withConfirm'
import Input from 'components/default/form/input'
import AuthModal from 'components/default/authModal/authModal'

class NewsEditContainer extends Component{
  constructor(props){
    super(props);

    const {newsItem, newsErrors} = this.props.newsProps;

    this.state = {
      newsItem: newsItem || {},
      newsTitle: newsItem && newsItem.title || '',
      newsContent: newsItem && newsItem.contentFull || '',
      newsNewTitle: newsItem && newsItem.title || '',
      newsNewContent: newsItem && newsItem.contentFull || '',
      formNotEmpty: false,
      formWasChanged: false,
      errors: newsErrors || {},
      newsItemSaved: false,
    };

  }

  componentDidMount(): void {
    this.setState({errors: {}});

    const {match, newsAction, newsProps} = this.props;

    newsAction.getNewsItem({newsId: match.params.id, appInited: newsProps.appInited});
  }

  componentDidUpdate(prevProps, prevState, snapshot) {

    const { newsItem, newsErrors, newsItemError } = this.props.newsProps;
    const { newsNewTitle, newsNewContent } = this.state;

    if(newsItem !== prevProps.newsProps.newsItem) {
      this.setState(() => ({
        newsItem: newsItem,
        newsNewTitle: newsItem && newsItem.title,
        newsNewContent: newsItem && newsItem.contentFull
      }));

    }else if(
      newsNewTitle !== prevState.newsNewTitle ||
      newsNewContent !== prevState.newsNewContent ||
      newsItemError !== prevState.newsItemError
    ){
      return true;

    }else if(newsErrors !== prevProps.newsErrors){
      this.setState({errors: newsErrors})
    }
  }

  handleFieldValueChange = (e) => {
    const target = e.target;

    const newsErrors = this.state.errors;
    delete newsErrors[target.name];

    this.setState(() => ({
      [target.id]: target.value,
      formWasChanged: true,
      errors: newsErrors
    }))
  }

  cancelChanges = () => {

    const {title, contentFull} = this.props.newsProps.newsItem;

    this.setState(() => ({
      newsNewTitle: title,
      newsNewContent: contentFull,
      formWasChanged: false,
    }))

  }

  handleNotify = () => {
      this.setState(() => ({
        newsItemSaved: true,
        formWasChanged: false
      }), () => {
          setTimeout(() => {
            this.setState({newsItemSaved: false})
          }, 1000)
        }
      )
  }

  save = () => {
    this.setState({newsItemSaved: true})
  }

  render(){
    const {authProps, authAction, newsAction, newsProps} = this.props;
    const {errors, newsItemSaved} = this.state;
    const {source} = newsProps.newsItem || {};
    const {id} = source || 0;

    const editNotifyClasses = classnames('edit__notify', {
      'show': newsItemSaved,
    })

    let editBody;

    if(newsProps.newsItemError){
      return (
        <Fragment>
          <Redirect to="/" />
        </Fragment>
      )
    }

    if(newsProps.loadingStatus){
      editBody = (
        <div className="lds-facebook mt-2">
          <div />
          <div />
          <div />
        </div>
      );

    }else if(newsProps.newsItemError){
      editBody = (
        <div className='news__error'>
          <p className="news__error__title">{newsProps.newsErrors.message}</p>
          <d>Try again <span className="btn btn--primary" onClick={this.reload}>Reload</span></d>
        </div>
      );

    }else if(newsProps.newsItem){
      editBody = (
        <form>
          <Input
            type="text"
            name="title"
            label="Title"
            id="newsNewTitle"
            error={errors.title}
            placeholder="Enter title"
            value={this.state.newsNewTitle}
            disabled={!authProps.user && true}
            handleChangeFunc={this.handleFieldValueChange}
          />

          <Input
            type="textarea"
            name="content"
            label="Text"
            id="newsNewContent"
            classes="edit__content"
            error={errors.content}
            placeholder="Enter news content"
            value={this.state.newsNewContent}
            disabled={!authProps.user && true}
            handleChangeFunc={this.handleFieldValueChange}
          />

          {authProps.user && (
            <div className="edit__actions">
              <div className="edit__actions__block">
                <WithConfirm
                  title='Save changes'
                  description="are u sure?"
                  actionFunc={() => {
                      newsAction.editNewsItem({
                        newsId: id,
                        title: this.state.newsNewTitle,
                        content: this.state.newsNewContent,
                        author: authProps.user,
                      });
                      this.handleNotify();
                    }
                  }
                  authState={authProps.user ? true : false}
                  Component={(...props) => (
                    <NewsBtn
                      title="Save"
                      type="submit"
                      isPrivate={true}
                      authState={props[0].authState}
                      disabled={!this.state.formWasChanged && true}
                      handleModalFunc={authAction.handleAuthModalState}
                      confirmFunc={(e) => props[0].confirmFunc(e)}
                      classes={'btn btn--edit btn--primary'}
                    />
                  )}
                />

                {this.state.formWasChanged && (
                  <WithConfirm
                    title='Cancel'
                    description="are u sure?"
                    actionFunc={() => {this.cancelChanges({ newsId: id, })}}
                    authState={authProps.user ? true : false}
                    Component={(...props) => (
                      <NewsBtn
                        title="Cancel"
                        isPrivate={true}
                        authState={props[0].authState}
                        handleModalFunc={authAction.handleAuthModalState}
                        confirmFunc={(e) => props[0].confirmFunc(e)}
                        classes="btn btn--secondary ml-05"
                      />
                    )}
                  />
                )}
              </div>

              <WithConfirm
                title='Delete'
                description="are u sure?"
                authState={authProps.user ? true : false}
                actionFunc={() => {
                  newsAction.deleteNewsItem({
                    newsId: id,
                    isPrivatePage: true,
                  })}
                }
                Component={(...props) => (
                  <NewsBtn
                    title="Delete"
                    isPrivate={true}
                    authState={props[0].authState}
                    handleModalFunc={authAction.handleAuthModalState}
                    confirmFunc={(e) => props[0].confirmFunc(e)}
                    classes="btn btn--secondary ml-05"
                  />
                )}
              />
            </div>
          )}
        </form>
      );
    }

    return (
      <Fragment>
        <HeaderNav isPrivatePage={true} />

        <div className="edit">
          <div className={editNotifyClasses}>"{trimString(this.state.newsNewTitle, 25)}" <span className="event bold">Saved</span></div>
          <div className="container edit__container">
            <div className="row">
              <div className="edit__inner mt-1">
                {editBody}
              </div>
            </div>
          </div>
        </div>
        <AuthModal isPrivatePage={true} />
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  authProps: state.authReducer,
  newsProps: state.newsReducer
})

const mapDispatchToProps = dispatch => ({
  newsAction: bindActionCreators(newsAction, dispatch),
  authAction: bindActionCreators(authAction, dispatch),
})


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NewsEditContainer))
