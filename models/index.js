let mongoose = require('./connection');

module.exports = {
	role: require('./schema/role')(mongoose),
	user: require('./schema/user')(mongoose),
	category: require('./schema/category')(mongoose),
	faq: require('./schema/faqs')(mongoose)
}
