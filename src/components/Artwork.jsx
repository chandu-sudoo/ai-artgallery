import { useState, useRef, Suspense } from 'react'
import { useBox } from '@react-three/cannon'
import { Text, useTexture } from '@react-three/drei'
import * as THREE from 'three'

// Inner component to handle texture loading suspending
const ArtworkCanvas = ({ size, imageColor, imagePath }) => {
  // If we have an image path, load it. If it fails for any reason (like missing file during preview), 
  // it might throw inside useTexture, but usually Suspense catches it. 
  // To be safe for dev preview before they upload, we can check if it exists or just try loading.
  let texture = null
  try {
    // We only call useTexture if imagePath is provided
    // eslint-disable-next-line react-hooks/rules-of-hooks
    texture = imagePath ? useTexture(imagePath) : null
  } catch(e) {
    console.warn("Could not load texture", imagePath)
  }

  return (
    <mesh position={[0, 0, 0.051]}>
      <planeGeometry args={size} />
      {texture ? (
        <meshStandardMaterial map={texture} roughness={0.6} />
      ) : (
        <meshStandardMaterial color={imageColor} roughness={0.6} />
      )}
    </mesh>
  )
}

export const Artwork = ({ position, rotation, title, imageColor, imagePath, size = [2, 3], isEmpty = false, onClick }) => {
  const [fallen, setFallen] = useState(false)
  const isFallenRef = useRef(false)
  
  // We use mass=1 but initially set it to Kinematic so it stays on the wall.
  const [ref, api] = useBox(() => ({
    mass: 1,
    type: 'Kinematic', // Stays in place until we make it dynamic
    position: position,
    rotation: rotation,
    args: [size[0] + 0.2, size[1] + 0.2, 0.4], // Thicker collision box
    onCollide: (e) => {
      // If the player collides with it and it hasn't fallen yet
      if (!isFallenRef.current && e.body.name === 'player') {
        makeFall()
      }
    }
  }))

  const makeFall = () => {
    isFallenRef.current = true
    setFallen(true)
    api.type.set('Dynamic') // Enable gravity/physics
    // Give it a tiny nudge so it falls off the wall visually
    api.velocity.set(0, 0, 0)
    
    // Depending on the wall, push it outward slightly
    const pushForce = 2
    if (rotation[1] === 0) api.applyImpulse([0, 0, pushForce], [0, 0, 0])
    if (rotation[1] === Math.PI) api.applyImpulse([0, 0, -pushForce], [0, 0, 0])
    if (rotation[1] === Math.PI/2) api.applyImpulse([-pushForce, 0, 0], [0, 0, 0])
    if (rotation[1] === -Math.PI/2) api.applyImpulse([pushForce, 0, 0], [0, 0, 0])
  }

  const putBack = () => {
    isFallenRef.current = false
    setFallen(false)
    api.type.set('Kinematic')
    api.position.set(position[0], position[1], position[2])
    api.rotation.set(rotation[0], rotation[1], rotation[2])
    api.velocity.set(0, 0, 0)
    api.angularVelocity.set(0, 0, 0)
  }

  const handleClick = (e) => {
    // Only intercept click if we need to put it back
    if (isFallenRef.current) {
      e.stopPropagation() // Don't trigger room clicks
      putBack()
      // Also open the modal
      onClick() 
    } else {
      // Just open the modal
      onClick()
    }
  }

  return (
    <mesh 
      ref={ref} 
      onClick={handleClick}
      castShadow
      receiveShadow
    >
      {/* Outer Protective Glass / Frame (museum style) */}
      <boxGeometry args={[size[0] + 0.2, size[1] + 0.2, 0.1]} />
      <meshPhysicalMaterial 
        color="#222" 
        transmission={0.2} 
        roughness={0.1} 
        thickness={0.1}
        clearcoat={1}
      />

      {/* Canvas inside the frame (only if not empty) */}
      {!isEmpty && (
        <Suspense fallback={
          <mesh position={[0, 0, 0.051]}>
            <planeGeometry args={size} />
            <meshStandardMaterial color={imageColor} roughness={0.6} />
          </mesh>
        }>
          <ArtworkCanvas size={size} imageColor={imageColor} imagePath={imagePath} />
        </Suspense>
      )}

      {/* Info placard attached to the frame */}
      <group position={[0, -size[1]/2 - 0.2, 0.06]}>
        <mesh>
          <boxGeometry args={[1, 0.2, 0.02]} />
          <meshStandardMaterial color="#eeeeee" />
        </mesh>
        <Text
          position={[0, 0, 0.011]}
          fontSize={0.08}
          color="#000"
          anchorX="center"
          anchorY="middle"
        >
          {title}
        </Text>
      </group>
    </mesh>
  )
}
