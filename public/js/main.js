lucide.createIcons();

var nav = document.getElementById('nav');
window.addEventListener('scroll', function() {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

var toggle = document.getElementById('navToggle');
var links = document.getElementById('navLinks');
toggle.addEventListener('click', function() {
  links.classList.toggle('open');
  var icon = toggle.querySelector('i');
  icon.setAttribute('data-lucide', links.classList.contains('open') ? 'x' : 'menu');
  lucide.createIcons();
});

links.querySelectorAll('a').forEach(function(a) {
  a.addEventListener('click', function() {
    links.classList.remove('open');
    toggle.querySelector('i').setAttribute('data-lucide', 'menu');
    lucide.createIcons();
  });
});

document.querySelectorAll('a[href^="#"]').forEach(function(a) {
  a.addEventListener('click', function(e) {
    var id = a.getAttribute('href');
    if (id === '#') return;
    var el = document.querySelector(id);
    if (el) {
      e.preventDefault();
      window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
    }
  });
});

var form = document.getElementById('contactForm');
var toast = document.getElementById('toast');

function showToast(msg, isError) {
  toast.textContent = msg;
  toast.classList.remove('error');
  if (isError) toast.classList.add('error');
  toast.classList.add('show');
  setTimeout(function() { toast.classList.remove('show'); }, 4000);
}

form.addEventListener('submit', function(e) {
  e.preventDefault();
  var btn = form.querySelector('button');
  var orig = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i data-lucide="loader-circle" style="width:18px;height:18px;"></i> 提交中...';
  lucide.createIcons();

  var fd = new FormData(form);
  var data = {};
  fd.forEach(function(v, k) { data[k] = v; });

  fetch('/api/booking', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(function(res) { return res.json(); })
  .then(function(json) {
    if (json.success) {
      showToast(json.message);
      form.reset();
    } else {
      showToast(json.message || '提交失败，请重试', true);
    }
  })
  .catch(function() {
    showToast('网络错误，请稍后重试', true);
  })
  .finally(function() {
    btn.disabled = false;
    btn.innerHTML = orig;
    lucide.createIcons();
  });
});
