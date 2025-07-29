// app.js

let currentData = [];
let bookmarks = JSON.parse(localStorage.getItem('ferpaBookmarks') || '[]');

function loadSection(sectionId) {
  const results = document.getElementById('results');
  results.innerHTML = '';

  if (sectionId === 'statute') {
    currentData = statuteData;
  } else if (sectionId === 'regulations') {
    currentData = regulationsData;
  }

  currentData.forEach(entry => {
    renderEntry(entry, results);
  });
}

function bookmark(id) {
  if (!bookmarks.includes(id)) {
    bookmarks.push(id);
    localStorage.setItem('ferpaBookmarks', JSON.stringify(bookmarks));
    alert('Bookmarked!');
  } else {
    alert('Already bookmarked.');
  }
}

function showBookmarks() {
  const results = document.getElementById('results');
  results.innerHTML = '';
  const all = [...(statuteData || []), ...(regulationsData || [])];
  const bookmarkedItems = all.filter(e => bookmarks.includes(e.id));

  if (!bookmarkedItems.length) {
    results.innerHTML = '<p>No bookmarks found.</p>';
    return;
  }

  bookmarkedItems.forEach(entry => {
    renderEntry(entry, results);
  });
}

function renderEntry(entry, container) {
  const div = document.createElement('div');
  div.className = 'section-entry';

  const shareText = encodeURIComponent(`${entry.title}\n\n${entry.text}`);
  div.innerHTML = `
    <h2>${entry.title}</h2>
    <p>${entry.text.replace(/\n/g, '<br>')}</p>
    <div style="margin-top: 10px">
      <button onclick="bookmark('${entry.id}')">📌 Bookmark</button>
      <button onclick="copyText(\`${entry.text.replace(/`/g, '\`')}\`)">📋 Copy</button>
      <button onclick="shareTextEmail('${shareText}')">📧 Email</button>
      <button onclick="shareTextSMS('${shareText}')">📱 Text</button>
    </div>
  `;
  container.appendChild(div);
}

function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('Text copied to clipboard');
  });
}

function shareTextEmail(text) {
  const mailtoLink = `mailto:?subject=FERPA Reference&body=${text}`;
  window.location.href = mailtoLink;
}

function shareTextSMS(text) {
  const smsLink = `sms:?body=${text}`;
  window.location.href = smsLink;
}

function exportBookmarks() {
  const blob = new Blob([JSON.stringify(bookmarks)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ferpa-bookmarks.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importBookmarks(fileInput) {
  const file = fileInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        bookmarks = imported;
        localStorage.setItem('ferpaBookmarks', JSON.stringify(bookmarks));
        alert('Bookmarks imported successfully!');
      } else {
        alert('Invalid bookmarks file.');
      }
    } catch (err) {
      alert('Error reading file.');
    }
  };
  reader.readAsText(file);
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

document.getElementById('search').addEventListener('input', function (e) {
  const query = e.target.value.trim();
  const results = document.getElementById('results');
  results.innerHTML = '';

  if (!query || !currentData.length) return;

  currentData.forEach(entry => {
    if (entry.text.toLowerCase().includes(query.toLowerCase())) {
      const highlightedText = entry.text.replace(
        new RegExp(`(${query})`, 'gi'),
        '<mark>$1</mark>'
      );

      const div = document.createElement('div');
      div.className = 'section-entry';
      div.innerHTML = `
        <h2>${entry.title}</h2>
        <p>${highlightedText.replace(/\n/g, '<br>')}</p>
      `;
      results.appendChild(div);
    }
  });
});