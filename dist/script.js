console.clear(); //katharizei konsola

const audioCtx = new AudioContext(); // o browser zita apo ton xristi ton hxo (san API)
const numberOfNodes = 32; //arithos twn stilwn
const data = new Uint8Array(numberOfNodes * 4);
// elVisualizer = elementVisualizer
const elVisualizer = document.querySelector('.visualizer');
//elNodes = elementVisualizer 
const elNodes = Array.from({ length: numberOfNodes }, (n,i)=> { // ta nodes pernoun twn ari8mo twn sinolikon nodes kai ta data.
  let node = document.createElement('div'); // na dimiourgisi ta nodes me ta data
  node.className = 'node';
  node.style.setProperty('--i',i);
  elVisualizer.appendChild(node); // na efanisoun ta nodes me ta data sto visualizer
  return node;
});

const analyserNode = new AnalyserNode(audioCtx, { // zita sinexia hxo gia ta node (kati san loop)
  fftSize: Math.max(numberOfNodes * 16, 32), //posa nodes mporoun na paroun max size
  maxDecibels: -20,
  minDecibels: -80,
  smoothingTimeConstant: 0.9 // xronos p tha midenistei to visualizer an den akougete hxos
});

function updateVisualizer(){ 
  requestAnimationFrame(updateVisualizer);
  // na 3ekinisei na zita audio
  analyserNode.getByteFrequencyData(data);
  // na dosei ta data
  
  elNodes.forEach( (node,i) => {
    node.style.setProperty('--c', data[i]); //to i einai ta data mas
    node.style.setProperty(
      '--level', 
      (data[i] / 255) // to 255 einai to max data p pernei to node
      
      * (1 + (i / numberOfNodes)) // gia 4iles k xamiles notes kai to dierei sta  ypolipa nodes
    );
  });
  
}

function startStream(){ // na pernei hxous apo mikrofono tou xristh kai apo tin othoni tou px. an pezei kapio video sto backround
  window.volume.innerHTML = ' &nbsp; ';
  
  return navigator.mediaDevices
    .getUserMedia({ audio: true, video: false }) //na pernei mono ton hxo (input audio otan patisoume to koumpi pio katw gia na tou dosoume access)
  .then( stream => audioCtx.createMediaStreamSource(stream) ) // na kanei stream ton hxo pou pernei apo to input
  .then( source => {
    source.connect(analyserNode); // to stream na enimerosei ta node tou visualizer
  }).then(updateVisualizer); // kai na ta kanei update gia na ta di3ei
        
}

// gia na 3ekinisei to visualizer prepi na patisis panw stin o8oni
document.addEventListener('click', ()=>{ // na kaneis click gia na arxisi na pernei data apo ton hxo
  audioCtx.resume(); // arxizei o hxos
  startStream(); // 3ekina to stream gia na arxisoun ta nodes na kouniounte
});