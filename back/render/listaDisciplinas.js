
function renderizarListaDisciplinas() {
  var $listaDisciplinas = document.getElementById('lista-disciplinas');
  var $emptyLista = document.getElementById('empty-lista');
  var $counterDisc = document.getElementById('counter-disciplinas');
  var $btnLimpar = document.getElementById('btn-limpar');

  var items = $listaDisciplinas.querySelectorAll('.disc-item');
  for (var i = 0; i < items.length; i++) {
    items[i].remove();
  }

  if (estado.disciplinas.length === 0) {
    $emptyLista.hidden = false;
    $btnLimpar.hidden = true;
  } else {
    $emptyLista.hidden = true;
    $btnLimpar.hidden = false;
  }

  $counterDisc.textContent = estado.disciplinas.length;

  for (var j = 0; j < estado.disciplinas.length; j++) {
    var d = estado.disciplinas[j];
    var el = document.createElement('div');
    el.className = 'disc-item';
    el.style.borderLeftColor = d.cor;

    var diasTexto = d.dias.map(function (dia) {
      return dia.charAt(0).toUpperCase() + dia.slice(1);
    }).join(', ');

    el.innerHTML =
      '<div class="disc-info">' +
      '  <div class="disc-nome">' + d.nome + '</div>' +
      '  <div class="disc-detalhe">' + diasTexto + ' • ' + d.inicio + '–' + d.fim + '</div>' +
      '</div>' +
      '<button class="disc-remove" data-id="' + d.id + '" title="Remover">&times;</button>';

    $listaDisciplinas.appendChild(el);
  }
}
