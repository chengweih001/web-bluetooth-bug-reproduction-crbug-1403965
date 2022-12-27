function onRequestBluetoothDeviceButtonClick() {
  log('Requesting any Bluetooth device...');
  navigator.bluetooth
    .requestDevice({
      acceptAllDevices: true,
    })
    .then((device) => {
      log('> Requested ' + device.name);
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
        log('found an authorized device, attempting connection...');
        device.gatt.connect().then(() => console.log('connected'));
      } else {
        log("Argh! no authorized device was found, please authorize it using the 'request device' button");
      }
    })
    .catch((error) => {
      log('Argh! ' + error);
    });
}
