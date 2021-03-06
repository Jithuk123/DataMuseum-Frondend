import React from 'react'

import SearchModule from '../../components/Search/index.search'
import ModalModule from '../../components/Modal/Modal'
import DeleteModalModule from '../../components/Modal/DeleteModalModule'
import AddUserModalModule from './AddUserModalModule'
// import Pagination from "react-js-pagination"
import ButtonModule from '../Posts/ButtonModal'
import { NotifyDelete, NotifyAdded } from '../../components/Toaster/Tosater'
import { ToastContainer } from 'react-toastify';

import CardsModule from './PostCard'
import './PostsModules.css'
import './ButtonModal.css'

class PostContainer extends React.PureComponent {
  state = {
    postData: [],
    result: '',
    slicedData: [],
    filteredPostResult: [],
    isModalButtonClicked: false,
    activePage: 1,
  }

  componentDidMount() {
    const { fetchPostData } = this.props
    fetchPostData()
  }

  structuredData = (postDatas) => {
    let slicedDataa = []
    slicedDataa = postDatas
    this.setState({
      slicedData: slicedDataa,
      filteredPostResult: slicedDataa
    })
  }

  componentWillReceiveProps(nextProps) {
    const { postDatas } = this.props
    if (nextProps.postDatas !== postDatas) this.structuredData(nextProps.postDatas)
  }

  SearchData = () => {

    const { slicedData } = this.state
    const { searchString } = this.props

    let filteredResults = []
    filteredResults = slicedData.filter((item) =>
      item.title.toLowerCase().match(searchString.toLowerCase())
    )

    this.setState({ filteredPostResult: filteredResults })
  }

  SearchHandler = (e) => {
    const { duxSearchHandler } = this.props
    duxSearchHandler(e)
  }

  KeyPressHandler = (e) => {
    if (e.keyCode === 13) {

      this.SearchData()
    }
  }

  OnScreenEnterKey = (e) => {
    this.SearchData()
  }

  OnDeleteClick = (e, id) => {
    // const { filteredPostResult } = this.state
    // let deletedData = []
    // deletedData = filteredPostResult.filter((post) => post.id !== id)
    // this.setState({
    //   slicedData: deletedData,
    //   filteredPostResult: deletedData
    // })
    this.setState((prevState) => ({
      isDeleteModalButtonClicked: !prevState.isDeleteModalButtonClicked,
      clickedId: id
    }))
  }
  onDeleteConfirmClick = () => {
    const { fetchPostData } = this.props
    this.setState((prevState) => ({
      isDeleteModalButtonClicked: !prevState.isDeleteModalButtonClicked,

    }))

    const TOKEN_KEY = 'jwt';
    const token = localStorage.getItem(TOKEN_KEY)

    fetch(`http://localhost:5000/api/posts/${this.state.clickedId}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      }

    })
    NotifyDelete()
    fetchPostData()

  }


  onDetailClick = (e, id) => {

    const { postDatas } = this.props

    if (postDatas && id) {
      const selectedItem = postDatas.filter((listItem) => listItem.id === id)
      const postBody = selectedItem[0].body
      const title = selectedItem[0].title
      this.setState({
        selectedItem, postBody, title
      })
    }

    this.setState((prevState) => ({
      isModalButtonClicked: !prevState.isModalButtonClicked,

    }))
  }

  onAddBtnClick = () => {
    this.setState((prevState) => ({
      isAddNoteModalButton: !prevState.isAddNoteModalButton,

    }))
  }

  onAddNoteSubmmitBtn = () => {
    const { fetchPostData } = this.props
    const userId = localStorage.getItem('userId')
    const changedData = {
      title: this.state.title,
      body: this.state.description,
      userId
    }
    const TOKEN_KEY = 'jwt';
    const token = localStorage.getItem(TOKEN_KEY)


    fetch(`http://localhost:5000/api/posts`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify(changedData)
    }).then(() => {
      this.setState((prevState) => ({
        isAddNoteModalButton: !prevState.isAddNoteModalButton,

      }))
      NotifyAdded()
      fetchPostData()
    })

  }

  onAddChangeHandler = (event) => {
    let value = event.target.value
    let fieldName = event.target.name
    this.setState({
      [fieldName]: value //this value will assign to this respective fieldname
    })
  }

  render() {
    const { filteredPostResult, isModalButtonClicked, postBody, title, isDeleteModalButtonClicked, activePage, totalCount, isAddNoteModalButton } = this.state


    return (
      <>
        <div>
          <div class="container text-center" >
            <div class="costumModal">
              <h1 class="title" style={{ fontSize: '60px', color: '#757575', fontWeight: 'bold', paddingLeft: '400px' }}>
                Notes
        </h1>
            </div>
          </div>

          <ButtonModule
            onAddBtnClick={this.onAddBtnClick}
            isAddNoteModalButton={isAddNoteModalButton} />

          <AddUserModalModule
            isAddNoteModalButton={isAddNoteModalButton}
            onAddChangeHandler={this.onAddChangeHandler}
            onAddNoteSubmmitBtn={this.onAddNoteSubmmitBtn}
            onModalClick={this.onAddBtnClick} />

          <div style={{ paddingLeft: '13% ', paddingTop: '60px' }}>
            <SearchModule
              searchHandler={this.SearchHandler}
              onSearchBtnClick={this.onSearchBtnClick}
              keyPressHandler={this.KeyPressHandler}
              onScreenEnterKey={this.OnScreenEnterKey}
            />
          </div>


          <ModalModule
            onModalClick={this.onDetailClick}
            isModalButtonClicked={isModalButtonClicked}
            postBody={postBody}
            title={title}
          />
          <CardsModule
            slicedData={filteredPostResult}
            onDeleteClick={this.OnDeleteClick}
            onDetailClick={this.onDetailClick} />

          <DeleteModalModule
            onModalClick={this.OnDeleteClick}
            isDeleteModalButtonClicked={isDeleteModalButtonClicked}
            onDeleteConfirmClick={this.onDeleteConfirmClick}
          />
          <div>
            <ToastContainer
              hideProgressBar />
          </div>

        </div>
        {/* <Pagination
          style={{ padding: '20px' }}
          activePage={activePage}
          itemsCountPerPage={10}
          totalItemsCount={totalCount}
          pageRangeDisplayed={4}
          onChange={this.handlePageChange}
          itemClass="page-item"
          linkClass="page-link"
        /> */}
      </>
    )
  }
}

export default PostContainer