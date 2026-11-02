// ১. মোবাইল মেনু টগল হ্যান্ডলিং
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');

mobileToggle.addEventListener('click', () => {
  navMenu.classList.toggle('open');
  const icon = mobileToggle.querySelector('i');
  if (navMenu.classList.contains('open')) {
    icon.classList.remove('fa-bars');
    icon.classList.add('fa-xmark');
  } else {
    icon.classList.remove('fa-xmark');
    icon.classList.add('fa-bars');
  }
});

// কোনো লিঙ্কে ক্লিক করলে মোবাইল মেনু নিজে থেকেই বন্ধ হবে
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    const icon = mobileToggle.querySelector('i');
    if (icon) {
      icon.classList.remove('fa-xmark');
      icon.classList.add('fa-bars');
    }
  });
});

// ২. সার্চ বার হ্যান্ডলার
function handleSearch() {
  const searchInput = document.getElementById('searchInput');
  const query = searchInput.value.trim();

  if (!query) {
    showToast('Please type a search keyword (e.g. "Data Structures")');
    return;
  }

  showToast(`Searching for "${query}" in Academic Vault...`);

  // স্ক্রোল করে একাডেমিক ভল্ট সেকশনে নিয়ে যাওয়া
  document.getElementById('vault').scrollIntoView({ behavior: 'smooth' });
}

// Enter বাটন চাপলেও সার্চ এক্সিকিউট হবে
document.getElementById('searchInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    handleSearch();
  }
});

// ৩. রিসোর্স ডাউনলোড অ্যাকশন
function downloadResource(resourceTitle) {
  showToast(`Starting download: ${resourceTitle} (PDF)`);
}

// ৪. মেন্টর মেসেজ অ্যাকশন
function contactMentor(mentorName) {
  showToast(`Connecting with mentor ${mentorName}...`);
}

// ৫. স্টুডেন্ট পোর্টাল মোডাল ওপেন ও ক্লোজ
const portalModal = document.getElementById('portalModal');

function openPortalModal() {
  portalModal.classList.add('active');
}

function closePortalModal() {
  portalModal.classList.remove('active');
}

// মোডালের ব্যাকগ্রাউন্ডে ক্লিক করলে বন্ধ হবে
window.addEventListener('click', (e) => {
  if (e.target === portalModal) {
    closePortalModal();
  }
});

// পোর্টাল লগইন ফর্ম সাবমিশন
function handlePortalSubmit(event) {
  event.preventDefault();
  const studentId = document.getElementById('studentId').value.trim();

  closePortalModal();
  showToast(`Welcome back, Student ID: ${studentId}! Login successful.`);
  document.getElementById('portalLoginForm').reset();
}

// ৬. কাস্টম টোস্ট নোটিফিকেশন ফাংশন
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toastBox');
  const toastMsg = document.getElementById('toastMsg');

  toastMsg.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3400);
}