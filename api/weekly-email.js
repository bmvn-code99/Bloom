// api/weekly-email.js
// Vercel serverless function — triggered every Friday at 18:00 by cron-job.org
// Reads activity log from Supabase, builds HTML email, sends via Resend

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL      = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const RESEND_API_KEY    = process.env.RESEND_API_KEY;

const ADMIN_EMAILS = [
  'bmvn@mail.co.uk',
  'nmogilda@sopris.tech',
  'sitiosaramandala@gmail.com'
];

const ADMINS = ['Bruno', 'Natalia', 'Felipe'];
const DAYS   = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// ── Week helpers ──────────────────────────────────────────────
function getWeekKey(date) {
  const d   = new Date(date);
  const jan = new Date(d.getFullYear(), 0, 1);
  const wk  = Math.ceil((((d - jan) / 86400000) + jan.getDay() + 1) / 7);
  return d.getFullYear() + '-W' + String(wk).padStart(2, '0');
}

function getMonDaySunOfWeek(weekKey) {
  const [year, wStr] = weekKey.split('-W');
  const wNum = parseInt(wStr);
  const jan  = new Date(parseInt(year), 0, 1);
  const dayOfWeek = jan.getDay() || 7;
  const monday = new Date(jan);
  monday.setDate(jan.getDate() + (wNum - 1) * 7 - (dayOfWeek - 1));
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d);
  }
  return days;
}

function fmtDay(date) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return DAYS[date.getDay() === 0 ? 6 : date.getDay() - 1] + ' ' + date.getDate() + ' ' + months[date.getMonth()];
}

