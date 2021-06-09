//get platform source: https://github.com/bestiejs/platform.js

function startup(){
	detectManufacturer();
	add_event_listeners();
	modal();
}

document.addEventListener("DOMContentLoaded", startup);

function detectManufacturer(){
	var parser = new UAParser();
	var result = parser.getResult();
	let checkvar = 'hey!';
	var message;

	if (typeof(checkvar) !== 'undefined'){
		message = "JS is ES6 and above";
	} else{
		message = "JS is below ES6";
	}

	alert(
		message + '\n\n' +
		'ua-parser-js' + '\n' +
		'Device Vendor: ' + result.device.vendor + '\n\n' +

		'Platform JS' + '\n' +
		'Name: ' + platform.name + '\n' + // 'IE'
		'Version: ' + platform.version + '\n' +  // '10.0'
		'Layout: ' + platform.layout + '\n' +// 'Trident'
		'OS: ' + platform.os + '\n' + // 'Windows Server 2008 R2 / 7 x64'
		'Description: ' + platform.description+ '\n' +// 'IE 10.0 x86 (platform preview; running in IE 7 mode) on Windows Server 2008 R2 / 7 x64'
		'Product: ' + platform.product + '\n' +
		'Manufacturer: ' + platform.manufacturer
		);

}

function add_event_listeners(){

	//Main Function

	//tap bubbles
	setTimeout(()=>{ tap_here_add() }, 4000);
	setTimeout(()=>{ tap_here_remove() }, 10000);

	document.addEventListener('scroll', tap_here_remove);
	document.addEventListener('click', tap_here_remove);

	//no products add a product
	var noProducts = document.querySelector('.add-a-product');
	noProducts.addEventListener('click', no_items_add_a_product);

	/* float circles */
	var circlesCount = document.querySelectorAll('.circle').length;
	var circle;

	//get all instances of elements with the "circle" class
	for (var i = 0; i < circlesCount; i++){
		circle = document.querySelectorAll('.circle')[i];
		circle.addEventListener("click", float_circles);
	}

	/* copy */
	var copyButton = document.querySelector('.copy-button p');
	copyButton.addEventListener("click", copy_order_form);

	/* dropdown */
	var dropdown = document.querySelector('#product-categories');

	dropdown.addEventListener("change", function(){
		var selectedOption = this[this.selectedIndex];
		var text = selectedOption.text;

		collections_change( filter_text_from_string("Categories:", text) );
	});

	/* modal height */
	window.addEventListener('resize', modalHeight);
	window.addEventListener('load', modalHeight);

	collections_items_count();
	item_names_as_classes_on_images();

	/* add to cart */
	var addToCartButton = document.querySelector('#addToCart');
	var textArea = document.querySelector('#order-product-quantity');
	
	addToCartButton.addEventListener('click', function(){

		var quantityField = document.querySelector('.quantityCart input');

		var thisProduct = this.parentElement.parentElement.querySelector('.modal-heading').textContent;
		var thisProductPrice = this.parentElement.parentElement.querySelector('.modal-price').textContent;
		var thisProductQuantity = this.parentElement.parentElement.querySelector('.quantityCart input').value;

		add_to_cart(thisProductQuantity, thisProduct, thisProductPrice);

	});

	//remove from cart
	document.addEventListener('click', function(e){
	
	if (e.target && e.target.id == 'remove-item'){
		var thisProduct = e.target.parentElement.querySelector('.product').textContent;

		remove_from_cart(thisProduct);
		}
	});

}

//dropdown change
function collections_change(text){
	var collectionID = text.replace(/\s/g, "").replace("Collection", "-Collection").toLowerCase();
	var newID;
	var collection = document.querySelectorAll(".collection");

	for (var i=0; i < collection.length; i++){

		if(collectionID.indexOf("-collection") < 1){
			newID = collectionID + '-collection';
		} else{
			newID = collectionID;
		}
		
		if ( collection[i].classList.contains('active') ){
			collection[i].classList.remove('active');
		}

		document.querySelector('.' + newID).classList.add('active');
	}
	
}

