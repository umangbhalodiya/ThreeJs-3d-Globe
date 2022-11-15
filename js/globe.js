var DAT = DAT || {};

DAT.Globe = function (container, opts) {
  opts = opts || {};

  var colorFn =
    opts.colorFn ||
    function (x) {
      var c = new THREE.Color();
      c.setHSL(0.6 - x * 0.5, 1.0, 0.5);
      return c;
    };

  var imgDir = "./";

  var Shaders = {
    earth: {
      uniforms: {
        texture: { type: "t", value: null },
      },
      vertexShader: [
        "varying vec3 vNormal;",
        "varying vec2 vUv;",
        "void main() {",
        "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
        "vNormal = normalize( normalMatrix * normal );",
        "vUv = uv;",
        "}",
      ].join("\n"),
      fragmentShader: [
        "uniform sampler2D texture;",
        "varying vec3 vNormal;",
        "varying vec2 vUv;",
        "void main() {",
        "vec3 diffuse = texture2D( texture, vUv ).xyz;",
        "float intensity = 1.05 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );",
        "vec3 atmosphere = vec3( 1.0, 1.0, 1.0 ) * pow( intensity, 3.0 );",
        "gl_FragColor = vec4( diffuse + atmosphere, 1.0 );",
        "}",
      ].join("\n"),
    },
    atmosphere: {
      uniforms: {},
      vertexShader: [
        "varying vec3 vNormal;",
        "void main() {",
        "vNormal = normalize( normalMatrix * normal );",
        "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
        "}",
      ].join("\n"),
      fragmentShader: [
        "varying vec3 vNormal;",
        "void main() {",
        "float intensity = pow( 0.8 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 12.0 );",
        "gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 ) * intensity;",
        "}",
      ].join("\n"),
    },
  };

  var camera, scene, renderer, w, h;
  var mesh, atmosphere, point;

  var overRenderer;

  var curZoomSpeed = 0;
  var zoomSpeed = 50;

  var mouse = { x: 0, y: 0 },
    mouseOnDown = { x: 0, y: 0 };
  var rotation = { x: 0, y: 0 },
    target = { x: (Math.PI * 3) / 2, y: Math.PI / 6.0 },
    targetOnDown = { x: 0, y: 0 };

  var distance = 100000,
    distanceTarget = 100000;
  var padding = 40;
  var PI_HALF = Math.PI / 2;

  var ROTATIONSPEED = 0.002;
  var k = ROTATIONSPEED;
  var f = false;

  function init() {
    container.style.color = "#fff";
    container.style.font = "13px/20px Arial, sans-serif";

    var shader, uniforms, material;
    w = container.offsetWidth || window.innerWidth;
    h = container.offsetHeight || window.innerHeight;

    camera = new THREE.PerspectiveCamera(30, w / h, 1, 10000);
    camera.position.z = distance;

    scene = new THREE.Scene();

    var geometry = new THREE.SphereGeometry(200, 40, 30);

    shader = Shaders["earth"];
    uniforms = THREE.UniformsUtils.clone(shader.uniforms);
    uniforms["texture"].value = THREE.ImageUtils.loadTexture(opts.textureImg);

    material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader,
    });

    mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.y = Math.PI;
    scene.add(mesh);

    shader = Shaders["atmosphere"];
    uniforms = THREE.UniformsUtils.clone(shader.uniforms);

    material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });

    mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(1.1, 1.1, 1.1);
    scene.add(mesh);

    geometry = new THREE.BoxGeometry(0.75, 0.75, 1);
    geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, -0.5));

    point = new THREE.Mesh(geometry);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);

    renderer.domElement.style.position = "absolute";

    container.appendChild(renderer.domElement);

    // Listeners
    container.addEventListener("mousedown", onMouseDown, false);
    container.addEventListener("mousewheel", onMouseWheel, false);
    document.addEventListener("keydown", onDocumentKeyDown, false);
    window.addEventListener("resize", onWindowResize, false);
    container.addEventListener(
      "mouseover",
      function () {
        overRenderer = true;
      },
      false
    );
    container.addEventListener(
      "mouseout",
      function () {
        overRenderer = false;
      },
      false
    );
  }

  function onMouseDown(event) {
    event.preventDefault();

    k = 0;
    f = true;

    container.addEventListener("mousemove", onMouseMove, false);
    container.addEventListener("mouseup", onMouseUp, false);
    container.addEventListener("mouseout", onMouseOut, false);

    target.y = rotation.y;

    mouseOnDown.x = -event.clientX;
    mouseOnDown.y = event.clientY;

    targetOnDown.x = target.x;
    targetOnDown.y = target.y;

    container.style.cursor = "move";
  }

  function onMouseMove(event) {
    mouse.x = -event.clientX;
    mouse.y = event.clientY;

    var zoomDamp = distance / 1000;

    target.x = targetOnDown.x + (mouse.x - mouseOnDown.x) * 0.005 * zoomDamp;
    target.y = targetOnDown.y + (mouse.y - mouseOnDown.y) * 0.005 * zoomDamp;

    target.y = target.y > PI_HALF ? PI_HALF : target.y;
    target.y = target.y < -PI_HALF ? -PI_HALF : target.y;
  }

  function onMouseUp(event) {
    k = ROTATIONSPEED;
    f = false;

    container.removeEventListener("mousemove", onMouseMove, false);
    container.removeEventListener("mouseup", onMouseUp, false);
    container.removeEventListener("mouseout", onMouseOut, false);
    container.style.cursor = "auto";
  }

  function onMouseOut(event) {
    k = ROTATIONSPEED;
    f = false;

    container.removeEventListener("mousemove", onMouseMove, false);
    container.removeEventListener("mouseup", onMouseUp, false);
    container.removeEventListener("mouseout", onMouseOut, false);
  }

  function onMouseWheel(event) {
    event.preventDefault();
    if (overRenderer) {
      zoom(event.wheelDeltaY * 0.3);
    }
    return false;
  }

  function onDocumentKeyDown(event) {
    switch (event.keyCode) {
      case 38:
        zoom(100);
        event.preventDefault();
        break;
      case 40:
        zoom(-100);
        event.preventDefault();
        break;
    }
  }

  function onWindowResize(event) {
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
  }

  function zoom(delta) {
    distanceTarget -= delta;
    distanceTarget = distanceTarget > 1000 ? 1000 : distanceTarget;
    distanceTarget = distanceTarget < 350 ? 350 : distanceTarget;
  }

  function animate() {
    requestAnimationFrame(animate);
    render();
  }

  function render() {
    zoom(curZoomSpeed);

    target.x -= k;

    rotation.x += (target.x - rotation.x) * 0.2;

    if (f == true) {
      rotation.y += (target.y - rotation.y) * 0.2;
    }
    if (f == false) {
      target.y = Math.PI / 5.0;
      rotation.y += (target.y - rotation.y) * 0.02;
    }

    distance += (distanceTarget - distance) * 0.3;

    camera.position.x = distance * Math.sin(rotation.x) * Math.cos(rotation.y);
    camera.position.y = distance * Math.sin(rotation.y);
    camera.position.z = distance * Math.cos(rotation.x) * Math.cos(rotation.y);

    camera.lookAt(mesh.position);

    renderer.render(scene, camera);
  }

  init();

  this.animate = animate;

  this.__defineGetter__("time", function () {
    return this._time || 0;
  });

  this.__defineSetter__("time", function (t) {
    var validMorphs = [];
    var morphDict = this.points.morphTargetDictionary;
    for (var k in morphDict) {
      if (k.indexOf("morphPadding") < 0) {
        validMorphs.push(morphDict[k]);
      }
    }
    validMorphs.sort();
    var l = validMorphs.length - 1;
    var scaledt = t * l + 1;
    var index = Math.floor(scaledt);
    for (i = 0; i < validMorphs.length; i++) {
      this.points.morphTargetInfluences[validMorphs[i]] = 0;
    }
    var lastIndex = index - 1;
    var leftover = scaledt - index;
    if (lastIndex >= 0) {
      this.points.morphTargetInfluences[lastIndex] = 1 - leftover;
    }
    this.points.morphTargetInfluences[index] = leftover;
    this._time = t;
  });

  this.renderer = renderer;
  this.scene = scene;

  return this;
};
