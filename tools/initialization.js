const User = require('../models/user');
const bcrypt = require('bcrypt');

const initialization = async () => {
	try {
		const EXIST_ADMIN = await User.findOne({ role: 'admin' });
		if (EXIST_ADMIN) {
			return console.log('Admin already created');
		}

		const ADMIN = new User({
			firstName: 'Reza',
			lastName: 'Mavadat',
			userName: 'Reza',
			mobile: '09125544712',
			sex: 'male',
			role: 'admin',
			password: '12345678',
		});
		bcrypt
			.hash(ADMIN.password, 10)
			.then((hash) => {
				ADMIN.password = hash;
				ADMIN.save();
				console.log('Admin created');
			})
			.catch((err) => {
				return err;
			});
	} catch (err) {
		console.log('Error in initialization function', err);
	}
};

module.exports = initialization;
