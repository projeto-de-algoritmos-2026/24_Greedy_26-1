// ═══════════════════════════════
// render/painelResumo.js — Renderiza o painel de resumo estatístico
// ═══════════════════════════════
// Depende de: estado.js

/**
 * Atualiza o painel de resumo com os dados do resultado.
 * Esconde o painel se não houver resultado.
 */
function renderizarResumo() {
  var $cardResumo = document.getElementById('card-resumo');
  var $resumoDisc = document.getElementById('resumo-disciplinas');
  var $resumoIntervalos = document.getElementById('resumo-intervalos');
  var $resumoColunas = document.getElementById('resumo-colunas');
  var $resumoConflitos = document.getElementById('resumo-conflitos');
  var $resumoConflitosBox = document.getElementById('resumo-conflitos-box');

  if (!estado.resultado) {
    $cardResumo.hidden = true;
    return;
  }

  $cardResumo.hidden = false;
  $resumoDisc.textContent = estado.disciplinas.length;
  $resumoIntervalos.textContent = estado.resultado.todosIntervalos.length;
  $resumoColunas.textContent = estado.resultado.maxColunas;
  $resumoConflitos.textContent = estado.resultado.totalConflitos;

  if (estado.resultado.totalConflitos > 0) {
    $resumoConflitosBox.classList.add('tem-conflito');
  } else {
    $resumoConflitosBox.classList.remove('tem-conflito');
  }
}
