import {DIAS_NOMES,DIAS,GRADE_FIM,GRADE_INICIO,SLOT_MINUTOS} from "./data.js"
//usando os dados de data.js, que serão estáveis e constantes:

function intervalPartition(intervalosDoDia) {
    var log = [];
    var colunas = [];
    var conflitos = 0;

    intervalosDoDia.sort(function (a, b) {
      if (a.inicioMin !== b.inicioMin) return a.inicioMin - b.inicioMin;
      return a.fimMin - b.fimMin;
    });
  
    log.push({ text: 'ordenando', type: 'header' });
  

  
    for (var i = 0; i < intervalosDoDia.length; i++) {
      var intervalo = intervalosDoDia[i];
      var alocado = false;
  
      log.push({
        text: 'entrou no for 1', 
        type: 'header'
      });
  
      for (var c = 0; c < colunas.length; c++) {
        if (colunas[c] <= intervalo.inicioMin) {
          colunas[c] = intervalo.fimMin;
          intervalo.coluna = c;
          alocado = true;
  
          log.push({
            text: '  coluna ' + (c + 1) + ' ta livre (termina as ' + minutesToTime(colunas[c]),
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
            text: ' 1 clonflito, cria col ' + colunas.length,
            type: 'conflict'
          });
        } else {
          log.push({
            text: ' nenhuma ex, cria col 1',
            type: 'success'
          });
        }
      }
    }
  
    for (var k = 0; k < intervalosDoDia.length; k++) {
      intervalosDoDia[k].totalColunasDia = colunas.length;
    }
  
    return {
      numColunas: colunas.length,
      conflitos: conflitos,
      log: log
    };
  }