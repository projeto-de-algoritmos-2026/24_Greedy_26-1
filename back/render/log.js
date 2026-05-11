function renderizarLog() {
  var $cardLog = document.getElementById('card-log');
  var $logOutput = document.getElementById('log-output');

  if (!estado.resultado) return;

  $cardLog.hidden = false;
  $logOutput.innerHTML = '';

  var logs = estado.resultado.logs;
  for (var i = 0; i < logs.length; i++) {
    var div = document.createElement('div');
    div.className = 'log-line ' + logs[i].type;
    div.textContent = logs[i].text;
    $logOutput.appendChild(div);
  }
}
