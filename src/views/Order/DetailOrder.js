import moment from 'moment'
import React, { useCallback, useEffect } from 'react'
import Barcode from 'react-barcode'
import { useDispatch, useSelector } from 'react-redux'
import Pdf from 'react-to-pdf'
// import UpdateOrderComponent from './UpdateOrderComponent'
import { CCard, CCol, CFormLabel, CRow, CCardHeader, CButton, CCardBody } from '@coreui/react'
import { useTranslation } from 'react-i18next'
import { alertError } from '../../Utils/alert.error'
import { GetOrderTypes, GetOrderSelector } from 'src/Redux/GetOrderRedux'
import { useParams } from 'react-router-dom'
import { loginStateSelector } from 'src/Redux/LoginRedux'
import UpdateOrderComponent from './UpdateOrderComponent'

const DetailOrder = () => {
  const myRef = React.createRef()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const getOrderState = useSelector(GetOrderSelector)
  const { id } = useParams()
  console.log('matches', id)
  const getOrder = useCallback(
    (id) => {
      dispatch({
        type: GetOrderTypes.GET_ORDER_REQUEST,
        params: id,
      })
    },
    [dispatch],
  )
  useEffect(() => {
    getOrder(id)
  }, [getOrder, id])

  useEffect(() => {
    if (getOrderState.error) {
      alertError(t(getOrderState.error.message))
    }
  }, [getOrderState, t])

  const role = useSelector(loginStateSelector)?.data.role
  const order = getOrderState?.data || {}
  const convertValue = (key, value) => {
    switch (key) {
      case 'updated_at':
      case 'created_at':
        return moment(value).format('YYYY-MM-DD HH:mm')
      default:
        return value
    }
  }

  const renderRow = (key, value) => {
    return (
      <CRow CRow key={key}>
        <CCol md="5">
          <CFormLabel>{t(key)}</CFormLabel>
        </CCol>
        <CCol xs="12" md="7">
          <p className="form-control-static">{convertValue(key, value)}</p>
        </CCol>
      </CRow>
    )
  }
  const renderLine = () => {
    return (
      <div
        style={{
          height: 1,
          width: '100%',
          backgroundColor: 'black',
          marginBottom: 10,
        }}
      />
    )
  }
  const renderOrder = (order) => {
    return (
      <CCol>
        <CRow>
          <CCol md="6">
            <strong>{t('orderTransportNumber')}</strong>
          </CCol>
          <div ref={myRef} style={{ padding: 10 }}>
            {order && <Barcode value={order.orderTransportNumber + ''} />}
          </div>
        </CRow>
        {renderLine()}
        <CRow>
          <CCol md="6">
            <strong>{t('sender')}</strong>
            {['senderAddress', 'senderCompany', 'senderName'].map((key) =>
              renderRow(key, order[key]),
            )}
          </CCol>
          <CCol md="6">
            <strong>{t('receiver')}</strong>
            {[
              'receiverAddress',
              'receiverCompany',
              'receiverCountry',
              'receiverName',
              'receiverPhone',
            ].map((key) => renderRow(key, order[key]))}
          </CCol>
        </CRow>
        {renderLine()}
        <CRow>
          <CCol md="6">
            <strong>{t('packageInfo')}</strong>
            {['packageGoodName', 'packageNo', 'packageWeight'].map((key) =>
              renderRow(key, order[key]),
            )}
          </CCol>
          <CCol md="6">
            <strong>{t('Status')}</strong>
            <CRow CRow>
              <CCol md="5">
                <CFormLabel>{t('status')}</CFormLabel>
              </CCol>
              <CCol xs="12" md="7">
                <p className="form-control-static">
                  {convertValue('status', t('order_history_row_' + order.status))}
                </p>
              </CCol>
            </CRow>
            {['created_at', 'updated_at'].map((key) => renderRow(key, order[key]))}
          </CCol>
        </CRow>
        {renderLine()}
        <CRow>
          <CCol>
            <strong>{t('history')}</strong>
            {order.histories &&
              order.histories.map((each, index) => {
                return (
                  <CRow CRow key={index}>
                    <CCol md="3">
                      <CFormLabel>{convertValue('created_at', each.created_at)}</CFormLabel>
                    </CCol>
                    <CCol xs="12" md="3">
                      <p className="form-control-static">{t(`order_history_row_${each.status}`)}</p>
                    </CCol>
                    <CCol md="6">
                      <CFormLabel>{each.country}</CFormLabel>
                    </CCol>
                  </CRow>
                )
              })}
          </CCol>
        </CRow>
      </CCol>
    )
  }

  return (
    <div className="animated fadeIn">
      <CRow>
        <CCol xs="12" md={role === 1 ? '9' : '12'}>
          <CCard>
            <CCardHeader>
              {order && (
                <Pdf targetRef={myRef} filename={`${order.orderTransportNumber}.pdf`}>
                  {({ toPdf }) => (
                    <CButton color="success" onClick={toPdf}>
                      {t('print')}
                    </CButton>
                  )}
                </Pdf>
              )}
            </CCardHeader>
            <CCardBody>{renderOrder(order)}</CCardBody>
          </CCard>
        </CCol>
        {role === 1 && (
          <CCol xs="12" md={3}>
            <UpdateOrderComponent order={order} />
          </CCol>
        )}
      </CRow>
    </div>
  )
}

export default DetailOrder
