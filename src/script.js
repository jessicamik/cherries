// My attempt at connecting a public library
// import * as THREE from 'https://unpkg.com/three@0.123.0/build/three.module.js';
// import { OrbitControls } from "https://unpkg.com/three@0.123.0/examples/jsm/controls/OrbitControls.js";
// import { GLTFLoader } from 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/168282/gltfloader.js'


// import './style.css'
// import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Cursor
 */
 const cursor = {
    x: 0,
    y: 0
}
window.addEventListener('mousemove', (event) =>
{
    cursor.x = - (event.clientX / sizes.width - 0.5)
    cursor.y = (event.clientY / sizes.height - 0.5)
    cursor.z = (event.clientY / sizes.height - 0.5)
})


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color (0xFFFFFF)

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// GLTF loader
const gltfLoader = new GLTFLoader()
const model = new THREE.Object3D();
// gltfLoader.setDRACOLoader(dracoLoader

/**
 * Textures
 */
 const bakedTexture = textureLoader.load('https://i.ibb.co/vZLmBL3/bake-cherry.jpg')
 bakedTexture.flipY = false
 bakedTexture.encoding = THREE.sRGBEncoding


 /**
 * Materials
 */
// Baked material
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })

/**
 * Model
 */
gltfLoader.load(
    'cherries.txt',
    (gltf) => {
        const model = gltf.scene;
        model.name = 'cherries.txt';
       
        gltf.scene.traverse((child) =>
        {
            child.material = bakedMaterial
        })

        scene.add(gltf.scene)
    }
)

model.position.y = 0.001




/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(4, sizes.width / sizes.height, 0.1, 100)
camera.position.y = 0
camera.lookAt(model.position)

scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.dampingFactor = 1
controls.enableZoom = false
controls.enableRotate = false

/**
 * Renderer
 */
 const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding


/**
 * Animate
 */
const clock = new THREE.Clock()


const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // // //Update objects
    // // // gltf.scene.rotation.y += 0.002 * deltaTime //multiply with deltaTime value
    // // model.rotation.y = 0.001 * elapsedTime

    //Update Camera
    // camera.position.x = cursor.x * 0.1
    // camera.position.y = cursor.y * 0.1

    camera.position.x = Math.sin(cursor.x * Math.PI * .6) * 1
    camera.position.z = Math.cos(cursor.x * Math.PI * .6) * 1
    // camera.position.y = cursor.y * 3
    camera.lookAt(model.position)

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()