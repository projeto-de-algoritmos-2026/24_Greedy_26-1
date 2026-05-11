function renderizarGrade() {
  var $gradeContainer = document.getElementById('grade-container');

  if (!estado.resultado) return;

  var porDia = estado.resultado.porDia;
  var totalSlots = (GRADE_FIM - GRADE_INICIO) / SLOT_MINUTOS;

  var colunasPorDia = {};
  for (var d = 0; d < DIAS.length; d++) {
    var dia = DIAS[d];
    var maxCol = 1;
    for (var k = 0; k < porDia[dia].length; k++) {
      if (porDia[dia][k].totalColunasDia > maxCol) {
        maxCol = porDia[dia][k].totalColunasDia;
      }
    }
    colunasPorDia[dia] = maxCol;
  }

  var html = '<div class="grade-wrapper">';

  // Header dos dias
  html += '<div class="grade-dias-header">';
  html += '<div class="grade-dia-label">Horário</div>';
  for (var d = 0; d < DIAS.length; d++) {
    var dia = DIAS[d];
    var colInfo = colunasPorDia[dia] > 1
      ? '<span class="col-info">' + colunasPorDia[dia] + ' colunas</span>'
      : '';
    html += '<div class="grade-dia-label">' + DIAS_NOMES[dia] + colInfo + '</div>';
  }
  html += '</div>';

  // Corpo
  html += '<div class="grade-body">';

  // Coluna de horários
  html += '<div class="grade-hora-col">';
  for (var s = 0; s <= totalSlots; s++) {
    var minAtual = GRADE_INICIO + s * SLOT_MINUTOS;
    var eHoraCheia = (minAtual % 60 === 0);
    var classe = 'grade-hora-slot' + (eHoraCheia ? ' hora-cheia' : '');
    html += '<div class="' + classe + '">' + (eHoraCheia ? minutesToTime(minAtual) : '') + '</div>';
  }
  html += '</div>';

  // Colunas dos dias
  for (var d = 0; d < DIAS.length; d++) {
    var dia = DIAS[d];
    var numCols = colunasPorDia[dia];

    html += '<div class="grade-dia-col">';

    // Slots de fundo
    for (var s = 0; s < totalSlots; s++) {
      var minSlot = GRADE_INICIO + s * SLOT_MINUTOS;
      var eCheia = (minSlot % 60 === 0);
      html += '<div class="grade-slot-bg' + (eCheia ? ' hora-cheia' : '') + '"></div>';
    }

    // Blocos das disciplinas
    var intervalosDia = porDia[dia];
    for (var i = 0; i < intervalosDia.length; i++) {
      var iv = intervalosDia[i];
      var totalAltura = totalSlots * 30;
      var topPx = ((iv.inicioMin - GRADE_INICIO) / (GRADE_FIM - GRADE_INICIO)) * totalAltura;
      var heightPx = ((iv.fimMin - iv.inicioMin) / (GRADE_FIM - GRADE_INICIO)) * totalAltura;

      var colWidth = 100 / numCols;
      var leftPct = iv.coluna * colWidth;

      var isConflito = numCols > 1 && iv.coluna > 0;

      html += '<div class="grade-bloco' + (isConflito ? ' conflito' : '') + '"' +
        ' style="' +
        'top:' + topPx + 'px;' +
        'height:' + heightPx + 'px;' +
        'left:' + (leftPct + 1) + '%;' +
        'width:' + (colWidth - 2) + '%;' +
        '"' +
        ' data-idx="' + i + '"' +
        ' data-dia="' + dia + '"' +
        '>' +
        '<div class="grade-bloco-bg" style="background:' + iv.cor + '"></div>' +
        '<div class="grade-bloco-border" style="background:' + iv.cor + '"></div>' +
        '<div class="grade-bloco-nome" style="color:' + iv.cor + '">' + iv.nome + '</div>' +
        '<div class="grade-bloco-hora">' + iv.inicio + '–' + iv.fim + '</div>' +
        (numCols > 1 ? '<div class="grade-bloco-col">Col. ' + (iv.coluna + 1) + '</div>' : '') +
        '</div>';
    }

    html += '</div>';
  }

  html += '</div>'; // grade-body
  html += '</div>'; // grade-wrapper

  $gradeContainer.innerHTML = html;
}
