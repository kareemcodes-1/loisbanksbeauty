import React from 'react'
import Hero from './components/hero'
import Video from './components/video'
import Testimonials from './components/testimonials'
import FAQ from './components/faq'
import Footer from './components/footer'
import Collections from './components/collections'
import Products from './components/products/products'
import About from './components/about'
import CTA from './components/cta'

const HomePage = () => {
  return (
    <>
      <Hero />
      <Collections />
      <Products />
      <About />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </>
  )
}

export default HomePage