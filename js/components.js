
AFRAME.registerComponent('water', {

  schema: {
  },

  init: function() {

    const waterGeometry = this.el.object3D.children[0].geometry;


    const water = new THREE.Water(
      waterGeometry,
      {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load( './assets/images/waternormals.jpg', function ( texture ) {

          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
          
          globalThis.tex = texture;

        } ),
        distortionScale: 0.2,
      }
    );

    const sun = new THREE.Vector3();
    const phi = THREE.MathUtils.degToRad( 90 - 0.4 );
    const theta = THREE.MathUtils.degToRad( -76.6 );

    sun.setFromSphericalCoords( 1, phi, theta );

    water.material.uniforms.sunDirection.value.copy( sun ).normalize();

    water.material.transparent = true;
    water.material.uniforms.alpha.value = 0.9;
    water.material.uniforms.size.value = 27.5;

    this.data.water = water;

    // console.log(water);

    this.el.object3D.children[0].material = water.material;

    this.el.object3D.add(water);


  },
  update: function(time) {
  },
  tick: function() {
    this.el.object3D.children[0].material.uniforms[ 'time' ].value += 0.75 / 60.0;
  }
});






AFRAME.registerComponent('scene-environment', {

    schema: {
        enabled: {default: true},
        hdrImage: {default: ''},
        hdrExposure: {default: 1}
    },

    init: function() {

      let enabled = this.data.enabled;
      let hdrImage = this.data.hdrImage;
      let hdrExposure = this.data.hdrExposure;
      
      if (!enabled) return;

      const sceneEl = this.el;
      const scene = sceneEl.object3D;
      const renderer = sceneEl.renderer;

      new THREE.RGBELoader()
        .load( hdrImage, function ( texture ) {

          texture.mapping = THREE.EquirectangularReflectionMapping;
          
          scene.environment = texture;

          renderer.toneMapping = THREE.LinearToneMapping;
          renderer.toneMappingExposure = hdrExposure;

          renderer.outputEncoding = THREE.sRGBEncoding;

      } );
},
    update: function() {
    },
    tick: function() {
    }
});

AFRAME.registerComponent('rt-env-map', {
  init: function() {

      if (!document.querySelector('video')) return;

      document.querySelector('video').id = 'video'
      this.el.addEventListener('loaded', this.update.bind(this));

      const cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 256, { format: THREE.RGBFormat, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter } );
      globalThis.sphereCamera = new THREE.CubeCamera(0.01, 10, cubeRenderTarget);
      globalThis.sphereCamera.traverse(function(child) {
              child.layers.set( 1 );
      });

      var reflectSphere = document.createElement('a-entity');
      reflectSphere.setAttribute('geometry','primitive: sphere; radius: 0.256');
      reflectSphere.setAttribute('id','reflect');
      reflectSphere.setAttribute('rotation','0 -90 0');
      reflectSphere.setAttribute('material','src: #video; shader: flat; side: back;');
      reflectSphere.setAttribute('move-to-layer1','');
      document.querySelector('a-scene').append(reflectSphere);
  },
  update: function() {
      const sceneEl = document.querySelector('a-scene');
      const scene = sceneEl.object3D;
      globalThis.sphereCamera.position.set(0, 0, -0.2);
      globalThis.sphereCamera.layers.set( 1 );
      scene.add(globalThis.sphereCamera);
      var reflectobjs = document.getElementsByClassName('rtreflect');
      for (var i = 0; i < reflectobjs.length; ++i) {
          reflectobjs[i].object3D.traverse(function(child) {
              if (child.isMesh) {
                  let sphereMaterial = child.material.clone();
                  sphereMaterial.envMap = globalThis.sphereCamera.renderTarget.texture;
                  child.material = sphereMaterial;
              }
          });
      }
  },
  tick: function() {
      const sceneEl = document.querySelector('a-scene');
      const scene = sceneEl.object3D;
      const renderer = sceneEl.renderer;
      globalThis.sphereCamera.update(renderer, scene);
  }
});


AFRAME.registerComponent("rtreflect", {
  init: function() {
      this.el.addEventListener('model-loaded', this.update.bind(this));
  },
  update: function() {
    
      if (!globalThis.sphereCamera) return;
      
      var el = this.el;
      const sceneEl = document.querySelector('a-scene');
      const renderer = sceneEl.renderer;
      el.object3D.traverse(function(child) {
          if (child.isMesh) {
              
              // child.material.metalness = 1;
              // child.material.roughness = 0;
              // console.log(child.material)
              child.material.envMap = globalThis.sphereCamera.renderTarget.texture;
              child.material.needsUpdate = true;
          }
      });
  }
});
AFRAME.registerComponent("move-to-layer1", {
  init: function() {
      this.el.addEventListener('model-loaded', this.update.bind(this));
  },
  update: function() {
      var el = this.el;

      el.object3D.traverse(function(child) {
          if (child.isMesh) {
              child.layers.set( 1 );
          }
      });
  }
});


AFRAME.registerComponent('modelopacity', {
  schema: {default: 1.0},
  init: function () {
    this.el.addEventListener('model-loaded', this.update.bind(this));
  },
  update: function () {
    var mesh = this.el.getObject3D('mesh');
    var data = this.data;
    if (!mesh) { return; }
    mesh.traverse(function (node) {
      if (node.isMesh) {
        node.material.opacity = data;
        node.material.transparent = data < 1.0;
        node.material.alphaTest = 0.001;
        node.material.needsUpdate = true;
      }
    });
  }
});


AFRAME.registerComponent('rot-loop', {
  schema: {default: 1.0},
  init: function () {
    this.el.addEventListener('model-loaded', this.update.bind(this));
  },
  update: function () {
    
  },
  tick: function () {
    var data = this.data;
    this.el.object3D.rotation.y += data;
  }
});