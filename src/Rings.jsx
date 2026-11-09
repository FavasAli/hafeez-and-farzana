import {Suspense, useRef} from 'react'
import {Canvas, useFrame} from '@react-three/fiber'
import {Environment, Float, OrbitControls, Sparkles} from '@react-three/drei'

const Gold = () => <meshStandardMaterial color="#e0aa43" metalness={1} roughness={0.14} envMapIntensity={1.8} />
const Band = () => <mesh><torusGeometry args={[1, 0.12, 48, 160]} /><Gold /></mesh>

function Pair({progress}) {
  const a = useRef(), b = useRef(), group = useRef()
  useFrame((_, dt) => {
    const distance = 2.8 - 1.7 * progress.get()
    a.current.position.x = -distance / 2
    b.current.position.x = distance / 2
    group.current.rotation.y += dt * 0.25
  })
  return (
    <group ref={group} rotation={[0.35, 0, 0.15]}>
      <group ref={a}>
        <Band />
        <mesh position={[0, 1.16, 0]} scale={[1, 1.25, 1]}>
          <octahedronGeometry args={[0.2]} />
          <meshStandardMaterial color="#fff" metalness={0.2} roughness={0} flatShading envMapIntensity={3.5} />
        </mesh>
      </group>
      <group ref={b} rotation={[Math.PI / 2, 0, 0]}><Band /></group>
    </group>
  )
}

export default function Rings({progress}) {
  return (
    <Canvas dpr={[1, 2]} camera={{position: [0, 0, 6.2], fov: 35}}>
      <Suspense fallback={null}>
        <Environment preset="city" />
        <Float speed={1.6} rotationIntensity={0.2} floatIntensity={0.6}><Pair progress={progress} /></Float>
        <Sparkles count={40} scale={6} size={3} speed={0.4} color="#f4d784" />
      </Suspense>
      <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={1} maxPolarAngle={2.2} />
    </Canvas>
  )
}
