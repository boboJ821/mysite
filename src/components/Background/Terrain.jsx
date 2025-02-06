import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Terrain() {
  const meshRef = useRef()
  const geometry = new THREE.PlaneGeometry(30, 30, 64, 64)

  // 创建顶点位移
  const positions = geometry.attributes.position.array
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i]
    const z = positions[i + 2]
    positions[i + 1] = Math.sin(x) * Math.sin(z) * 2
  }

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    meshRef.current.rotation.x = -Math.PI / 2
    meshRef.current.position.y = -5
    // 添加波浪动画
    const positions = meshRef.current.geometry.attributes.position.array
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i]
      const z = positions[i + 2]
      positions[i + 1] = Math.sin(x + time) * Math.sin(z + time) * 2
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[30, 30, 64, 64]} />
      <meshStandardMaterial
        color="#9336B4"
        wireframe
        side={THREE.DoubleSide}
      />
    </mesh>
  )
} 