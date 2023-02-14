/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  CButton as Button,
  CCard as Card,
  CCardBody as CardBody,
  CCardFooter as CardFooter,
  CCardHeader as CardHeader,
  CCol as Col,
  CRow as Row,
  CFormLabel as Label,
  CFormInput as Input,
} from '@coreui/react'
import CountryDropdown from './CountryDropDown'
import { CreateOrderSelector, CreateOrderTypes } from 'src/Redux/CreateOrderRedux'
import { useNavigate } from 'react-router-dom'
import { alertError, alertSuccess } from 'src/Utils/alert.error'

const CreateForm = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [state, setState] = useState({
    senderCompany: '',
    senderAddress: '',
    senderName: '',
    senderPhone: '',
    receiverCompany: '',
    receiverAddress: '',
    receiverName: '',
    receiverPhone: '',
    receiverCountry: '',
    packageNo: 1,
    packageWeight: 0.5,
    packageGoodName: '',
  })
  const [fetching, setFetching] = useState(false)
  const updateState = (newData) => {
    setState({ ...state, ...newData })
  }
  const createOrderState = useSelector(CreateOrderSelector)
  const navigate = useNavigate()
  useEffect(() => {
    if (fetching && !createOrderState.fetching) {
      setFetching(false)
      console.log('tom updateOrderState', createOrderState)
      if (createOrderState.data) {
        alertSuccess(t('order_created', { orderNo: createOrderState.data.data }))
        navigate('/home/orders')
      }
      if (createOrderState.error) {
        console.log(createOrderState.error)
        updateState({ fetching: false })
        alertError(t(createOrderState.error.message))
      }
    }
  }, [createOrderState])

  const handleCreate = () => {
    setFetching(true)
    dispatch({
      type: CreateOrderTypes.CREATE_ORDER_REQUEST,
      params: { ...state },
    })
  }

  const _createTextField = (propName, type = 'text') => {
    return (
      <Row row key={propName} className="mb-3">
        <Col md="3">
          <Label htmlFor="text-input">{t(propName)}</Label>
        </Col>
        <Col xs="12" md="9">
          <Input
            type={type}
            id={`text-input-${propName}`}
            onChange={(event) => {
              updateState({ [propName]: event.target.value })
            }}
          />
        </Col>
      </Row>
    )
  }
  const senders = ['senderCompany', 'senderAddress', 'senderName', 'senderPhone'].map((each) =>
    _createTextField(each),
  )
  const receivers = ['receiverCompany', 'receiverAddress', 'receiverName', 'receiverPhone'].map(
    (each) => _createTextField(each),
  )

  return (
    <div className="animated fadeIn">
      <Row>
        <Col xs="12" md="12">
          <Card>
            <CardHeader>
              <strong>{t('create_order')}</strong>
            </CardHeader>
            <CardBody>
              <Col>
                <Row row>
                  <Col md="3">
                    <Label>
                      <strong>{t('sender')}</strong>
                    </Label>
                  </Col>
                </Row>
                {senders}
                <Row row>
                  <Col md="3">
                    <Label>
                      <strong>{t('receiver')}</strong>
                    </Label>
                  </Col>
                </Row>
                {receivers}
                <Row className="mb-3">
                  <Col md="3">
                    <Label htmlFor="select">{t('receiverCountry')}</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <CountryDropdown
                      value={state.receiverCountry}
                      onChange={(event) => updateState({ receiverCountry: event.target.value })}
                    />
                  </Col>
                </Row>

                <Row row>
                  <Col md="3">
                    <Label>
                      <strong>{t('packageInfo')}</strong>
                    </Label>
                  </Col>
                </Row>
                {_createTextField('packageNo', 'number')}
                <Row className="mb-3">
                  <Col md="3">
                    <Label htmlFor="text-input">{t('packageWeight')}</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <Input
                      type="number"
                      id="text-input"
                      name="text-input"
                      placeholder="kg"
                      value={state.packageWeight}
                      onChange={(event) => updateState({ packageWeight: event.target.value })}
                    />
                  </Col>
                </Row>
                {_createTextField('packageGoodName')}
              </Col>
            </CardBody>
            <CardFooter>
              <Button type="submit" size="sm" color="primary" onClick={() => handleCreate()}>
                <i className="fa fa-dot-circle-o"></i> Submit
              </Button>
            </CardFooter>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default CreateForm
