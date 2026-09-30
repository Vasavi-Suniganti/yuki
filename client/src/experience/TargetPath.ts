import * as THREE from 'three';

export const targetPathPoints = [
  new THREE.Vector3(0, 5, 0),
  new THREE.Vector3(-2, 6, -2),
  new THREE.Vector3(-5, 7, -4),
  new THREE.Vector3(0, 6, -7),
  new THREE.Vector3(3, 8, -10),
  new THREE.Vector3(0, 10, -14)
];

export const targetPath = new THREE.CatmullRomCurve3(targetPathPoints, false, 'centripetal', 0.5);
