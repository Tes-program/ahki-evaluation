const express = require('express');
const cors    = require('cors');
const fs      = require('fs');
const path    = require('path');

const app      = express();
const PORT     = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());

// Serve index.html and any static assets from the same directory
app.use(express.static(path.join(__dirname, 'public')));

// ── GET /api/data ──────────────────────────────────────────────────────────
// Returns the persisted evaluation data as JSON.
// If the file doesn't exist yet, returns an empty object so the frontend
// gracefully renders with all blank editable cells.
app.get('/api/data', (req, res) => {
  if (!fs.existsSync(DATA_FILE)) {
    return res.json({});
  }
  try {
    const raw  = fs.readFileSync(DATA_FILE, 'utf8');
    const data = JSON.parse(raw);
    res.json(data);
  } catch (err) {
    console.error('Error reading data.json:', err.message);
    res.status(500).json({ error: 'Failed to read data file.' });
  }
});

// ── POST /api/data ─────────────────────────────────────────────────────────
// Accepts a JSON body and writes it to data.json, completely replacing the
// previous contents. Simple atomic write — fine for single-user eval tools.
app.post('/api/data', (req, res) => {
  const payload = req.body;

  if (!payload || typeof payload !== 'object') {
    return res.status(400).json({ error: 'Invalid payload — expected a JSON object.' });
  }

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(payload, null, 2), 'utf8');
    res.json({ ok: true, savedAt: new Date().toISOString() });
  } catch (err) {
    console.error('Error writing data.json:', err.message);
    res.status(500).json({ error: 'Failed to write data file.' });
  }
});

// ── Fallback: serve index.html for any unmatched route ────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Yahshud Eval running → http://localhost:${PORT}`);
});
