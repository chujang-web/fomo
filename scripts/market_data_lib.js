const fs = require('node:fs/promises');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'public', 'data');
const SYMBOLS_PATH = path.join(__dirname, 'market_symbols.json');

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function compactDate(dateISO) {
  return String(dateISO).replaceAll('-', '');
}

async function readJson(filePath, fallback = null) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'));
  } catch (err) {
    if (fallback !== null) return fallback;
    throw err;
  }
}

async function writeJson(filePath, data) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function parseStooqCsv(csv) {
  const lines = String(csv).trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const header = lines[0].split(',').map(h => h.trim().toLowerCase());
  const dateIdx = header.indexOf('date');
  const closeIdx = header.indexOf('close');
  if (dateIdx < 0 || closeIdx < 0) return [];
  return lines.slice(1).map(line => {
    const cols = line.split(',');
    const date = cols[dateIdx];
    const close = Number(cols[closeIdx]);
    return { date, close };
  }).filter(row => row.date && Number.isFinite(row.close) && row.close > 0);
}

async function fetchText(url, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'user-agent': 'futurewealth-fomo-retire/1.0' }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

async function fetchStooqHistory(stooqSymbol, startDate = '2015-01-01', endDate = todayISO()) {
  const url = `https://stooq.com/q/d/l/?s=${encodeURIComponent(stooqSymbol)}&d1=${compactDate(startDate)}&d2=${compactDate(endDate)}&i=d`;
  const csv = await fetchText(url);
  const rows = parseStooqCsv(csv);
  if (!rows.length) throw new Error(`No Stooq rows for ${stooqSymbol}`);
  return rows;
}

async function fetchStooqLatest(stooqSymbol) {
  const rows = await fetchStooqHistory(stooqSymbol, '2020-01-01', todayISO());
  return rows[rows.length - 1];
}

async function fetchAlphaVantageLatest(symbol, apiKey) {
  if (!apiKey) throw new Error('ALPHA_VANTAGE_API_KEY is missing');
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${encodeURIComponent(apiKey)}`;
  const raw = await fetchText(url);
  const json = JSON.parse(raw);
  const quote = json['Global Quote'];
  const price = quote && Number(quote['05. price']);
  const date = quote && quote['07. latest trading day'];
  if (!Number.isFinite(price) || !date) throw new Error(`No Alpha Vantage quote for ${symbol}`);
  return { date, close: price };
}

function yearStartPrices(rows) {
  const result = {};
  for (const row of rows) {
    const year = String(row.date).slice(0, 4);
    if (!result[year]) result[year] = row.close;
  }
  return result;
}

function latestYearPrice(row) {
  return { year: String(row.date).slice(0, 4), price: row.close, date: row.date };
}

async function loadProjectData() {
  return {
    assets: await readJson(path.join(DATA_DIR, 'assets.json')),
    prices: await readJson(path.join(DATA_DIR, 'prices.json')),
    symbols: await readJson(SYMBOLS_PATH, {})
  };
}

async function appendUpdateLog(entry) {
  const logPath = path.join(DATA_DIR, 'update-log.json');
  const log = await readJson(logPath, []);
  log.unshift({ at: new Date().toISOString(), ...entry });
  await writeJson(logPath, log.slice(0, 100));
}

module.exports = {
  ROOT,
  DATA_DIR,
  todayISO,
  readJson,
  writeJson,
  fetchStooqHistory,
  fetchStooqLatest,
  fetchAlphaVantageLatest,
  yearStartPrices,
  latestYearPrice,
  loadProjectData,
  appendUpdateLog
};
