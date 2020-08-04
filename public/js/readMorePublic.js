const submitComment = document.getElementById('submitComment');
const addComment = document.getElementById('addComment');

// **************************************************************************
// **************************************************************************
// Post new comment

// // If not logged in first redirect to login page
// addComment.addEventListener('click', (e) => {
// 	e.preventDefault();
// 	if (sessionStorage.getItem('status') === null) {
// 		window.location.href = '/api/login';
// 	}
// });

// submitComment.addEventListener('click', (e) => {
// 	e.preventDefault();
// 	axios
// 		.post('/api/comments/addComment', {
// 			id: e.target.getAttribute('data-id'),
// 			message: document.getElementById('newCommentText').value,
// 		})
// 		.then((res) => {
// 			showAlertModal('success', res.data);
// 			// setTimeout(() => {
// 			// 	window.location.href = `http://localhost:3000/${e.target.getAttribute('data-id')}`;
// 			// }, 2000);
// 		})
// 		.catch((err) => {
// 			showAlertModal('danger', err.response.data);
// 		});
// });

// **************************************************************************
// **************************************************************************
// Functions

// Show alert box function
function showAlert(type, message) {
	document.getElementById('alert').classList = `alert alert-${type}`;
	document.getElementById('alert').innerText = message;
}

// show alert box in the modal
function showAlertModal(type, message) {
	document.getElementById('alertModal').classList = `d-block alert alert-${type}`;
	document.getElementById('alertModal').innerText = message;
}
