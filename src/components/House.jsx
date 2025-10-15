import React, { useEffect, useRef } from 'react'
import * as THREE from 'three';
import gsap from 'gsap';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

function House() {
    const canvasRef = useRef(null);

  useEffect(() => {
    // Debug GUI
    const gui = new GUI({
      title: 'Debug UI Settings',
      width: 300,
      closeFolders: true
    });
    gui.close();

    const toggleGUI = (event) => {
      if (event.key === 'h') {
        gui.show(gui._hidden); // toggle debug UI
      }
    };
    window.addEventListener('keydown', toggleGUI);

    // Scene
    const scene = new THREE.Scene();

    // Temporary sphere
   

    //Floor
    const floor =new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshStandardMaterial()
    )
    floor.rotation.x = -Math.PI * 0.5
    scene.add(floor)

    // house container
    const house = new THREE.Group()
    scene.add(house)

    //Walls
    const walls = new THREE.Mesh(
      new THREE.BoxGeometry(4, 2.5, 4),
      new THREE.MeshStandardMaterial()
    )
    walls.position.y += 1.25
    house.add(walls) // add to the GROUP not the scene

    //Roof
    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(3.5, 1, 4), // radius, height, segments
      new THREE.MeshStandardMaterial()
    )
    roof.position.y = 2.5 + 0.5 // this moves the odject up
    roof.rotation.y = Math.PI * 0.25 // orients roof properly
    house.add(roof)

    // Door
    const door = new  THREE.Mesh(
      new THREE.PlaneGeometry(1.2, 2.2,),
      new THREE.MeshStandardMaterial({
        color: '#a15555',
      })
    )
    door.position.y = 1
    door.position.z = 2 + 0.1
    house.add(door)

    // Bushes
    const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
    const bushMaterial = new THREE.MeshStandardMaterial()

    const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
    bush1.scale.set(0.5, 0.5, 0.5)
    bush1.position.set(1.3, 0.2, 2.2)
    
    const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
    bush2.scale.set(0.25, 0.25, 0.25)
    bush2.position.set(1.8, 0.1, 2.4)

    const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
    bush3.scale.set(0.25, 0.25, 0.25)
    bush3.position.set(-1.8, 0.1, 2.4)

    const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
    bush4.scale.set(0.5, 0.5, 0.5)
    bush4.position.set(-1.2, 0.1, 3.4)

    house.add(bush1, bush2, bush3, bush4)


    /**
    * Lights
    */
    // Ambient light
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
    scene.add(ambientLight)

    // Directional light
    const directionalLight = new THREE.DirectionalLight('#ffffff', 1.5)
    directionalLight.position.set(3, 2, -8)
    scene.add(directionalLight)

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    );
    camera.position.x = 4;
    camera.position.y = 2
    camera.position.z = 5;
    scene.add(camera);

    


    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 1);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Resize handler
    const handleResize = () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      console.log('window is resized');
    };
    window.addEventListener('resize', handleResize);

    // Fullscreen toggle
    const handleDblClick = () => {
      const fullscreenElement =
        document.fullscreenElement || document.webkitFullscreenElement;

      if (!fullscreenElement) {
        if (canvasRef.current.requestFullscreen) {
          canvasRef.current.requestFullscreen();
        } else if (canvasRef.current.webkitRequestFullscreen) {
          canvasRef.current.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
      console.log('double clicked');
    };
    window.addEventListener('dblclick', handleDblClick);

    // Animation loop
    const clock = new THREE.Clock();
    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

      

      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    };
    tick();

    return () => {
      gui.destroy();
      window.removeEventListener('keydown', toggleGUI);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('dblclick', handleDblClick);
      renderer.dispose();
      // geometry.dispose();
      // material.dispose();
    };

}, []);

  return (
    <div>
      <canvas
        ref={canvasRef}
        className="exampleOnScreen"
        id="example_canvas"
      ></canvas>
    </div>
  )
}

export default House
