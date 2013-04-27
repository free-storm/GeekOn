var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
	name: String,
	provider: {type : Schema.ObjectId, ref : 'User'},
	preview: String,
	requirement: String,
	Participants: [{type : Schema.ObjectId, ref : 'User'}],
	comments: [{
		body: { type : String, default : '' },
		user: { type : Schema.ObjectId, ref : 'User' },
		createdAt: { type : Date, default : Date.now }
	}],
	createdAt: { type: Date, default : Date.now }
});

ProjectSchema.methods = {
	addComment: function (user, comment, cb) {
		this.comments.push({
			body: comment,
			user: user._id
		})
		this.save(cb)
	}

}
ProjectSchema.statics = {

  
  load: function (id, cb) {
    this.findOne({ _id : id })
      .populate('user', 'name email')
      .populate('comments.user')
      .exec(cb)
  },

  /**
   * List articles
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  list: function (options, cb) {
    var criteria = options.criteria || {}

    this.find(criteria)
      .populate('user', 'name')
      .sort({'createdAt': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  }

}

mongoose.model('Project', ProjectSchema);