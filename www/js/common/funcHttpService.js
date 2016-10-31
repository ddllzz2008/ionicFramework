/**封装网络请求
 * Created by ddllzz on 16/9/13.
 */
function checkConnection() {
  //调试用,部署需要delete
  if(isDebugMode) {
    return true;
  }
  var networkState = navigator.connection.type;
  return networkState == Connection.NONE ? false:true;
  // var states = {};
  // states[Connection.UNKNOWN]  = 'Unknown connection';//未知连接
  // states[Connection.ETHERNET] = 'Ethernet connection';//以太网
  // states[Connection.WIFI]     = 'WiFi connection';//wifi
  // states[Connection.CELL_2G]  = 'Cell 2G connection';//2G
  // states[Connection.CELL_3G]  = 'Cell 3G connection';//3G
  // states[Connection.CELL_4G]  = 'Cell 4G connection';//4G
  // states[Connection.CELL]     = 'Cell generic connection';//蜂窝网络
  // states[Connection.NONE]     = 'No network connection';
  // alert('Connection type: ' + states[networkState]);
}
function getFromUrl(http,url) {
  // header('Access-Control-Allow-Origin:http://localhost:63342/')
  http.get(url)
    .success(function(response)
    {
      alert(response);
    });
}

function checkRefreshTime($cordovaFile,filename,needRefresh,needNotRefresh,refreshmode) {
  if(isDebugMode) {
    //调试用,部署需要delete
    needRefresh();
    return;
  }
  if(refreshmode){
    needRefresh();
    return;
  }
  readFile(filename,function (time) {
    try{
      if(time!=null&&time!=undefined){
        var lastDate = new Date(time);
        var currentDate = new Date();
        var diff = lastDate.GetDateDiff('n',currentDate);
        if(diff>timerefresh){
          needRefresh();
        }else{
          needNotRefresh();
        }
      }else{
        needRefresh();
        var lastDate = new Date();
        var dateString = lastDate.Format('yyyy/MM/dd HH:mm:ss');
        createAndWriteFile(filename,dateString,$cordovaFile);
      }
    }catch(ex){

    }
  },$cordovaFile);
}
