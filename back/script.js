var $form = document.getElementById('disciplina-form');
var $inputNome = document.getElementById('input-nome');
var $inputInicio = document.getElementById('input-inicio');
var $inputFim = document.getElementById('input-fim');
var $inputCor = document.getElementById('input-cor');
var $formError = document.getElementById('form-error');
var $listaDisciplinas = document.getElementById('lista-disciplinas');
var $btnExemplos = document.getElementById('btn-exemplos');
var $btnGerar = document.getElementById('btn-gerar');
var $btnLimpar = document.getElementById('btn-limpar');
var $cardResumo = document.getElementById('card-resumo');
var $cardLog = document.getElementById('card-log');
var $logToggle = document.getElementById('log-toggle');
var $logToggleIcon = document.getElementById('log-toggle-icon');
var $logBody = document.getElementById('log-body');
var $gradeContainer = document.getElementById('grade-container');
var $modalOverlay = document.getElementById('modal-overlay');
var $modalNome = document.getElementById('modal-nome');
var $modalColor = document.getElementById('modal-color');
var $modalDia = document.getElementById('modal-dia');
var $modalHorario = document.getElementById('modal-horario');
var $modalColuna = document.getElementById('modal-coluna');
var $modalTotalColunas = document.getElementById('modal-total-colunas');
var $modalConflitoAviso = document.getElementById('modal-conflito-aviso');
var $modalClose = document.getElementById('modal-close');


function mostrarErro(msg) {
  $formError.textContent = 'Aviso ' + msg;
  $formError.hidden = false;
}

function esconderErro() {
  $formError.hidden = true;
}

function resetarGrade() {
  $cardResumo.hidden = true;
  $cardLog.hidden = true;
  $gradeContainer.innerHTML =
    '<div class="empty-state" id="empty-grade">' +
    '  <span class="empty-icon">📅</span>' +
    '  <p>Nenhuma grade gerada ainda.</p>' +
    '  <p class="hint">Adicione disciplinas e clique em "Gerar Grade".</p>' +
    '</div>';
}

function abrirModal(intervalo) {
  $modalNome.textContent = intervalo.nome;
  $modalColor.style.backgroundColor = intervalo.cor;
  $modalDia.textContent = DIAS_NOMES[intervalo.dia];
  $modalHorario.textContent = intervalo.inicio + ' – ' + intervalo.fim;
  $modalColuna.textContent = 'Coluna ' + (intervalo.coluna + 1);
  $modalTotalColunas.textContent = intervalo.totalColunasDia;

  if (intervalo.coluna > 0) {
    $modalConflitoAviso.hidden = false;
  } else {
    $modalConflitoAviso.hidden = true;
  }

  $modalOverlay.classList.add('active');
}

function fecharModal() {
  $modalOverlay.classList.remove('active');
}

function carregarExemplos() {
  var dados = [
    { nome: 'Cálculo 1', cor: '#6366f1', dias: ['seg', 'qua'], inicio: '10:00', fim: '12:00' },
    { nome: 'Introdução à Programação', cor: '#f43f5e', dias: ['ter', 'qui'], inicio: '10:00', fim: '12:00' },
    { nome: 'Física 1', cor: '#10b981', dias: ['seg', 'qua'], inicio: '14:00', fim: '16:00' },
    { nome: 'Álgebra Linear', cor: '#f59e0b', dias: ['ter', 'qui'], inicio: '14:00', fim: '16:00' },
    { nome: 'Estruturas de Dados', cor: '#8b5cf6', dias: ['seg', 'qua'], inicio: '16:00', fim: '18:00' },
    { nome: 'Banco de Dados', cor: '#06b6d4', dias: ['ter', 'qui'], inicio: '16:00', fim: '18:00' },
    { nome: 'Probabilidade', cor: '#ec4899', dias: ['seg'], inicio: '10:30', fim: '12:30' },
    { nome: 'Org. Computadores', cor: '#84cc16', dias: ['seg'], inicio: '11:00', fim: '13:00' }
  ];

  estado.disciplinas = dados.map(function (d) {
    return {
      id: estado.proximoId++,
      nome: d.nome,
      cor: d.cor,
      dias: d.dias,
      inicio: d.inicio,
      fim: d.fim
    };
  });

  estado.resultado = null;
  renderizarListaDisciplinas();
  resetarGrade();
}

$form.addEventListener('submit', function (e) {
  e.preventDefault();
  esconderErro();

  var nome = $inputNome.value.trim();
  var checkboxes = document.querySelectorAll('input[name="dias"]:checked');
  var dias = [];
  for (var i = 0; i < checkboxes.length; i++) {
    dias.push(checkboxes[i].value);
  }
  var inicio = $inputInicio.value;
  var fim = $inputFim.value;
  var cor = $inputCor.value;

  if (!nome) {
    mostrarErro('Informe o nome da disciplina.');
    return;
  }
  if (dias.length === 0) {
    mostrarErro('Selecione ao menos um dia da semana.');
    return;
  }
  if (timeToMinutes(fim) <= timeToMinutes(inicio)) {
    mostrarErro('O horário de fim deve ser posterior ao de início.');
    return;
  }

  estado.disciplinas.push({
    id: estado.proximoId++,
    nome: nome,
    dias: dias,
    inicio: inicio,
    fim: fim,
    cor: cor
  });

  $inputNome.value = '';
  var cbs = document.querySelectorAll('input[name="dias"]');
  for (var j = 0; j < cbs.length; j++) cbs[j].checked = false;

  estado.resultado = null;
  renderizarListaDisciplinas();
  resetarGrade();
});

$listaDisciplinas.addEventListener('click', function (e) {
  var btn = e.target.closest('.disc-remove');
  if (!btn) return;
  var id = parseInt(btn.getAttribute('data-id'));
  estado.disciplinas = estado.disciplinas.filter(function (d) { return d.id !== id; });
  estado.resultado = null;
  renderizarListaDisciplinas();
  resetarGrade();
});

$btnExemplos.addEventListener('click', carregarExemplos);

$btnGerar.addEventListener('click', function () {
  if (estado.disciplinas.length === 0) return;
  gerarGrade();
});

$btnLimpar.addEventListener('click', function () {
  estado.disciplinas = [];
  estado.resultado = null;
  renderizarListaDisciplinas();
  resetarGrade();
});

$logToggle.addEventListener('click', function () {
  $logBody.classList.toggle('open');
  $logToggleIcon.classList.toggle('open');
});

$gradeContainer.addEventListener('click', function (e) {
  var bloco = e.target.closest('.grade-bloco');
  if (!bloco || !estado.resultado) return;

  var dia = bloco.getAttribute('data-dia');
  var idx = parseInt(bloco.getAttribute('data-idx'));
  var intervalo = estado.resultado.porDia[dia][idx];
  if (intervalo) abrirModal(intervalo);
});

$modalClose.addEventListener('click', fecharModal);
$modalOverlay.addEventListener('click', function (e) {
  if (e.target === $modalOverlay) fecharModal();
});

renderizarListaDisciplinas();