// ── Build the email HTML ──────────────────────────────────────
function buildEmailHtml(weekKey, logs, weekDays) {
  const C = {
    bg:     '#1C0F07',
    card:   '#2A1508',
    gold:   '#C9A84C',
    light:  '#E8D5A3',
    muted:  '#8A7A6A',
    border: '#3D2010',
    bruno:  '#C9A84C',
    natalia:'#A87C4F',
    felipe: '#7A9E7E',
  };

  // Group logs by day → admin
  const grid = {}; // grid[dayISO][adminName] = [action strings]
  for (const log of logs) {
    const d = new Date(log.timestamp);
    const dayISO = d.toISOString().split('T')[0];
    if (!grid[dayISO]) grid[dayISO] = {};
    if (!grid[dayISO][log.admin_name]) grid[dayISO][log.admin_name] = [];
    const actionEmoji = log.action_type === 'added' ? '＋' : log.action_type === 'deleted' ? '✕' : log.action_type === 'restored' ? '↩' : '✎';
    grid[dayISO][log.admin_name].push(actionEmoji + ' ' + log.item_name + ' <span style="color:' + C.muted + ';font-size:10px">(' + log.section + ')</span>');
  }

  const adminColors = { Bruno: C.bruno, Natalia: C.natalia, Felipe: C.felipe };

  const totalActions = logs.length;
  const byAdmin = {};
  for (const a of ADMINS) byAdmin[a] = logs.filter(l => l.admin_name === a).length;

  const headerRow = ADMINS.map(a =>
    `<th style="padding:10px 14px;text-align:left;color:${adminColors[a]};font-size:11px;letter-spacing:1.5px;text-transform:uppercase;border-bottom:1px solid ${C.border};font-weight:600">${a}</th>`
  ).join('');

  const dataRows = weekDays.map((date, di) => {
    const dayISO = date.toISOString().split('T')[0];
    const isToday = dayISO === new Date().toISOString().split('T')[0];
    const rowBg = di % 2 === 0 ? C.card : '#241006';
    const cells = ADMINS.map(a => {
      const actions = (grid[dayISO] && grid[dayISO][a]) || [];
      const cellContent = actions.length > 0
        ? actions.map(ac => `<div style="margin-bottom:3px;font-size:11px;line-height:1.4;color:${C.light}">${ac}</div>`).join('')
        : `<span style="color:${C.border};font-size:11px">—</span>`;
      return `<td style="padding:10px 14px;border-bottom:1px solid ${C.border};vertical-align:top">${cellContent}</td>`;
    }).join('');
    return `<tr style="background:${rowBg}">
      <td style="padding:10px 14px;border-bottom:1px solid ${C.border};white-space:nowrap;color:${isToday ? C.gold : C.muted};font-size:11px;font-weight:${isToday?'600':'400'}">${fmtDay(date)}${isToday ? ' ◀' : ''}</td>
      ${cells}
    </tr>`;
  }).join('');

  const summaryCards = ADMINS.map(a =>
    `<div style="flex:1;background:${C.card};border:1px solid ${C.border};border-radius:10px;padding:16px;text-align:center">
      <div style="color:${adminColors[a]};font-size:22px;font-weight:600">${byAdmin[a]}</div>
      <div style="color:${C.muted};font-size:10px;letter-spacing:1.5px;text-transform:uppercase;margin-top:4px">${a}</div>
    </div>`
  ).join('');

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${C.bg};font-family:'Georgia',serif">
  <div style="max-width:680px;margin:0 auto;padding:32px 16px">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px">
      <img src="https://res.cloudinary.com/dhjsldh2q/image/upload/v1772914730/bloom_logo.png" width="64" height="64" style="border-radius:50%;margin-bottom:12px" />
      <div style="color:${C.gold};font-size:22px;letter-spacing:3px;text-transform:uppercase">BLOOM</div>
      <div style="color:${C.muted};font-size:11px;letter-spacing:2px;margin-top:4px">Weekly Activity Report</div>
      <div style="color:${C.muted};font-size:11px;margin-top:8px">${weekKey.replace('W', 'Week ')} · ${fmtDay(weekDays[0])} – ${fmtDay(weekDays[6])}</div>
    </div>

    <!-- Summary cards -->
    <div style="display:flex;gap:12px;margin-bottom:28px">
      <div style="flex:1;background:${C.card};border:1px solid ${C.border};border-radius:10px;padding:16px;text-align:center">
        <div style="color:${C.gold};font-size:22px;font-weight:600">${totalActions}</div>
        <div style="color:${C.muted};font-size:10px;letter-spacing:1.5px;text-transform:uppercase;margin-top:4px">Total Actions</div>
      </div>
      ${summaryCards}
    </div>

    <!-- Activity grid -->
    <div style="background:${C.card};border:1px solid ${C.border};border-radius:12px;overflow:hidden;margin-bottom:28px">
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="background:#1A0C05">
            <th style="padding:10px 14px;text-align:left;color:${C.muted};font-size:11px;letter-spacing:1.5px;text-transform:uppercase;border-bottom:1px solid ${C.border};font-weight:400">Day</th>
            ${headerRow}
          </tr>
        </thead>
        <tbody>
          ${dataRows}
        </tbody>
      </table>
    </div>

    <!-- Footer -->
    <div style="text-align:center;color:${C.border};font-size:10px;letter-spacing:1px">
      BLOOM Investment Tracker · Automated weekly digest · Every Friday at 18:00
    </div>

  </div>
</body>
</html>`;
}

// ── Main handler ──────────────────────────────────────────────
module.exports = async function handler(req, res) {
  // Allow manual GET trigger for testing, plus the cron POST
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Get current week key
    const weekKey  = getWeekKey(new Date());
    const weekDays = getMonDaySunOfWeek(weekKey);

    // Fetch this week's activity log
    const { data: logs, error: logErr } = await supabase
      .from('activity_log')
      .select('*')
      .eq('week_key', weekKey)
      .order('timestamp', { ascending: true });

    if (logErr) throw new Error('Supabase error: ' + logErr.message);

    const html = buildEmailHtml(weekKey, logs || [], weekDays);

    // Send via Resend
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + RESEND_API_KEY,
      },
      body: JSON.stringify({
        from:    'BLOOM <onboarding@resend.dev>',
        to:      ADMIN_EMAILS,
        subject: 'BLOOM · Weekly Activity · ' + weekKey,
        html:    html,
      }),
    });

    const emailData = await emailRes.json();

    if (!emailRes.ok) throw new Error('Resend error: ' + JSON.stringify(emailData));

    return res.status(200).json({
      success: true,
      week:    weekKey,
      actions: (logs || []).length,
      emailId: emailData.id,
    });

  } catch (err) {
    console.error('[BLOOM] weekly-email error:', err);
    return res.status(500).json({ error: err.message });
  }
};
