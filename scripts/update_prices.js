#!/usr/bin/env node
/*
  Daily price updater.

  What it does:
  - Reads public/data/assets.json and public/data/prices.json
  - Fetches latest close for mapped assets
  - Updates the current year value inside public/data/prices.json
  - Writes public/data/update-log.json for audit/debugging

  Default provider: Stooq, because it does not require an API key for many stocks/ETFs.
  Optional provider: Alpha Vantage for US-listed assets when ALPHA_VANTAGE_API_KEY is set.

  Usage:
    node scripts/update_prices.js
    PROVIDER=alphavantage ALPHA_VANTAGE_API_KEY=xxxx node scripts/update_prices.js
    DRY_RUN=1 node scripts/update_prices.js
*/

const path = require('node:path');
const {
  DATA_DIR,
  writeJson,
  fetchStooqLatest,
  fetchAlphaVantageLatest,
  latestYearPrice,
  loadProjectData,
  appendUpdateLog
} = require('./market_data_lib');

const PROVIDER = (process.env.PROVIDER || 'stooq').toLowerCase();
const DRY_RUN = process.env.DRY_RUN === '1' || process.env.DRY_RUN === 'true';
const API_KEY = process.env.ALPHA_VANTAGE_API_KEY || '';

async function latestForAsset(key, map) {
  if (PROVIDER === 'alphavantage' && map.alphaVantage) {
    return fetchAlphaVantageLatest(map.alphaVantage, API_KEY);
  }
  if (map.stooq) {
    return fetchStooqLatest(map.stooq);
  }
  throw new Error('no supported provider mapping');
}

async function main() {
  const { assets, prices, symbols } = await loadProjectData();
  const nextPrices = { ...prices };
  const report = { provider: PROVIDER, dryRun: DRY_RUN, ok: [], skipped: [], failed: [] };

  for (const key of Object.keys(assets)) {
    const map = symbols[key];
    if (!map || (!map.stooq && !map.alphaVantage)) {
      report.skipped.push({ key, reason: map?.note || 'no provider mapping' });
      continue;
    }

    try {
      const row = await latestForAsset(key, map);
      const { year, price, date } = latestYearPrice(row);
      nextPrices[key] = { ...(nextPrices[key] || {}), [year]: price };
      report.ok.push({ key, date, year, price });
      console.log(`OK ${key}: ${date} close=${price}`);
    } catch (err) {
      report.failed.push({ key, error: err.message });
      console.warn(`FAIL ${key}: ${err.message}`);
    }
  }

  if (!DRY_RUN) {
    await writeJson(path.join(DATA_DIR, 'prices.json'), nextPrices);
    await appendUpdateLog({ type: 'daily_update', report });
  }

  console.log('\nDaily update complete.');
  console.log(`Updated: ${report.ok.length}, skipped: ${report.skipped.length}, failed: ${report.failed.length}`);
  if (DRY_RUN) console.log('DRY_RUN=1, no files were changed.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
