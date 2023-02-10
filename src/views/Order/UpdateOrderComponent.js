/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import {
  CButton as Button,
  CCard as Card,
  CCardBody as CardBody,
  CCardFooter as CardFooter,
  CCardHeader as CardHeader,
  CCol as Col,
  CRow,
  CFormLabel as Label,
} from '@coreui/react'

import CountryDropdown from './CountryDropDown'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { UpdateOrderSelector, UpdateOrderTypes } from '../../Redux/UpdateOrderRedux'
import { CFormSelect } from '@coreui/react'
import { alertError, alertSuccess } from 'src/Utils/alert.error'
import { GetOrderTypes } from '../../Redux/GetOrderRedux'

const STATUSES = [
  'created',
  'picked_up',
  'custom_clearance_complete',
  'in_transit',
  'arrived',
  'delivery',
  'delivered',
]
const UpdateOrderComponent = (props) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [country, setCountry] = useState('')
  const [status, setStatus] = useState(props.order.status)
  const [fetching, setFetching] = useState(false)
  const updateOrder = (params) => {
    setFetching(true)
    dispatch({
      type: UpdateOrderTypes.UPDATE_ORDER_REQUEST,
      params,
    })
  }
  useEffect(() => {
    if (props.order && props.order.status) setStatus(props.order.status)
  }, [props.order, props.order.status])

  const updateOrderState = useSelector(UpdateOrderSelector)
  useEffect(() => {
    if (fetching && !updateOrderState.fetching) {
      if (updateOrderState.error) {
        alertError(t(updateOrderState.error.message))
      } else if (updateOrderState.data && updateOrderState.data.success) {
        alertSuccess(t('update_success'))
        dispatch({
          type: GetOrderTypes.GET_ORDER_REQUEST,
          params: props.order.orderTransportNumber,
        })
      }
    }
  }, [updateOrderState.fetching])
  //   if (data !== props.data ) {
  //     setState({ fetching: false, data: props.data })
  //     if(props.data && props.data.success) {
  //       alertSuccess(t('update_success'))
  //       props.getOrder(props.order.orderTransportNumber)
  //     }
  //     if (props.error) {
  //       setState({ fetching: false })
  //       alertError(t(props.error.message))
  //     }
  //   }
  // }

  const renderOrderAdmin = () => {
    return (
      <Col>
        <CRow row>
          <Col md="3">
            <Label htmlFor="select">{t('status')}</Label>
          </Col>
          <Col xs="12" md="9">
            <CFormSelect
              type="select"
              name="select"
              id="select"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {t(`order_history_row_${status}`)}
                </option>
              ))}
            </CFormSelect>
          </Col>
        </CRow>

        <CRow row>
          <Col md="3">
            <Label htmlFor="select">{t('country')}</Label>
          </Col>
          <Col xs="12" md="9">
            <CountryDropdown value={country} onChange={(event) => setCountry(event.target.value)} />
          </Col>
        </CRow>
      </Col>
    )
  }
  return (
    <Card>
      <CardHeader>
        <strong>{t('admin')}</strong>
      </CardHeader>
      <CardBody>{renderOrderAdmin(props.order)}</CardBody>
      <CardFooter>
        <Button
          color="success"
          onClick={() => {
            updateOrder({
              orderTransportNumber: props.order.orderTransportNumber,
              country: country,
              status: status,
            })
          }}
        >
          {t('update')}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default UpdateOrderComponent
