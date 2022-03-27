import React from 'react'
import { Row, Col } from 'antd'
import { NodeComponent } from '../../../type'

const LayoutContainer: NodeComponent = ({ node }) => {
  return (
    <Row>
      <Col>{}</Col>
    </Row>
  )
}

LayoutContainer.getInitialProps = () => ({})

export default LayoutContainer
