const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const match = html.match(/const TRACKS_DATA = (\[[\s\S]*?\]);/);
if (!match) { console.log('not found'); process.exit(1); }
let TRACKS_DATA = eval(match[1]);

for (let track of TRACKS_DATA) {
    const filename = track.title.trim() + '.txt';
    try {
        track.lyricsText = fs.readFileSync(filename, 'utf8');
    } catch (e) {
        track.lyricsText = 'Letra não encontrada.';
    }
}

const template = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Letras - DJ Mike</title>
  <style>
    :root {
      --bg-color: #0f172a;
      --card-bg: #1e293b;
      --card-inner: #0b1120;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --accent: #38bdf8;
      --accent-hover: #0284c7;
      --border-color: #334155;
    }
    body {
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      background-color: var(--bg-color);
      color: var(--text-main);
      margin: 0;
      display: flex;
      height: 100vh;
      overflow: hidden;
    }
    .sidebar {
      width: 300px;
      background-color: var(--card-bg);
      border-right: 1px solid var(--border-color);
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }
    .header {
      padding: 1.5rem;
      border-bottom: 1px solid var(--border-color);
    }
    .header h1 {
      margin: 0;
      font-size: 1.5rem;
      background: linear-gradient(90deg, #38bdf8, #818cf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .header a {
      color: var(--accent);
      text-decoration: none;
      font-size: 0.9rem;
      display: block;
      margin-top: 0.5rem;
    }
    .header a:hover {
      text-decoration: underline;
    }
    .track-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .track-item {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid var(--border-color);
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .track-item:hover {
      background-color: rgba(56, 189, 248, 0.08);
    }
    .track-item.active {
      background-color: rgba(56, 189, 248, 0.15);
      border-left: 4px solid var(--accent);
    }
    .track-item-title {
      font-weight: 600;
      color: var(--text-main);
    }
    .main-content {
      flex: 1;
      padding: 2rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .lyrics-container {
      width: 100%;
      max-width: 800px;
      background-color: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 2.5rem;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
    }
    .lyrics-title {
      font-size: 2rem;
      color: var(--accent);
      margin-top: 0;
      margin-bottom: 1.5rem;
      text-align: center;
    }
    .lyrics-text {
      white-space: pre-wrap;
      font-size: 1.1rem;
      line-height: 1.8;
      color: var(--text-main);
      text-align: center;
    }
    .placeholder-msg {
      color: var(--text-muted);
      text-align: center;
      margin-top: 5rem;
      font-size: 1.2rem;
    }
  </style>
</head>
<body>

  <div class="sidebar">
    <div class="header">
      <h1>Letras - DJ Mike</h1>
      <a href="index.html">← Voltar ao Catálogo</a>
    </div>
    <ul class="track-list" id="trackList"></ul>
  </div>
  
  <div class="main-content">
    <div id="lyricsView">
      <div class="placeholder-msg">Selecione uma música ao lado para ler a letra.</div>
    </div>
  </div>

<script>
  const TRACKS_DATA = ${JSON.stringify(TRACKS_DATA)};

  const trackList = document.getElementById('trackList');
  const lyricsView = document.getElementById('lyricsView');
  let currentActive = null;

  function renderSidebar() {
    TRACKS_DATA.forEach((track, idx) => {
      const li = document.createElement('li');
      li.className = 'track-item';
      li.innerHTML = \`<div class="track-item-title">\${track.title}</div>\`;
      li.onclick = () => loadLyrics(track, li);
      trackList.appendChild(li);
    });
  }

  function loadLyrics(track, element) {
    if (currentActive) {
      currentActive.classList.remove('active');
    }
    currentActive = element;
    element.classList.add('active');

    lyricsView.innerHTML = \`
      <div class="lyrics-container">
        <h2 class="lyrics-title">\${track.title}</h2>
        <div class="lyrics-text">\${track.lyricsText}</div>
      </div>
    \`;
  }

  renderSidebar();
</script>
</body>
</html>`;

fs.writeFileSync('letras.html', template, 'utf8');
