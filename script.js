(function () {
  const targetCentiseconds = 314; // 3.14 s

  const unlockKey = 'regiardo_unlocked';
  const unlockOverlay = document.getElementById('unlockOverlay');
  const unlockForm = document.getElementById('unlockForm');
  const unlockInput = document.getElementById('unlockInput');
  const unlockError = document.getElementById('unlockError');

  const timerDisplay = document.getElementById('timerDisplay');
  const statusEl = document.getElementById('status');
  const actionButton = document.getElementById('actionButton');
  const signOverlay = document.getElementById('signOverlay');

  let isRunning = false;
  let isGameOver = false;
  let startTimestamp = 0;
  let elapsedMs = 0;
  let rafId = 0;

  function isUnlockOpen() {
    return !unlockOverlay.hasAttribute('hidden');
  }

  function isSignOpen() {
    return !signOverlay.hasAttribute('hidden');
  }

  function showUnlockIfFirstTime() {
    const hasUnlocked = localStorage.getItem(unlockKey) === 'true';
    if (!hasUnlocked) {
      unlockOverlay.removeAttribute('hidden');
      setTimeout(() => unlockInput.focus(), 0);
    } else {
      unlockOverlay.setAttribute('hidden', '');
    }
  }

  function handleUnlockSubmit(event) {
    event.preventDefault();
    const value = (unlockInput.value || '').trim().toUpperCase();
    if (value === 'REGIARDO') {
      localStorage.setItem(unlockKey, 'true');
      unlockOverlay.setAttribute('hidden', '');
      unlockError.textContent = '';
      statusEl.textContent = 'Press Space to start • Press Space again to stop';
    } else {
      unlockError.textContent = 'Incorrect clue. Try again.';
      unlockInput.select();
    }
  }

  function formatTime(ms) {
    return (ms / 1000).toFixed(2) + ' s';
  }

  function updateTimer() {
    elapsedMs = performance.now() - startTimestamp;
    timerDisplay.textContent = formatTime(elapsedMs);
    rafId = requestAnimationFrame(updateTimer);
  }

  function start() {
    if (isRunning || isGameOver) return;
    isRunning = true;
    elapsedMs = 0;
    startTimestamp = performance.now();
    statusEl.textContent = 'Running... Press Space to stop';
    rafId = requestAnimationFrame(updateTimer);
  }

  function stop() {
    if (!isRunning || isGameOver) return;
    isRunning = false;
    cancelAnimationFrame(rafId);
    rafId = 0;

    const finalMs = elapsedMs;
    timerDisplay.textContent = formatTime(finalMs);

    const roundedCentiseconds = Math.round(finalMs / 10);
    if (roundedCentiseconds === targetCentiseconds) {
      statusEl.textContent = 'Perfect!';
      showWinSign();
      isGameOver = true;
    } else {
      const signedMs = Math.round(finalMs - targetCentiseconds * 10);
      const sign = signedMs >= 0 ? '+' : '';
      statusEl.textContent = `Missed by ${sign}${signedMs} ms • Press Space to try again`;
    }
  }

  function resetIfStopped() {
    if (isRunning || isGameOver) return;
    elapsedMs = 0;
    timerDisplay.textContent = '0.00 s';
    statusEl.textContent = 'Press Space to start • Press Space again to stop';
  }

  function toggleStartStop() {
    if (isUnlockOpen() || isSignOpen()) return;
    if (!isRunning) {
      start();
    } else {
      stop();
    }
  }

  function handleSpaceKey(event) {
    if (event.code !== 'Space') return;
    if (event.target && (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA')) return;
    if (isUnlockOpen()) return;
    event.preventDefault();
    if (event.repeat) return;

    if (!isRunning && !isGameOver && elapsedMs > 0) {
      resetIfStopped();
      start();
      return;
    }

    toggleStartStop();
  }

  function handleActionButton() {
    if (isUnlockOpen()) return;
    if (!isRunning && !isGameOver && elapsedMs > 0) {
      resetIfStopped();
      start();
      return;
    }
    toggleStartStop();
  }

  function showWinSign() {
    signOverlay.removeAttribute('hidden');
  }

  function init() {
    showUnlockIfFirstTime();
    unlockForm.addEventListener('submit', handleUnlockSubmit);
    document.addEventListener('keydown', handleSpaceKey);
    actionButton.addEventListener('click', handleActionButton);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();