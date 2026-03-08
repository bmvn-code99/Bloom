import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── ISO Week Key helper ────────────────────────────────────────
function getWeekKey() {
  const now = new Date();
  const jan1 = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil((((now - jan1) / 86400000) + jan1.getDay() + 1) / 7);
  return now.getFullYear() + '-W' + String(week).padStart(2, '0');
}

// ─── Data Layer ─────────────────────────────────────────────────
export const db = {

  // Load ALL app state from Supabase (returns flat key→value object)
  async loadAll() {
    const { data, error } = await supabase
      .from('app_state')
      .select('key, value');
    if (error) { console.error('[BLOOM] Supabase load error:', error); return null; }
    const result = {};
    for (const row of data) result[row.key] = row.value;
    return result;
  },

  // Upsert a single key into app_state
  async saveState(key, value, adminName) {
    const { error } = await supabase
      .from('app_state')
      .upsert({
        key,
        value,
        updated_by: adminName || 'system',
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });
    if (error) console.error('[BLOOM] Supabase save error:', key, error);
  },

  // Write an activity log entry
  async logActivity(adminName, actionType, section, itemName, oldValue, newValue) {
    const { error } = await supabase.from('activity_log').insert({
      admin_name: adminName,
      action_type: actionType,
      section: section,
      item_name: itemName,
      old_value: oldValue || null,
      new_value: newValue || null,
      week_key: getWeekKey()
    });
    if (error) console.error('[BLOOM] Activity log error:', error);
  },

  // Try to acquire an item lock.
  // Returns { success: true } or { success: false, lockedBy: 'AdminName' }
  async acquireLock(itemKey, adminName) {
    // Clear stale locks (older than 5 minutes)
    await supabase
      .from('item_locks')
      .delete()
      .lt('locked_at', new Date(Date.now() - 5 * 60 * 1000).toISOString());

    // Check for existing lock
    const { data: existing, error: checkErr } = await supabase
      .from('item_locks')
      .select('locked_by')
      .eq('item_key', itemKey)
      .maybeSingle();

    if (checkErr) return { success: true }; // fail open if Supabase unreachable
    if (existing) return { success: false, lockedBy: existing.locked_by };

    // Acquire
    const { error: lockErr } = await supabase
      .from('item_locks')
      .insert({ item_key: itemKey, locked_by: adminName, locked_at: new Date().toISOString() });

    return { success: !lockErr };
  },

  // Release a specific lock
  async releaseLock(itemKey) {
    await supabase.from('item_locks').delete().eq('item_key', itemKey);
  },

  // Release all locks held by an admin (called on login + logout)
  async releaseAllLocksByAdmin(adminName) {
    await supabase.from('item_locks').delete().eq('locked_by', adminName);
  }
};
