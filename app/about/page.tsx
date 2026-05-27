import React from 'react'
import Aurora from '../components/aurora'
import AboutHero from './components/hero'
import AboutMe from './components/about-me'

const WorksPage = () => {
  return (
    <>
    <Aurora
      colorStops={["#c81d11", "#f63a22", "#ffb347"]}
      blend={0.6}
      amplitude={1.2}
      speed={0.8}
    />   

    <AboutHero />
    <AboutMe />
    </>
  )
}

export default WorksPage