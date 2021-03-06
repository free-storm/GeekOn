var mongoose = require('mongoose');
var Article = mongoose.model('Article');
var sanitize = require('validator').sanitize;

exports.article = function(req, res, next, id){
  var User = mongoose.model('User');
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.render('404');
  }

  Article.load(id, function (err, article) {
    if (err) return next(err);
    if (!article) return res.render('404');
    req.article = article;
    next();
  });
};

exports.articles = function(req, res, next) {
  var options = {
    perPage: 5,
    page: 0
  };

  Article.list(options, function (err, articles) {
    if (err) return next(err);
    req.articles = articles;
    next();
  });
};

exports.new = function (req, res) {
  res.render('articles/new', {
    title: '新建文章',
    article: new Article({})
  });
};

/**
 * Create an article
 */
 exports.create = function (req, res) {
  var article = new Article({
    title: sanitize(req.body.title).xss(),
    body: sanitize(req.body.body).xss()
  });

  article.save(function (err) {
    if (err) {
      res.render('articles/new', {
        title: '新建文章',
        article: article,
        errors: err.errors
      });
    }
    else {
      req.flash('success','成功创建新文章');
      res.redirect('/articles/'+article._id);
    }
  });
};

exports.show = function(req, res){
  res.render('articles/show', {
    title: req.article.title,
    article: req.article,
    articles: req.articles
  });
};

/**
 * Delete an article
 */

 exports.destroy = function(req, res){
  var article = req.article;
  article.remove(function(err){
    req.flash('success', 'Deleted successfully');
    res.redirect('/articles');
  });
};



exports.index = function(req, res){
  var page = req.param('page') > 0 ? req.param('page') : 0;
  var perPage = 15;
  var options = {
    perPage: perPage,
    page: page
  };

  Article.count().exec(function (err, count) {
    res.render('articles/index', {
      title: '最新动态',
      articles: req.articles,
      page: page,
      pages: count / perPage
    });
  });
};

exports.edit = function (req, res) {
  res.render('articles/edit', {
    title: 'Edit '+req.article.title,
    article: req.article
  });
};

exports.update = function (req, res) {
  var article = req.article;
  req.article.title = sanitize(req.body.title).xss();
  req.article.body = sanitize(req.body.body).xss();

  article.save(function (err, article) {
    if (err) {
      res.render('articles/edit', {
        title: '编辑文章',
        article: article,
        errors: err.errors
      });
    }
    else {
      req.flash("success","修改成功！");
      req.article = article;
      res.redirect('/articles/' + article._id);
    }
  })
};
