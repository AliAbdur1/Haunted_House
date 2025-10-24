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

    // Textures
    const textureLoader = new THREE.TextureLoader();

    //floor texture

    const floorAlphaTexture = textureLoader.load('/static/floor/alpha.jpg')
    const floorColorTexture = textureLoader.load('/static/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.jpg')
    const floorArmTexture = textureLoader.load('/static/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.jpg')
    const floorNormalTexture = textureLoader.load('/static/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.jpg')
    const floorDisplacementTexture = textureLoader.load('/static/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.webp')

    floorColorTexture.colorSpace = THREE.SRGBColorSpace

    // makes textures reapeat
    floorColorTexture.repeat.set(8, 8)
    floorColorTexture.wrapS = THREE.RepeatWrapping
    floorColorTexture.wrapT = THREE.RepeatWrapping

    floorArmTexture.repeat.set(8, 8)
    floorArmTexture.wrapS = THREE.RepeatWrapping
    floorArmTexture.wrapT = THREE.RepeatWrapping

    floorNormalTexture.repeat.set(8, 8)
    floorNormalTexture.wrapS = THREE.RepeatWrapping
    floorNormalTexture.wrapT = THREE.RepeatWrapping

    floorDisplacementTexture.repeat.set(8, 8)
    floorDisplacementTexture.wrapS = THREE.RepeatWrapping
    floorDisplacementTexture.wrapT = THREE.RepeatWrapping

   

    //Floor
    const floor =new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20, 100, 100),
      new THREE.MeshStandardMaterial({
        alphaMap: floorAlphaTexture,
        transparent: true,
        map: floorColorTexture,
        aoMap: floorArmTexture,
        roughnessMap: floorArmTexture,
        metalnessMap: floorArmTexture,
        normalMap: floorNormalTexture,
        displacementMap: floorDisplacementTexture,
        displacementScale: 0.3,
        displacementBias: -0.2
        
      })
    )
    floor.rotation.x = -Math.PI * 0.5
    scene.add(floor)

    // house container
    const house = new THREE.Group()
    scene.add(house)

    // Wall Textures
    const wallColorTexture = textureLoader.load('/static/wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.jpg')
    const wallNormalTexture = textureLoader.load('/static/wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.jpg')
    const wallArmTexture = textureLoader.load('/static/wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.jpg')

    wallColorTexture.colorSpace = THREE.SRGBColorSpace

    //Walls vv

    // may have to use repeat method from earlier if you want to use a
    // different shape for walls or add other structures
    const walls = new THREE.Mesh(
      new THREE.BoxGeometry(4, 2.5, 4),
      new THREE.MeshStandardMaterial({
        map: wallColorTexture,
        aoMap: wallArmTexture,
        roughnessMap: wallArmTexture,
        metalnessMap: wallArmTexture,
        normalMap: wallNormalTexture
      })
    )
    walls.position.y += 1.25
    house.add(walls) // add to the GROUP not the scene

    //Roof
    const roofColorTexture = textureLoader.load('/static/roof/roof_slates_02_1k/roof_slates_02_diff_1k.jpg')
    const roofNormalTexture = textureLoader.load('/static/roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.jpg')
    const roofArmTexture = textureLoader.load('/static/roof/roof_slates_02_1k/roof_slates_02_arm_1k.jpg')

    roofColorTexture.colorSpace = THREE.SRGBColorSpace

    roofColorTexture.repeat.set(3, 1)
    roofArmTexture.repeat.set(3, 1)
    roofNormalTexture.repeat.set(3, 1)

    roofColorTexture.wrapS = THREE.RepeatWrapping
    roofArmTexture.wrapT = THREE.RepeatWrapping
    roofNormalTexture.wrapT = THREE.RepeatWrapping


    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(3.5, 1.5, 4), // radius, height, segments
      new THREE.MeshStandardMaterial({
        map: roofColorTexture,
        aoMap: roofArmTexture,
        roughnessMap: roofArmTexture,
        metalnessMap: roofArmTexture,
        normalMap: roofNormalTexture
      })
    )
    roof.position.y = 2.5 + 0.5 // this moves the odject up
    roof.rotation.y = Math.PI * 0.25 // orients roof properly
    house.add(roof)

    // Door

    const doorColorTexture = textureLoader.load('/static/door/color.jpg')
    const doorNormalTexture = textureLoader.load('/static/door/normal.jpg')
    const doorAlphaTexture = textureLoader.load('/static/door/alpha.jpg')
    const doorAmbientTexture = textureLoader.load('/static/door/ambientOcclusion.jpg')
    const doorHeightTexture = textureLoader.load('/static/door/height.jpg')
    const doorMetalnessTexture = textureLoader.load('/static/door/metalness.jpg')
    const doorRoughnessTexture = textureLoader.load('/static/door/roughness.jpg')

    doorColorTexture.colorSpace = THREE.SRGBColorSpace

    

    // doorColorTexture.repeat.set(0.3, 0.4)
    // doorAlphaTexture.repeat.set(0.3, 0.4)
    // doorNormalTexture.repeat.set(0.3, 0.4)

    const door = new  THREE.Mesh(
      new THREE.PlaneGeometry(2.2, 2.2,10,10),
      new THREE.MeshStandardMaterial({
        color: '#a15555',
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientTexture,
        displacementMap: doorHeightTexture,
        normalMap: doorNormalTexture,
        displacementScale: 0.1,
        roughnessMap: doorRoughnessTexture,
        metalnessMap: doorMetalnessTexture,

      })
    )
    door.position.y = 1
    door.position.z = 2
    house.add(door)

    // Bushes
    const bushColorTexture = textureLoader.load('/static/bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.jpg')
    const bushNormalTexture = textureLoader.load('/static/bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.jpg')
    const bushArmTexture = textureLoader.load('/static/bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.jpg')

    bushColorTexture.colorSpace = THREE.SRGBColorSpace

    bushColorTexture.repeat.set(2, 1)
    bushArmTexture.repeat.set(2, 1)
    bushNormalTexture.repeat.set(2, 1)

    bushColorTexture.wrapS = THREE.RepeatWrapping
    bushArmTexture.wrapS = THREE.RepeatWrapping
    bushNormalTexture.wrapS = THREE.RepeatWrapping


    const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
    const bushMaterial = new THREE.MeshStandardMaterial({
      color: '#91C56C',
      map: bushColorTexture,
      aoMap: bushArmTexture,
      roughnessMap: bushArmTexture,
      metalnessMap: bushArmTexture,
      normalMap: bushNormalTexture
    })

    const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
    bush1.scale.set(0.5, 0.5, 0.5)
    bush1.position.set(1.3, 0.2, 2.2)
    bush1.rotation.x = -0.75 // hides weird UV issue with texture
    
    const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
    bush2.scale.set(0.25, 0.25, 0.25)
    bush2.position.set(1.8, 0.1, 2.4)
    bush2.rotation.x = -0.75

    const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
    bush3.scale.set(0.25, 0.25, 0.25)
    bush3.position.set(-1.8, 0.1, 2.4)
    bush3.rotation.x = -0.75

    const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
    bush4.scale.set(0.5, 0.5, 0.5)
    bush4.position.set(-1.2, 0.1, 3.4)
    bush4.rotation.x = -0.75

    house.add(bush1, bush2, bush3, bush4)

    // Graves
    const gravesColorTexture = textureLoader.load('/static/grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.jpg')
    const gravesNormalTexture = textureLoader.load('/static/grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.jpg')
    const gravesArmTexture = textureLoader.load('/static/grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.jpg')

    gravesColorTexture.colorSpace = THREE.SRGBColorSpace

    gravesColorTexture.repeat.set(0.3, 0.4)
    gravesArmTexture.repeat.set(0.3, 0.4)
    gravesNormalTexture.repeat.set(0.3, 0.4)


    const gravegeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
    const graveMaterial = new THREE.MeshStandardMaterial({
      color: '#b2b6b1',
      map: gravesColorTexture,
      aoMap: gravesArmTexture,
      roughnessMap: gravesArmTexture,
      metalnessMap: gravesArmTexture,
      normalMap: gravesNormalTexture
    })

    const graves = new THREE.Group()
    scene.add(graves)

    for(let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2 // random angle in radians. * 2 for full circle
      const radius = 5 + Math.random() * 4
      const graveX = Math.sin(angle) * radius
      const graveZ = Math.cos(angle) * radius
      const grave = new THREE.Mesh(gravegeometry, graveMaterial)
      grave.position.x = graveX
      grave.position.y = Math.random() * 0.4 // this is 0.4 because the graves are 0.8 tall
      grave.position.z = graveZ
      grave.rotation.x = (Math.random() - 0.5) * 0.4 // to multiply by 0.4 makes the effect less extreme
      grave.rotation.y = (Math.random() - 0.5) * 0.4
      grave.rotation.z = (Math.random() - 0.5) * 0.4
      graves.add(grave)
    }


    /**
    * Lights
    */
    // Ambient light
    const ambientLight = new THREE.AmbientLight('#86cdff', 0.275)
    scene.add(ambientLight)

    // Directional light
    const directionalLight = new THREE.DirectionalLight('#86cdff', 1)
    directionalLight.position.set(3, 2, -8)
    scene.add(directionalLight)

    // Door light
    const doorlight = new THREE.PointLight('#ff7d00', 1, 7)
    doorlight.position.set(0, 2.2, 2.7)
    house.add(doorlight)

    // Ghosts
    const ghost1 = new THREE.PointLight('#8800ff', 2, 3)
    const ghost2 = new THREE.PointLight('#ff0088', 2, 3)
    const ghost3 = new THREE.PointLight('#ff000', 2, 3)

    scene.add(ghost1, ghost2, ghost3)

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

      // Ghost movement
      const ghostangle = elapsedTime * 0.5 // slow down the movement
      ghost1.position.x = Math.cos(ghostangle) * 4
      ghost1.position.z = Math.sin(ghostangle) * 4
      ghost1.position.y = Math.sin(elapsedTime * 3) // up and down movement

      

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
