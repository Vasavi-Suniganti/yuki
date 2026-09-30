import * as THREE from 'three';

export const cameraPathPoints = [
  new THREE.Vector3(0, 4, 16),
  new THREE.Vector3(-1, 5, 11),
  new THREE.Vector3(-5, 7, 7),
  new THREE.Vector3(-3, 10, 3),
  new THREE.Vector3(2, 6, 0),
  new THREE.Vector3(6, 8, -4),
  new THREE.Vector3(3, 13, -9),
  new THREE.Vector3(0, 16, -18)
];

export const cameraPath = new THREE.CatmullRomCurve3(cameraPathPoints, false, 'centripetal', 0.5);
