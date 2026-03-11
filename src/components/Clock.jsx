import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'

export const Clock = ({ position, rotation }) => {
  const hoursRef = useRef()
  const minutesRef = useRef()
  const secondsRef = useRef()

  useFrame(() => {
    const date = new Date()
    const hours = date.getHours() % 12
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()
    const ms = date.getMilliseconds()
    
    // Smooth continuous movement
    const secondsAngle = ((seconds + ms / 1000) / 60) * Math.PI * 2
    const minutesAngle = ((minutes + seconds / 60) / 60) * Math.PI * 2
    const hoursAngle = ((hours + minutes / 60) / 12) * Math.PI * 2

    if (secondsRef.current) secondsRef.current.rotation.z = -secondsAngle
    if (minutesRef.current) minutesRef.current.rotation.z = -minutesAngle
    if (hoursRef.current) hoursRef.current.rotation.z = -hoursAngle
  })

  return (
    <group position={position} rotation={rotation}>
      {/* Clock Face - rotated so the circular face points towards +Z */}
      <mesh rotation={[Math.PI / 2, 0, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.5, 1.5, 0.1, 32]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.5} />
      </mesh>
      
      {/* Clock Rim */}
      <mesh position={[0, 0, 0]} receiveShadow castShadow>
        <torusGeometry args={[1.5, 0.08, 16, 100]} />
        <meshStandardMaterial color="#222222" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Numbers */}
      {[...Array(12)].map((_, i) => {
        const angle = -(i * Math.PI) / 6 + Math.PI / 2
        return (
          <Text
            key={i}
            position={[Math.cos(angle) * 1.2, Math.sin(angle) * 1.2, 0.06]}
            fontSize={0.3}
            color="#000000"
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZJhjp-Ek-_EeAmM.woff"
          >
            {i === 0 ? 12 : i}
          </Text>
        )
      })}

      {/* Center Pin */}
      <mesh position={[0, 0, 0.07]}>
        <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Clock Hands */}
      {/* Hour Hand */}
      <group position={[0, 0, 0.08]} ref={hoursRef}>
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[0.08, 0.8, 0.02]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </group>

      {/* Minute Hand */}
      <group position={[0, 0, 0.09]} ref={minutesRef}>
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[0.05, 1.1, 0.02]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </group>

      {/* Second Hand */}
      <group position={[0, 0, 0.1]} ref={secondsRef}>
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[0.03, 1.3, 0.02]} />
          <meshStandardMaterial color="#ff0000" />
        </mesh>
        {/* Tail of second hand */}
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[0.03, 0.4, 0.02]} />
          <meshStandardMaterial color="#ff0000" />
        </mesh>
      </group>
    </group>
  )
}
