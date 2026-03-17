import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/cannon'
import { KeyboardControls, Sky } from '@react-three/drei'

import { Player } from './components/Player'
import { GalleryRoom } from './components/GalleryRoom'
import { Artwork } from './components/Artwork'
import { DisplayTable } from './components/DisplayTable'

// We add an empty frame at the end (id: 7) with no color to represent the "empty painting holder"
const rawArtworksData = [
  // User Provided Artworks
  { id: 1, title: 'The Aftermath', color: '#ff5555', imagePath: '/art1.jpg', size: [4, 3] }, // Landscape aspect ratio
  { id: 2, title: 'Scarlet Silhouette', color: '#55aa55', imagePath: '/art2.jpg', size: [2, 3.5] }, // Portrait aspect ratio
  { id: 3, title: 'The Woodsmen', color: '#5555ff', imagePath: '/art3.jpg', size: [4, 2.5] }, // Landscape aspect ratio
  { id: 4, title: 'Masked Visage', color: '#ffa500', imagePath: '/art4.jpg', size: [2.5, 3.5] }, // Portrait aspect ratio
  
  // Fillers to occupy remaining walls if needed
  { id: 5, title: 'Stillness', color: '#8a2be2', size: [3, 3] },
  { id: 6, title: 'Chaos', color: '#ff1493', size: [4, 4] },
  
  // Empty frame
  { id: 7, title: 'Awaiting Masterpiece', color: '#cccccc', size: [2, 3], isEmpty: true },
]

const wallPositions = [
  // Front Wall (Z = -14.4)
  { position: [0, 2.5, -14.4], rotation: [0, 0, 0] },
  { position: [-8, 2.5, -14.4], rotation: [0, 0, 0] },
  { position: [8, 2.5, -14.4], rotation: [0, 0, 0] },

  // Right Wall (X = 14.4)
  { position: [14.4, 2.5, -5], rotation: [0, -Math.PI / 2, 0] },
  { position: [14.4, 2.5, 5], rotation: [0, -Math.PI / 2, 0] },

  // Left Wall (X = -14.4)
  { position: [-14.4, 2.5, 0], rotation: [0, Math.PI / 2, 0] },
  { position: [-14.4, 2.5, -8], rotation: [0, Math.PI / 2, 0] }
]

function App() {
  const [activeArtwork, setActiveArtwork] = useState(null)
  const [artworks, setArtworks] = useState([])

  // Randomize artworks on load
  useState(() => {
    const shuffledArtworks = [...rawArtworksData].sort(() => 0.5 - Math.random())
    const assignedArtworks = wallPositions.map((pos, index) => ({
      ...shuffledArtworks[index % shuffledArtworks.length],
      position: pos.position,
      rotation: pos.rotation,
      // unique key needed since we might reuse artworks if wallPositions > rawArtworksData
      uniqueId: `${shuffledArtworks[index % shuffledArtworks.length].id}-${index}`
    }))
    setArtworks(assignedArtworks)
  }, [])

  return (
    <>
      <KeyboardControls
        map={[
          { name: 'forward', keys: ['ArrowUp', 'w', 'W'] },
          { name: 'backward', keys: ['ArrowDown', 's', 'S'] },
          { name: 'left', keys: ['ArrowLeft', 'a', 'A'] },
          { name: 'right', keys: ['ArrowRight', 'd', 'D'] },
          { name: 'jump', keys: ['Space'] },
        ]}
      >
        <Canvas shadows camera={{ fov: 60, position: [0, 1.5, 5] }}>
          {/* Environment */}
          <color attach="background" args={['#ffffff']} />
          <fog attach="fog" args={['#ffffff', 10, 40]} />
          <ambientLight intensity={0.6} />
          
          <Physics gravity={[0, -9.8, 0]}> {/* Real gravity */}
            <Player />
            <GalleryRoom />
            
            {/* Display Tables in the center of the room */}
            <DisplayTable position={[-4, 0, -5]} />
            <DisplayTable position={[4, 0, -5]} />
            <DisplayTable position={[0, 0, 2]} />

            {/* Artworks */}
            {artworks.map((art) => (
              <Artwork
                key={art.uniqueId}
                position={art.position}
                rotation={art.rotation}
                title={art.title}
                imageColor={art.color}
                imagePath={art.imagePath}
                size={art.size}
                isEmpty={art.isEmpty}
                onClick={() => {
                  document.exitPointerLock()
                  setActiveArtwork(art)
                }}
              />
            ))}
          </Physics>
        </Canvas>
      </KeyboardControls>

      {/* Modal Overlay */}
      {activeArtwork && (
        <div 
          onClick={() => setActiveArtwork(null)}
          style={{
            position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(255, 255, 255, 0.9)', 
            backdropFilter: 'blur(10px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000,
            opacity: activeArtwork ? 1 : 0, transition: 'opacity 0.3s ease',
            padding: '20px', boxSizing: 'border-box'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{ 
              backgroundColor: '#fff', padding: 'min(40px, 5vw)', borderRadius: 16, 
              maxWidth: 900, width: '100%', maxHeight: '90vh', overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)', 
              display: 'flex', 
              flexDirection: window.innerWidth > window.innerHeight ? 'row' : 'column',
              gap: 'min(40px, 5vw)',
              fontFamily: "'Inter', sans-serif"
            }}
          >
            {activeArtwork.isEmpty ? (
              <div style={{ 
                width: '100%', aspectRatio: '1/1', maxWidth: '400px', backgroundColor: '#eee', 
                border: '4px dashed #ccc', borderRadius: '8px', flexShrink: 0,
                display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#999',
                margin: '0 auto'
              }}>
                <h3 style={{ textAlign: 'center', padding: '20px' }}>Reserved for future artwork</h3>
              </div>
            ) : activeArtwork.imagePath ? (
              <div style={{ 
                width: '100%', aspectRatio: '1/1', maxWidth: '400px', flexShrink: 0,
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                backgroundColor: '#f5f5f5', borderRadius: '8px', overflow: 'hidden',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)',
                margin: '0 auto'
              }}>
                <img 
                  src={activeArtwork.imagePath} 
                  alt={activeArtwork.title} 
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.parentElement.style.backgroundColor = activeArtwork.color;
                    e.target.parentElement.innerHTML = `<span style="color:white; font-weight:bold; text-align:center; padding:10px;">${activeArtwork.title} (Image Pending)</span>`;
                  }}
                />
              </div>
            ) : (
              <div style={{ 
                width: '100%', aspectRatio: '1/1', maxWidth: '400px', backgroundColor: activeArtwork.color, 
                borderRadius: '8px', flexShrink: 0,
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)',
                margin: '0 auto'
              }} />
            )}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
              <h1 style={{ margin: '0 0 10px 0', fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', fontWeight: 800 }}>{activeArtwork.title}</h1>
              <p style={{ color: '#666', fontSize: 'clamp(0.9rem, 3vw, 1.2rem)', lineHeight: '1.6', marginBottom: '30px' }}>
                This is a placeholder description for the artwork {activeArtwork.title}. 
                When real artworks are provided, this section will contain the actual details, medium, and year of the piece.
              </p>
              <button 
                onClick={() => setActiveArtwork(null)}
                style={{
                  padding: '12px 24px', backgroundColor: '#000', color: '#fff',
                  border: 'none', borderRadius: '30px', fontSize: '1.1rem', fontWeight: 600,
                  cursor: 'pointer', alignSelf: 'flex-start', transition: 'transform 0.2s',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default App
