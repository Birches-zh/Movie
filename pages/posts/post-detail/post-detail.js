var postsData = require('../../../data/posts-data.js')
var app = getApp(); //这里是获取app.js的全局变量
Page({
  data: {
    isPlayingMusic: false
  },
  onLoad: function(option) {
    // console.log(app);
    var postId = option.id;
    this.data.currentPostId = postId;
    var postData = postsData.postList[postId];
    this.setData({ ...postData
    });

    // 收藏
    // var postCollected = {//属性的键代表某个文章的ID号，它的值就是collected的值，代表文章是否被收藏
    //   1:"false",
    //   2:"true",
    //   3:"false"
    // }

    var postsCollected = wx.getStorageSync('posts_Collected') //首先会去读取缓存有没有数据
    if (postsCollected) { //如果是false则不走这一步
      var postCollected = postsCollected[postId] //如果postsCollected是true则获取缓存中的值，如果postCollected的id下没有这个值，布尔的特性也会返回false
      this.setData({
        collected: postCollected
      })
    } else { //如果缓存的key不存在(一般这里是初始化才会执行的)
      postsCollected = {};
      postsCollected[postId] = false; //因为是不存在，让当前的页面状态为false
      wx.setStorageSync('posts_Collected', postsCollected);
    }
    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId) {
      this.setData({
        isPlayingMusic: true
      })
    }
    this.setMusicMonitor();
  },
  setMusicMonitor: function() {
    var that = this;
    wx.onBackgroundAudioPlay(function() {
      that.setData({
        isPlayingMusic: true
      })
      app.globalData.g_isPlayingMusic = true;
      app.globalData.g_currentMusicPostId = that.data.currentPostId; //指定id
    });
    wx.onBackgroundAudioPause(function() {
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicPostId = null; //这里暂停记得要把id清空
    });
    wx.onBackgroundAudioStop(function() {
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicPostId = null; //这里暂停记得要把id清空
    })
  },

  onCollectionTap: function(event) { //点击收藏的业务代码
    var postsCollected = wx.getStorageSync('posts_Collected');
    var postCollected = postsCollected[this.data.currentPostId];
    postCollected = !postCollected; //如果是true就变成false，如果是false就变成了true，这个叫取反，学到了没？
    postsCollected[this.data.currentPostId] = postCollected; //因为值发生改变了，这里要整体的更新一下变量
    this.showToast(postsCollected, postCollected);
    // this.showModal(postsCollected, postCollected);//一般不用这个方法，体验不是很友好
  },

  showToast: function(postsCollected, postCollected) {
    wx.setStorageSync('posts_Collected', postsCollected); //更新了storage的值
    this.setData({
      collected: postCollected
    })
    wx.showToast({
      title: postCollected ? "收藏成功" : "取消收藏",
      duration: 1000
    })
  },

  showModal: function(postsCollected, postCollected) {
    var that = this; //保存一下外面的this
    wx.showModal({
      title: '收藏',
      content: postCollected ? '是否收藏该文章？' : '取消收藏该文章？',
      showCancel: 'true',
      cancelText: "取消",
      cancelColor: "#333",
      confirmText: "确认",
      confirmColor: "#405f80",
      success: function(res) { //success会接收一个res的参数
        if (res.confirm) {
          wx.setStorageSync('posts_Collected', postsCollected); //更新了storage的值
          that.setData({ //这里的this指的是success函数，要从外面保存个this进来
            collected: postCollected
          })
        }
      }
    })
  },


  onShareTap: function(event) {
    var itemList = [
      "分享给微信好友",
      "分享给微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博"
    ];
    wx.showActionSheet({
      itemList: itemList,
      success: function(res) {
        // res.cancel //用户是不是点击了取消按钮
        // res.tapIndex //数组元素的序号，从0开始
        wx.showModal({
          title: "用户" + itemList[res.tapIndex],
          content: "用户是否取消？" + itemList[res.tapIndex] + "现在无法实现分享功能"
        })
      }
    })
  },
  onMusicTap: function(event) {
    var currentPostId = this.data.currentPostId;
    var postData = postsData.postList[currentPostId];
    var isPlayingMusic = this.data.isPlayingMusic; //需要一个变量来判断是否开启或暂停
    if (isPlayingMusic) {
      console.log(isPlayingMusic);
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      })
      this.data.isPlayingMusic = false;
    } else {
      wx.playBackgroundAudio({
        dataUrl: postData.music.url,
        title: postData.music.title,
        coverImgUrl: postData.music.coverImg

      })
      console.log(isPlayingMusic);
      this.setData({
        isPlayingMusic: true
      })
    }
  }
})