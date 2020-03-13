import ProfileContainer from '../Profile/ProfileContainer'
import { connect } from 'react-redux'

import { fetchProfileData, postProfileData } from './dux'

const mapStateToProps = (state) => ({
  userProfileData: state.ProfileReducer.userProfileData,
  // postDataResponse: state.ProfileReducer.postDataResponse

})
const mapDispatchToProps = {
  fetchProfileData,
  postProfileData
}


export default connect(mapStateToProps, mapDispatchToProps)(ProfileContainer)


