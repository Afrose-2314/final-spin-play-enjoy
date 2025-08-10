/* Shared functions for spinner and games */

// ---- Spinner logic ----
let wheelEl, spinBtn, modal, instTitle, instBody, instStart, instCancel;
let currentGames = [];
let spinning = false;

function initWheel(games){
  currentGames = games.slice(); // copy
  wheelEl = document.getElementById('wheel');
  spinBtn = document.getElementById('spinBtn');
  modal = document.getElementById('instructionsModal');
  instTitle = document.getElementById('instTitle');
  instBody = document.getElementById('instBody');
  instStart = document.getElementById('instStart');
  instCancel = document.getElementById('instCancel');

  renderLabels(games);
  spinBtn.addEventListener('click', handleSpin);
  instCancel.addEventListener('click', ()=> hideModal());
  instStart.addEventListener('click', ()=> {
    // open the selected game page
    const sel = spinBtn.dataset.selected;
    if(!sel) { hideModal(); return; }
    const game = currentGames.find(g => g.id === sel);
    window.location = game.file + '?player=' + encodeURIComponent(sessionStorage.getItem('sp_user')||'Player');
  });
}

/* place labels evenly but using random order */
function renderLabels(games){
  // shuffle order so each spin start looks different
  const order = shuffle([...games]);
  wheelEl.innerHTML = '';
  const center = 50; // percent
  const r = 140; // radius in px approx (depends on wheel size)
  const count = order.length;
  for(let i=0;i<count;i++){
    const angle = (360/count)*i - 90; // start from top
    const rad = angle * Math.PI/180;
    const x = 50 + Math.cos(rad)*42; // percent adjustments
    const y = 50 + Math.sin(rad)*42;
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

/* spin handler: rotate wheel to a random degree with easing */
function handleSpin(){
  if(spinning) return;
  spinning = true;
  // re-render labels to shuffle positions
  renderLabels(currentGames);

  // choose random target game
  const idx = Math.floor(Math.random()*currentGames.length);
  const segment = 360/currentGames.length;
  // compute random rotation that lands middle of segment at pointer (0deg)
  // pointer is at top (we used -90 offset earlier). We'll compute final rotation so label angle aligns to 270deg.
  const baseAngle = 360 * (3 + Math.floor(Math.random()*4)); // give several full spins (3-6)
  // target center angle relative to label index:
  const targetAngle = (idx * segment) + segment/2; // angle position of chosen segment
  // we want wheel rotate so that targetAngle ends at 270deg (pointer)
  const final = baseAngle + (270 - targetAngle);
  // apply rotation
  wheelEl.style.transition = 'transform 4s cubic-bezier(.16,.98,.3,1.02)';
  wheelEl.style.transform = `rotate(${final}deg)`;

  // glow effect on wheel while spinning
  wheelEl.classList.add('spinning-glow');
  spinBtn.classList.add('disabled');
  spinBtn.disabled = true;

  // after transition ends determine selected
  wheelEl.addEventListener('transitionend', onSpinEnd, {once:true});
  // store selection temporarily on the button dataset
  spinBtn.dataset.selected = currentGames[idx].id;
}

function onSpinEnd(){
  spinning = false;
  wheelEl.classList.remove('spinning-glow');
  spinBtn.disabled = false;
  spinBtn.classList.remove('disabled');
  // show instructions modal for selected game
  const selectedId = spinBtn.dataset.selected;
  const game = currentGames.find(g => g.id === selectedId);
  if(game){
    showInstructions(game);
  }
}

/* modal controls */
function showInstructions(game){
  instTitle.innerHTML = game.name;
  instBody.innerHTML = game.inst + '<p class="note">After time ends, input will stop and you will be returned to Spinner.</p>';
  modal.style.display = 'flex';
  // animate modal content (class .animated-pop in CSS does it)
  // set data for start button
  spinBtn.dataset.selected = game.id;
}

function hideModal(){
  modal.style.display = 'none';
}

/* utility shuffle */
function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]] = [arr[j],arr[i]];
  }
  return arr;
}

/* helper used by games to end and redirect */
function gameEnd(success, message){
  // show result badge
  const badge = document.createElement('div');
  badge.className = `result-badge show ${success? 'congrats':'fail'}`;
  badge.innerHTML = success ? `🎉 Congratulations! ${message||''}` : `❌ Try Again ${message||''}`;
  document.querySelector('.game-card').prepend(badge);
  // stop any timers already handled in game code
  // after 2 seconds redirect to spinner
  setTimeout(()=> {
    window.location = 'index.html';
  }, 1800);
}

/* Expose helpers to window so game pages can call them */
window.spHelpers = {
  gameEnd,
  shuffle
};
