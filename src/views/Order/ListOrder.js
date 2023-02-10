import React, { useCallback, useEffect, useMemo, useState } from 'react'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { CButton, CCard, CCardBody, CCol, CFormInput, CRow, CTable } from '@coreui/react'
import { ListOrderSelector, ListOrderTypes } from 'src/Redux/ListOrderRedux'
import { alertError } from '../../Utils/alert.error'
import { Link } from 'react-router-dom'

const fields = [
  'orderTransportNumber',
  'receiverAddress',
  'receiverCompany',
  'receiverCountry',
  'senderAddress',
  'senderCompany',
  'senderName',
  'updated_at',
]

const ListOrder = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const listOrderState = useSelector(ListOrderSelector)
  const [search, setSearch] = useState('')
  const searchHandler = useCallback(() => {
    dispatch({
      type: ListOrderTypes.LIST_ORDER_REQUEST,
      params: {
        orderTransportNumber: search,
      },
    })
  }, [dispatch, search])
  useEffect(() => {
    searchHandler()
  }, [searchHandler])

  useEffect(() => {
    if (listOrderState.error) {
      alertError(t(listOrderState.error.message))
    }
  }, [listOrderState, t])

  const orders = useMemo(() => {
    return listOrderState && listOrderState.data && listOrderState.data.data
      ? listOrderState.data.data
      : []
  }, [listOrderState])
  const renderOrder = (order) => {
    return (
      <tr key={order.orderTransportNumber}>
        {fields.map((field) => {
          switch (field) {
            case 'updated_at':
              return <td key={field}>{moment(order[field]).format('YYYY/MM/DD HH:mm')}</td>
            case 'orderTransportNumber':
              return (
                <td key={field}>
                  <Link to={`/home/orders/list/${order[field]}`}>{order[field]}</Link>
                </td>
              )
            default:
              return <td key={field}>{order[field]}</td>
          }
        })}
      </tr>
    )
  }

  return (
    <div className="animated fadeIn">
      <CCard>
        <CCardBody>
          <CRow>
            <CCol xs="12" md="12">
              <CRow style={{ marginBottom: 10 }}>
                <CCol>
                  <CFormInput
                    placeholder={t('orderTransportNumber')}
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </CCol>
                <CCol md="1">
                  <CButton color="info" onClick={() => searchHandler()}>
                    {t('search')}
                  </CButton>
                </CCol>
              </CRow>
              <CTable responsive>
                <thead>
                  <tr>
                    {fields.map((field) => (
                      <th key={field}>{t(field)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>{orders.map((order) => renderOrder(order))}</tbody>
              </CTable>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default ListOrder
