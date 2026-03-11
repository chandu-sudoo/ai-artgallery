import { useEffect, useRef } from 'react'
import { useSphere } from '@react-three/cannon'
import { useThree, useFrame } from '@react-three/fiber'
import { PointerLockControls, useKeyboardControls } from '@react-three/drei'
import * as THREE from 'three'

const SPEED = 7
const direction = new THREE.Vector3()
const frontVector = new THREE.Vector3()
const sideVector = new THREE.Vector3()

export const Player = () => {
  const { camera } = useThree()
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

  useFrame(() => {
    camera.position.set(pos.current[0], pos.current[1] + 0.6, pos.current[2])
    const { forward, backward, left, right } = getKeys()
    
    frontVector.set(0, 0, Number(backward) - Number(forward))
    sideVector.set(Number(left) - Number(right), 0, 0)
    
    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(SPEED).applyEuler(camera.rotation)
    api.velocity.set(direction.x, velocity.current[1], direction.z)
  })

  return (
    <>
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
      <mesh ref={ref} visible={false}>
        <sphereGeometry args={[0.5]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    </>
  )
}