function collections_items_count(){
	var collection = document.querySelectorAll('.collection');

	for (var i = 0; i < collection.length; i++){
		count_items(collection[i].id);
	}
}

function item_names_as_classes_on_images(){
	var itemContainer = document.querySelectorAll('.item-container');
	var itemName, itemImage, sanitizedName;

	for (var i = 0; i < itemContainer.length; i++){
		itemName = itemContainer[i].querySelector('.product-name').textContent;
		itemImage = itemContainer[i].querySelector('.image img');

		sanitizedName = itemName.trim()
											 .toLowerCase()
											 .replaceAll(" ", "-")
											 .replaceAll("'", "")
											 .replaceAll("&", "")
											 .replaceAll("--", "-");

		itemImage.classList.add(sanitizedName + '-image');
	}
}

function count_items(elementID){ //not yet done
	var countChildren = document.querySelector('#' + elementID);
	var itemsContainer = countChildren.querySelectorAll('.items-container');
	var count = parseInt(countChildren.querySelectorAll('.items-container > div').length);

	for(var i = 0; i < itemsContainer.length; i++){

		switch (itemsContainer.length){

			case 2:
				switch(count){
					case 4:
						itemsContainer[i].classList.add('two-columns');
					break;

					case 1:
						itemsContainer[i].classList.add('one-column');
					break;

					default:
						itemsContainer[i].classList.add('three-columns');
				}

			break;

			default:

				switch(count){
					case 4:
						itemsContainer[i].classList.add('two-columns');
					break;

					case 1:
						itemsContainer[i].classList.add('one-column');
					break;

					default:
						itemsContainer[i].classList.add('three-columns');
				}
		}
	}
}

//modal functions
function modalHeight(){
	var modalContainer = document.querySelector('.modal-content-container');
	var modalImageContainer = document.querySelector('.modal-image-container');
	var windowHeight = window.screen.height;
	var windowWidth = window.screen.width;

	if (windowWidth <= 992 && windowWidth > 600){
		modalImageContainer.style.maxHeight = (modalContainer.offsetHeight / 2) + 'px';
	}

	else if (windowWidth <= 600){
		modalImageContainer.style.maxHeight = ( (modalContainer.offsetHeight / 2) - 60 ) + 'px';

		if(windowHeight <= 600){
			modalImageContainer.style.maxHeight = ( (modalContainer.offsetHeight / 2) - 100 ) + 'px';
		}
	}

	else{
		modalImageContainer.style.maxHeight = modalContainer.offsetHeight + 'px';
	}
}

function add_class_to_modal_heading(name){
	var modalHeading = document.querySelector('.modal-heading');
	var className = name.trim()
											 .toLowerCase()
											 .replaceAll(" ", "-")
											 .replaceAll("'", "")
											 .replaceAll("&", "")
											 .replaceAll("--", "-");

	modalHeading.classList.add( className );
}

function remove_classes_from_modal_heading(){
	var modalHeading = document.querySelector('.modal-heading');
	modalHeading.className ="modal-heading"; 
}

function hide_overflow(scrollAmount){

	var body = document.body;
	var html = document.body.parentElement;

	window.scrollTo(0, scrollAmount - 400);

	html.style.overflowY = 'hidden';
	body.style.overflowY = 'hidden';

}

function visible_overflow(){

	var body = document.body;
	var html = document.body.parentElement;

	html.style.overflowY = 'visible';
	body.style.overflowY = 'visible';

}

/* Find the position of an object. Source: https://www.quirksmode.org/js/findpos.html */
function findPos(obj) {
	var curleft = curtop = 0;

	if (obj.offsetParent) {
		do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
			} while (obj = obj.offsetParent);
		return [curleft,curtop];
	}
}

