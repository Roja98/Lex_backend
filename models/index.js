let mongoose = require('./connection');

module.exports = {
	role: require('./schema/role')(mongoose),
	user: require('./schema/user')(mongoose),
}
