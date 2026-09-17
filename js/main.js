/**
 * NOTOSAN — Main Controller & Interactive Travel Features
 */

document.addEventListener('DOMContentLoaded', () => {
  initAudioToggle();
  initUserAuth();
  initBookingForm();
  initMobileNav();
  initJourneyBtn();
});

/* ==========================================================================
   1. AUDIO ATMOSPHERE TOGGLE
   ========================================================================== */
function initAudioToggle() {
  const toggleBtn = document.getElementById('audio-toggle');
  const iconOff = document.getElementById('audio-icon-off');
  const iconOn = document.getElementById('audio-icon-on');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    if (!window.soundEngine) return;
    const isPlaying = window.soundEngine.toggle();

    if (isPlaying) {
      toggleBtn.classList.add('playing');
      iconOff.classList.add('hidden');
      iconOn.classList.remove('hidden');
    } else {
      toggleBtn.classList.remove('playing');
      iconOff.classList.remove('hidden');
      iconOn.classList.add('hidden');
    }
  });
}

/* ==========================================================================
   2. USER AUTHENTICATION & TOP-RIGHT PROFILE BADGE CONTROLLER
   ========================================================================== */
function initUserAuth() {
  const registerModal = document.getElementById('register-modal');
  const openRegisterBtn = document.getElementById('open-register-modal');
  const closeRegisterBtn = document.getElementById('close-register-modal');
  const registerForm = document.getElementById('modal-quick-form');

  const profileBadge = document.getElementById('user-profile-badge');
  const profileDropdown = document.getElementById('profile-dropdown');
  const profileLogoutBtn = document.getElementById('profile-logout-btn');
  const profileViewPassBtn = document.getElementById('profile-view-pass-btn');

  const navAvatarIcon = document.getElementById('nav-avatar-icon');
  const navProfileName = document.getElementById('nav-profile-name');
  const dropdownAvatarIcon = document.getElementById('dropdown-avatar-icon');
  const dropdownUserName = document.getElementById('dropdown-user-name');
  const dropdownUserEmail = document.getElementById('dropdown-user-email');
  const dropdownPassId = document.getElementById('dropdown-pass-id');

  const emblemPreview = document.getElementById('emblem-avatar-preview');
  const avatarButtons = document.querySelectorAll('.avatar-select-btn');

  const passModal = document.getElementById('sanctuary-pass-modal');
  const closePassModalBtn = document.getElementById('close-pass-modal');
  const closePassBtn = document.getElementById('close-pass-btn');
  const passModalName = document.getElementById('pass-modal-name');
  const passModalId = document.getElementById('pass-modal-id');

  let selectedAvatar = '🧳';

  // 1. Avatar selector in modal
  avatarButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      avatarButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedAvatar = btn.getAttribute('data-avatar') || '🧳';
      if (emblemPreview) {
        emblemPreview.textContent = selectedAvatar;
      }
      if (window.soundEngine) window.soundEngine.playWaterDrop();
    });
  });

  // 2. Open & close register modal
  const openModal = () => {
    if (!registerModal) return;
    registerModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    if (window.soundEngine) window.soundEngine.playWaterDrop();
  };

  const closeModal = () => {
    if (!registerModal) return;
    registerModal.classList.add('hidden');
    document.body.style.overflow = '';
  };

  if (openRegisterBtn) openRegisterBtn.addEventListener('click', openModal);
  if (closeRegisterBtn) closeRegisterBtn.addEventListener('click', closeModal);

  if (registerModal) {
    registerModal.addEventListener('click', (e) => {
      if (e.target === registerModal) closeModal();
    });
  }

  // 3. Apply logged-in user state
  function applyLoggedInState(user, isNewLogin = false) {
    if (!user) return;

    // Update nav badge elements
    if (navAvatarIcon) navAvatarIcon.textContent = user.avatar || '🧳';
    if (navProfileName) navProfileName.textContent = user.name || 'Kenji Tanaka';

    // Update dropdown elements
    if (dropdownAvatarIcon) dropdownAvatarIcon.textContent = user.avatar || '🧳';
    if (dropdownUserName) dropdownUserName.textContent = user.name || 'Kenji Tanaka';
    if (dropdownUserEmail) dropdownUserEmail.textContent = user.email || 'kenji@notosan.jp';
    if (dropdownPassId) dropdownPassId.textContent = user.passId || '#NT-2026';

    // Update pass modal elements
    if (passModalName) passModalName.textContent = user.name || 'Kenji Tanaka';
    if (passModalId) passModalId.textContent = user.passId || '#NT-2026';

    // Switch buttons in top-right nav
    if (openRegisterBtn) openRegisterBtn.classList.add('hidden');
    if (profileBadge) profileBadge.classList.remove('hidden');

    // Save to localStorage
    try {
      localStorage.setItem('notosan_user', JSON.stringify(user));
    } catch (err) {
      console.warn('Storage not available:', err);
    }

    if (isNewLogin) {
      // Audio chime and canvas celebration sparkles
      if (window.soundEngine) window.soundEngine.playTempleBell();

      if (window.notoNatureCanvas && profileBadge) {
        const rect = profileBadge.getBoundingClientRect();
        window.notoNatureCanvas.spawnSparkles(rect.left + rect.width / 2, rect.bottom + 10, 24, 'gold');
        window.notoNatureCanvas.spawnSparkles(rect.left + rect.width / 2, rect.bottom + 10, 14, 'pink');
      }

      showNotoToast('✨', `Selamat datang, ${user.name}! Profil Anda kini aktif di pojok kanan atas.`);
    }
  }

  // 4. Form Submit handler (Enter / Register)
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('modal-name');
      const emailInput = document.getElementById('modal-email');

      const name = nameInput ? nameInput.value.trim() : 'Kenji Tanaka';
      const email = emailInput ? emailInput.value.trim() : 'kenji@notosan.jp';
      const passId = `#NT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      const user = {
        name: name || 'Kenji Tanaka',
        email: email || 'kenji@notosan.jp',
        avatar: selectedAvatar,
        passId: passId,
        karma: 100
      };

      closeModal();
      applyLoggedInState(user, true);
    });
  }

  // 5. Toggle Profile Dropdown Popover
  if (profileBadge) {
    profileBadge.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = !profileDropdown.classList.contains('hidden');
      if (isOpen) {
        profileDropdown.classList.add('hidden');
        profileBadge.classList.remove('active');
        profileBadge.setAttribute('aria-expanded', 'false');
      } else {
        profileDropdown.classList.remove('hidden');
        profileBadge.classList.add('active');
        profileBadge.setAttribute('aria-expanded', 'true');
        if (window.soundEngine) window.soundEngine.playWaterDrop();
      }
    });
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (profileDropdown && !profileDropdown.contains(e.target) && !profileBadge.contains(e.target)) {
      profileDropdown.classList.add('hidden');
      if (profileBadge) {
        profileBadge.classList.remove('active');
        profileBadge.setAttribute('aria-expanded', 'false');
      }
    }
  });

  // 6. Profile Logout handler
  if (profileLogoutBtn) {
    profileLogoutBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      try {
        localStorage.removeItem('notosan_user');
      } catch (err) {}

      if (profileDropdown) profileDropdown.classList.add('hidden');
      if (profileBadge) {
        profileBadge.classList.add('hidden');
        profileBadge.classList.remove('active');
      }
      if (openRegisterBtn) openRegisterBtn.classList.remove('hidden');

      if (window.soundEngine) window.soundEngine.playWaterDrop();
      showNotoToast('👋', 'Anda telah keluar akun. Tombol Register kembali aktif.');
    });
  }

  // 7. Sanctuary Pass View Modal Handlers
  if (profileViewPassBtn && passModal) {
    profileViewPassBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (profileDropdown) profileDropdown.classList.add('hidden');
      if (profileBadge) profileBadge.classList.remove('active');
      passModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      if (window.soundEngine) window.soundEngine.playTempleBell();
    });
  }

  const closePassModal = () => {
    if (!passModal) return;
    passModal.classList.add('hidden');
    document.body.style.overflow = '';
    if (window.soundEngine) window.soundEngine.playWaterDrop();
  };

  if (closePassModalBtn) closePassModalBtn.addEventListener('click', closePassModal);
  if (closePassBtn) closePassBtn.addEventListener('click', closePassModal);
  if (passModal) {
    passModal.addEventListener('click', (e) => {
      if (e.target === passModal) closePassModal();
    });
  }

  // 8. ESC key closes any open modal/dropdown
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (registerModal && !registerModal.classList.contains('hidden')) closeModal();
      if (passModal && !passModal.classList.contains('hidden')) closePassModal();
      if (profileDropdown && !profileDropdown.classList.contains('hidden')) {
        profileDropdown.classList.add('hidden');
        if (profileBadge) profileBadge.classList.remove('active');
      }
    }
  });

  // 9. Check existing login session from localStorage
  try {
    const savedUser = localStorage.getItem('notosan_user');
    if (savedUser) {
      applyLoggedInState(JSON.parse(savedUser), false);
    }
  } catch (err) {
    console.warn('Could not read user session:', err);
  }
}

/* ==========================================================================
   GLOBAL TOAST NOTIFICATION HELPER
   ========================================================================== */
let notoToastTimeout = null;
function showNotoToast(icon, message) {
  const toast = document.getElementById('noto-toast');
  const toastIcon = document.getElementById('toast-icon');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastIcon || !toastMsg) return;

  toastIcon.textContent = icon;
  toastMsg.textContent = message;
  toast.classList.remove('hidden');

  // Trigger reflow for smooth transition
  void toast.offsetWidth;
  toast.classList.add('active');

  if (notoToastTimeout) clearTimeout(notoToastTimeout);
  notoToastTimeout = setTimeout(() => {
    toast.classList.remove('active');
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 380);
  }, 4200);
}

/* ==========================================================================
   3. EXPEDITION BOOKING FORM
   ========================================================================== */
function initBookingForm() {
  const form = document.getElementById('main-booking-form');
  const successBox = document.getElementById('booking-success-box');
  const resetBtn = document.getElementById('reset-booking-btn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('submit-booking-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sealing Sanctuary Permit...</span>';
    }

    setTimeout(() => {
      if (successBox) successBox.classList.remove('hidden');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <span>Confirm Expedition Reservation</span>
          <span class="arrow-symbol">▸</span>
        `;
      }
      form.reset();

      if (window.soundEngine) window.soundEngine.playTempleBell();
    }, 850);
  });

  if (resetBtn && successBox) {
    resetBtn.addEventListener('click', () => {
      successBox.classList.add('hidden');
      if (window.soundEngine) window.soundEngine.playWaterDrop();
    });
  }
}

/* ==========================================================================
   4. START THE JOURNEY BUTTON
   ========================================================================== */
function initJourneyBtn() {
  const journeyBtn = document.getElementById('start-journey-btn');
  if (!journeyBtn) return;

  journeyBtn.addEventListener('click', () => {
    const target = document.getElementById('tranquility');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      if (window.soundEngine) window.soundEngine.playWaterDrop();
    }
  });

  // Learn more links
  const learnMoreBtns = document.querySelectorAll('.link-learn-more');
  learnMoreBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const sanctuarySec = document.getElementById('sanctuary');
      if (sanctuarySec) {
        sanctuarySec.scrollIntoView({ behavior: 'smooth' });
        if (window.soundEngine) window.soundEngine.playWaterDrop();
      }
    });
  });
}

/* ==========================================================================
   5. MOBILE NAVIGATION
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-nav-toggle');
  const header = document.getElementById('site-header');

  if (!toggleBtn || !header) return;

  toggleBtn.addEventListener('click', () => {
    header.classList.toggle('mobile-menu-active');
  });

  const links = header.querySelectorAll('.nav-link, .btn-register-pill');
  links.forEach(l => {
    l.addEventListener('click', () => {
      header.classList.remove('mobile-menu-active');
    });
  });
}
