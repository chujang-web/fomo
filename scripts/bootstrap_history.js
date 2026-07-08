#!/usr/bin/env node
/*
  One-time historical data bootstrap.

  This script downloads daily prices and converts them into the annual January/first-trading-day
  price format used by the current calculator. Run this only when initially preparing or
  rebuilding public/data/prices.json.

  Usage:
    node scripts/bootstrap_history.js
    START_DATE=2010-01-01 node scripts/bootstrap_history.js
*/

const path = require('node:path');
const {
  DATA_DIR,
  writeJson,
  fetchStooqHistory,
  yearStartPrices,
  loadProjectData,
  appendUpdateLog,
  todayISO
} = require('./market_data_lib');

const START_DATE = process.env.START_DATE || '2015-01-01';
const END_DATE = process.env.END_DATE || todayISO();

async function main() {
  const { assets, prices, symbols } = await loadProjectData();
  const nextPrices = { ...prices };
  const report = { ok: [], skipped: [], failed: [] };

  for (const key of Object.keys(assets)) {
    const map = symbols[key];
    if (!map || !map.stooq) {
      report.skipped.push({ key, reason: 'no stooq symbol mapping' });
      continue;
    }

    try {
      const rows = await fetchStooqHistory(map.stooq, START_DATE, END_DATE);
      const annual = yearStartPrices(rows);
      nextPrices[key] = { ...(nextPrices[key] || {}), ...annual };
      report.ok.push({ key, symbol: map.stooq, years: Object.keys(annual).length });
      console.log(`OK ${key} ${map.stooq}: ${Object.keys(annual).length} years`);
    } catch (err) {
      report.failed.push({ key, symbol: map.stooq, error: err.message });
      console.warn(`FAIL ${key} ${map.stooq}: ${err.message}`);
    }
  }

  await writeJson(path.join(DATA_DIR, 'prices.json'), nextPrices);
  await appendUpdateLog({ type: 'bootstrap_history', startDate: START_DATE, endDate: END_DATE, report });

  console.log('\nHistory bootstrap complete.');
  console.log(`Updated: ${report.ok.length}, skipped: ${report.skipped.length}, failed: ${report.failed.length}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
