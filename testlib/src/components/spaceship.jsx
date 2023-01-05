/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
author: Ruslan Malovsky (https://sketchfab.com/malovsky)
license: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
source: https://sketchfab.com/3d-models/free-spaceship-891bb91d22ac4115a8e3c423efb44457
title: Free Spaceship
*/

import React, { memo } from "react";
import { PerspectiveCamera, useGLTF } from "@react-three/drei";

export function Model(props) {
  const { nodes, materials } = useGLTF("/free_spaceship.glb");
  return (
    <group {...props} dispose={null} scale={20}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <group rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <group position={[6.17, 0, 0]}>
              <mesh
                geometry={nodes.Spaceship_02_2_0.geometry}
                material={materials.material}
              />
              <mesh
                geometry={nodes.Spaceship_02_1_0.geometry}
                material={materials.material_1}
              />
            </group>
          </group>
        </group>
      </group>
      <PerspectiveCamera
        name={"camera" + props.name}
        makeDefault={false}
        position={props.position}
        fov={45}
        far={10000000}
        near={0.5}
        aspect={window.innerWidth / window.innerHeight}
      />
    </group>
  );
}
export const MemoModel = memo(Model);

useGLTF.preload("/free_spaceship.glb");