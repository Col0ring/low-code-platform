import MenuLayout from '@/components/menu-layout'
import React, { useEffect } from 'react'
const AppPageLayout: React.FC = () => {
  useEffect(() => {
    // wait data
  }, [])
  return (
    <MenuLayout
      menus={[
        {
          title: 1,
          key: '2',
          path: '2',
        },
      ]}
    />
  )
}

export default AppPageLayout
