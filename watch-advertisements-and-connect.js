function onRequestBluetoothDeviceButtonClick() {
  log('Requesting any Bluetooth device...');
  navigator.bluetooth
    .requestDevice({
      acceptAllDevices: true,
    })
    .then((device) => {
      log('> Requested ' + device.name);
      const connectButton = document.createElement('button');
      connectButton.textContent = device.name;
      connectButton.addEventListener('click', function() {
        onConnectToDeviceButtonClick(device.name);
      })
      document.querySelector('#connectButtons').appendChild(connectButton)
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
        device.gatt.connect().then(() => console.log('connected'));
      } else {
        log("Argh! no authorized device was found with this name");
      }
    })
    .catch((error) => {
      log('Argh! ' + error);
    });
}
