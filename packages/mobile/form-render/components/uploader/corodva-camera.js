export function getImage() {
  return new Promise((resolve, reject) => {
    // TODO: 调整 options 参数
    const options = {
      quality: 0,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: 1, // 0:Photo Library, 1=Camera, 2=Saved Album
      encodingType: 0, // 0=JPG 1=PNG
    };

    navigator.device.capture.captureImage(
      function (mediaFiles) {
        const imgData = mediaFiles[0].localURL;
        let reader;
        let imgBlob;
        window.resolveLocalFileSystemURL(
          imgData,
          function (fileEntry) {
            fileEntry.file(
              function (file) {
                reader = new FileReader();
                reader.onloadend = function (e) {
                  imgBlob = new Blob([this.result], { type: "image/jpeg" });
                  console.log("imgBlob", imgBlob);
                  resolve(imgBlob);
                  // window.__file = imgBlob; // PLACE THE FILE ASSIGNMENT HERE AFTER THE READER HAS INGESTED THE FILE BYTES
                };
                reader.readAsArrayBuffer(file);
              },
              function (err) {
                reject(err);
                console.log("error with photo file");
              },
            );
          },
          function (err) {
            reject(err);
            console.log("error with photo file");
          },
        );
      },
      function (err) {
        reject(err);
        alert("Error taking picture", "Error");
      },
      options,
    );
  });
}

export function getVideo() {
  return new Promise((resolve, reject) => {
    // TODO: 调整 options 参数
    const options = {
      quality: 0,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: 1, // 0:Photo Library, 1=Camera, 2=Saved Album
      encodingType: 0, // 0=JPG 1=PNG
    };

    navigator.device.capture.captureVideo(
      function (mediaFiles) {
        const imgData = mediaFiles[0].localURL;
        let reader;
        let imgBlob;
        window.resolveLocalFileSystemURL(
          imgData,
          function (fileEntry) {
            fileEntry.file(
              function (file) {
                reader = new FileReader();
                reader.onloadend = function (e) {
                  imgBlob = new Blob([this.result], { type: "video/mp4" });
                  console.log("imgBlob", imgBlob);
                  resolve(imgBlob);
                  // window.__file = imgBlob; // PLACE THE FILE ASSIGNMENT HERE AFTER THE READER HAS INGESTED THE FILE BYTES
                };
                reader.readAsArrayBuffer(file);
              },
              function (err) {
                reject(err);
                console.log("error with photo file");
              },
            );
          },
          function (err) {
            reject(err);
            console.log("error with photo file");
          },
        );
      },
      function (err) {
        reject(err);
        alert("Error taking picture", "Error");
      },
      options,
    );
  });
}
