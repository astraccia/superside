let sceneEl, currentDataArea = null, titanic;

window.addEventListener("load", function () {
  start();
});

async function start() {

  sceneEl = document.querySelector('a-scene');
  titanic = document.querySelector('#titanic-container');




  //menu top
  document.querySelector('#btn_camera').addEventListener("click", event => {
    document.querySelector('#captureShutterButton').click();
  });

  document.querySelector('#btn_360').addEventListener("click", event => {
    if (titanic.getAttribute('rot-loop') !== 0) {
      titanic.setAttribute('rot-loop', 0)
      return;
    }
    titanic.setAttribute('rot-loop', -0.015)
  });

  //menu down

  document.querySelector('#btn_technical').addEventListener("click", event => {
    activateDataArea('text-technical')
  });

  document.querySelector('#btn_historical').addEventListener("click", event => {
    activateDataArea('text-historical')
  });

  document.querySelector('#btn_tragedy').addEventListener("click", event => {
    activateDataArea('text-tragedy')
  });
  

  
}

const Delay = (milliseconds) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
};


const activateDataArea = async function(dataArea) {

  if (currentDataArea) {
    resetDataArea(currentDataArea);
  }

  await Delay(1000);

  currentDataArea = dataArea;

  const textArray = document.querySelectorAll('.' + dataArea);
  textArray.forEach(async function(el,index) {
    el.setAttribute('animation___1',`property: object3D.position.z; from: -5; to: 0; dur: 1000; easing: easeInOutCubic;delay:${index*150}`);
    el.setAttribute('animation___2',`property: modelopacity; from: 0; to: 1; dur: 1000; easing: easeInOutCubic;delay:${index*150}`);

    await Delay(index*150 + 1000 + 50);

    el.removeAttribute('animation___1');
    el.removeAttribute('animation___2');
  })


}


const resetDataArea = async function(dataArea) {

  const textArray = document.querySelectorAll('.' + dataArea);
  textArray.forEach(async function(el,index) {
    el.setAttribute('animation___1_back',`property: object3D.position.z; from: 0; to: -5; dur: 1000; easing: easeInOutCubic;delay:${index*150}`);
    el.setAttribute('animation___2_back',`property: modelopacity; from: 1; to: 0; dur: 1000; easing: easeInOutCubic;delay:${index*150}`);

    await Delay(index*150 + 1000 + 50);

    el.removeAttribute('animation___1_back');
    el.removeAttribute('animation___2_back');
  })

}