/**
 * Sri Pushpagiri Peetham Sacred Audio Player
 * Audio: "జయ జయ శంకరా" (WhatsApp Audio 2026-10-08 at 22.22.36)
 */

(function () {
  let audioElement = null;

  function getAudioElement() {
    if (!audioElement) {
      audioElement = document.getElementById('peethamAudio');
    }
    if (!audioElement) {
      audioElement = document.createElement('audio');
      audioElement.id = 'peethamAudio';
      audioElement.preload = 'metadata';
      audioElement.loop = true;

      const srcMp3 = document.createElement('source');
      srcMp3.src = 'audio/WhatsApp-Audio-2026-10-08-at-22.22.36.mp3';
      srcMp3.type = 'audio/mpeg';

      const srcMpeg = document.createElement('source');
      srcMpeg.src = 'audio/WhatsApp-Audio-2026-10-08-at-22.22.36.mpeg';
      srcMpeg.type = 'audio/mpeg';

      audioElement.appendChild(srcMp3);
      audioElement.appendChild(srcMpeg);
      document.body.appendChild(audioElement);

      attachListeners(audioElement);
    }
    return audioElement;
  }

  function attachListeners(audio) {
    audio.addEventListener('play', () => updateAudioUI(true));
    audio.addEventListener('pause', () => updateAudioUI(false));
    audio.addEventListener('ended', () => updateAudioUI(false));
    audio.addEventListener('error', (e) => {
      console.warn('Audio playback encountered an issue:', e);
      updateAudioUI(false);
    });
  }

  function updateAudioUI(isPlaying) {
    const btns = document.querySelectorAll('.audio-toggle-btn');
    const pausedIcons = document.querySelectorAll('.audio-state-paused');
    const playingIcons = document.querySelectorAll('.audio-state-playing');
    const badges = document.querySelectorAll('.audio-badge');

    btns.forEach(btn => {
      if (isPlaying) {
        btn.classList.add('ring-2', 'ring-amber-500', 'bg-amber-100', 'shadow-[0_0_14px_rgba(245,158,11,0.5)]');
        btn.setAttribute('title', 'Pause: జయ జయ శంకరా');
        btn.setAttribute('aria-label', 'Pause sacred chant');
      } else {
        btn.classList.remove('ring-2', 'ring-amber-500', 'bg-amber-100', 'shadow-[0_0_14px_rgba(245,158,11,0.5)]');
        btn.setAttribute('title', 'Play Sacred Chant: జయ జయ శంకరా');
        btn.setAttribute('aria-label', 'Play sacred chant');
      }
    });

    pausedIcons.forEach(el => {
      if (isPlaying) {
        el.classList.add('hidden');
        el.classList.remove('flex');
      } else {
        el.classList.remove('hidden');
        el.classList.add('flex');
      }
    });

    playingIcons.forEach(el => {
      if (isPlaying) {
        el.classList.remove('hidden');
        el.classList.add('flex');
      } else {
        el.classList.add('hidden');
        el.classList.remove('flex');
      }
    });

    badges.forEach(badge => {
      if (isPlaying) {
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    });
  }

  window.togglePeethamAudio = function () {
    const audio = getAudioElement();
    if (!audio) return;

    if (audio.paused) {
      audio.play().then(() => {
        updateAudioUI(true);
      }).catch(err => {
        console.warn('Autoplay/playback error:', err);
      });
    } else {
      audio.pause();
      updateAudioUI(false);
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    const existingAudio = document.getElementById('peethamAudio');
    if (existingAudio) {
      audioElement = existingAudio;
      attachListeners(audioElement);
    }
  });
})();
