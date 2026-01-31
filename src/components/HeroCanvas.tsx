'use client'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Text, RoundedBox, Environment } from '@react-three/drei'
import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'

function CityCard() {
  const groupRef = useRef<THREE.Group>(null!)
  const [pointerPos, setPointerPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handlePointer = (e: MouseEvent) => {
      setPointerPos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      })
    }
    window.addEventListener('pointermove', handlePointer)
    return () => window.removeEventListener('pointermove', handlePointer)
  }, [])

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        pointerPos.y * 0.1,
        0.05
      )
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        pointerPos.x * 0.15,
        0.05
      )
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={groupRef}>
        <RoundedBox args={[3.5, 2.2, 0.08]} radius={0.12} smoothness={4}>
          <meshStandardMaterial
            color="#1a1a2e"
            metalness={0.7}
            roughness={0.2}
            envMapIntensity={0.8}
          />
        </RoundedBox>
        <Text
          position={[0, 0.3, 0.05]}
          fontSize={0.35}
          color="#F3C623"
          anchorX="center"
          anchorY="middle"
          fontWeight={800}
        >
          Kaposvár+
        </Text>
        <Text
          position={[0, -0.2, 0.05]}
          fontSize={0.14}
          color="#94A3B8"
          anchorX="center"
          anchorY="middle"
          maxWidth={2.8}
          textAlign="center"
        >
          Városi szuperapp
        </Text>
        <mesh position={[1.2, -0.6, 0.05]}>
          <planeGeometry args={[0.5, 0.5]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
    </Float>
  )
}

function Particles() {
  const count = 100
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 15
    positions[i * 3 + 1] = (Math.random() - 0.5) * 15
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
  }

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#F3C623" transparent opacity={0.6} sizeAttenuation />
    </points>
  )
}

export default function HeroCanvas() {
  const [webglSupported, setWebglSupported] = useState(true)

  useEffect(() => {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) {
      setWebglSupported(false)
    }
  }, [])

  if (!webglSupported) {
    return <HeroFallback />
  }

  return (
    <div style={{ width: '100%', height: '400px', borderRadius: '18px', overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 40 }}>
        <ambientLight intensity={0.3} />
        <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1} castShadow />
        <spotLight position={[-10, -10, -10]} angle={0.3} penumbra={1} intensity={0.5} />
        <Environment preset="city" />
        <CityCard />
        <Particles />
      </Canvas>
    </div>
  )
}

export function HeroFallback() {
  return (
    <div
      style={{
        width: '100%',
        height: '400px',
        borderRadius: '18px',
        background: 'linear-gradient(135deg, #0F172A, #1E293B)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #ffffff1a',
      }}
    >
      <svg width="280" height="180" viewBox="0 0 280 180">
        <rect
          x="10"
          y="10"
          width="260"
          height="160"
          rx="12"
          fill="#1a1a2e"
          stroke="#F3C623"
          strokeWidth="2"
        />
        <text
          x="140"
          y="90"
          textAnchor="middle"
          fill="#F3C623"
          fontSize="24"
          fontWeight="800"
        >
          Kaposvár+
        </text>
        <text
          x="140"
          y="115"
          textAnchor="middle"
          fill="#94A3B8"
          fontSize="12"
        >
          Városi szuperapp
        </text>
      </svg>
    </div>
  )
}
