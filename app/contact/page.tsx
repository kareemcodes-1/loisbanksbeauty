import React from 'react'
import ContactMe from './components/contact-me'
import Aurora from '../components/aurora'

const ContactPage = () => {
  return (
     <>
      <Aurora
           colorStops={["#c81d11", "#f63a22", "#ffb347"]}
           blend={0.6}
           amplitude={1.2}
           speed={0.8}
         /> 

        <ContactMe />
     </>
  )
}

export default ContactPage