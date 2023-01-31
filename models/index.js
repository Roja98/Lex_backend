let mongoose = require('./connection');

module.exports = {
	user: require('./schema/user')(mongoose)
}
