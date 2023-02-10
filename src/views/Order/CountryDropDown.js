/* eslint-disable react/prop-types */
import React from 'react'
import { useTranslation } from 'react-i18next'
import { CFormSelect } from '@coreui/react'
const COUNTRIES = ['Japan', 'Vietnam', 'American']
export default function CountryDropdown(props) {
  const { t } = useTranslation()
  return (
    <CFormSelect
      type="select"
      value={props.value}
      onChange={(event) => {
        if (props.onChange) props.onChange(event)
      }}
    >
      <option value="">{t('please_select')}</option>
      {COUNTRIES.map((country) => (
        <option value={country} key={country}>
          {country}
        </option>
      ))}
    </CFormSelect>
  )
}
