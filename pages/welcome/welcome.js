Page({
  onTap: function() {
    // wx.navigateTo({//可以返回，上一个页面被隐藏
    //   url:'../posts/posts'
    // })
    // wx.redirectTo({//不可以返回，上一个页面被卸载
    //   url: '../posts/posts'
    // })
    wx.switchTab({//有tab栏
      url: '../posts/posts'
    })
  }
})