function getCurrentPosition(config) {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve(position);
      },
      reject,
      {
        enableHighAccuracy: true,
        timeout: 5000,
        ...config,
      },
    );
  });
}

export default getCurrentPosition;
