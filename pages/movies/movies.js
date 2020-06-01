var app = getApp(); //获取全局变量
var util = require('../../utils/utils.js')
Page({
  // RESTFul API
  // SOAP XML
  data: { //这里是一个坑，如果数据绑定，异步调用的话这里一定要先设一个空值
    inTheaters: {},
    comingSoon: {},
    top250: {},
    searchResult: {},
    emptyData: '',
    containerShow: true,
    searchPanelShow: false
  },


  onLoad: function(event) {
    var inTheatersUrl = app.globalData.doubanBase +
      "/v2/movie/in_theaters" + "?start=0&count=3"; //正在热映，start=0&count=3只拿三页数据
    var comingSoonUrl = app.globalData.doubanBase +
      "/v2/movie/coming_soon" + "?start=0&count=3"; //即将上映
    var top250Url = app.globalData.doubanBase +
      "/v2/movie/top250" + "?start=0&count=3"; //Top250

    this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映");
    this.getMovieListData(comingSoonUrl, "comingSoon", "即将上线");
    this.getMovieListData(top250Url, "top250", "豆瓣Top250");
  },


  onMoreTap: function(event) { //通过template绑定自定义data-属性点击事件，用event获取自定义属性，再通过跳转，把参数写进url，这样跳转过去的组件就可以通过options来获取数据啦
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: "more-movie/more-movie?category=" + category
    })
  },

  onMovieTap: function(event) { //跳转到电影详情页面movies-detail
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: "movie-detail/movie-detail?id=" + movieId
    })
  },


  onBindFocus: function(event) {
    // 控制电影页面的隐藏和显示还有搜索页面的隐藏和显示
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },


  onCancelImgTap: function(event) { //这个是叉叉键
    // 控制电影页面的隐藏和显示还有搜索页面的隐藏和显示
    this.setData({
      emptyData: '',
      containerShow: true,
      searchPanelShow: false
    })
  },


  onBindBlur: function(event) { //input输入的值通过event事件对象来获取
    var text = event.detail.value;
    var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
    this.getMovieListData(searchUrl, "searchResult", "")
  },


  getMovieListData: function(url, settedKey, categoryTitle) {
    var that = this;
    wx.request({
      url: url,
      data: {}, //这里一般是method是get或post去使用的，查询数据的话data就用不到，要是想去服务器提交数据就会用到了

      //一般get是查询数据，post和put是提交数据，delete是删除数据
      method: 'GET', //OPTIONS,GET,HEAD,POST,PUT,DELETE,TRACE,CONNECT

      header: { //设置请求的header
        "Content-Type": ''
      },
      success: function(res) {
        that.processDoubanData(res.data, settedKey, categoryTitle)
      },
      fail: function(err) {
        console.log(err)
      },
      complete: function() {}
    })
  },


  processDoubanData: function(moviesDouban, settedKey, categoryTitle) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp);
    }
    var readyData = {}; //首先这个是一个对象，给对象中的settedKey属性添加movies对象，movies属性的值就是获取到的数据
    readyData[settedKey] = {
      categoryTitle: categoryTitle,
      movies: movies
    };
    this.setData({ ...readyData
    })
  }
})