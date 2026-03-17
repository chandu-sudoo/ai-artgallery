import { useEffect, useRef, useState, useCallback } from 'react'
import { useSphere } from '@react-three/cannon'
import { useThree, useFrame } from '@react-three/fiber'
import { PointerLockControls, useKeyboardControls } from '@react-three/drei'
import * as THREE from 'three'
import { MobileControls } from './MobileControls'

const SPEED = 7
const LOOK_SENSITIVITY = 0.002
const direction = new THREE.Vector3()
const frontVector = new THREE.Vector3()
const sideVector = new THREE.Vector3()

export const Player = () => {
  const { camera } = useThree()
  const [isMobile] = useState(() => 'ontouchstart' in window || navigator.maxTouchPoints > 0)
  
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: 'Dynamic',
    position: [0, 1.5, 5],
    args: [0.5],
    fixedRotation: true
  }))

  const velocity = useRef([0, 0, 0])
  useEffect(() => api.velocity.subscribe((v) => (velocity.current = v)), [api.velocity])
  
  const pos = useRef([0, 0, 0])
  useEffect(() => api.position.subscribe((p) => (pos.current = p)), [api.position])

  const [subscribeKeys, getKeys] = useKeyboardControls()
  
  // Mobile movement state
  const mobileMovement = useRef({ x: 0, y: 0 })
  const handleMobileMove = useCallback((move) => {
    mobileMovement.current = move
  }, [])

  // Mobile look rotation
  const mobileLookDelta = useRef({ dx: 0, dy: 0 })
  const handleMobileLook = useCallback(({ dx, dy }) => {
    mobileLookDelta.current.dx += dx
    mobileLookDelta.current.dy += dy
  }, [])

  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'))

  useFrame(() => {
    camera.position.set(pos.current[0], pos.current[1] + 0.6, pos.current[2])
    
    // Apply mobile rotation from accumulated deltas
    if (isMobile && (mobileLookDelta.current.dx !== 0 || mobileLookDelta.current.dy !== 0)) {
      euler.current.setFromQuaternion(camera.quaternion)
      euler.current.y -= mobileLookDelta.current.dx * LOOK_SENSITIVITY
      euler.current.x -= mobileLookDelta.current.dy * LOOK_SENSITIVITY
      euler.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.current.x))
      camera.quaternion.setFromEuler(euler.current)
      
      // Reset deltas after applying
      mobileLookDelta.current.dx = 0
      mobileLookDelta.current.dy = 0
    }

    let fb = 0, lr = 0
    
    if (isMobile) {
      fb = mobileMovement.current.y
      lr = -mobileMovement.current.x
    } else {
      const { forward, backward, left, right } = getKeys()
      fb = Number(backward) - Number(forward)
      lr = Number(left) - Number(right)
    }

    frontVector.set(0, 0, fb)
    sideVector.set(lr, 0, 0)
    
    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(SPEED).applyEuler(camera.rotation)
    api.velocity.set(direction.x, velocity.current[1], direction.z)
  })

  return (
    <>
      {!isMobile && (
        <PointerLockControls 
          onLock={() => {
            const el = document.getElementById('instructions')
            if(el) el.style.opacity = '0'
          }}
          onUnlock={() => {
            const el = document.getElementById('instructions')
            if(el) el.style.opacity = '1'
          }}
        />
      )}
      {isMobile && <MobileControls onMove={handleMobileMove} onLook={handleMobileLook} />}
      <mesh ref={ref} visible={false}>
        <sphereGeometry args={[0.5]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    </>
  )
}
