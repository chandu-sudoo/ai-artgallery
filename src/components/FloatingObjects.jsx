import { useBox, useSphere } from '@react-three/cannon'
import { useFrame } from '@react-three/fiber'

const Box = ({ position, color }) => {
  const [ref] = useBox(() => ({
    mass: 1,
    position,
    args: [1, 1, 1],
    material: { friction: 0, restitution: 1.2 } // Bouncy
  }))
  
  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} roughness={0.2} metalness={0.1} />
    </mesh>
  )
}

const Sphere = ({ position, color, size }) => {
  const [ref] = useSphere(() => ({
    mass: 0.5,
    position,
    args: [size],
    material: { friction: 0, restitution: 1.05 }
  }))
  
  return (
    <mesh ref={ref} castShadow receiveShadow>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial color={color} roughness={0.1} metalness={0.2} />
    </mesh>
  )
}

export const FloatingObjects = () => {
  return (
    <group>
      <Box position={[0, 5, -5]} color="#FF3366" />
      <Box position={[5, 8, 2]} color="#33CCFF" />
      <Box position={[-4, 4, 3]} color="#FFCC00" />
      <Sphere position={[2, 6, -3]} color="#33FF99" size={0.8} />
      <Sphere position={[-5, 7, -6]} color="#9933FF" size={1.2} />
      <Sphere position={[6, 3, 5]} color="#FF9933" size={0.6} />
    </group>
  )
}