function modal(){
	var closeModal = document.querySelector('.close-modal');
	var imageCount = document.querySelectorAll('.image').length;
	var openModal, currentSelectPrice, clickedObject, scrollAmount;
	var scrollFinal = 0;

	for (var j = 0; j < imageCount; j++){
		openModal = document.querySelectorAll('.image')[j];
		openModal.addEventListener('click', function(e){

		var thisItem = this;
		
		var thisItemName = this.parentElement.parentElement.querySelector('.product-name');
		var targetName = e.target.parentElement.parentElement.parentElement.querySelector('.product-name');

		if (thisItemName.textContent === targetName.textContent){
			var sanitizedName = targetName.textContent.trim()
											 .toLowerCase()
											 .replaceAll(" ", "-")
											 .replaceAll("'", "")
											 .replaceAll("&", "")
											 .replaceAll("--", "-");

		clickedObject = document.querySelector('.' + sanitizedName + '-image');

		scrollAmount = findPos(clickedObject)[1];

		}

		var currentSelect = thisItem.parentElement.parentElement.querySelector('.product-name').textContent;
		var currentSelectDesc = thisItem.parentElement.parentElement.querySelector('.product-desc').innerHTML;
		var currentSelectImage = thisItem.parentElement.parentElement.querySelector('.image img').src;
		if (thisItem.parentElement.parentElement.querySelector('.box-price') != null){
			currentSelectPrice = thisItem.parentElement.parentElement.querySelector('.box-price').textContent;
		}

		modal_open(currentSelect, currentSelectImage, currentSelectDesc, currentSelectPrice, scrollAmount);

		});

	} 

	closeModal.addEventListener("click", () => { modal_close() });
}

function modal_open(name, image, info, price, scrollAmount){

	hide_overflow(scrollAmount);

	var className = name.trim()
											 .toLowerCase()
											 .replaceAll(" ", "-")
											 .replaceAll("'", "")
											 .replaceAll("&", "")
											 .replaceAll("--", "-");

	var modalBG = document.querySelector('.modal-bg');
	var modal = document.querySelector('.modal-container');
	var imageModal = document.querySelector('.modal-image-container img');
	var modalHeading = document.querySelector('.modal-heading');
	var modalDesc = document.querySelector('.modal-description');
	var modalPrice = document.querySelector('.modal-price');
	var addToCart = document.querySelector('.addToCartContainer');

	add_class_to_modal_heading(name);

	if (className === 'cookie-cake' || className === 'bite-sized-cookies'){
			modal.querySelector('.' + className).parentElement.querySelector('.addToCartContainer').classList.add('hide');
			modal.querySelector('.' + className).parentElement.querySelector('.modal-price').classList.add('hide');
	} 

	else{
			modal.querySelector('.' + className).parentElement.querySelector('.addToCartContainer').classList.remove('hide');
			modal.querySelector('.' + className).parentElement.querySelector('.modal-price').classList.remove('hide');
	}

	imageModal.src = image;
	imageModal.alt = name;
	modalHeading.textContent = name;
	modalDesc.innerHTML = info;
	if (price){
		modalPrice.textContent = price;
	}
	modal.classList.add('active');
	modalBG.classList.add('active');

}

function modal_close(){

	var modalBG = document.querySelector('.modal-bg');
	var modal = document.querySelector('.modal-container');
	var added = document.querySelector('.added');
	var productQuantity = document.querySelector('.quantityCart input');
	productQuantity.value = 1;
	added.classList.remove('shown');
	modal.classList.remove('active');
	modalBG.classList.remove('active');

	remove_classes_from_modal_heading();
	visible_overflow();

}

