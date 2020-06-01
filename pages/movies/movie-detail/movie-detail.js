import { Movie } from 'class/Movie.js';
var app = getApp(); //获取全局变量
Page({
  data: {
    movie: {}
  },
  onLoad: function(options) {
    var movieId = options.id; //电影详情的id，通过template的自定义属性data-再实现页面跳转通过url传递过来来用options来获取的
    var url = app.globalData.doubanBase + "/v2/movie/subject/" + movieId;
    var movie = new Movie(url);
    // var movieData = movie.getMovieData();这里不能这样写等于的调用，因为http是异步的，只能用15行的代码去写
    // var that = this; //因为这里的函数调用不是这里的this，所以要用保留this的方法，但你用箭头函数就不必担心此问题
    // movie.getMovieData(function(movie) {
    //   that.setData({
    //     movie: movie
    //   })
    // })
    movie.getMovieData((movie) =>{
      this.setData({
        movie: movie
      })
    })
  },
  viewMoviePostImg: function(e) { //大图预览的效果
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src, //当前显示图片的http链接
      urls: [src], //需要预览的图片http链接列表
    })
  }
})