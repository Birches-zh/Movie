// 页面里面实现的是页面生命周期的控制，而App.js则是整个应用程序的生命周期控制
// App({})这是全局对象
// app.js有三个生命周期
// 1、当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
// 2、当小程序启动，或从后台进入前台显示，会触发 onShow
// 3、当小程序从前台进入后台，会触发 onHide

// 小g加_下划线表示一个全局的变量
App({
  globalData:{
    g_isPlayingMusic:false,//这个是指代是否被播放
    g_currentMusicPostId:null,//这个是指代哪个音乐被播放
    doubanBase:"http://t.talelin.com"
  }
})