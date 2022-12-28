function addDeviceConnectButton(deviceName) {
  const connectButton = document.createElement('button');
  connectButton.textContent = deviceName;
  connectButton.addEventListener('click', function () {
    onConnectToDeviceButtonClick(deviceName);
  });
  document.querySelector('#connectButtons').appendChild(connectButton);
}

function displayAuthorizedDevicesConnectButtons() {
  navigator.bluetooth.getDevices().then((devices) => {
    devices.forEach((device) => {
      addDeviceConnectButton(device.name);
    });
  });
}

function onRequestBluetoothDeviceButtonClick() {
  log('Requesting any Bluetooth device...');
  navigator.bluetooth
    .requestDevice({
      acceptAllDevices: true,
    })
    .then((device) => {
      log('> Requested ' + device.name);
      addDeviceConnectButton(device.name);
    })
    .catch((error) => {
      log('Argh! ' + error);
    });
}

function onConnectToDeviceButtonClick(deviceName) {
  log('Getting existing permitted Bluetooth devices...');
  navigator.bluetooth
    .getDevices()
    .then((devices) => {
      const device = devices.find((pairedDevice) => pairedDevice.name === deviceName);
      if (device) {
        log(`found an authorized device name ${deviceName}, attempting connection...`);
        device.gatt.connect().then(() => log(`Connected successfully to ${deviceName}`));
      } else {
        log(`Argh! no authorized device was found with this named ${deviceName}`);
      }
    })
    .catch((error) => {
      log('Argh! ' + error);
    });
}
