import React, {useRef} from 'react';
import './App.css';
import { Canvas, useFrame, MeshProps, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { Stats, OrbitControls } from '@react-three/drei'
import { useControls } from 'leva'


const Lights = () => {
  const directionalRef = useRef<THREE.DirectionalLight>(null!)

  useControls('Directional Light', {
    intensity: {
      value: 1, min: 0, max: 5, step: 0.1,
      onChange: (v) => {
        directionalRef.current.intensity = v
      },
    },
    position: {
      value: [3.3,1.0,4.4],
      onChange: (v) => {
        directionalRef.current.position.x = v[0]
        directionalRef.current.position.y = v[1]
        directionalRef.current.position.z = v[2]
      },
    },
  })
  
  return (
    <directionalLight ref={directionalRef} castShadow />
  )
}

type BoxProps = {
  props: MeshProps;
  wireframe?: boolean;
}

const Box = (boxprops: BoxProps) => {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame((_, delta) => {
    if( !ref.current) return
    ref.current.rotation.x += 1 * delta
    ref.current.rotation.y += 0.5 * delta
  })

  return (
    <mesh {...boxprops.props} ref={ref}>
      <boxGeometry />
    </mesh>
  )
}

const Floor = () => {
  return (
    <mesh rotation-x={-Math.PI / 2} receiveShadow={true}>
      <circleGeometry args={[10]} />
      <meshStandardMaterial />
    </mesh>
  )
}

const App = () => {
  const texture = useLoader(THREE.TextureLoader, './imgs/grid.png')

  return (
    <div style={{ width: "75vw", height: "75vh" }}>
      <Canvas camera={{ position: [4, 4, 3] }} shadows>
        <Lights />
        <Box props={{position:[3, 1, 0], name:"meshBasicMaterial",    material: new THREE.MeshBasicMaterial({ map: texture })}}/>
        <Box props={{position:[1, 1, 0], name:"meshNormalMaterial",   material: new THREE.MeshNormalMaterial({flatShading: true,})}}/>
        <Box props={{position:[1, 3, 0], name:"meshPhongMaterial",    material: new THREE.MeshPhongMaterial({flatShading: true, map: texture,})}}/>
        <Box props={{position:[3, 3, 0], name:"MeshStandardMaterial", material: new THREE.MeshStandardMaterial({flatShading: true, map: texture,})}}/>
        <Floor />
        <OrbitControls />
        <axesHelper args={[5]} />
        <gridHelper />
        <Stats />
      </Canvas>
    </div>
  );
}

export default App;
