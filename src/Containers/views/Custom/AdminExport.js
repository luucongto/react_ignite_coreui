import React, { Component } from 'react'
import { Button, Col, Row, Card, CardHeader, CardBody, Input, CardFooter,Table, FormGroup, Label, Badge, Progress } from 'reactstrap'
import moment from 'moment'
import { connect } from 'react-redux'
import { AppSwitch } from '@coreui/react'
import SoldProductActions from '../../../Redux/SoldProductRedux'
import ReactExport from "react-data-export";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const multiDataSet = [
  {
      columns: ["Name", "Salary", "Sex"],
      data: [
          ["Johnson", 30000, "Male"],
          ["Monika", 355000, "Female"],
          ["Konstantina", 20000, "Female"],
          ["John", 250000, "Male"],
          ["Josef", 450500, "Male"],
      ]
  },
  {
      xSteps: 1, // Will start putting cell with 1 empty cell on left most
      ySteps: 5, //will put space of 5 rows,
      columns: ["Name", "Department"],
      data: [
          ["Johnson", "Finance"],
          ["Monika", "IT"],
          ["Konstantina", "IT Billing"],
          ["John", "HR"],
          ["Josef", "Testing"],
      ]
  }
];
class AdminExport extends Component {
  constructor (props) {
    super(props)
    this.state = {
      updated_at: 0,
      productData: [],
      winnerData: []
    }
    
  }
  componentWillReceiveProps(props){
    if(!props.soldProduct) return
    let productData = {
      columns: ["id", "name", "category", "ams_code", "start_at", "start_price", "step_price", "seller_name", "winner_id", "win_price", "user_name", "user_email", "updated_at"],
      data: []
    }
    let winners = {}
    props.soldProduct.forEach(product => {
      if(winners[product.winner_id]){
        winners[product.winner_id][3] += product.win_price
      } else {
        winners[product.winner_id] = [
          product.winner_id,
          product.user_name,
          product.user_email,
          product.win_price
        ]
      }
      productData.data.push([
        product.id,
        product.name,
        product.category,
        product.ams_code,
        moment(product.start_at*1000).format('YY/MM/DD HH:mm:ss'),
        product.start_price,
        product.step_price,
        product.seller_name,
        product.winner_id,
        product.win_price,
        product.user_name,
        product.user_email,
        moment(product.updated_at*1000).format('YY/MM/DD HH:mm:ss'),
      ])
    })
    let winnerData = {
      columns: ['id', 'name', 'email', 'total_pay'],
      data: Object.values(winners)
    }
    this.setState({productData: [productData],winnerData: [winnerData] })
  }
  search(){
    this.props.request({command: 'getAdmin', updated_at: this.state.updated_at})
  }
  _renderProducts(){
    if(this.props.fetching) return (<Progress value='100' animated color='info' />)
    if(!this.state.productData.length) return ('')
    let products = this.state.productData[0]
    return (
      <Table responsive>
        <thead>
        <tr>
          {/* {displays.map(item => <th key={item} > {item.toLocaleUpperCase()} </th>)} */}
          {products.columns.map((item , index) => <th key={index} > {item.toLocaleUpperCase()} </th>)}
        </tr>
        </thead>
        <tbody>
          {products.data.map(product => (
            <tr key={product[0]}>
              {product.map((item , index)=> <td key={index} > {item} </td>)}
            </tr>
          ))}
        </tbody>
      </Table>
    )
  }
  _renderWinners(){
    if(!this.state.winnerData.length) return ('')
    let winners = this.state.winnerData[0]
    return (
      <Table responsive>
        <thead>
        <tr>
          {/* {displays.map(item => <th key={item} > {item.toLocaleUpperCase()} </th>)} */}
          {winners.columns.map((item , index) => <th key={index} > {item.toLocaleUpperCase()} </th>)}
        </tr>
        </thead>
        <tbody>
          {winners.data.map(winner => (
            <tr key={winner[0]}>
              {winner.map((item , index) => <td key={index} > {item} </td>)}
            </tr>
          ))}
        </tbody>
      </Table>
    )
  }
  _render () {
    return (
        <Card>
          <CardHeader>
            <Row>
            <Col xl='3'>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="date-input">Sold After</Label>
                </Col>
                <Col xs="12" md="6">
                  <Input type="datetime-local" id="date-input" name="datetime-local" placeholder="date" onChange={(event => this.setState({updated_at: Math.floor(new Date(event.target.value).getTime()/1000)}))}/>
                </Col>
                <Col xs="12" md="3">
                  <Button color='success' onClick={() => this.search()} > Search </Button>
                </Col>
              </FormGroup>
            </Col>
            {this.state.productData.length ? (<Col xl='1'>
              <ExcelFile element={<Button color='success' > Export Excel </Button>}>
                <ExcelSheet dataSet={this.state.productData} name="Products"/>
                <ExcelSheet dataSet={this.state.winnerData} name="Winners"/> 
            </ExcelFile>
            </Col>) : ('')}
            </Row>
          </CardHeader>
          <CardBody>
            {this._renderProducts()}
            {this._renderWinners()}
          </CardBody>
        </Card>
    )
  }
  render () {
    return (
      <div className='animated fadeIn pl-0 pr-0'>
        {this.props.user.isAdmin ? this._render()
        : (<h3> Unauthorized </h3>)}
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.login.data,
    soldProduct: state.soldProduct.data,
    fetching: state.soldProduct.fetching
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    request: (params) => dispatch(SoldProductActions.soldProductRequest(params))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminExport)
