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
    width: 512,
    height: 512
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
* Material
*/
const baseMaterial = new THREE.MeshStandardMaterial()
baseMaterial.side = THREE.DoubleSide
baseMaterial.roughness = 0.4

/*
* Objects
*/
const planeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    baseMaterial
)
planeMesh.position.set(0, -0.8, 0)
planeMesh.rotateX(- Math.PI*0.5)


const sphereMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.5),
    baseMaterial
)
sphereMesh.position.set(-1.5, 0, 0)

const boxMesh = new THREE.Mesh(
    new THREE.BoxGeometry(),
    baseMaterial
)

const torusMesh = new THREE.Mesh(
    new THREE.TorusGeometry(0.5, 0.2, 32, 16),
    baseMaterial
)
torusMesh.position.set(1.5, 0, 0)

scene.add(sphereMesh, boxMesh, torusMesh, planeMesh)

/*
* Lights
*/
const ambientLight = new THREE.AmbientLight("fxffffff") // Set properties when constructed
ambientLight.color = new THREE.Color("yellow") // remember to use the color class when setting color on lights
ambientLight.intensity = 0.025 // Or set the property here
scene.add(ambientLight)
gui.add( ambientLight, "intensity").min(0).max(5).step(0.01)

const pointLight = new THREE.PointLight(0xffffff, 8)
pointLight.position.set(4, 4, 4)
scene.add(pointLight)

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


/*
* Controller
*/
const controller = new OrbitControls(camera, canvasEl)
controller.enableDamping = true

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

    // Render
    controller.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()