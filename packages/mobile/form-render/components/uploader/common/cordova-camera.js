export function getImage(_options = {}) {
  return new Promise((resolve, reject) => {
    // TODO: 调整 options 参数
    const options = {
      quality: 0,
      destinationType: 1, // 0-Return base64 encoded string. 1-Return file uri (content://media/external/images/media/2 for Android)
      sourceType: 1, // 0-Photo Library, 1-Camera, 2-Saved Album Choose image only from the device's Camera Roll album
      encodingType: 0, // 0=JPG 1=PNG
      ..._options,
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
                  if (!imgBlob?.name) {
                    imgBlob.name = `${Date.now()}.${imgBlob.type?.replace(
                      "image/",
                      "",
                    )}`;
                  }
                  if (!imgBlob?.lastModifiedDate) {
                    imgBlob.lastModifiedDate = new Date();
                  }
                  if (!imgBlob?.lastModified) {
                    imgBlob.lastModified = imgBlob.lastModifiedDate.getTime();
                  }
                  resolve(imgBlob);
                  // window.__file = imgBlob; // PLACE THE FILE ASSIGNMENT HERE AFTER THE READER HAS INGESTED THE FILE BYTES
                };
                reader.readAsArrayBuffer(file);
              },
              function (err) {
                reject(err);
                console.error("error with photo file");
              },
            );
          },
          function (err) {
            reject(err);
            console.error("error with photo file");
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

export function getVideo(_options = {}) {
  return new Promise((resolve, reject) => {
    // TODO: 调整 options 参数
    const options = {
      quality: 0,
      destinationType: 1,
      sourceType: 1, // 0:Photo Library, 1=Camera, 2=Saved Album
      encodingType: 0, // 0=JPG 1=PNG
      ..._options,
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
                  if (!imgBlob?.name) {
                    imgBlob.name = `${Date.now()}.${imgBlob.type?.replace(
                      "video/",
                      "",
                    )}`;
                  }
                  if (!imgBlob?.lastModifiedDate) {
                    imgBlob.lastModifiedDate = new Date();
                  }
                  if (!imgBlob?.lastModified) {
                    imgBlob.lastModified = imgBlob.lastModifiedDate.getTime();
                  }
                  resolve(imgBlob);
                  // window.__file = imgBlob; // PLACE THE FILE ASSIGNMENT HERE AFTER THE READER HAS INGESTED THE FILE BYTES
                };
                reader.readAsArrayBuffer(file);
              },
              function (err) {
                reject(err);
                console.error("error with photo file");
              },
            );
          },
          function (err) {
            reject(err);
            console.error("error with photo file");
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
