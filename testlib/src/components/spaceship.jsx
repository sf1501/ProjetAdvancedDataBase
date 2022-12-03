/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
author: Ruslan Malovsky (https://sketchfab.com/malovsky)
license: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
source: https://sketchfab.com/3d-models/free-spaceship-891bb91d22ac4115a8e3c423efb44457
title: Free Spaceship
*/

import React from "react";
import { useGLTF } from "@react-three/drei";

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
    </group>
  );
}

useGLTF.preload("/free_spaceship.glb");
