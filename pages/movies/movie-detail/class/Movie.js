var util = require('../../../../utils/utils.js')
class Movie { //创建一个类
  constructor(url) { //这是一个构造函数，里面传了个URL
    this.url = url; //这个this指的就是这个Movie类的实例
  }

  getMovieData(cb) { //成员变量函数，es6里面是不需要加:function,CB是callback
    this.cb = cb; //这个cb还是放到Movie的实例里
    util.http(this.url, this.processDoubanData.bind(this)); //调用util的http方法 / 因为外部调用了匿名函数，所以在这里改this指向，bind(this)是改变this的指向
  }
  processDoubanData(data) {
    if (!data) {
      return;
    }
    var director = {
      avatar: "",
      name: "",
      id: ""
    }
    if (data.directors[0] != null) {
      if (data.directors[0].avatars != null) {
        director.avatar = data.directors[0].avatars.large
      }
      director.name = data.directors[0].name;
      director.id = data.directors[0].id;
    }
    var movie = {
      movieImg: data.images ? data.images.large : "",
      country: data.countries[0],
      title: data.id,
      original_title: data.original_title,
      wishCount: data.wish_count,
      commentCount: data.comments_count,
      year: data.year,
      generes: data.genres.join("、"),
      stars: util.convertToStarsArray(data.rating.stars),
      score: data.rating.average,
      director: director,
      casts: util.convertToCastString(data.casts),
      castsInfo: util.convertToCastInfos(data.casts),
      summary: data.summary
    }
    // 因为是异步方法你不能直接写return movie返回出去
    this.cb(movie);//这个cb就是movie-detail.js传进来的匿名方法 / 由于cb的this不是外面的this，所以要在第九行改变this的指向bind(this)
  }
}

export{Movie}
