/* Shared functions for spinner and games */

// ---- Helpers and state ----
let wheelEl, spinBtn, modalEl, instTitleEl, instBodyEl, instStartBtn, instCancelBtn;
let currentGames = [];
let spinning = false;

function initWheel(games){
  currentGames = games.slice();
  wheelEl = document.getElementById('wheel');
  spinBtn = document.getElementById('spinBtn');
  modalEl = document.getElementById('instructionsModal');
  instTitleEl = document.getElementById('instTitle');
  instBodyEl = document.getElementById('instBody');
  instStartBtn = document.getElementById('instStart');
  instCancelBtn = document.getElementById('instCancel');

  renderLabels(currentGames);
  if(spinBtn){
    spinBtn.addEventListener('click', handleSpin);
  }
  if(instCancelBtn) instCancelBtn.addEventListener('click', hideModal);
  if(instStartBtn) instStartBtn.addEventListener('click', ()=> {
    const selectedId = spinBtn.dataset.selected;
    if(!selectedId) { hideModal(); return; }
    const g = currentGames.find(x=>x.id === selectedId);
    if(g) location.href = g.file;
  });
}

/* render labels evenly around wheel, in random order each time */
function renderLabels(games){
  const order = shuffle([...games]);
  wheelEl.innerHTML = '';
  const count = order.length;
  const cx = 50, cy = 50; // percentages center
  const radius = 38; // percent radius
  for(let i=0;i<count;i++){
    const angle = (360 / count) * i - 90; // start top
    const rad = angle * Math.PI/180;
    const x = cx + Math.cos(rad) * radius;
    const y = cy + Math.sin(rad) * radius;
    const label = document.createElement('div');
    label.className = 'label';
    label.style.left = `${x}%`;
    label.style.top = `${y}%`;
    label.style.transform = `translate(-50%,-50%) rotate(${angle+90}deg)`;
    label.dataset.gameId = order[i].id;
    label.innerHTML = `<span style="transform:rotate(-${angle+90}deg);display:inline-block">${order[i].label}</span>`;
    wheelEl.appendChild(label);
  }
}

/* spin logic */
function handleSpin(){
  if(spinning) return;
  spinning = true;
  renderLabels(currentGames); // shuffle positions before spin

  const idx = Math.floor(Math.random()*currentGames.length);
  const segment = 360 / currentGames.length;
  const fullSpins = 3 + Math.floor(Math.random()*3); // 3-5 full spins
  const baseAngle = 360 * fullSpins;
  const targetAngle = (idx * segment) + (segment / 2); // center of chosen segment
  // pointer is at 270deg (top). compute final rotation so that targetAngle ends at pointer.
  const final = baseAngle + (270 - targetAngle) + (Math.random()*segment - segment/2);
  // set transition and rotate
  wheelEl.style.transition = 'transform 4s cubic-bezier(.16,.98,.3,1.02)';
  wheelEl.style.transform = `rotate(${final}deg)`;
  wheelEl.classList.add('spinning-glow');
  spinBtn.disabled = true;

  // store selection
  spinBtn.dataset.selected = currentGames[idx].id;

  wheelEl.addEventListener('transitionend', function onEnd(){
    wheelEl.removeEventListener('transitionend', onEnd);
    spinning = false;
    wheelEl.classList.remove('spinning-glow');
    spinBtn.disabled = false;
    // show instructions modal
    const selectedId = spinBtn.dataset.selected;
    const g = currentGames.find(x=>x.id === selectedId);
    if(g) showInstructions(g);
  });
}

function showInstructions(game){
  instTitleEl.innerHTML = game.name;
  instBodyEl.innerHTML = game.inst + '<p class="note">After time ends, the game will stop and you will return to spinner automatically.</p>';
  modalEl.style.display = 'flex';
  modalEl.setAttribute('aria-hidden','false');
}
function hideModal(){
  modalEl.style.display = 'none';
  modalEl.setAttribute('aria-hidden','true');
}

/* gameEnd: show inline badge then redirect to spinner */
function gameEnd(success, message){
  const container = document.querySelector('.game-card') || document.body;
  const badge = document.createElement('div');
  badge.className = `result-badge show ${success? 'congrats':'fail'}`;
  badge.style.position = 'relative';
  badge.style.zIndex = 999;
  badge.innerHTML = success ? `🎉 Congratulations! ${message||''}` : `❌ Try Again ${message||''}`;
  container.prepend(badge);
  // make sure user sees it, then redirect
  setTimeout(()=> {
    location.href = 'index.html';
  }, 1400);
}

/* shuffle helper */
function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]] = [arr[j],arr[i]];
  }
  return arr;
}

/* Expose helpers to pages */
window.spHelpers = {
  gameEnd,
  shuffle
};
