function expandirDisciplinas(discs) {
  var intervalos = [];
  for (var i = 0; i < discs.length; i++) {
    var d = discs[i];
    for (var j = 0; j < d.dias.length; j++) {
      intervalos.push({
        disciplinaId: d.id,
        nome: d.nome,
        cor: d.cor,
        dia: d.dias[j],
        inicio: d.inicio,
        fim: d.fim,
        inicioMin: timeToMinutes(d.inicio),
        fimMin: timeToMinutes(d.fim),
        coluna: -1,
        totalColunasDia: 1
      });
    }
  }
  return intervalos;
}

function gerarGrade() {
  if (estado.disciplinas.length === 0) return;

  var todosIntervalos = expandirDisciplinas(estado.disciplinas);
  var logs = [];
  var totalConflitos = 0;
  var maxColunas = 0;

  var porDia = {};
  for (var i = 0; i < DIAS.length; i++) {
    porDia[DIAS[i]] = [];
  }
  for (var j = 0; j < todosIntervalos.length; j++) {
    porDia[todosIntervalos[j].dia].push(todosIntervalos[j]);
  }

  for (var d = 0; d < DIAS.length; d++) {
    var dia = DIAS[d];
    var intervalosDia = porDia[dia];
    if (intervalosDia.length === 0) continue;

    logs.push({ text: '', type: 'separator' });
    logs.push({ text: '── ' + DIAS_NOMES[dia] + ' ───────────────────────', type: 'header' });

    var res = intervalPartition(intervalosDia);
    logs = logs.concat(res.log);

    logs.push({
      text: '  → ' + DIAS_NOMES[dia] + ': ' + res.numColunas + ' coluna(s), ' + res.conflitos + ' conflito(s)',
      type: 'result'
    });

    totalConflitos += res.conflitos;
    if (res.numColunas > maxColunas) maxColunas = res.numColunas;
  }

  logs.push({ text: '', type: 'separator' });
  logs.push({ text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', type: 'separator' });
  logs.push({ text: 'Resultado Final', type: 'result' });
  logs.push({ text: '   Disciplinas: ' + estado.disciplinas.length, type: 'result' });
  logs.push({ text: '   Intervalos: ' + todosIntervalos.length, type: 'result' });
  logs.push({ text: '   Colunas paralelas (máx): ' + maxColunas, type: 'result' });
  logs.push({ text: '   Conflitos: ' + totalConflitos, type: 'result' });
  logs.push({ text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', type: 'separator' });

  estado.resultado = {
    todosIntervalos: todosIntervalos,
    porDia: porDia,
    totalConflitos: totalConflitos,
    maxColunas: maxColunas,
    logs: logs
  };

  renderizarResumo();
  renderizarGrade();
  renderizarLog();
}
