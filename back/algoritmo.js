function intervalPartition(intervalosDoDia) {
  var log = [];

  intervalosDoDia.sort(function (a, b) {
    if (a.inicioMin !== b.inicioMin) return a.inicioMin - b.inicioMin;
    return a.fimMin - b.fimMin;
  });

  log.push({ text: 'Ordenando intervalos por horário de início...', type: 'header' });

  var colunas = []; 
  var conflitos = 0;

  for (var i = 0; i < intervalosDoDia.length; i++) {
    var intervalo = intervalosDoDia[i];
    var alocado = false;

    log.push({
      text: 'Analisando ' + intervalo.nome + ' em ' + DIAS_NOMES[intervalo.dia] + ' ' + intervalo.inicio + '–' + intervalo.fim,
      type: 'header'
    });

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
