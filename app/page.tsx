import React from 'react'
import Hero from './components/hero'
import Navbar from './components/navbar'
import Stats from './components/stats'
import SelectedWorks from './components/projects'
import Problems from './components/problems'
import Offer from './components/offer'
import Aurora from './components/aurora'
import Video from './components/video'
import Process from './components/process'
import Testimonials from './components/testimonials'
import FAQ from './components/faq'
import CTA from './components/cta'
import Footer from './components/footer'
import GradualBlurMemo from '@/components/animations/gradual-blur'

const HomePage = () => {
  return (
    <div className="relative overflow-hidden">

      <Aurora
        colorStops={["#c81d11", "#f63a22", "#ffb347"]}
        blend={0.5}
        amplitude={1.0}
        speed={0.8}
      />
      <Hero />
      <Video />
      <SelectedWorks />
      <Problems />
      <Offer />
      <Process />
      <Testimonials />
      <FAQ />

      <GradualBlurMemo
        target="page"
        position="bottom"
        height="6rem"
        strength={2}
        divCount={7}
        curve="bezier"
        exponential
        opacity={1}
      />
    </div>
  )
}

export default HomePage