import { Component, Suspense, useEffect, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { CameraControls, Html, Loader, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { HOME_TARGET, HOTSPOTS, MODEL_LENGTH, OVERVIEW_DIR, TONES } from './data'

const deg = (d) => (d * Math.PI) / 180

/** Real model (Draco is decoded automatically by drei's useGLTF). */
function Model() {
  const { scene } = useGLTF('/model.glb')
  return <primitive object={scene} />
}

/** Shown if /model.glb is missing, so hotspots and camera moves can be tested. */
function Placeholder() {
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2}>
        <planeGeometry args={[120, 60]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      {HOTSPOTS.map((h) => (
        <mesh key={h.id} position={[h.position[0], h.size[1] / 2, 0]}>
          <boxGeometry args={h.size} />
          <meshStandardMaterial
            color={h.tone === 'amber' ? '#b45309' : '#007A4D'}
            metalness={0.4}
            roughness={0.5}
          />
        </mesh>
      ))}
    </group>
  )
}

class ModelBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? <Placeholder /> : this.props.children
  }
}

function Hotspot({ h, isActive, onSelect }) {
  const tone = TONES[h.tone]
  return (
    <Html position={h.position} center zIndexRange={[10, 0]}>
      <button
        aria-label={h.title}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(h.id)
        }}
        className="relative grid h-11 w-11 place-items-center"
      >
        {!isActive && <span className={`absolute h-8 w-8 animate-ping rounded-full opacity-60 ${tone.dot}`} />}
        <span className={`relative h-5 w-5 rounded-full border-2 border-white shadow-lg ${tone.dot}`} />
      </button>
    </Html>
  )
}

/** Animates the camera: to a machine when one is active, otherwise back to the wide overview. */
function Rig({ controls, active }) {
  const fov = useThree((s) => s.camera.fov)
  // Rounded so tiny resizes (mobile address bar) don't retrigger the animation
  const aspect = useThree((s) => Math.round((s.size.width / s.size.height) * 20) / 20)
  const first = useRef(true)

  useEffect(() => {
    const c = controls.current
    if (!c) return
    let target, position

    if (active) {
      // On portrait phones, aim slightly below the machine so it sits above the data card
      const lift = aspect < 1 ? 1.8 : 0
      target = new THREE.Vector3(active.target[0], active.target[1] - lift, active.target[2])
      position = target
        .clone()
        .add(new THREE.Vector3(...active.view).normalize().multiplyScalar(active.distance))
    } else {
      // Pick a distance so the full model length fits the horizontal FOV (matters on portrait phones)
      const hFov = 2 * Math.atan(Math.tan(deg(fov) / 2) * aspect)
      const distance = Math.max(24, (MODEL_LENGTH * 1.15) / (2 * Math.tan(hFov / 2)))
      target = new THREE.Vector3(...HOME_TARGET)
      position = target.clone().add(new THREE.Vector3(...OVERVIEW_DIR).multiplyScalar(distance))
    }

    // First run snaps into place; every later change animates.
    c.setLookAt(position.x, position.y, position.z, target.x, target.y, target.z, !first.current)
    first.current = false
  }, [active, aspect, fov, controls])

  return null
}

export default function Scene({ activeId, onSelect, onClear }) {
  const controls = useRef()
  const active = HOTSPOTS.find((h) => h.id === activeId) || null

  return (
    <>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 10, 30], fov: 45, near: 0.1, far: 600 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        onPointerMissed={onClear}
        className="!absolute inset-0 touch-none"
      >
        <color attach="background" args={['#0f172a']} />
        <hemisphereLight args={['#dbeafe', '#0f172a', 0.9]} />
        {/* <directionalLight position={[10, 15, 10]} intensity={1.6} /> */}
        <directionalLight position={[10, 15, 10]} intensity={1.4} color='#D3FDD6' />
        <directionalLight position={[-10, 6, -8]} intensity={0.5} color="#FDB913" />

        <Suspense fallback={null}>
          <ModelBoundary>
            <Model />
          </ModelBoundary>
          {HOTSPOTS.map((h) => (
            <Hotspot key={h.id} h={h} isActive={h.id === activeId} onSelect={onSelect} />
          ))}
        </Suspense>

        <CameraControls
          ref={controls}
          smoothTime={0.6}
          draggingSmoothTime={0.15}
          minPolarAngle={deg(60)}
          maxPolarAngle={deg(80)}
          minDistance={4}
          maxDistance={150}
          truckSpeed={0}
        />
        <Rig controls={controls} active={active} />
      </Canvas>
      <Loader />
    </>
  )
}
