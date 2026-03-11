import { useBox } from '@react-three/cannon'

export const DisplayTable = ({ position, rotation = [0, 0, 0], scale = [1, 1, 1] }) => {
  // Table dimensions
  const width = 2 * scale[0]
  const depth = 1.5 * scale[2]
  const height = 1 * scale[1]
  const legWidth = 0.1

  // Collider for the whole table (rough bounding box)
  const [ref] = useBox(() => ({
    type: 'Static',
    position: [position[0], position[1] + height / 2, position[2]],
    args: [width, height, depth],
    rotation: rotation
  }))

  return (
    <group position={position} rotation={rotation}>
      {/* Invisible collider mesh */}
      <mesh ref={ref} visible={false}>
        <boxGeometry args={[width, height, depth]} />
      </mesh>

      {/* Table Top */}
      <mesh position={[0, height, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, 0.1, depth]} />
        <meshStandardMaterial color="#333333" roughness={0.7} />
      </mesh>

      {/* Legs */}
      <mesh position={[-width/2 + legWidth/2, height/2, -depth/2 + legWidth/2]} castShadow receiveShadow>
        <boxGeometry args={[legWidth, height, legWidth]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      <mesh position={[width/2 - legWidth/2, height/2, -depth/2 + legWidth/2]} castShadow receiveShadow>
        <boxGeometry args={[legWidth, height, legWidth]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      <mesh position={[-width/2 + legWidth/2, height/2, depth/2 - legWidth/2]} castShadow receiveShadow>
        <boxGeometry args={[legWidth, height, legWidth]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      <mesh position={[width/2 - legWidth/2, height/2, depth/2 - legWidth/2]} castShadow receiveShadow>
        <boxGeometry args={[legWidth, height, legWidth]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

      {/* Empty Glass Vessel (for future artifacts) */}
      <mesh position={[0, height + 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.8, 32]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          transmission={0.9} 
          opacity={1}
          transparent
          roughness={0.05} 
          thickness={0.05}
          ior={1.5}
        />
      </mesh>
      
      {/* Base for the vessel */}
      <mesh position={[0, height + 0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.1, 32]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
    </group>
  )
}
