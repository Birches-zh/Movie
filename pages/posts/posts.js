var postsData = require('../../data/posts-data.js')
Page({
  data: {

  },
  onLoad: function(options) {
    this.setData({
      post_key: postsData.postList
    });
  },
  onPostTap: function(event) {
    var postId = event.currentTarget.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId
    })
  },
  // onSwiperItemTap: function(event) {
  //   var postId = event.currentTarget.dataset.postid;
  //   wx.navigateTo({
  //     url: 'post-detail/post-detail?id=' + postId
  //   })
  // },

  
  // target指的是当前点击的组件，currentTarget指的是事件捕获的组件
  // target指的是image,而currentTarget指的是swiper
  onSwiperTap: function(event) {
    console.log(event)
    var postId = event.target.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId
    })
  }
})