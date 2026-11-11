document.addEventListener('DOMContentLoaded', async () => {
  const list = document.getElementById('historyList');
  const config = window.FINA_CONFIG || { API_BASE_URL: '', DEMO_MODE: true };
  const base = (config.API_BASE_URL || '').replace(/\/$/, '');
  const demo = config.DEMO_MODE !== false;
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
  const money = value => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 2 }).format(Math.abs(Number(value || 0)));
  const first = (...values) => values.find(value => value !== undefined && value !== null && value !== '');
  const asArray = value => Array.isArray(value) ? value : (Array.isArray(value?.items) ? value.items : []);
  const dateValue = item => first(item.createdAt, item.created_at, item.date, item.timestamp, item.updatedAt, item.updated_at, 0);
  const dateLabel = value => { const parsed = new Date(value); return Number.isNaN(parsed.getTime()) ? 'Date unavailable' : parsed.toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' }); };
  const pvMarked = item => item.preview === true || item.isPreview === true || item.mode === 'preview' || /\bpreview\b/i.test(String(first(item.type, item.description, item.note, item.status, '')));
  const label = value => String(value || '').replace(/\bpreview\b/gi, 'PV');
  function render(rows) {
    if (!rows.length) { list.innerHTML = '<div class="history-empty">No transactions have been recorded for this account yet.</div>'; return; }
    rows.sort((a, b) => new Date(dateValue(b)).getTime() - new Date(dateValue(a)).getTime());
    list.replaceChildren();
    rows.forEach(item => {
      const type = String(first(item.type, item.transactionType, item.transaction_type, item.description, item.service, item.category, 'Transaction'));
      const status = String(first(item.status, item.state, 'Recorded'));
      const amount = Number(first(item.amount, item.value, item.total, 0));
      const negative = /withdraw|airtime|data|betting|debit|payment|purchase|transfer out/i.test(type) || String(item.direction || '').toLowerCase() === 'debit';
      const row = document.createElement('article'); row.className = 'history-item';
      const icon = document.createElement('span'); icon.className = 'history-icon'; icon.textContent = /withdraw|debit|transfer out/i.test(type) ? '↓' : /welcome|bonus|credit|deposit|transfer in/i.test(type) ? '↑' : '↗';
      const main = document.createElement('div'); main.className = 'history-main';
      const title = document.createElement('strong'); title.textContent = label(type.replace(/^service request\s*[—-]\s*/i, 'Service request — ')).replace(/\s*\(PV\)\s*/gi, ' ').replace(/\bpreview\b/gi, '').trim();
      const meta = document.createElement('small'); meta.textContent = dateLabel(dateValue(item));
      main.append(title, meta);
      const side = document.createElement('div'); side.className = 'history-side';
      const value = document.createElement('div'); value.className = 'history-amount'; value.textContent = (negative && amount > 0 ? '−' : amount > 0 ? '+' : '') + money(amount);
      const state = document.createElement('small'); state.className = 'history-status ' + (/success|complete|received|approved/i.test(status) ? 'success' : /fail|declin|reject|cancel/i.test(status) ? 'failed' : ''); state.textContent = pvMarked(item) ? '' : label(status);
      side.append(value); if (pvMarked(item)) { const badge = document.createElement('small'); badge.className = 'history-status history-pv'; badge.textContent = 'PV'; side.append(badge); } else if (state.textContent) { side.append(state); } row.append(icon, main, side); list.append(row);
    });
  }
  try {
    let rows = [];
    if (demo) {
      const user = read('fina_demo_user', null);
      if (!user) { location.replace('index.html'); return; }
      rows = asArray(read('fina_demo_transactions', [])).concat(asArray(read('fina_demo_withdrawals', []))).filter(item => !item.email || !user.email || String(item.email).toLowerCase() === String(user.email).toLowerCase());
    } else {
      if (!base) throw new Error('Account service is not connected.');
      const response = await fetch(base + '/api/dashboard', { credentials: 'include', headers: { Accept: 'application/json' } });
      if (response.status === 401) { location.replace('index.html'); return; }
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.message || payload.error || 'Could not load transaction history.');
      const data = payload.data && typeof payload.data === 'object' ? payload.data : payload;
      const sources = [data.transactions, data.allTransactions, data.recentActivity, data.activity, data.history, data.withdrawals, data.deposits, payload.transactions, payload.allTransactions, payload.recentActivity];
      const seen = new Set();
      rows = sources.flatMap(asArray).filter(item => { const key = String(first(item.id, item._id, item.reference, item.transactionId, JSON.stringify([dateValue(item), item.amount, item.type, item.description, item.status]))); if (seen.has(key)) return false; seen.add(key); return true; });
    }
    render(rows);
  } catch (error) {
    list.replaceChildren(); const message = document.createElement('div'); message.className = 'history-empty'; message.textContent = error.message || 'Unable to load transaction history.'; list.append(message);
  }
});
