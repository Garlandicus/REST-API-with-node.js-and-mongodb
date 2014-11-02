// Userlist data array
var userListData = [];

// DOM Ready ---------------------------
$(document).ready(function() {
	//Pop. user table
	populateTable();
	//Username link click
	$('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
	//Add User button click
	$('#btnAddUser').on('click', addUser);
	//Delete User link click
	$('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
	//Update User button click
	$('#btnUpdateUser').on('click', updateUser);
});

// Functions ---------------------------

//Fill table with data
function populateTable() {
	var tableContent = '';

	//jQuery AJAX call for JSON
	$.getJSON( '/users/userlist', function (data) {
		userListData = data; //Not a good idea for large-scale operations
		$.each(data, function() {
			tableContent += '<tr>';
			tableContent += '<td><a href="#" class="linkshowuser" rel="'+ this.username + '" title="Show Details">' + this.username + '</a></td>';
			tableContent += '<td>' + this.email + '</td>';
			tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete!</a></td>';
			tableContent += '</tr>';
		});

		//Insert whole content string
		$('#userList table tbody').html(tableContent);
	})
}

//Show User Info
function showUserInfo(event) {
	//Prevent Link from firing
	event.preventDefault(); 					

	//Find user object
	var thisUserName = $(this).attr('rel');		
	var arrayPosition = userListData.map(function(arrayItem){
		return arrayItem.username;
	}).indexOf(thisUserName);
	var thisUserObject = userListData[arrayPosition];

	//Populate Info Box
	$('#userInfoName').text(thisUserObject.fullname);
	$('#userInfoAge').text(thisUserObject.age);
	$('#userInfoGender').text(thisUserObject.gender);
	$('#userInfoLocation').text(thisUserObject.location);

	//Populate Update User Box
	$('#updateUser fieldset input#updateUserName').val(thisUserObject.username);
	// $('#updateUser fieldset input#updateUserEmail').val(thisUserObject.email);
	$('#updateUser fieldset input#updateUserFullName').val(thisUserObject.fullname);
	$('#updateUser fieldset input#updateUserAge').val(thisUserObject.age);
	$('#updateUser fieldset input#updateUserLocation').val(thisUserObject.location);
	$('#updateUser fieldset input#updateUserGender').val(thisUserObject.gender);
}

// Add User
function addUser(event) {
	event.preventDefault();

	//Basic Validation
	var errorCount = 0;
	$('#addUser input').each(function(index, val) {
		if($(this).val() == '') { errorCount++; }
	});

	//Check and make sure errorCount's still at zero
	if(errorCount === 0) {
		//If it is, compile user info into new object
		var newUser = {
			'username': $('#addUser fieldset input#inputUserName').val(),
			'email': 	$('#addUser fieldset input#inputUserEmail').val(),
			'fullname': $('#addUser fieldset input#inputUserFullname').val(),
			'age': 		$('#addUser fieldset input#inputUserAge').val(),
			'location': $('#addUser fieldset input#inputUserLocation').val(),
			'gender': 	$('#addUser fieldset input#inputUserGender').val()
		}

		//Use AJAX to post the object to our adduser service
		$.ajax({
			type: 'POST',
			data: newUser,
			url:  '/users/adduser',
			dataType: 'JSON'
		}).done(function( response ) {
			//Successful response should be blank!
			if (response.msg === '') {
				//Clear the form inputs
				$('#addUser fieldset input').val('');
				//Update the table
				populateTable();
			} else {
				alert('Error: ' + response.msg);
			}
		});
	} else {
		alert('Please fill in all fields. Currently Missing ' + errorCount + ' fields.');
		return false;
	}
}

// Delete User
function deleteUser(event) {
	event.preventDefault();

	// Pop up a confirmation dialog
	var confirmation = confirm ('Are you sure you want to delete this user?');

	// Check and make sure the user confirmed
	if (confirmation === true) { 

		//If they did, delete away...
		$.ajax({
			type: 'DELETE',
			url: '/users/deleteuser/' + $(this).attr('rel')
		}).done(function( response ) {
			//Successful response should be blank!
			if (response.msg === '') {
				//We don't have to do anything special here...
			} else {
				alert('Error:' + response.msg);
			}

			//Update the table
			populateTable();
		})
	} else {
		//If they said no to the confirm
		alert("Thank heavens... please don't scare me like that again.");
	}
}

// Update User
//TODO Currently receiving a 500 server error on PUT
function updateUser(event) {
	event.preventDefault();

	//Basic Validation
	var errorCount = 0;
	$('#updateUser input').each(function(index, val) {
		if($(this).val() == '') { errorCount++; }
	});

	//Check and make sure errorCount's still at zero
	if(errorCount === 0) {

		var thisUserName = $('#updateUser fieldset input#updateUserName').val();
		var arrayPosition = userListData.map(function(arrayItem){
			return arrayItem.username;
		}).indexOf(thisUserName);
		var thisUserObject = userListData[arrayPosition];

		//If it is, compile user info into new object
		var updateUser = {
			'id' : 
			'fullname': $('#updateUser fieldset input#updateUserFullname').val(),
			'age': 		$('#updateUser fieldset input#updateUserAge').val(),
			'location': $('#updateUser fieldset input#updateUserLocation').val(),
			'gender': 	$('#updateUser fieldset input#updateUserGender').val()
		}

		//Use AJAX to post the object to our adduser service
		$.ajax({
			type: 'PUT',
			data: updateUser,
			url: '/users/updateUser/' + arrayPosition,
			dataType: 'JSON'
		}).done(function( response ) {
			//Successful response should be blank!
			if (response.msg === '') {
				//Update the table
				populateTable();
			} else {
				alert('Error: ' + response.msg);
			}
		});
	} else {
		alert('Please fill in all fields. Currently Missing ' + errorCount + ' fields.');
		return false;
	}
}