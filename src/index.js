import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import GUI from "lil-gui"

const canvasEl = document.getElementById("canvas")

/*
* Lil-gui init 
*/
const gui = new GUI()


/*
* Canvas size 
*/
const size = {
    // width: window.innerWidth,
    // height: window.innerHeight
    width: 1024,
    height: 1024
}

window.addEventListener("resize", () => {
    size.width = window.innerWidth
    size.height = window.innerHeight
    renderer.setSize(size.width, size.height)
    camera.aspect = size.width/size.height
    camera.updateProjectionMatrix()
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/*
* Scene
*/
const scene = new THREE.Scene()

/*
* Texture loader
*/
const textureLoader = new THREE.TextureLoader()
const bakeShadow = textureLoader.load("/textures/bake.png")
bakeShadow.colorSpace = THREE.SRGBColorSpace

const simpleShadow = textureLoader.load("/textures/simpleShadow.jpg")
simpleShadow.colorSpace = THREE.SRGBColorSpace
console.log(simpleShadow)

/*
* Material
*/
const baseMaterial = new THREE.MeshStandardMaterial()
baseMaterial.side = THREE.DoubleSide
baseMaterial.roughness = 0.4

// Prebaked shadows from Blender
const bakedMaterial = new THREE.MeshBasicMaterial( { map: bakeShadow})
bakedMaterial.roughness = 0.4

/*
* Objects
*/
const planeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    baseMaterial
)
planeMesh.position.set(0, -0.8, 0)
planeMesh.rotateX(- Math.PI*0.5)
planeMesh.receiveShadow = true

// Shadow plane
const sphereShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(4, 4),
    new THREE.MeshBasicMaterial( {
        color: 0xff0000,
        transparent: true,
        alphaMap: simpleShadow
    } )
)
sphereShadow.position.y = planeMesh.position.y + 0.02
sphereShadow.rotation.x = - Math.PI * 0.5
scene.add(sphereShadow)

const boxMesh = new THREE.Mesh(
    new THREE.BoxGeometry(),
    baseMaterial
)
boxMesh.position.set(-1.5, 0, 0)
boxMesh.castShadow = true

const sphereMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.5),
    baseMaterial
)
sphereMesh.castShadow = true

const torusMesh = new THREE.Mesh(
    new THREE.TorusGeometry(0.5, 0.2, 32, 16),
    baseMaterial
)
torusMesh.position.set(1.5, 0, 0)

scene.add(sphereMesh, boxMesh, torusMesh, planeMesh)

/*
* Lights
*/
const ambientLight = new THREE.AmbientLight(0xffffff, 0.025) 
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0)
directionalLight.position.set(4, 4, 4)
directionalLight.castShadow = true
// console.log(directionalLight.shadow)
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024

directionalLight.shadow.camera.near = 3
directionalLight.shadow.camera.far = 15

directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.bottom = -2
directionalLight.shadow.camera.left = 2
directionalLight.shadow.camera.right = -2
// directionalLight.shadow.radius = 10

// Adding helper for light-camera
const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
directionalLightCameraHelper.visible = false // Hides helper
scene.add(directionalLightCameraHelper)

scene.add(directionalLight)


const spotLight = new THREE.SpotLight(0xff00ff, 5, 10, Math.PI * 0.3)
spotLight.position.set(0, 2, 2)
spotLight.castShadow = true
scene.add(spotLight)
scene.add(spotLight.target)

spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024
spotLight.shadow.camera.near = 2
spotLight.shadow.camera.far = 8

const spotLightHelper = new THREE.SpotLightHelper(spotLight)
spotLightHelper.visible = false
scene.add(spotLightHelper)

const spotLightShadowHelper = new THREE.CameraHelper(spotLight.shadow.camera)
spotLightShadowHelper.visible = false
scene.add(spotLightShadowHelper)

spotLight.visible = false

const pointLight = new THREE.PointLight(0x0000ff, 5)
pointLight.position.set(-1, 1, 0)
pointLight.castShadow = true
pointLight.shadow.mapSize.width = 256
pointLight.shadow.mapSize.height = 256
pointLight.shadow.camera.near = 0.1
pointLight.shadow.camera.far = 10
scene.add(pointLight)

const pointLightHelper = new THREE.CameraHelper(pointLight.shadow.camera)
scene.add(pointLightHelper)
pointLightHelper.visible = false 


/*
* Camera
*/
const camera = new THREE.PerspectiveCamera(45, size.width/size.height, 0.01, 200)
camera.position.set(0, 0, 6)
scene.add(camera)

/*
* Renderer
*/
const renderer = new THREE.WebGLRenderer( { canvas: canvasEl, antialias: true } )
renderer.setSize(size.width, size.width)

renderer.shadowMap.enabled = false // Option to disable shadowmap
// renderer.shadowMap.type = THREE.PCFSoftShadowMap

/*
* Controller
*/
const controller = new OrbitControls(camera, canvasEl)
controller.enableDamping = true

const clock = new THREE.Clock()

/*
* Tick
*/
const tick = () => {
    // Animate
    const animationSpeed = 0.005
    sphereMesh.rotation.x += animationSpeed
    sphereMesh.rotation.y += animationSpeed
    boxMesh.rotation.x += animationSpeed
    boxMesh.rotation.y += animationSpeed
    torusMesh.rotation.x += animationSpeed
    torusMesh.rotation.y += animationSpeed

    const elapsedTime = clock.getElapsedTime()
    sphereMesh.position.x = Math.cos(elapsedTime) * 1.5
    sphereMesh.position.z = Math.sin(elapsedTime) * 1.5
    sphereMesh.position.y = Math.abs(Math.sin(elapsedTime * 3))

    sphereShadow.position.x = sphereMesh.position.x
    sphereShadow.position.z = sphereMesh.position.z
    sphereShadow.material.opacity = (1 - sphereMesh.position.y) * 0.8

    // Render
    controller.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()