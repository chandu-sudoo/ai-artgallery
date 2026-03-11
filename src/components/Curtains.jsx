import { useRef } from 'react'
import * as THREE from 'three'

export const Curtains = ({ position, rotation, width = 6, height = 8 }) => {

  const folds = 24
  const foldWidth = width / folds
  const curtainColor = "#6b2c3a" // Elegant dark red/burgundy
  
  return (
    <group position={position} rotation={rotation}>
       {/* Rod */}
       <mesh position={[0, height / 2 + 0.1, 0.2]} castShadow>
         <cylinderGeometry args={[0.08, 0.08, width + 0.8, 16]} />
         <meshStandardMaterial color="#333" metalness={0.9} roughness={0.2} />
       </mesh>
       
       {/* Left Curtain */}
       <group position={[-width / 4 - 0.5, 0, 0]}>
          {[...Array(folds / 2 | 0)].map((_, i) => (
            <mesh key={`l-${i}`} position={[(i - folds/4) * foldWidth + foldWidth/2, 0, i % 2 === 0 ? 0.08 : 0]} castShadow receiveShadow>
              <cylinderGeometry args={[foldWidth / 1.5, foldWidth / 1.5, height, 16]} />
              <meshStandardMaterial color={curtainColor} roughness={0.8} />
            </mesh>
          ))}
       </group>
       
       {/* Right Curtain */}
       <group position={[width / 4 + 0.5, 0, 0]}>
          {[...Array(folds / 2 | 0)].map((_, i) => (
            <mesh key={`r-${i}`} position={[(i - folds/4) * foldWidth + foldWidth/2, 0, i % 2 === 0 ? 0.08 : 0]} castShadow receiveShadow>
              <cylinderGeometry args={[foldWidth / 1.5, foldWidth / 1.5, height, 16]} />
              <meshStandardMaterial color={curtainColor} roughness={0.8} />
            </mesh>
          ))}
       </group>
       
       {/* Window / Frame behind curtains */}
       <mesh position={[0, 0, -0.1]} receiveShadow>
         <boxGeometry args={[width - 1, height - 0.5, 0.1]} />
         <meshStandardMaterial color="#111" roughness={0.2} metalness={0.8} /> {/* Dark glass effect */}
       </mesh>
       <mesh position={[0, height / 2, -0.1]}>
          <boxGeometry args={[width, 0.2, 0.2]} />
          <meshStandardMaterial color="#fff" />
       </mesh>
       <mesh position={[0, -height / 2, -0.1]}>
          <boxGeometry args={[width, 0.2, 0.2]} />
          <meshStandardMaterial color="#fff" />
       </mesh>
       <mesh position={[-width/2 + 0.5, 0, -0.1]}>
          <boxGeometry args={[0.2, height, 0.2]} />
          <meshStandardMaterial color="#fff" />
       </mesh>
       <mesh position={[width/2 - 0.5, 0, -0.1]}>
          <boxGeometry args={[0.2, height, 0.2]} />
          <meshStandardMaterial color="#fff" />
       </mesh>
    </group>
  )
}
