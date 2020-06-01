var app = getApp();
var util = require('../../../utils/utils.js')
Page({

  data: {
    movies: {}, //不加这个可能会报错
    navigateTitle: '',
    requestUrl: '',
    totalCount: 0,
    isEmpty: true
  },
  onLoad: function(options) {
    var category = options.category;
    this.data.navigateTitle = category;
    var dataUrl = '';
    switch (category) {
      case '正在热映':
        dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
        break;
      case '即将上线':
        dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
        break;
      case '豆瓣Top250':
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
        break;
    }
    this.data.requestUrl = dataUrl;
    util.http(dataUrl, this.processDoubanData)
  },

  onReachBottom: function(event) { //滚动到底部触发
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20"; //start表示从第几个加载，count是表示加载多少个
    util.http(nextUrl, this.processDoubanData);
    wx.showNavigationBarLoading() //加载loading
  },

  onPullDownRefresh: function(event) {//下拉刷新效果
    var refreshUrl = this.data.requestUrl + "?start=0" + "&count=20";
    this.data.movies = {};
    this.data.isEmpty = true;
    this.data.totalCount = 0;
    util.http(refreshUrl, this.processDoubanData);
    wx.showNavigationBarLoading(); //加载loading
  },

  processDoubanData(moviesDouban) { //筛选需要的数据
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
    var totalMovies = {};
    if (!this.data.isEmpty) { //如果已经有数据了，就合并数据
      totalMovies = this.data.movies.concat(movies); //老的数据和新的数据合并
    } else {
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    this.setData({
      movies: totalMovies
    });
    this.data.totalCount += 20;
    wx.hideNavigationBarLoading(); //隐藏loading
    wx.stopPullDownRefresh();//停止下拉刷新
  },
  onReady: function() {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    })
  },
  onMovieTap: function (event) {
    console.log('aaa');
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId
    })
  },
})