//copy order form button
function copy_order_form(){
		//form input elements
    var orderForm = document.querySelector("#order-form");
    var name = orderForm.querySelector("input[name='order-name']");
    var number = orderForm.querySelector("input[name='order-number']");
    var address = orderForm.querySelector("textarea[name='order-address']");
    var products = orderForm.querySelector("div[name='order-product-quantity']");
    var schedule = orderForm.querySelector("input[name='order-schedule']");
    var modeOfPayment = orderForm.querySelector("input[type='radio'][name='order-mode-of-payment']");
    var modeOfPaymentChecked = orderForm.querySelector("input[type='radio'][name='order-mode-of-payment']:checked") || 'Waley';

    //form labels
    var label_name = name.previousElementSibling.textContent;
    var label_number = number.previousElementSibling.textContent;
    var label_address = address.previousElementSibling.textContent;
    var label_products = products.previousElementSibling.textContent;
    var label_schedule = schedule.previousElementSibling.textContent;
    var label_modeOfPayment = modeOfPayment.parentElement.previousElementSibling.textContent;

    var order_products = products.querySelectorAll('.cart-item');
    var products_final = "";
    var address_sanitized = "";

    //get the data from all the products in the order formn
    for (var i = 0; i < order_products.length; i++){
    	var product_order_name = order_products[i].querySelector('.product').textContent;
    	var product_order_quantity = order_products[i].querySelector('.quantity').textContent;
    	var product_order_price = order_products[i].querySelector('.total-price').textContent;
    	var product_boxes = ' Box of 6';

    	if (product_order_name == 'Assorted'){
    		product_boxes = ' Box of 8';
    	}

    	products_final += product_order_quantity + 'x ' + product_order_name + ' ' + product_boxes + ' ' + product_order_price + ' PHP' + '\n';
    }

    //separate google maps link from actual address
    address_sanitized += address.value.trim().replace("https", "\nhttps");

    //form labels + values
    var order = label_name + " " + name.value + '\n';
    		order += label_number + " " + number.value + '\n';
    		order += label_address + " \n" + address.value + '\n\n';
    		order += label_products + " \n" + products_final + '\n';
    		order += 'Total Price: ' + get_total_price() + ' PHP \n\n';
    		order += label_schedule + " " + schedule.value + '\n';
    		order += label_modeOfPayment + " " + modeOfPaymentChecked.value;

    var input = document.createElement("textarea");

    if(order){
    	input.value = strip_whitespaces(order);
	    document.body.appendChild(input);
	    input.value = input.value.replace("(i.e. 1 - Assorted Box of 6, etc..)", "");
	    input.value = input.value.replace("(Please attach a google map link)", "");
	    input.select();
	    document.execCommand("Copy");
	    input.remove();

	    confirm_copy();

	    setTimeout( () => {
	    	scroll_to_socmed();
	      dm_us();
	    }, 500);
	    
    }
}

function tap_here_add(){
	var firstItem = document.querySelector('.item-container:first-child');
	firstItem.querySelector('.tap-bubble-container').classList.add('show');
}

function tap_here_remove(){
	var firstItem = document.querySelector('.item-container:first-child');
	firstItem.querySelector('.tap-bubble-container').classList.remove('show');
}

function confirm_copy(){
	var chatBubble = document.querySelector('.confirm-bubble');

	if (chatBubble.classList.contains('confirming')){
		chatBubble.classList.remove("confirming");
	}

	else{
		chatBubble.classList.add("confirming");
		setTimeout(() => {chatBubble.classList.remove("confirming")}, 2000);
	}

}

function dm_us(){
	var chatBubble = document.querySelector('.socmed-bubble');

	if (chatBubble.classList.contains('dm-us')){
		chatBubble.classList.remove("dm-us");
	}

	else{
		chatBubble.classList.add("dm-us");
		setTimeout(() => {chatBubble.classList.remove("dm-us")}, 6000);
	}

}

//sanitize copied texts
function strip_whitespaces(string){
	return string.replace(/\t+/g, "");
}

function filter_text_from_string(text,string){
	var filtered = string.replace(text, "");
	return filtered;
}

function filter_price_from_string(string){
	var pattern = /[0-9]+/;
	var price = string.slice(string.length - 7);
	var filteredPrice = price.match(pattern);//i.e. filter to 300, 320... - without the PHP

	return Math.max(filteredPrice);
}

//scroll functions
function no_items_add_a_product(){
	scroll_to('.our-products-header');
}

function scroll_to(element){
	var elementToScrollTo = document.querySelector(element);
	var topPos = elementToScrollTo.offsetTop - 0;

	window.scrollTo(0, topPos);
}

