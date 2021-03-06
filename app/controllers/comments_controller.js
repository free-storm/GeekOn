var sanitize = require('validator').sanitize;
exports.create = function (req, res, next) {
    var project = req.project || null;
    var article = req.article || null;
    var user = req.session.user;

    if (project && !article){
        if (!req.body['comment']) return res.redirect('/projects/'+ project._id);
        project.addComment(user, sanitize(req.body['comment']).xss(), function (err) {
            if (err) return next(err);
            res.redirect('/projects/'+ project.id);
        });
    } else {
     if (!req.body['comment']) return res.redirect('/articles/'+ article._id);
     article.addComment(user, sanitize(req.body['comment']).xss(), function (err) {
         if (err) return next(err);
         res.redirect('/articles/'+ article.id);
     });
 }
};
