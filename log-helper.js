var ChromeSamples = {
  log: function () {
    var line = Array.prototype.slice
      .call(arguments)
      .map(function (argument) {
        return typeof argument === 'string' ? argument : JSON.stringify(argument);
      })
      .join(' ');

    document.querySelector('#log').textContent += line + '\n';
  },

  clearLog: function () {
    document.querySelector('#log').textContent = '';
  },
};

log = ChromeSamples.log;
clearLog = ChromeSamples.clearLog

function isWebBluetoothEnabled() {
  if (navigator.bluetooth) {
    return true;
  } else {
    return false;
  }
}
