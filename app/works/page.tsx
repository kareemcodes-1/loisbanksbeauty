import React from 'react'
import Aurora from '../components/aurora'
import AllWorks from './components/all-works'

const WorksPage = () => {
  return (
    <>
    <Aurora
      colorStops={["#c81d11", "#f63a22", "#ffb347"]}
      blend={0.6}
      amplitude={1.2}
      speed={0.8}
    />   

    <AllWorks />
    </>
  )
}

export default WorksPage