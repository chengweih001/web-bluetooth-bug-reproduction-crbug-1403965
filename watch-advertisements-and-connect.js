function getTimestampInSeconds () {
  return Math.floor(Date.now() / 1000)
}

function getBadStateThreshold() {
  const val = document.querySelector('#badStateThreshold').value;
  return val;
}

function addDeviceConnectButton(deviceName) {
  const connectButton = document.createElement('button');
  connectButton.textContent = deviceName;
  connectButton.addEventListener('click', function () {
    onConnectToDeviceButtonClick(deviceName, false, getTimestampInSeconds());
  });
  document.querySelector('#connectButtons').appendChild(connectButton);
}

function addDeviceKeepTryingConnectButton(deviceName) {
  const connectButton = document.createElement('button');
  connectButton.textContent = deviceName + "[KeepTrying]";
  connectButton.addEventListener('click', function () {
    onConnectToDeviceButtonClick(deviceName, true, getTimestampInSeconds());
  });
  document.querySelector('#connectButtons').appendChild(connectButton);
}

function displayAuthorizedDevicesConnectButtons() {
  navigator.bluetooth.getDevices().then((devices) => {
    devices.forEach((device) => {
      addDeviceConnectButton(device.name);
      addDeviceKeepTryingConnectButton(device.name);
    });
  });
}

function onRequestBluetoothDeviceButtonClick() {
  log('Requesting any Bluetooth device...');
  navigator.bluetooth.getDevices().then((authorizedDevices) => {
    navigator.bluetooth
      .requestDevice({
        acceptAllDevices: true,
      })
      .then((device) => {
        log('> Requested ' + device.name);
        if (!authorizedDevices.find((authorizedDevice) => authorizedDevice.name === device.name)) {
          addDeviceConnectButton(device.name);
          addDeviceKeepTryingConnectButton(device.name);
        }
      })
      .catch((error) => {
        log('Argh! ' + error);
      });
  });
}



function onConnectToDeviceButtonClick(deviceName, keepTrying, calledAtSeconds) {
  log('Getting existing permitted Bluetooth devices...');
  navigator.bluetooth
    .getDevices()
    .then((devices) => {
      const device = devices.find((pairedDevice) => pairedDevice.name === deviceName);
      if (device) {
        log(`found an authorized device named ${deviceName}, attempting connection...`);
        device.gatt
          .connect()
          .then(() => log(`Connected successfully to ${deviceName}`))
          .catch((err) => {
            log('Argh! ' + err.message);
            const diffSeconds = getTimestampInSeconds() - calledAtSeconds;
            if (diffSeconds > getBadStateThreshold() && keepTrying) {
              log(`keep trying (diffSeconds:${diffSeconds}).`);
              onConnectToDeviceButtonClick(deviceName, keepTrying, getTimestampInSeconds());
            } else {
              log(`to throw error (diffSeconds:${diffSeconds})! (keepTrying:${keepTrying})`);
              throw err;
            }
          });
      } else {
        log(`Argh! no authorized device was found with this named ${deviceName}`);
      }
    })
    .catch((error) => {
      log('Argh! ' + error);
    });
}
