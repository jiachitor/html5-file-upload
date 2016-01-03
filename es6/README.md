## 项目说明
这是使用HTML5 技术实现的图片上传与图片裁剪功能。
实现技术：flow.js 和 cropperjs 。

注： HTML5 File API 不支持IE6, IE7, IE8, IE9

##### 关于 system.js 和 webpack 
我的思路是： 如果是demo 或者 小型的项目， 我们可以使用 gulp + system.js 来实现多功能的模块加载。 如果是 中大型项目，就是用 gulp + webpack 来实现。

###### demo 1
这是 HTML5 upload 原理演示。






# 如果安装过全局的 gulp 的话先卸载之
$ npm uninstall gulp -g

# 安装全局的 gulp 4.0
$ npm install "gulpjs/gulp#4.0" -g

# 到项目目录里删掉本地的 gulp
$ npm rm gulp --save-dev

# 安装本地的 gulp 4.0
$ npm install "gulpjs/gulp#4.0" --save-dev