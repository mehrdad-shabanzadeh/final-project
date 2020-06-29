// For Edit
// document.getElementById('edit').addEventListener('click', (e) => {
// 	// alert(e.target.dataset.id);
// 	axios('/', { id: e.target.dataset.id })
// 		.then((res) => {})
// 		.catch((err) => {});
// });

// LOGOUT
document.getElementById('logout').addEventListener('click', function (e) {
	e.preventDefault();
	if (confirm('Are you sure?')) {
		console.log('logout');
		axios
			.get('/api/user/logout')
			.then((res) => {
				// console.log(res);
				// console.log(res.data);
				window.location.href = 'http://localhost:3000';
			})
			.catch((err) => {
				console.log(err);
			});
	}
});
