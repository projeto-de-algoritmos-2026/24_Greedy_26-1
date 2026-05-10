// ═══════════════════════════════
// utils.js — Funções utilitárias de tempo
// ═══════════════════════════════

/**
 * Converte string "HH:MM" para total de minutos.
 * Ex: "08:30" → 510
 */
function timeToMinutes(timeStr) {
  var partes = timeStr.split(':');
  return parseInt(partes[0]) * 60 + parseInt(partes[1]);
}

/**
 * Converte total de minutos para string "HH:MM".
 * Ex: 510 → "08:30"
 */
function minutesToTime(min) {
  var h = Math.floor(min / 60);
  var m = min % 60;
  return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
}
