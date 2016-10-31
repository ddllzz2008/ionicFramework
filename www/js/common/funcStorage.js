/**封装文件读取
 * Created by ddllzz on 16/9/13.
 */
//创建并写入文件
function createAndWriteFile(filename,content,$cordovaFile){
  if(isDebugMode) {
    //调试用,部署需要delete
    return;
  }
  try{
    document.addEventListener("deviceready", function() {
      try{
        //持久化数据保存
        // WRITE
        $cordovaFile.writeFile(cordova.file.dataDirectory, filename, content, true)
          .then(function (success) {
            // success
            console.log(success);
          }, function (error) {
            // error
            console.log(error);
          });
      }catch(ex){
        if ($common_ionicLoading != null) {
          //hiddenLoading($common_ionicLoading);
        }
      }
    },false);
  }catch(ex){
    if ($common_ionicLoading != null) {
      //hiddenLoading($common_ionicLoading);
    }
  }
}

//将内容数据写入到文件中
function writeFile(fileEntry, dataObj) {
  //创建一个写入对象
  fileEntry.createWriter(function (fileWriter) {

    //文件写入成功
    fileWriter.onwriteend = function() {
      console.log("Successful file read...");
    };

    //文件写入失败
    fileWriter.onerror = function (e) {
      console.log("Failed file read: " + e.toString());
    };

    //写入文件
    fileWriter.write(dataObj);
  });
}

//文件创建失败回调
function  onErrorCreateFile(error){
  console.log("文件创建失败！")
}

//FileSystem加载失败回调
function  onErrorLoadFs(error){
  console.log("文件系统加载失败！")
}

//读取文件
function readFile(filename,callback,$cordovaFile) {
  if(isDebugMode) {
    //调试用,部署需要delete
    if (filename == dbplatformInfo) {
      var postData = {
        "UserName": "lz",
        "Password": "123456",
        "IMEI": "123",
        // "IMEI":'123',
        "Version": "1.1",
        "Platform": "ios",
        "isMD5":false
        // "Platform": "chrome"
      };
      callback(JSON.stringify(postData));
      return;
    }
  }
try{
  document.addEventListener("deviceready", function () {
    try{
      //持久化数据读取
      $cordovaFile.readAsText(cordova.file.dataDirectory, filename)
        .then(function (success) {
          // success
          callback(success);
        }, function (error) {
          // error
          callback(null);
        });
    }catch(ex) {
      if ($common_ionicLoading != null) {
        hiddenLoading($common_ionicLoading);
      }
    }
  },false);
  // ionicPlatform.ready(function () {
  //   try{
  //     alert('cordovaFile is '+cordovaFile);
  //     //持久化数据读取
  //     cordovaFile.readAsText(cordova.file.dataDirectory, filename)
  //       .then(function (success) {
  //         // success
  //         callback(success);
  //       }, function (error) {
  //         // error
  //         callback(null);
  //       });
  //   }catch(ex) {
  //     alert(ex.toString());
  //     if ($common_ionicLoading != null) {
  //       hiddenLoading($common_ionicLoading);
  //     }
  //   }
  // });
}catch(ex) {
  alert('5:error:'+ex.toString());
  if ($common_ionicLoading != null) {
    hiddenLoading($common_ionicLoading);
  }
}

    // window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
    //
    //   console.log('打开的文件系统: ' + fs.name);
    //   fs.root.getFile(filename, {create: false, exclusive: false},
    //     function (fileEntry) {
    //
    //       fileEntry.file(function (file) {
    //         var reader = new FileReader();
    //         reader.onloadend = function() {
    //           callback(this.result);
    //         };
    //         reader.readAsText(file);
    //       }, onErrorReadFile);
    //
    //     }, null);
    //
    // }, null);
}

//读取文件失败响应
function onErrorReadFile(){
  console.log("文件读取失败!");
}

//删除文件
function deleteFile(filename,$cordovaFile){
  if(isDebugMode) {
    //调试用,部署需要delete
    return;
  }
  try{
    document.addEventListener("deviceready", function() {
      try{
        //持久化数据保存
        // WRITE
        $cordovaFile.removeFile(cordova.file.dataDirectory, filename)
          .then(function (success) {
            // success
            console.log(success);
          }, function (error) {
            // error
            console.log(error);
          });
      }catch(ex){
        if ($common_ionicLoading != null) {
          //hiddenLoading($common_ionicLoading);
        }
      }
    },false);
  }catch(ex){
    if ($common_ionicLoading != null) {
      //hiddenLoading($common_ionicLoading);
    }
  }
}
