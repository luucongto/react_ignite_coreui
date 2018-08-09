import React, { Component } from 'react'
import { connect } from 'react-redux'
import AdminExport from './AdminExport'
class SellerSoldManagement extends Component {
  render () {
    return this.props.user.isSeller ? <AdminExport userId={this.props.user.id} />
        : (<h3> Unauthorized </h3>)
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.login.data
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SellerSoldManagement)
