// ═══════════════════════════════
// algoritmo.js — Algoritmo Greedy: Interval Partition
// ═══════════════════════════════
// Depende de: data.js (DIAS_NOMES), utils.js (minutesToTime)

/**
 * Executa o algoritmo Interval Partition em um conjunto de intervalos
 * de um mesmo dia.
 *
 * Estratégia gulosa: ordena por horário de início e tenta alocar
 * cada intervalo na primeira coluna cujo último intervalo já terminou.
 * Se nenhuma coluna está livre, cria uma nova (= conflito).
 *
 * @param {Array} intervalosDoDia - intervalos já expandidos de um dia
 * @returns {{ numColunas: number, conflitos: number, log: Array }}
 */
function intervalPartition(intervalosDoDia) {
  var log = [];

  // Ordena por horário de início (greedy: earliest start first)
  intervalosDoDia.sort(function (a, b) {
    if (a.inicioMin !== b.inicioMin) return a.inicioMin - b.inicioMin;
    return a.fimMin - b.fimMin;
  });

  log.push({ text: 'Ordenando intervalos por horário de início...', type: 'header' });

  var colunas = [];   // colunas[c] = horário de fim do último intervalo alocado na coluna c
  var conflitos = 0;

  for (var i = 0; i < intervalosDoDia.length; i++) {
    var intervalo = intervalosDoDia[i];
    var alocado = false;

    log.push({
      text: 'Analisando ' + intervalo.nome + ' em ' + DIAS_NOMES[intervalo.dia] + ' ' + intervalo.inicio + '–' + intervalo.fim,
      type: 'header'
    });

    // Tenta alocar em uma coluna existente cuja última aula já terminou
    for (var c = 0; c < colunas.length; c++) {
      if (colunas[c] <= intervalo.inicioMin) {
        colunas[c] = intervalo.fimMin;
        intervalo.coluna = c;
        alocado = true;

        log.push({
          text: '  Coluna ' + (c + 1) + ' está livre (termina às ' + minutesToTime(colunas[c]) + '), reutilizando coluna ' + (c + 1),
          type: 'success'
        });
        break;
      }
    }

    // Nenhuma coluna livre → cria nova (conflito se já existe pelo menos uma)
    if (!alocado) {
      colunas.push(intervalo.fimMin);
      intervalo.coluna = colunas.length - 1;

      if (colunas.length > 1) {
        conflitos++;
        log.push({
          text: '  Conflito detectado! Nenhuma coluna livre, criando coluna ' + colunas.length,
          type: 'conflict'
        });
      } else {
        log.push({
          text: '  Nenhuma coluna existente, criando coluna 1',
          type: 'success'
        });
      }
    }
  }

  // Propaga o total de colunas do dia para cada intervalo
  for (var k = 0; k < intervalosDoDia.length; k++) {
    intervalosDoDia[k].totalColunasDia = colunas.length;
  }

  return {
    numColunas: colunas.length,
    conflitos: conflitos,
    log: log
  };
}
