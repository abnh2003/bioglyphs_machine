// Fonctions principales pour le jeu de la vie
const GameOfLife = {
  colorSettings: {
	backgroundNoise: true, // NEW
    baseGray: 255,
    ageDecay: 10,
    baseColor: '#ffffff',
    cellAlpha: 1,
    haloColor: 'rgba(255,0,0,0.24)',
    particleColor: 'rgba(255,255,255,0.08)',
    backgroundRange: [30, 60], // موروثة، لكن غير مستعملة إذا تم تحديد backgroundColor
    backgroundColor: '#1e1e1e'
  },
  // Configuration initiale
  init: function(gridSize, cellSize, canvasScale) {
    this.gridSize = gridSize;
    this.cellSize = cellSize;
    this.canvasScale = 1; // Fixé à 1 pour éviter le flou
    this.fps = 200;
    this.activeProb = 0.2;
    this.running = false;
    this.frame = 0;
    this.generation = 0;
    this.generationHistory = [];
    this.isRecording = false;
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.videoStream = null;
    
    // Initialisation des grilles
    this.createGrids();
    
    // Initialisation des particules
    this.initParticles();
    
    // Initialisation du canvas externe pour l'enregistrement
    this.initOffscreenCanvas();
    
    // Initialisation des métadonnées
    this.initMetadata();
  },
  
  // Création des grilles
  createGrids: function() {
    this.grid = this.createGrid();
    this.initialGrid = this.grid.map(row => [...row]);
    this.nextGrid = this.createGrid(0);
    this.ageGrid = this.createGrid(0);
  },
  
  // Création d'une grille
  createGrid: function(fill = () => Math.random() < this.activeProb) {
    return Array.from({ length: this.gridSize }, () =>
      Array.from({ length: this.gridSize }, () =>
        typeof fill === 'function' ? fill() : fill
      )
    );
  },
  
  // Initialisation des particules
  initParticles: function() {
    this.particles = [];
    for (let i = 0; i < 100; i++) {
      const baseR = 5 + Math.random() * 2;
      const pts = 5 + Math.floor(Math.random() * 6);
      const shape = Array.from({ length: pts }, (_, j) => {
        const ang = (j / pts) * 2 * Math.PI;
        const rad = baseR * (0.5 + Math.random() * 0.5);
        return [Math.cos(ang) * rad, Math.sin(ang) * rad];
      });
      this.particles.push({
        x: Math.random() * (this.gridSize * this.cellSize),
        y: Math.random() * (this.gridSize * this.cellSize),
        shape, vy: 0.2 + Math.random() * 0.5, alpha: 0.05 + Math.random() * 0.1
      });
    }
  },
  
  // Initialisation du canvas externe
  initOffscreenCanvas: function() {
    // Créer un canvas hors écran de la même taille exacte que le canvas visible
    this.off = document.createElement('canvas');
    this.off.width = canvas.width;
    this.off.height = canvas.height;
    this.offCtx = this.off.getContext('2d', { willReadFrequently: true });
  },

 // Initialization of metadata
initMetadata: function() {
	const userIndexInput = document.getElementById('nft-index');
	const index = userIndexInput ? userIndexInput.value : 1;
	this.nftName = this.generateSerialName(index);

	this.metadata = {
	  name: this.nftName,
      title: "Conway's Game of Life",
      description: "A digital simulation inspired by the rules of John Conway's Game of Life, showcasing the evolution of cellular patterns across generations with unique visual effects",
      author: "Bioglyphs",
      created_at: new Date().toISOString(),
      version: "1.0.0",
      license: "CC BY-NC-SA 4.0",
      keywords: ["cellular automaton", "Conway's Game of Life", "generative art", "digital art", "simulation"],
      artwork: {
        title: "Evolution of Digital Life",
        medium: "Interactive digital simulation",
        style: "Generative art",
        dimensions: {
          width: this.gridSize * this.cellSize,
          height: this.gridSize * this.cellSize,
          unit: "pixels"
        },
        color_scheme: "grayscale with red accents",
        inspiration: "Rules of Conway's Game of Life (1970)",
        concept: "Exploration of emergent complexity from simple rules, where cellular patterns evolve over time into complex and ever-changing structures"
      },
      rules: {
        birth: [3],
        survival: [2, 3],
        neighborhood: "Moore",
        boundary: "toroidal",
        description: "A new cell is born if it has exactly 3 living neighbors. A cell survives if it has 2 or 3 living neighbors. A cell dies in all other cases."
      },
      simulation: {
        grid_size: this.gridSize,
        cell_size: this.cellSize,
        initial_density: this.activeProb,
        speed_ms: this.fps,
        current_generation: 0,
        alive_cells: 0,
        density_percentage: 0,
        initial_pattern: "random",
        pattern_history: []
      },
      rendering: {
  canvas_scale: this.canvasScale,
  color_scheme: "custom",
  particle_effects: true,
  cell_rendering: {
    shape: "organic",
    glow_effect: true,
    age_based_color: true,
    animation: "subtle_wiggle",
    base_color: this.colorSettings.baseColor,
    halo_color: this.colorSettings.haloColor,
    alpha: this.colorSettings.cellAlpha
  },
  background: {
    type: this.colorSettings.backgroundNoise ? "noise" : "flat",
    color_range: this.colorSettings.backgroundRange,
    background_color: this.colorSettings.backgroundColor,
    animation: "static"
  },
  particles: {
    color: this.colorSettings.particleColor,
    count: 100,
    motion: "rising organic shapes"
  }
},

      export: {
        video_format: "mp4",
        video_quality: "high",
        video_fps: this.fps,
        timestamp: "",
        file_size_bytes: 0,
        frame_count: 0,
        resolution: {
          width: this.gridSize * this.cellSize,
          height: this.gridSize * this.cellSize,
          scale_factor: this.canvasScale
        }
      },
      technical: {
        platform: "Web Browser",
        language: "JavaScript",
        libraries: ["MediaRecorder API", "jszip.min.js"],
        canvas_api: "HTML5 Canvas",
        browser_compatibility: ["Chrome", "Firefox", "Safari", "Edge"],
        mobile_support: true
      },
      historical_context: {
        original_creation: "1970 by John Horton Conway",
        publication: "October 1970 issue of Scientific American in Martin Gardner’s 'Mathematical Games' column",
        significance: "One of the most famous cellular automata in the history of computing, demonstrating that simple rules can yield complex and unpredictable behavior"
      },
      viewer_settings: {
        interface_type: "minimal",
        controls: ["play_pause", "reset"],
        display_stats: true,
        auto_play: false
      },
      nft_metadata: {
        schema: "ERC-721",
        blockchain: "Ethereum",
        collection_name: "Digital Cellular Automata",
        rarity: "Unique",
        properties: {
          generation_algorithm: "Conway's Game of Life",
          initial_state_hash: "",
          final_state_hash: "",
          animation_length_seconds: 0,
          total_generations: 0
        }
      }
    };
  },

 
 // le nom
 // بدلاً من تحويل الشبكة إلى رمز ثنائي-36، نرتّب بالرقم التسلسلي فقط:
generateSerialName: function(index) {
  const idx = String(index ?? 1).padStart(4, '0');
  return `Glyph-${idx}`;
},


  // Dessin de l'arrière-plan
drawBackground: function(ctx) {
  const img = ctx.createImageData(this.gridSize * this.cellSize, this.gridSize * this.cellSize);

  if (this.colorSettings.backgroundNoise) {
    const [minV, maxV] = this.colorSettings.backgroundRange;
    for (let i = 0; i < img.data.length; i += 4) {
      const v = minV + Math.random() * (maxV - minV);
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
  } else {
    const hex = this.colorSettings.backgroundColor;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    for (let i = 0; i < img.data.length; i += 4) {
      img.data[i] = r;
      img.data[i + 1] = g;
      img.data[i + 2] = b;
      img.data[i + 3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);
},
  
  // Dessin des particules
  drawParticles: function(ctx) {
    ctx.save();
    this.particles.forEach(p => {
      p.y -= p.vy;
      if (p.y + 50 < 0) p.y = this.gridSize * this.cellSize + 50;
      ctx.beginPath();
      ctx.moveTo(p.x + p.shape[0][0], p.y + p.shape[0][1]);
      p.shape.slice(1).forEach(pt => ctx.lineTo(p.x + pt[0], p.y + pt[1]));
      ctx.closePath();
      ctx.fillStyle = this.colorSettings.particleColor.replace('0.08', p.alpha.toFixed(2));
      ctx.fill();
    });
    ctx.restore();
  },
  
  // Dessin des cellules
  drawCells: function(ctx) {
    const wiggle = 1.2;
    for (let y = 0; y < this.gridSize; y++) {
      for (let x = 0; x < this.gridSize; x++) {
        if (!this.grid[y][x]) continue;

        const age = this.ageGrid[y][x];
        const gray = Math.max(0, this.colorSettings.baseGray - age * this.colorSettings.ageDecay);
        const hex = this.colorSettings.baseColor;
const rBase = parseInt(hex.slice(1, 3), 16);
const gBase = parseInt(hex.slice(3, 5), 16);
const bBase = parseInt(hex.slice(5, 7), 16);

const maxAge = 20; // أقصى عمر يبلغه التدرج، يمكنك تعديله
const t = Math.min(age / maxAge, 1); // نسبة التقدم نحو اللون النهائي

const r = Math.round(255 - (255 - rBase) * t);
const g = Math.round(255 - (255 - gBase) * t);
const b = Math.round(255 - (255 - bBase) * t);

const cellColor = `rgba(${r},${g},${b},${this.colorSettings.cellAlpha})`;


        const cx = x * this.cellSize + this.cellSize / 2 + Math.sin((x + this.frame * 0.05)) * wiggle;
        const cy = y * this.cellSize + this.cellSize / 2 + Math.cos((y + this.frame * 0.05)) * wiggle;
        const pts = 18 + Math.floor(Math.random() * 3);
        const shape = [], halo = [];

        for (let i = 0; i < pts; i++) {
          const ang = i * 2 * Math.PI / pts;
          const r = this.cellSize / 2 - 1 + Math.random() * 2;
          const rh = r + 4;
          shape.push([cx + Math.cos(ang) * r, cy + Math.sin(ang) * r]);
          halo.push([cx + Math.cos(ang) * rh, cy + Math.sin(ang) * rh]);
        }

        ctx.beginPath();
        ctx.moveTo(halo[0][0], halo[0][1]);
        halo.slice(1).forEach(p => ctx.lineTo(p[0], p[1]));
        ctx.closePath();
        ctx.fillStyle = this.colorSettings.haloColor;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(shape[0][0], shape[0][1]);
        shape.slice(1).forEach(p => ctx.lineTo(p[0], p[1]));
        ctx.closePath();
        ctx.fillStyle = cellColor;
        ctx.fill();
      }
    }
  },
   // Mise à jour de la logique du jeu
  updateLogic: function() {
    for (let y = 0; y < this.gridSize; y++) {
      for (let x = 0; x < this.gridSize; x++) {
        let neighbors = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const ny = (y + dy + this.gridSize) % this.gridSize;
            const nx = (x + dx + this.gridSize) % this.gridSize;
            neighbors += this.grid[ny][nx];
          }
        }
        this.nextGrid[y][x] = this.grid[y][x] ? (neighbors === 2 || neighbors === 3) : (neighbors === 3);
        this.ageGrid[y][x] = this.nextGrid[y][x] ? (this.grid[y][x] ? this.ageGrid[y][x] + 1 : 1) : 0;
      }
    }
    [this.grid, this.nextGrid] = [this.nextGrid, this.grid];
  },
  
  // Mise à jour des statistiques
  updateStats: function() {
    let alive = 0;
    this.grid.forEach(row => row.forEach(c => alive += c));
    const pct = ((alive / (this.gridSize * this.gridSize)) * 100).toFixed(1);
    
    // Mise à jour des éléments DOM
    document.getElementById('cell-stats').textContent = 
      (document.documentElement.lang === 'fr') ? 
      `Cellules vivantes: ${alive} | Densité: ${pct}%` : 
      `الخلايا الحية: ${alive} | الكثافة: ${pct}%`;
    
    // Mise à jour des métadonnées
    this.metadata.simulation.current_generation = this.generation;
    this.metadata.simulation.alive_cells = alive;
    this.metadata.simulation.density_percentage = parseFloat(pct);
    
    return { alive, pct };
  },
  
  // Sauvegarde de la génération
  saveGeneration: function() {
    this.generationHistory.push({
      generation: this.generation,
      grid: this.grid.map(r => [...r])
    });
    this.generation++;
    
    // Mise à jour des éléments DOM
    document.getElementById('generation-info').textContent = 
      (document.documentElement.lang === 'fr') ? 
      `Génération actuelle: ${this.generation} | Stockées: ${this.generationHistory.length}` : 
      `الجيل الحالي: ${this.generation} | المخزّن: ${this.generationHistory.length}`;
  },
  
  // Comparaison des générations
  compareGenerations: function() {
    if (this.generationHistory.length < 2) {
      document.getElementById('comparison-result').textContent = 
        (document.documentElement.lang === 'fr') ? 
        "Au moins deux générations sont nécessaires pour la comparaison" : 
        "مطلوب على الأقل جيلين للمقارنة";
      return;
    }
    
    let found = null;
    for (let i = this.generationHistory.length - 2; i >= 0; i--) {
      const past = this.generationHistory[i].grid;
      if (past.every((r, y) => r.every((c, x) => c === this.grid[y][x]))) {
        found = this.generationHistory[i].generation;
        break;
      }
    }
    
    if (found !== null) {
      const diff = this.generation - found;
      if (document.documentElement.lang === 'fr') {
        document.getElementById('comparison-result').innerHTML = `
          <p>Correspondance avec la génération ${found}</p>
          <p>Différence: ${diff} génération${diff > 1 ? 's' : ''}</p>
        `;
      } else {
        document.getElementById('comparison-result').innerHTML = `
          <p>تطابق مع الجيل ${found}</p>
          <p>الفارق: ${diff} جيل${diff > 1 ? 'ات' : ''}</p>
        `;
      }
    } else {
      document.getElementById('comparison-result').textContent = 
        (document.documentElement.lang === 'fr') ? 
        "Aucune correspondance avec les générations précédentes" : 
        "لا يوجد تطابق مع أي جيل سابق";
    }
  },
  
  // Dessin d'une image
  drawFrame: function(ctx) {
    this.frame++;
    this.drawBackground(ctx);
    this.drawParticles(ctx);
    this.drawCells(ctx);
    this.updateStats();
    captureFrameForPreview(); // تسجيل الإطار للـ GIF
  },
  // Boucle principale
  loop: function() {
    if (!this.running) return;
    this.saveGeneration();
    this.updateLogic();
    this.drawFrame(ctx);
    
    // Utiliser setTimeout pour respecter exactement la vitesse de la simulation
    setTimeout(() => this.loop(), this.fps);
  },
  
  // Création du HTML du visualiseur avec le motif initial
 // Création du HTML du visualiseur avec le motif initial
createViewerHTML: function () {
  const initialGridJSON = JSON.stringify(this.initialGrid);
  const recordedGenerations = this.generationHistory.length;
  const finalRecordedGrid = recordedGenerations > 0 ?
      JSON.stringify(this.generationHistory[recordedGenerations-1].grid) :
      initialGridJSON;

  const cs = this.colorSettings; // raccourci

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Viewer of ${this.nftName}</title>
  <style>
    body {
      margin: 0;
      background: #111;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-family: 'Courier New', monospace;
      color: #eee;
    }
    canvas {
      margin-top: 120px;
      border-radius: 12px;
      box-shadow: 0 0 20px rgba(0,0,0,0.2);
      background: #000;
    }
    .controls {
      position: fixed;
      top: 10px;
      z-index: 10;
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      background: rgba(255,255,255,0.9);
      padding: 8px;
      border-radius: 8px;
      direction: ltr;
    }
    .controls button {
      background: #000;
      color: #fff;
      padding: 10px 20px;
      font-size: 16px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: .2s;
    }
    .controls button:hover {
      background: #333;
    }
    .info-panel {
      margin: 20px auto;
      padding: 15px;
      max-width: 800px;
      background: #222;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.5);
      direction: ltr;
    }
    .info-panel div {
      margin: 4px 0;
    }
  </style>
</head>
<body>

  <div class="controls">
    <button id="start-stop">▶️ Start/Stop</button>
    <button id="step">⏭️ One step</button>
    <button id="reset">↺ Reset</button>
  </div>

  <canvas id="canvas"></canvas>

  <div class="info-panel">
    <h2>${this.nftName}</h2>
    <h3>Simulation statistics</h3>
    <div id="total-generations">Recorded Generations: ${recordedGenerations}</div>
    <div id="generation-info">Current generation: 0</div>
    <div id="cell-stats">Living cells: 0 | Density: 0%</div>
  </div>

  <script>
    const colorSettings = {
      baseGray: ${cs.baseGray},
      ageDecay: ${cs.ageDecay},
      baseColor: "${cs.baseColor}",
      cellAlpha: ${cs.cellAlpha},
      haloColor: "${cs.haloColor}",
      particleColor: "${cs.particleColor}",
      backgroundRange: [${cs.backgroundRange[0]}, ${cs.backgroundRange[1]}],
      backgroundColor: "${cs.backgroundColor}",
      backgroundNoise: ${cs.backgroundNoise}
    };

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let grid = ${initialGridJSON};
	let nextGrid = grid.map(row => [...row]);
	let ageGrid = grid.map(row => row.map(() => 1));

    const gridSize = ${this.gridSize};
    const cellSize = ${this.cellSize};
    const canvasScale = ${this.canvasScale};

    canvas.width = gridSize * cellSize;
    canvas.height = gridSize * cellSize;

    
    let generation = 0;
    let frame = 0;
    let running = false;

    function drawBackground() {
      const img = ctx.createImageData(canvas.width, canvas.height);
      if (colorSettings.backgroundNoise) {
        const [minV, maxV] = colorSettings.backgroundRange;
        for (let i = 0; i < img.data.length; i += 4) {
          const v = minV + Math.random() * (maxV - minV);
          img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
          img.data[i + 3] = 255;
        }
      } else {
        const hex = colorSettings.backgroundColor;
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        for (let i = 0; i < img.data.length; i += 4) {
          img.data[i] = r;
          img.data[i + 1] = g;
          img.data[i + 2] = b;
          img.data[i + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
    }

    function drawCells() {
      const wiggle = 1.2;
      for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
          if (!grid[y][x]) continue;
          const age = ageGrid[y][x];
          const hex = colorSettings.baseColor;
          const rBase = parseInt(hex.slice(1, 3), 16);
          const gBase = parseInt(hex.slice(3, 5), 16);
          const bBase = parseInt(hex.slice(5, 7), 16);
          const t = Math.min(age / 20, 1);
          const r = Math.round(255 - (255 - rBase) * t);
          const g = Math.round(255 - (255 - gBase) * t);
          const b = Math.round(255 - (255 - bBase) * t);
          const cellColor = \`rgba(\${r},\${g},\${b},\${colorSettings.cellAlpha})\`;

          const cx = x * cellSize + cellSize / 2 + Math.sin((x + frame * 0.05)) * wiggle;
          const cy = y * cellSize + cellSize / 2 + Math.cos((y + frame * 0.05)) * wiggle;
          const pts = 18;
          const shape = [];
          const halo = [];

          for (let i = 0; i < pts; i++) {
            const ang = i * 2 * Math.PI / pts;
            const r1 = cellSize / 2 - 1 + Math.random() * 2;
            const r2 = r1 + 4;
            shape.push([cx + Math.cos(ang) * r1, cy + Math.sin(ang) * r1]);
            halo.push([cx + Math.cos(ang) * r2, cy + Math.sin(ang) * r2]);
          }

          ctx.beginPath();
          ctx.moveTo(halo[0][0], halo[0][1]);
          halo.slice(1).forEach(p => ctx.lineTo(p[0], p[1]));
          ctx.closePath();
          ctx.fillStyle = colorSettings.haloColor;
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(shape[0][0], shape[0][1]);
          shape.slice(1).forEach(p => ctx.lineTo(p[0], p[1]));
          ctx.closePath();
          ctx.fillStyle = cellColor;
          ctx.fill();
        }
      }
    }

    function updateLogic() {
      for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
          let neighbors = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (dx === 0 && dy === 0) continue;
              const ny = (y + dy + gridSize) % gridSize;
              const nx = (x + dx + gridSize) % gridSize;
              neighbors += grid[ny][nx];
            }
          }
          const next = grid[y][x] ? (neighbors === 2 || neighbors === 3) : (neighbors === 3);
          ageGrid[y][x] = next ? (grid[y][x] ? ageGrid[y][x] + 1 : 1) : 0;
          nextGrid[y][x] = next;
        }
      }
      [grid, nextGrid] = [nextGrid, grid];
    }
	
	const particles = [];
for (let i = 0; i < 100; i++) {
  const baseR = 5 + Math.random() * 2;
  const pts = 5 + Math.floor(Math.random() * 6);
  const shape = Array.from({ length: pts }, (_, j) => {
    const ang = (j / pts) * 2 * Math.PI;
    const rad = baseR * (0.5 + Math.random() * 0.5);
    return [Math.cos(ang) * rad, Math.sin(ang) * rad];
  });
  particles.push({
    x: Math.random() * (gridSize * cellSize),
    y: Math.random() * (gridSize * cellSize),
    shape,
    vy: 0.2 + Math.random() * 0.5,
    alpha: 0.05 + Math.random() * 0.1
  });
}

function drawParticles() {
  ctx.save();
  particles.forEach(p => {
    p.y -= p.vy;
    if (p.y + 50 < 0) p.y = gridSize * cellSize + 50;
    ctx.beginPath();
    ctx.moveTo(p.x + p.shape[0][0], p.y + p.shape[0][1]);
    p.shape.slice(1).forEach(pt => ctx.lineTo(p.x + pt[0], p.y + pt[1]));
    ctx.closePath();
    ctx.fillStyle = colorSettings.particleColor.replace('0.08', p.alpha.toFixed(2));
    ctx.fill();
  });
  ctx.restore();
}


    function drawFrame() {
      frame++;
      drawBackground();
	  drawParticles();
	  drawCells();
	  updateStats();

    }

    function updateStats() {
  let alive = 0;
  grid.forEach(row => row.forEach(c => alive += c));
  const pct = ((alive / (gridSize * gridSize)) * 100).toFixed(1);

  // تحديث الخلايا الحية والنسبة
  document.getElementById('cell-stats').textContent =
    'Living cells: ' + alive + ' | Density: ' + pct + '%';

  // تحديث العداد مع دعم MAX
  let displayGen;
  if (generation <= ${recordedGenerations}) {
    displayGen = generation;
  } else {
    const diff = generation - ${recordedGenerations};
    displayGen = ${recordedGenerations} + ' +' + diff;
  }

  document.getElementById('generation-info').textContent =
    'Current generation: ' + displayGen;
}


    function loop() {
      if (!running) return;
      generation++;
      updateLogic();
      drawFrame();
      setTimeout(loop, 50);
    }

    document.getElementById('start-stop').onclick = () => {
      running = !running;
      this.textContent = running ? '⏸️ Stop' : '▶️ Start';
      if (running) loop();
    };

    document.getElementById('step').onclick = () => {
      generation++;
      updateLogic();
      drawFrame();
    };

    document.getElementById('reset').onclick = () => {
      for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
          grid[y][x] = ${initialGridJSON}[y][x];
          ageGrid[y][x] = grid[y][x] ? 1 : 0;
        }
      }
      generation = 0;
      frame = 0;
      drawFrame();
    };

    drawFrame();
  </script>
</body>
</html>`;
},

arraysEqual: function(a, b) {
  for (let y = 0; y < a.length; y++)
    for (let x = 0; x < a[y].length; x++)
      if (a[y][x] !== b[y][x]) return false;
  return true;
},

inferFinalPatternType: function() {
  const history = this.generationHistory;
  if (history.length < 1) return "moving";

  const current = this.grid;
  const prev1 = history[history.length - 1].grid;
  const prev2 = history[history.length - 2]?.grid;

  if (this.arraysEqual(current, prev1)) {
    return "static";
  }
  if (prev2 && this.arraysEqual(current, prev2)) {
    return "oscillating";
  }
  return "moving";
},
  
  // Démarrage de l'enregistrement vidéo
  startRecording: function() {
    const toggleBtn = document.getElementById('toggle-record');
    const saveBtn = document.getElementById('save-video');
    
    if (!this.isRecording) {
      // Vérifier si MediaRecorder est disponible
      if (!window.MediaRecorder) {
        alert(document.documentElement.lang === 'fr' ? 
              'Votre navigateur ne prend pas en charge l\'enregistrement vidéo.' : 
              'متصفحك لا يدعم تسجيل الفيديو.');
        return;
      }
      
      try {
        // Démarrer l'enregistrement
        this.isRecording = true;
        this.recordedChunks = [];
        
        // Créer un flux vidéo à partir du canvas
        this.videoStream = canvas.captureStream(30); // 30 FPS pour une vidéo fluide
        
        // Configurer le MediaRecorder avec des options de haute qualité
        this.mediaRecorder = new MediaRecorder(this.videoStream, {
          mimeType: 'video/webm;codecs=vp9', // Codec VP9 pour une meilleure qualité
          videoBitsPerSecond: 5000000 // 5 Mbps pour une haute qualité
        });
        
        // Collecter les données
        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.recordedChunks.push(event.data);
          }
        };
        
        // Quand l'enregistrement est terminé
        this.mediaRecorder.onstop = () => {
          // Créer un blob avec toutes les données
          const videoBlob = new Blob(this.recordedChunks, { type: 'video/mp4' });
          
          // Activer le bouton de sauvegarde
          saveBtn.disabled = false;
          
          // Mise à jour des métadonnées
          this.metadata.export.timestamp = new Date().toISOString();
          this.metadata.export.file_size_bytes = videoBlob.size;
          
          // Afficher un message de succès
          if (document.documentElement.lang === 'fr') {
            toggleBtn.textContent = '⏺️ Démarrer l\'enregistrement';
            alert('Enregistrement terminé ! Cliquez sur "Enregistrer Vidéo" pour télécharger.');
          } else {
            toggleBtn.textContent = '⏺️ بدء التسجيل';
            alert('اكتمل التسجيل! انقر على "حفظ الفيديو" للتنزيل.');
          }
          
          // Stocker le blob pour le téléchargement
          this.videoBlob = videoBlob;
        };
        
        // Démarrer l'enregistrement
        this.mediaRecorder.start();
        
        // Mettre à jour le texte du bouton
        if (document.documentElement.lang === 'fr') {
          toggleBtn.textContent = '⏹️ Arrêter l\'enregistrement';
        } else {
          toggleBtn.textContent = '⏹️ إيقاف التسجيل';
        }
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement:', error);
        alert(document.documentElement.lang === 'fr' ? 
              'Erreur lors de l\'enregistrement: ' + error.message : 
              'خطأ في التسجيل: ' + error.message);
        this.isRecording = false;
      }
    } else {
      // Arrêter l'enregistrement
      this.isRecording = false;
      
      if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop();
      }
      
      // Mettre à jour le texte du bouton
      if (document.documentElement.lang === 'fr') {
        toggleBtn.textContent = '🔄 Traitement en cours...';
      } else {
        toggleBtn.textContent = '🔄 جاري المعالجة...';
      }
    }
    
    // Configurer le bouton de sauvegarde
    document.getElementById('save-video').onclick = () => {
      if (!this.videoBlob) return;
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(this.videoBlob);
      link.download = `life-${Date.now()}.mp4`;
      link.click();
      
      // Activer le bouton NFT
      document.getElementById('download-nft').disabled = false;
    };
  },
  
  // Exportation au format JSON
  exportJSON: function() {
    const data = {
      metadata: this.metadata,
      grid: this.grid,
      initialGrid: this.initialGrid,
      generation: this.generation,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `life-${Date.now()}.json`;
    link.click();
  },
  
  // Exportation au format NFT
exportNFT: function() {
    if (!this.videoBlob) {
        alert(document.documentElement.lang === 'fr' ? 
              'Veuillez d\'abord enregistrer une vidéo avant de créer un NFT.' : 
              'يرجى تسجيل فيديو أولاً قبل إنشاء NFT.');
        return;
    }

    try {
        this.metadata.nft_metadata.properties.total_generations = this.generation;
        this.metadata.nft_metadata.properties.animation_length_seconds = 
            (this.generation * this.fps) / 1000;

        const zip = new JSZip();
        zip.file("animation.mp4", this.videoBlob);
		const finalPattern = this.inferFinalPatternType();
		this.metadata.nft_metadata.properties.final_pattern_type = finalPattern;

		// ثم توليد الوصف بالإنجليزي:
		this.metadata.description =
		`This generative simulation explores life-like patterns on a ${this.metadata.simulation.grid_size}×${this.metadata.simulation.grid_size} grid, ` +
		`initial density ${Math.round(this.metadata.simulation.initial_density * 100)}%. ` +
		`It ran for ${this.metadata.nft_metadata.properties.total_generations} generations, ` +
		`ending with ${this.metadata.simulation.alive_cells} live cells ` +
		`(~${this.metadata.simulation.density_percentage}% of the grid) over ` +
		`${this.metadata.nft_metadata.properties.animation_length_seconds.toFixed(1)} seconds. ` +
		`Final pattern detected: ${finalPattern}.`;


        zip.file("metadata.json", JSON.stringify(this.metadata, null, 2));
        zip.file("viewer.html", this.createViewerHTML());

        // توليد معاينة GIF وإضافتها إلى ZIP
        generateGifPreview((previewURL, gifBlob) => {
            zip.file("preview.gif", gifBlob);
            
            zip.generateAsync({ type: "blob" })
                .then(content => {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(content);
                    link.download = `${this.nftName}.zip`;
                    link.click();
                })
                .catch(error => {
                    console.error('Error creating ZIP:', error);
                    alert('Error creating NFT package: ' + error.message);
                });
        });
    } catch (error) {
        console.error('Error in NFT export:', error);
        alert('Error in NFT export: ' + error.message);
    }
},
  // Exporter les 3 dernières générations sous forme de fichier JSON
exportFinalAsCells: function() {
  const finalGrid = this.grid; // الجيل الحالي
  let content = `!Name: ${this.nftName}\n`;
  content += `!Generated from Bioglyphs NFT Simulation\n`;

  for (let y = 0; y < finalGrid.length; y++) {
    let line = '';
    for (let x = 0; x < finalGrid[y].length; x++) {
      line += finalGrid[y][x] ? 'O' : '.';
    }
    content += line + '\n';
  }

  const blob = new Blob([content], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${this.nftName}.cells`;
  link.click();
},


  // Mise à jour de la vitesse
  updateSpeed: function(value) {
    this.fps = parseInt(value);
    document.getElementById('speed-value').textContent = `${value}ms`;
    this.metadata.simulation.speed_ms = this.fps;
  },
  
  // Mise à jour de la densité
  updateDensity: function(value) {
    this.activeProb = parseFloat(value);
    document.getElementById('density-value').textContent = `${(value * 100).toFixed(0)}%`;
    this.metadata.simulation.initial_density = this.activeProb;
  }
};

// Initialisation du jeu lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', function() {
  // ==== عناصر تحكم في حجم الشبكة والخلية ====
  if (indexInput) {
    const last = parseInt(localStorage.getItem("lastNFTIndex")) || 1;
    indexInput.value = last;
  }
  const controlContainer = document.querySelector('.controls');
  if (controlContainer) {
    const gridControl = document.createElement('div');
    gridControl.innerHTML = `
  <label style="margin-left: 10px;">
    📐 حجم الشبكة:
    <input type="number" id="grid-size" min="10" max="100" value="\${GameOfLife.gridSize}" style="width: 60px;" />
  </label>
  <label style="margin-left: 10px;">
    🧱 حجم الخلية:
    <input type="number" id="cell-size" min="2" max="20" value="\${GameOfLife.cellSize}" style="width: 60px;" />
  </label>
  <button id="apply-grid" style="margin-left: 10px;">🔁 تحديث</button>

  <input type="text" id="visual-preset-name" placeholder="اسم الإعداد" style="margin-left: 10px; width: 120px;" />
  <button id="save-visual-preset">💾 حفظ بصري</button>
  <select id="visual-preset-list" style="margin-left: 10px;">
    <option value="">اختر إعدادًا بصريًا</option>
  </select>
  <button id="load-visual-preset">📂 تحميل بصري</button>
`;

    controlContainer.appendChild(gridControl);
  }
	function updateVisualPresetList() {
  const select = document.getElementById('visual-preset-list');
  const presets = JSON.parse(localStorage.getItem("visualPresets") || "{}");
  select.innerHTML = '<option value="">اختر إعدادًا بصريًا</option>';
  for (let name in presets) {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  }
}

function rgbaToHex(rgba) {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match || match.length < 4) return '#ffffff';
  return '#' + match.slice(1, 4).map(c => parseInt(c).toString(16).padStart(2, '0')).join('');
}


updateVisualPresetList();

	function updateVisualDebugPanel() {
  const box = document.getElementById("visual-debug");
  if (!box || !GameOfLife || !GameOfLife.colorSettings) return;

  const settings = GameOfLife.colorSettings;
  box.textContent =
    `🎨 إعدادات بصرية:\n` +
//    `baseGray: ${settings.baseGray}\n` +
 //   `ageDecay: ${settings.ageDecay}\n` +
    `baseColor: ${settings.baseColor}\n` +
    `haloColor: ${settings.haloColor}\n` +
    `particleColor: ${settings.particleColor}\n` +
    `backgroundColor: ${settings.backgroundColor}\n` ;
 //   `cellAlpha: ${settings.cellAlpha}\n` +
    `backgroundNoise: ${settings.backgroundNoise}`;
}

  document.getElementById('apply-grid').onclick = function() {
    const newGridSize = parseInt(document.getElementById('grid-size').value);
    const newCellSize = parseInt(document.getElementById('cell-size').value);

    if (isNaN(newGridSize) || isNaN(newCellSize) || newGridSize < 10 || newGridSize > 100 || newCellSize < 2 || newCellSize > 40) {
      alert('⚠️ القيم غير صالحة');
      return;
    }

    // حفظ القيم في localStorage
    localStorage.setItem("gridSize", newGridSize);
    localStorage.setItem("cellSize", newCellSize);

    // إعادة تهيئة المحاكاة
    GameOfLife.init(newGridSize, newCellSize, 1);
    canvas.width = GameOfLife.gridSize * GameOfLife.cellSize;
    canvas.height = GameOfLife.gridSize * GameOfLife.cellSize;
    canvas.style.width = canvas.width + "px";
    canvas.style.height = canvas.height + "px";
    GameOfLife.drawFrame(ctx);

    // تحديث metadata
    if (GameOfLife.metadata) {
      GameOfLife.metadata.artwork.dimensions.width = newGridSize * newCellSize;
      GameOfLife.metadata.artwork.dimensions.height = newGridSize * newCellSize;
      GameOfLife.metadata.simulation.grid_size = newGridSize;
      GameOfLife.metadata.simulation.cell_size = newCellSize;
      GameOfLife.metadata.export.resolution.width = newGridSize * newCellSize;
      GameOfLife.metadata.export.resolution.height = newGridSize * newCellSize;
    }
  };
	updateVisualDebugPanel();

	// === إعدادات بصرية محفوظة ===
document.getElementById('save-visual-preset').onclick = function() {
  const name = document.getElementById('visual-preset-name').value.trim();
  if (!name) {
    alert("يرجى إدخال اسم صالح");
    return;
  }
  const settings = GameOfLife.colorSettings;
  const presets = JSON.parse(localStorage.getItem("visualPresets") || "{}");
  presets[name] = settings;
  localStorage.setItem("visualPresets", JSON.stringify(presets));
  updateVisualPresetList();
};

document.getElementById('load-visual-preset').onclick = function() {
  const name = document.getElementById('visual-preset-list').value;
  const presets = JSON.parse(localStorage.getItem("visualPresets") || "{}");
  if (!presets[name]) return;
  GameOfLife.colorSettings = presets[name];

  if (document.getElementById('baseGray')) document.getElementById('baseGray').value = presets[name].baseGray;
  if (document.getElementById('ageDecay')) document.getElementById('ageDecay').value = presets[name].ageDecay;
  if (document.getElementById('baseColor')) document.getElementById('baseColor').value = presets[name].baseColor;
  if (document.getElementById('haloColor')) document.getElementById('haloColor').value = rgbaToHex(presets[name].haloColor);
  if (document.getElementById('particleColor')) document.getElementById('particleColor').value = rgbaToHex(presets[name].particleColor);
  if (document.getElementById('backgroundColor')) document.getElementById('backgroundColor').value = presets[name].backgroundColor;
  if (document.getElementById('cellAlpha')) document.getElementById('cellAlpha').value = presets[name].cellAlpha;
  if (document.getElementById('toggleNoise')) document.getElementById('toggleNoise').checked = presets[name].backgroundNoise;

  GameOfLife.drawFrame(ctx);
  updateVisualDebugPanel();

};

  // Configuration initiale
  GameOfLife.init(35, 6, 1); // gridSize, cellSize, canvasScale
  
  // Configuration du canvas
  canvas.width = GameOfLife.gridSize * GameOfLife.cellSize;
  canvas.height = GameOfLife.gridSize * GameOfLife.cellSize;
  canvas.style.width = `${GameOfLife.gridSize * GameOfLife.cellSize}px`;
  canvas.style.height = `${GameOfLife.gridSize * GameOfLife.cellSize}px`;
  
  // Premier rendu
  GameOfLife.drawFrame(ctx);
  
 document.getElementById('generate').onclick = function() {
  GameOfLife.grid = GameOfLife.createGrid();
  GameOfLife.initialGrid = GameOfLife.grid.map(row => [...row]);

  const userIndex = document.getElementById('nft-index')?.value || 1;
  GameOfLife.nftName = GameOfLife.generateSerialName(userIndex);
  GameOfLife.metadata.name = GameOfLife.nftName;

  GameOfLife.nextGrid = GameOfLife.createGrid(0);
  GameOfLife.ageGrid = GameOfLife.createGrid(0);
  GameOfLife.generation = 0;
  GameOfLife.generationHistory = [];
  GameOfLife.frame = 0;
  GameOfLife.drawFrame(ctx);
  GameOfLife.updateGenerationInfo();
  GameOfLife.updateComparisonResult();
};

  
  document.getElementById('start-stop').onclick = function() {
    GameOfLife.running = !GameOfLife.running;
    this.textContent = GameOfLife.running ? 
      (document.documentElement.lang === 'fr' ? '⏸️ Arrêter' : '⏸️ إيقاف') : 
      (document.documentElement.lang === 'fr' ? '▶️ Démarrer' : '▶️ بدء');
    if (GameOfLife.running) {
      GameOfLife.loop();
    }
  };
  
  document.getElementById('step').onclick = function() {
    GameOfLife.saveGeneration();
    GameOfLife.updateLogic();
    GameOfLife.drawFrame(ctx);
  };
  
  document.getElementById('clear').onclick = function() {
    GameOfLife.grid = GameOfLife.createGrid(0);
    GameOfLife.ageGrid = GameOfLife.createGrid(0);
    GameOfLife.generation = 0;
    GameOfLife.generationHistory = [];
    GameOfLife.frame = 0;
    GameOfLife.drawFrame(ctx);
    GameOfLife.updateGenerationInfo();
    GameOfLife.updateComparisonResult();
  };
  
  document.getElementById('compare').onclick = function() {
    GameOfLife.compareGenerations();
  };
  
  document.getElementById('save').onclick = function() {
    const link = document.createElement('a');
    link.download = `life-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };
  
  document.getElementById('toggle-record').onclick = function() {
    GameOfLife.startRecording();
  };
  
  document.getElementById('save-video').onclick = function() {
    // Géré dans la fonction startRecording
  };
  
  document.getElementById('export-json').onclick = function() {
    GameOfLife.exportJSON();
  };
  
  document.getElementById('download-nft').onclick = function() {
  const indexInput = document.getElementById('nft-index');
  let index = parseInt(indexInput?.value);

  if (isNaN(index) || index < 1) {
    // إدخال غير صالح → استخدم الرقم المحفوظ
    index = parseInt(localStorage.getItem("lastNFTIndex")) || 1;
  }

  // تحديث الرقم المحفوظ في localStorage
  localStorage.setItem("lastNFTIndex", index + 1);

  // توليد الاسم وإدخاله في الحقل
  GameOfLife.nftName = GameOfLife.generateSerialName(index);
  GameOfLife.metadata.name = GameOfLife.nftName;
  if (indexInput) indexInput.value = index;

  GameOfLife.exportNFT();
};


  
  document.getElementById('speed').oninput = function(e) {
    GameOfLife.updateSpeed(e.target.value);
	
  };
  
  document.getElementById('density').oninput = function(e) {
    GameOfLife.updateDensity(e.target.value);
  };

  document.getElementById('export-cells').onclick = function() {
  GameOfLife.exportFinalAsCells();
};

});

// Fonctions utilitaires
GameOfLife.updateGenerationInfo = function() {
  const genInfo = document.getElementById('generation-info');
  if (document.documentElement.lang === 'fr') {
    genInfo.textContent = `Génération actuelle: ${this.generation} | Stockées: ${this.generationHistory.length}`;
  } else {
    genInfo.textContent = `الجيل الحالي: ${this.generation} | المخزّن: ${this.generationHistory.length}`;
  }
};

GameOfLife.updateComparisonResult = function() {
  const compareRes = document.getElementById('comparison-result');
  if (document.documentElement.lang === 'fr') {
    compareRes.textContent = 'Aucune comparaison effectuée';
  } else {
    compareRes.textContent = 'لم يتم إجراء أي مقارنة بعد';
  }
};

// === GIF Preview Generator ===
// === GIF Preview Generator ===
const gifPreviewFrames = [];
const maxPreviewFrames = 50;
const previewCanvas = document.createElement('canvas');
previewCanvas.width = 150;
previewCanvas.height = 150;
const previewCtx = previewCanvas.getContext('2d');

// تسجيل الإطارات للـ GIF
function captureFrameForPreview() {
    // نسخ مصغر من canvas الرئيسي
    previewCtx.clearRect(0, 0, 150, 150);
    previewCtx.drawImage(canvas, 0, 0, 150, 150);

    // حفظ نسخة من الصورة في الذاكرة
    const frame = previewCtx.getImageData(0, 0, 150, 150);
    gifPreviewFrames.push(frame);

    // الاحتفاظ بآخر 30 إطارًا فقط
    if (gifPreviewFrames.length > maxPreviewFrames) {
        gifPreviewFrames.shift();
    }
}

// توليد الـ GIF من الإطارات المسجلة
function generateGifPreview(callback) {
    const gif = new GIF({
        workers: 2,
        quality: 10,
        width: 150,
        height: 150,
        workerScript: 'js/lib/gif.worker.js'
    });

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 150;
    tempCanvas.height = 150;
    const tempCtx = tempCanvas.getContext('2d');

    for (let i = 0; i < gifPreviewFrames.length; i++) {
        tempCtx.putImageData(gifPreviewFrames[i], 0, 0);
        gif.addFrame(tempCanvas, {copy: true, delay: GameOfLife.fps}); // استخدام نفس سرعة المحاكاة
    }

    gif.on('finished', function(blob) {
        const previewURL = URL.createObjectURL(blob);
        callback(previewURL, blob);
    });

    gif.render();
};



// ====== التحكم من واجهة المستخدم ======
['baseGray', 'ageDecay', 'cellAlpha'].forEach(id => {
  document.getElementById(id).addEventListener('input', e => {
    GameOfLife.colorSettings[id] = parseFloat(e.target.value);
    updateVisualDebugPanel();
  });
});

document.getElementById('haloColor').oninput = function(e) {
  GameOfLife.colorSettings.haloColor = hexToRgba(e.target.value, 0.24);
  updateVisualDebugPanel();

  
};
document.getElementById('baseGray').oninput = function(e) {
  GameOfLife.colorSettings.baseGray = parseInt(e.target.value);
};
document.getElementById('ageDecay').oninput = function(e) {
  GameOfLife.colorSettings.ageDecay = parseInt(e.target.value);
};
document.getElementById('baseColor').oninput = function(e) {
  GameOfLife.colorSettings.baseColor = e.target.value;
  updateVisualDebugPanel();

};
document.getElementById('toggleNoise').oninput = function(e) {
  GameOfLife.colorSettings.backgroundNoise = e.target.checked;
  
};

document.getElementById('backgroundColor').oninput = function(e) {
  GameOfLife.colorSettings.backgroundColor = e.target.value;
  updateVisualDebugPanel();

};
document.getElementById('cellAlpha').oninput = function(e) {
  GameOfLife.colorSettings.cellAlpha = parseFloat(e.target.value);
};
document.getElementById('reset-colors').onclick = function() {
  // إعادة الإعدادات داخل الكائن
  GameOfLife.colorSettings = {
 
    baseColor: '#ffffff',
 
    haloColor: 'rgba(255,0,0,0.24)',
    particleColor: 'rgba(255,255,255,0.08)',
 
    backgroundColor: '#1e1e1e',
 //   backgroundNoise: true
  };

  // إعادة القيم إلى واجهة المستخدم (الحقول)
 // document.getElementById('baseGray').value = 255;
 // document.getElementById('ageDecay').value = 10;
  document.getElementById('baseColor').value = '#ffffff';
//  document.getElementById('cellAlpha').value = 1;
  document.getElementById('haloColor').value = '#ff0000';
  document.getElementById('particleColor').value = '#ffffff';
  document.getElementById('backgroundColor').value = '#1e1e1e';
//  document.getElementById('toggleNoise').checked = true;

  // إعادة الرسم بالإعدادات الجديدة
  GameOfLife.drawFrame(ctx);
};

document.getElementById('particleColor').oninput = function(e) {
  const hex = e.target.value;
  GameOfLife.colorSettings.particleColor = hexToRgba(hex, 0.08);
  updateVisualDebugPanel();

};

function hexToRgba(hex, alpha) {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}
function getNextNFTIndex() {
  const key = "lastNFTIndex";
  const current = parseInt(localStorage.getItem(key)) || 1;
  localStorage.setItem(key, current + 1);
  return current;
}
