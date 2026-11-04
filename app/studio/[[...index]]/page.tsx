'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity.config'
import { useEffect, useState } from 'react'

export default function StudioPage() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Loading Sanity Studio...</h2>
          <p>Please wait...</p>
        </div>
      </div>
    )
  }

  return <NextStudio config={config} />
}
