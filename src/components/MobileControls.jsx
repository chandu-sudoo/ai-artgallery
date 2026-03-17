import { useState, useCallback, useEffect } from 'react'

export const MobileControls = ({ onMove, onLook }) => {
  const [joystick, setJoystick] = useState({ active: false, x: 0, y: 0, originX: 0, originY: 0 })
  const [lookTouch, setLookTouch] = useState({ active: false, lastX: 0, lastY: 0 })

  const handleJoystickStart = useCallback((e) => {
    const touch = e.touches[0]
    setJoystick({
      active: true,
      x: 0,
      y: 0,
      originX: touch.clientX,
      originY: touch.clientY
    })
  }, [])

  const handleJoystickMove = useCallback((e) => {
    if (!joystick.active) return
    const touch = [...e.touches].find(t => {
      // Find the touch that started near the origin
      const dx = t.clientX - joystick.originX
      const dy = t.clientY - joystick.originY
      return Math.sqrt(dx*dx + dy*dy) < 100 || joystick.active
    })
    
    if (touch) {
      const dx = touch.clientX - joystick.originX
      const dy = touch.clientY - joystick.originY
      const dist = Math.sqrt(dx * dx + dy * dy)
      const maxDist = 50
      const limitedDx = (dx / dist) * Math.min(dist, maxDist)
      const limitedDy = (dy / dist) * Math.min(dist, maxDist)
      
      setJoystick(prev => ({ ...prev, x: limitedDx, y: limitedDy }))
      onMove({ x: limitedDx / maxDist, y: -limitedDy / maxDist })
    }
  }, [joystick, onMove])

  const handleJoystickEnd = useCallback(() => {
    setJoystick({ active: false, x: 0, y: 0, originX: 0, originY: 0 })
    onMove({ x: 0, y: 0 })
  }, [onMove])

  const handleLookStart = useCallback((e) => {
    // Look area is the right half of the screen
    const touch = [...e.touches].find(t => t.clientX > window.innerWidth / 2)
    if (touch) {
      setLookTouch({ active: true, lastX: touch.clientX, lastY: touch.clientY })
    }
  }, [])

  const handleLookMove = useCallback((e) => {
    if (!lookTouch.active) return
    const touch = [...e.touches].find(t => t.clientX > window.innerWidth / 2)
    if (touch) {
      const dx = touch.clientX - lookTouch.lastX
      const dy = touch.clientY - lookTouch.lastY
      onLook({ dx, dy })
      setLookTouch({ active: true, lastX: touch.clientX, lastY: touch.clientY })
    }
  }, [lookTouch, onLook])

  const handleLookEnd = useCallback(() => {
    setLookTouch({ active: false, lastX: 0, lastY: 0 })
  }, [])

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      pointerEvents: 'none', zIndex: 1000
    }}>
      {/* Joystick Area */}
      <div 
        onTouchStart={handleJoystickStart}
        onTouchMove={handleJoystickMove}
        onTouchEnd={handleJoystickEnd}
        style={{
          position: 'absolute', bottom: '40px', left: '40px',
          width: '150px', height: '150px',
          borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(5px)', pointerEvents: 'auto',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          boxShadow: '0 0 20px rgba(0,0,0,0.2)', border: '2px solid rgba(255,255,255,0.2)'
        }}
      >
        <div style={{
          width: '60px', height: '60px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.8)',
          transform: `translate(${joystick.x}px, ${joystick.y}px)`,
          boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
          transition: joystick.active ? 'none' : 'transform 0.2s ease-out'
        }} />
      </div>

      {/* Look Area (Transparent overlay on right side) */}
      <div 
        onTouchStart={handleLookStart}
        onTouchMove={handleLookMove}
        onTouchEnd={handleLookEnd}
        style={{
          position: 'absolute', top: 0, right: 0, width: '60%', height: '100%',
          pointerEvents: 'auto'
        }} 
      />
    </div>
  )
}
