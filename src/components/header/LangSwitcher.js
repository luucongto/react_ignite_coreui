import React from 'react'

import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react'
import i18n from '../../I18n'

const LangSwitcher = () => {
  let langs = {
    en: {
      code: 'en',
      icon: 'us',
      name: 'English',
    },
    vi: {
      code: 'vi',
      icon: 'vn',
      name: 'Tiếng Việt',
    },
  }
  // eslint-disable-next-line
  const lang = i18n.language || 'vi'
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <strong>
          <i className={`fi fi-${langs[lang].icon}`} />
        </strong>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        {Object.values(langs).map((lang) => (
          <CDropdownItem
            key={lang.code}
            onClick={() => {
              i18n.changeLanguage(lang.code)
              localStorage.setItem('language', lang.code)
              // window.location.reload()
            }}
          >
            <i className={`fi fi-${lang.icon}`} />
            {lang.name}
          </CDropdownItem>
        ))}
      </CDropdownMenu>
    </CDropdown>
  )
}

export default LangSwitcher