function scroll_to_socmed(){
	var socmed = document.querySelector('.socmed');
	var topPos = socmed.offsetTop - 400;

	window.scrollTo(0, topPos);
}

//add/remove "float" class
function float_circles(){

	if (this.classList.contains('float')){
		this.classList.remove("float");
	} else {
		this.classList.add("float");
	}

	this.addEventListener("animationend", float_circles);
}

//cart functions
function store_to_cart(quantity, name, price){
	var productQuantityElement = document.querySelector('.order-product-quantity');
	var productQuantityStore = document.createElement('div');
	var productStorage = document.createElement('div');
	var quantityStorage = document.createElement('div');
	var priceStorage = document.createElement('div');
	var totalPriceStorage = document.createElement('div');
	var removeItem = document.createElement('div');

	var sameName, sameNameQuantity, sameNamePrice;
	var added_already_bool = already_added_to_cart(name);
	var sanitizedName = name.trim()
											 .toLowerCase()
											 .replaceAll(" ", "-")
											 .replaceAll("'", "")
											 .replaceAll("&", "")
											 .replaceAll("--", "-");

	if (added_already_bool === true){

		sameName = productQuantityElement.querySelector('.order-' + sanitizedName + ' .product').textContent;
		sameNameQuantity = parseFloat(productQuantityElement.querySelector('.order-' + sanitizedName + ' .quantity').textContent);
		sameNamePrice = parseFloat(productQuantityElement.querySelector('.order-' + sanitizedName + ' .price').textContent);
		
		if (sameName == name){

			var newQuantity = parseInt(quantity) + sameNameQuantity;
			var newPrice = parseFloat(filter_price_from_string(price)) + parseFloat(sameNamePrice * sameNameQuantity);

			productQuantityElement.querySelector('.order-' + sanitizedName + ' .quantity').textContent = newQuantity;
			productQuantityElement.querySelector('.order-' + sanitizedName + ' .total-price').textContent = newPrice;

		}
	}

	else{

		if (sameName != name){

			productQuantityElement.appendChild(productQuantityStore).classList.add('order-' + sanitizedName, 'cart-item');
			productQuantityStore.appendChild(quantityStorage).classList.add('quantity');
			document.querySelector('.order-product-quantity .order-' + sanitizedName + ' .quantity').textContent = quantity;
			productQuantityStore.appendChild(productStorage).classList.add('product');
			document.querySelector('.order-product-quantity .order-' + sanitizedName + ' .product').textContent = name;
			productQuantityStore.appendChild(priceStorage).classList.add('price');
			document.querySelector('.order-product-quantity .order-' + sanitizedName + ' .price').textContent = filter_price_from_string(price);
			productQuantityStore.appendChild(totalPriceStorage).classList.add('total-price');
			document.querySelector('.order-product-quantity .order-' + sanitizedName + ' .total-price').textContent = (parseInt(filter_price_from_string(price)) * parseInt(quantity));
			productQuantityStore.appendChild(removeItem).classList.add('remove-item');
			document.querySelector('.order-product-quantity .order-' + sanitizedName + ' .remove-item').id = 'remove-item';
			document.querySelector('.order-product-quantity .order-' + sanitizedName + ' .remove-item').textContent = '+';

			var productCount = document.querySelectorAll('.order-product-quantity > div').length;
			var filteredPrice = filter_price_from_string(price);
			var totalPrice = filteredPrice * quantity;

		}

	}
	
}

function already_added_to_cart(name){
	
	var productCount = document.querySelectorAll('.order-product-quantity > div').length;
	var added = false;
	var sanitizedName = name.trim()
											 .toLowerCase()
											 .replaceAll(" ", "-")
											 .replaceAll("'", "")
											 .replaceAll("&", "")
											 .replaceAll("--", "-");
	var product, productName;

	for(var i=0; i < productCount; i++){
		product = document.querySelectorAll('.order-product-quantity > div')[i];
		
		if (product.querySelector('.product') ){
			productName = product.querySelector('.product').textContent;
		}
		else{
			console.error('No product yet');
		}
		
		var countProduct = 0;

		if (productName == name){
			countProduct += 1;
			
			if (countProduct > 0){
				added = true;
			}

			else{
				added = false;
			}

		}

	}

	return added;
}

