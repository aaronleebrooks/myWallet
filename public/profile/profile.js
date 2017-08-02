const profileUrl = 'http://localhost:8080/users/dashboard/'

const pageId = sessionStorage.getItem("id")
const pageUser = sessionStorage.getItem("username")

function addButton(){
	$('#first-line').replaceWith('<p id="first-line">Hello, '+ pageUser +' <a href="../index.html" id="log-out">Log Out</a></p>');
		$('#addForm').on('click', function(event) {
			event.preventDefault();
			$('#addForm').replaceWith('<form id="addForm">' +
					'<label>Item Name</label>' +
					`<input id="item-name" type="text" name="username" placeholder="ex. Visa Card, Driver's License, picture of Mom" for= "item name">` +

					'<label>Item Description</label>' +
					'<input id="item-desc" type="text" name="desc" placeholder="Short description. Do not put any card numbers here" for="item description">' +

					'<label>URL</label>' +
					'<input id="item-link" type="text" name="link" placeholder="Link to item or how to replace" for="item description">' +

					'<label>Picture</label>' +
					'<input id="item-img" type="text" name="img" placeholder="URL to image" for="item image">' +
					'<button id="addCloseButton" class="button" type="button">Close</button>' +
					'<button id="submitButton" class="button" type="submit">Add something to your wallet</button>' +
				'</form>'
				)
			addItem();
			closeButton();
		});
}


function closeButton() {
	$('#addCloseButton').on('click', function(event) {
		event.preventDefault();
		$('#addForm').replaceWith(
		'<form id="addForm">' +
			'<button class="button" type="submit">Add something to your wallet</button>' +
		'</form>');
		addButton();
})
}

function addItem() {
	$('#addForm').on('submit', function(event){
		event.preventDefault();
		let postBody = {
			name: $('#item-name').val(),
			description: $('#item-desc').val(),
			url: $('#item-link').val(),
			image: $('#item-img').val()
		};
		console.log(postBody, 'postBody')
	$.ajax({ 
		url: profileUrl+pageId, 
		type: 'POST',
		data: JSON.stringify(postBody),
		dataType: 'json',
    	contentType: 'application/json',
		 success: function() { 
		 	location.reload();
		},
      error: function(res) {
		console.log(res);
         }
	})
	})
}

function deleteItem(cardId) {
	$('#'+cardId+' #deleteItem').on('click', function(event){
		event.preventDefault();
		let postBody = {id: cardId};
		console.log(postBody, 'postBody')
	$.ajax({ 
		url: profileUrl+pageId, 
		type: 'DELETE',
		data: JSON.stringify(postBody),
		dataType: 'json',
    	contentType: 'application/json',
		success: function() { 
		 	location.reload();
		},
      error: function(res) {
		console.log(res);
         }
	})
	})
}

function updateItem(card) {
	$('#'+card._id+' .updateItem').on('click', function(event){
		event.preventDefault();
		$('#'+card._id).replaceWith('<form id="'+card._id+'" class="updateForm">' +
			'<label>Item Name</label>' +
			'<input id="update-name" type="text" name="username" value="'+ card.name +'" for= "update name">' +

			'<label>Item Description</label>' +
			'<input id="update-desc" type="text" name="desc" value="'+card.description+'">' +

			'<label>URL</label>' +
			'<input id="update-link" type="text" name="link" value="'+card.url+'" for="update description">' +

			'<label>Picture</label>' +
			'<input id="update-img" type="text" name="img" value="'+card.image+'" for="update image">' +
			'<button id="closeButton" class="close button" type="button">Close</button>' +
			'<button class="submitUpdateButton" class="button" type="button">Update your wallet</button>' +
		'</form>'
		)
	putItem(card._id);
	closeUpdater(card);
});
}

