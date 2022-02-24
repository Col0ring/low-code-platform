import React from 'react'
import { Outlet } from 'react-router-dom'
// eslint-disable-next-line import/default
import ParticlesBg from 'particles-bg'
import FormHeader from '../../components/form-header'
import './style.less'
const AuthLayout: React.FC = () => {
  return (
    <div className="auth-layout">
      <div className="form-container">
        <FormHeader title="Low-Code-Platform" className="form-header" />
        <Outlet />
      </div>
      <ParticlesBg bg type="cobweb" />
    </div>
  )
}

export default AuthLayout