function add_to_cart(quantity, name, price){

	var productQuantity = document.querySelector('.order-product-quantity');
	var noProducts = document.querySelector('.no-products-yet');
	var added = document.querySelector('.added');
	var addButton = document.querySelector('#addToCart p');
	var windowHeight = window.screen.height;
	var windowWidth = window.screen.width;

	if (windowWidth <= 768 && windowWidth > 600 ){
		addButton.textContent = "Added!";
	}

	else if ( windowWidth <= 600 ){
		addButton.textContent = "Added to Orders!";
	}

	else{
		addButton.textContent = "Added to Orders!";
	}

	added.classList.add('shown');

	store_to_cart(quantity, name, price);

	noProducts.classList.add('hide');

	display_total_price(get_total_price());

	setTimeout( () => {
		added.classList.remove('shown');
		addButton.textContent = "Add to Order";
	}, 1500);

}

function get_total_price(){
	var priceStore = document.querySelectorAll('.order-product-quantity > div');
	var prices;
	var sum = 0;

	for (var i = 0; i < priceStore.length; i++){
		prices = priceStore[i].querySelector('.total-price').textContent;
		sum += parseInt(prices);
	}

	return sum;
}

function remove_from_cart(name){
	var product = document.querySelector('.order-product-quantity');
	var sanitizedName = name.trim()
											 .toLowerCase()
											 .replaceAll(" ", "-")
											 .replaceAll("'", "")
											 .replaceAll("&", "")
											 .replaceAll("--", "-");

	var priceToBeSubtracted = parseFloat(product.querySelector('.order-' + sanitizedName + ' .total-price').textContent);

	product.querySelector('.order-' + sanitizedName).remove();

	var totalPrice = parseFloat(document.querySelector('.total-price-display').textContent);
	var newTotalPrice = totalPrice - priceToBeSubtracted;

	document.querySelector('.total-price-display').textContent = newTotalPrice;

	if (newTotalPrice == 0){
		document.querySelector('.no-products-yet').classList.remove('hide');
		document.querySelector('.total-price-container').classList.remove('show');
	}
}

function store_prices(price, quantity){
	var absoluteElement = document.querySelector('.price-store');
	var multipliedPrice = parseInt(price) * quantity;
	var para = document.createElement('p');
	absoluteElement.appendChild(para).textContent += multipliedPrice;
}

function display_total_price(price){
	var totalPrice = document.querySelector('.total-price-display');
	var totalPriceContainer = document.querySelector('.total-price-container');
	totalPriceContainer.classList.add('show');
	totalPrice.textContent = price;
}

//detect paste, https://stackoverflow.com/questions/3211505/detect-pasted-text-with-ctrlv-or-right-click-paste
function getTextAreaSelection(textarea) {
    var start = textarea.selectionStart, end = textarea.selectionEnd;
    return {
        start: start,
        end: end,
        length: end - start,
        text: textarea.value.slice(start, end)
    };
}

function detectPaste(textarea, callback) {
    textarea.onpaste = function() {
        var sel = getTextAreaSelection(textarea);
        var initialLength = textarea.value.length;
        window.setTimeout(function() {
            var val = textarea.value;
            var pastedTextLength = val.length - (initialLength - sel.length);
            var end = sel.start + pastedTextLength;
            callback({
                start: sel.start,
                end: end,
                length: pastedTextLength,
                text: val.slice(sel.start, end)
            });
        }, 1);
    };
}


function put_space_after_paste(){

	var textarea = document.getElementById("order-address");
	detectPaste(textarea, function(pasteInfo) {
		var str = pasteInfo.text;
		str = str.substring(str.indexOf("https") - 100);
		str2 = str.substring(str.indexOf("https") + 0);

		textarea.value = textarea.value.trim().replace(str, "") + '\n' + str2;
	    // pasteInfo also has properties for the start and end character
	    // index and length of the pasted text
	});

}