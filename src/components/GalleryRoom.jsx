import { usePlane, useBox } from '@react-three/cannon'
import * as THREE from 'three'
import { useMemo } from 'react'
import { Clock } from './Clock'
import { Curtains } from './Curtains'

export const GalleryRoom = () => {
  // Create a tile texture dynamically
  const tileTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const context = canvas.getContext('2d')
    
    // Base color
    context.fillStyle = '#f0f0f0' 
    context.fillRect(0, 0, 512, 512)
    
    // Checkered pattern for marble-like tiles
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, 256, 256)
    context.fillRect(256, 256, 256, 256)

    // Grout lines
    context.strokeStyle = '#d0d0d0'
    context.lineWidth = 4
    context.beginPath()
    context.moveTo(256, 0)
    context.lineTo(256, 512)
    context.moveTo(0, 256)
    context.lineTo(512, 256)
    context.stroke()

    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(15, 15) // Repeat pattern over 30x30 floor (2 units per major tile)
    return texture
  }, [])

  // Floor
  const [floorRef] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
    type: 'Static'
  }))

  // Ceiling
  usePlane(() => ({
    rotation: [Math.PI / 2, 0, 0],
    position: [0, 8, 0],
    type: 'Static'
  }))

  const wallMaterialProps = { color: "#e3e1df", roughness: 0.9, metalness: 0.05 } // Elegant warm gray walls
  const trimMaterialProps = { color: "#ffffff", roughness: 0.5 } // White trims

  // We make a central room (30x30)
  // Walls
  const [wallN] = useBox(() => ({ position: [0, 4, -15], args: [30, 8, 1], type: 'Static' }))
  const [wallS] = useBox(() => ({ position: [0, 4, 15], args: [30, 8, 1], type: 'Static' }))
  const [wallE] = useBox(() => ({ position: [15, 4, 0], args: [1, 8, 30], type: 'Static' }))
  const [wallW] = useBox(() => ({ position: [-15, 4, 0], args: [1, 8, 30], type: 'Static' }))

  return (
    <group>
      {/* Floor */}
      <mesh ref={floorRef} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial map={tileTexture} roughness={0.1} metalness={0.1} /> {/* Premium tiled floor */}
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, 8, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#ffffff" roughness={1} />
      </mesh>

      {/* Walls */}
      <mesh ref={wallN} receiveShadow castShadow>
        <boxGeometry args={[30, 8, 1]} />
        <meshStandardMaterial {...wallMaterialProps} />
      </mesh>
      <mesh ref={wallS} receiveShadow castShadow>
        <boxGeometry args={[30, 8, 1]} />
        <meshStandardMaterial {...wallMaterialProps} />
      </mesh>
      <mesh ref={wallE} receiveShadow castShadow>
        <boxGeometry args={[1, 8, 30]} />
        <meshStandardMaterial {...wallMaterialProps} />
      </mesh>
      <mesh ref={wallW} receiveShadow castShadow>
        <boxGeometry args={[1, 8, 30]} />
        <meshStandardMaterial {...wallMaterialProps} />
      </mesh>
      
      {/* Skirting boards (trim at bottom of walls) */}
      <mesh position={[0, 0.2, -14.4]} receiveShadow>
        <boxGeometry args={[29.8, 0.4, 0.2]} />
        <meshStandardMaterial {...trimMaterialProps} />
      </mesh>
      <mesh position={[0, 0.2, 14.4]} receiveShadow>
        <boxGeometry args={[29.8, 0.4, 0.2]} />
        <meshStandardMaterial {...trimMaterialProps} />
      </mesh>
      <mesh position={[14.4, 0.2, 0]} receiveShadow>
        <boxGeometry args={[0.2, 0.4, 29.8]} />
        <meshStandardMaterial {...trimMaterialProps} />
      </mesh>
      <mesh position={[-14.4, 0.2, 0]} receiveShadow>
        <boxGeometry args={[0.2, 0.4, 29.8]} />
        <meshStandardMaterial {...trimMaterialProps} />
      </mesh>

      {/* Room Decor */}
      <Clock position={[0, 6, -14.4]} rotation={[0, 0, 0]} />
      <Curtains position={[0, 4, 14.4]} rotation={[0, Math.PI, 0]} width={8} height={8} />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      {/* Spotlight for paintings */}
      <spotLight position={[0, 7.8, -10]} angle={0.6} penumbra={0.5} intensity={1.5} castShadow target-position={[0, 2.5, -14.8]} />
      <spotLight position={[-8, 7.8, -10]} angle={0.6} penumbra={0.5} intensity={1.5} castShadow target-position={[-8, 2.5, -14.8]} />
      <spotLight position={[8, 7.8, -10]} angle={0.6} penumbra={0.5} intensity={1.5} castShadow target-position={[8, 2.5, -14.8]} />
      
      <spotLight position={[10, 7.8, -5]} angle={0.6} penumbra={0.5} intensity={1.5} castShadow target-position={[14.8, 2.5, -5]} />
      <spotLight position={[10, 7.8, 5]} angle={0.6} penumbra={0.5} intensity={1.5} castShadow target-position={[14.8, 2.5, 5]} />
      
      <spotLight position={[-10, 7.8, 0]} angle={0.6} penumbra={0.5} intensity={1.5} castShadow target-position={[-14.8, 2.5, 0]} />
    </group>
  )
}