function closeUpdater(card) {
	$('#closeButton').on('click', function(event) {
		console.log('helo')
		event.preventDefault();
		$('#'+card._id).replaceWith(
			'<div class="searchCard" id="'+card._id+'">' +
			'<h2>'+ card.name+'</h2>' +
			'<input id="minusSign" class="plusMinusButtons hidden" type="image" src="http://downloadicons.net/sites/default/files/minus-symbol-63799.png" alt="submit">' +
			'<input id="plusSign" class="plusMinusButtons" type="image" src="http://pngimages.net/sites/default/files/plus-png-image-80268.png" alt="submit">' +
			'<img class="searchImg hidden" src="'+ card.image + '">' +
			'<form class="replaceItem hidden" action="' + card.url +'" target="_blank">' +
				'<button class="button" "target="_blank">Replace?</button>'+
			'</form>' +
			'<form id="deleteItem" class="hidden">' +
				'<button id="deleteButton" class="button" type="button" alt="submit">Not in your Wallet?</button>'+
			'</form>' +
			'<form class="updateItem hidden">' +
				'<button id="updateButton" class="button" type="button" alt="submit">Need to Fix Something?</button>'+
			'</form>' +
			'<p class="hidden">'+ card.description+'</p>' +
			'</div>');
		deleteItem(card._id);
		updateItem(card);
		addAllTheThings(card._id);
})
}

function putItem(cardId) {
	console.log('hello')
	$('#'+cardId+' .submitUpdateButton').on('click', function(event){
		event.preventDefault();
		let postBody = {
			name: $('#update-name').val(),
			description: $('#update-desc').val(),
			url: $('#update-link').val(),
			image: $('#update-img').val(),
			id: cardId
		};
		console.log(postBody, 'postBody')
	$.ajax({ 
		url: profileUrl+pageId, 
		type: 'PUT',
		data: JSON.stringify(postBody),
		dataType: 'json',
    	contentType: 'application/json',
		 success: function() { 
		 	location.reload();
		},
      error: function(res) {
		console.log(res);
         }
	})
	})
}

function showWallets(walletArray) {
	walletArray.forEach(function(walletIndex) {
		$('#walletItems').append(
			'<div class="searchCard" id="'+walletIndex._id+'">' +
			'<h2>'+ walletIndex.name+'</h2>' +
			'<input id="minusSign" class="plusMinusButtons hidden" type="image" src="http://downloadicons.net/sites/default/files/minus-symbol-63799.png" alt="submit">' +
			'<input id="plusSign" class="plusMinusButtons" type="image" src="http://pngimages.net/sites/default/files/plus-png-image-80268.png" alt="submit">' +
			'<img class="searchImg hidden" src="'+ walletIndex.image + '">' +
			'<form class="replaceItem hidden" action="' + walletIndex.url +'" target="_blank">' +
				'<button class="button" "target="_blank">Replace?</button>'+
			'</form>' +
			'<form id="deleteItem" class="hidden">' +
				'<button id="deleteButton" class="button" type="button" alt="submit">Not in your Wallet?</button>'+
			'</form>' +
			'<form class="updateItem hidden">' +
				'<button id="updateButton" class="button" type="button" alt="submit">Need to Fix Something?</button>'+
			'</form>' +
			'<p class="description hidden">'+ walletIndex.description+'</p>' +
			'</div>');
		deleteItem(walletIndex._id);
		updateItem(walletIndex);
		addAllTheThings(walletIndex._id);
	})

}

function addAllTheThings(walletId) {

	$('#'+walletId+ ' .plusMinusButtons').on('click', function(){
		$('#'+walletId+ ' .plusMinusButtons').toggleClass('hidden');
		$('#'+walletId+ ' .searchImg').toggleClass('hidden');
		$('#'+walletId+ ' .replaceItem').toggleClass('hidden');
		$('#'+walletId+ ' .updateItem').toggleClass('hidden');
		$('#'+walletId+ ' #deleteItem').toggleClass('hidden');
		$('#'+walletId+ ' .description').toggleClass('hidden');
	})
}

$('#log-out').on('click', function(event) {
	sessionStorage.clear();
});

function getWallet() {
	console.log(profileUrl+pageId);
	$.ajax({ 
		url: profileUrl+pageId, 
		type: 'GET',
		 success: function(user) { 
		 	console.log(user);
		 	showWallets(user.wallet);
		},
      error: function(res) {
		console.log(res);
         }
	})
}

function displayWallet(walletItem) {
	$('#walletItems').append()
}

$(function() {
	getWallet();
	addButton();
});
