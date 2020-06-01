function convertToStarsArray(stars) {
  var num = stars.toString().substring(0, 1);
  var array = [];
  for (var i = 1; i <= 5; i++) {
    if (i <= num) {
      array.push(1);
    } else {
      array.push(0);
    }
  }
  return array;
}

function http(url,callBack) {
  wx.request({
    url: url,
    data: {}, //这里一般是method是get或post去使用的，查询数据的话data就用不到，要是想去服务器提交数据就会用到了
    //一般get是查询数据，post和put是提交数据，delete是删除数据
    method: 'GET', //OPTIONS,GET,HEAD,POST,PUT,DELETE,TRACE,CONNECT
    header: { //设置请求的header
      "Content-Type": ''
    },
    success: function(res) {
      callBack(res.data);
    },
    fail: function(err) {
      console.log(err)
    },
    complete: function() {}
  })
}

function convertToCastString(casts){//电影详情页的演员
  var castsjoin="";
  for(var idx in casts){
    castsjoin = castsjoin + casts[idx].name +"/";
  }

  return castsjoin.substring(0,castsjoin.length-2);//？
}

function convertToCastInfos(casts) {//电影详情页的演员图片和姓名
  var castsArray = []
  for(var idx in casts){
    var cast = {
      img: casts[idx].avatars ? casts[idx].avatars.large :"",
      name:casts[idx].name
    }
    castsArray.push(cast);
  }
  return castsArray;
}

module.exports = {
  convertToStarsArray: convertToStarsArray,
  convertToCastString: convertToCastString,
  convertToCastInfos: convertToCastInfos,
  http:http
}