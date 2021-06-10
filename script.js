/*
 * Modandezato Menu Scripts
 * Author: Robin Joshua Del Mundo
 * Version: 1.0
 * Note: So much to do, so many functions, still a novice, a lot of revisions incoming
 * MVC: Control
 */

//Main function

function startup(){
	add_event_listeners();
	modal();
}

document.addEventListener("DOMContentLoaded", startup);

function add_event_listeners(){

	//invoke debug toggler functionalities and detect device/device notice

	toggle_debug_mode();
	device_notice();

	const deviceNoticeOkay = document.querySelector('.device-notice .okay');
	deviceNoticeOkay.addEventListener('click', okay_device_notice);

	//Main Function Thread for adding events

	//tap bubbles, additional customer persuasion to tap/click the items

	setTimeout(()=>{ tap_here_add() }, 4000);
	setTimeout(()=>{ tap_here_remove() }, 10000);

	document.addEventListener('scroll', tap_here_remove);
	document.addEventListener('click', tap_here_remove);

	//no products/add a product events

	const noProducts = document.querySelector('.add-a-product');
	noProducts.addEventListener('click', no_items_add_a_product);

	/* float circles, interaction with the circle elements through the whole document */

	const circlesCount = document.querySelectorAll('.circle').length;
	let circle;

	//get all instances of elements with the "circle" class

	for (let i = 0; i < circlesCount; i++){
		circle = document.querySelectorAll('.circle')[i];
		circle.addEventListener("click", float_circles);
	}

	/* click copy button event */

	const copyButton = document.querySelector('.copy-button p');
	copyButton.addEventListener("click", copy_order_form);

	/* dropdown event change */

	let dropdown = document.querySelector('#product-categories');

	dropdown.addEventListener("change", function(){
		let selectedOption = this[this.selectedIndex];
		let text = selectedOption.text;

		collections_change( filter_text_from_string("Categories:", text) );
	});

	/* modal height called and attached to resize and load events */

	window.onresize = modalHeight;
	window.onload = modalHeight;

	window.addEventListener('resize', modalHeight);
	window.addEventListener('load', modalHeight);

	collections_items_count();
	item_names_as_classes_on_images();

	/* add to cart */

	const addToCartButton = document.querySelector('#addToCart');
	const textArea = document.querySelector('#order-product-quantity');
	
	addToCartButton.addEventListener('click', function(){

		const quantityField = document.querySelector('.quantityCart input');

		let thisProduct = this.parentElement.parentElement.querySelector('.modal-heading').textContent;
		let thisProductPrice = this.parentElement.parentElement.querySelector('.modal-price').textContent;
		let thisProductQuantity = this.parentElement.parentElement.querySelector('.quantityCart input').value;

		add_to_cart(thisProductQuantity, thisProduct, thisProductPrice);

	});

	//remove from cart, click event

	document.addEventListener('click', function(e){
	
	if (e.target && e.target.id == 'remove-item'){
		let thisProduct = e.target.parentElement.querySelector('.product').textContent;

		remove_from_cart(thisProduct);
		}
	});

}

//dropdown change present items based on chosen item

function collections_change(text){
	let collectionID = text.replace(/\s/g, "").replace("Collection", "-Collection").toLowerCase();
	let newID;
	const collection = document.querySelectorAll(".collection");

	for (let i=0; i < collection.length; i++){

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

//count items for classes in case of quantity changes

function collections_items_count(){
	const collection = document.querySelectorAll('.collection');

	for (let i = 0; i < collection.length; i++){
		count_items(collection[i].id);
	}
}

function item_names_as_classes_on_images(){
	const itemContainer = document.querySelectorAll('.item-container');
	let itemName, itemImage, sanitizedName;

	for (let i = 0; i < itemContainer.length; i++){
		itemName = itemContainer[i].querySelector('.product-name').textContent;
		itemImage = itemContainer[i].querySelector('.image img');

		sanitizedName = sanitize_text(itemName);

		itemImage.classList.add(sanitizedName + '-image');
	}
}

//not yet done/polished, for adjusting styles based on the number of items

function count_items(elementID){
	const countChildren = document.querySelector('#' + elementID);
	let itemsContainer = countChildren.querySelectorAll('.items-container');
	let count = parseInt(countChildren.querySelectorAll('.items-container > div').length);

	for(let i = 0; i < itemsContainer.length; i++){

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

//modal height adjustment, based on window innerHeight, subtract 20% from the total height
//to supply an appropriate max-height to modal-image-container

function modalHeight(){
	const modalContainer = document.querySelector('.modal-content-container');
	const modalImageContainer = document.querySelector('.modal-image-container');
	const windowHeight = window.innerHeight;
	const windowWidth = window.innerWidth;

	modalImageContainer.style.maxHeight = windowHeight - (windowHeight * 0.2) + 'px';

	if (windowWidth <= 992 ){
		modalImageContainer.style.maxHeight = (windowHeight/2) - ((windowHeight/2) * 0.3) + 'px';
	}
}

function add_class_to_modal_heading(name){
	const modalHeading = document.querySelector('.modal-heading');
	let className = sanitize_text(name);

	modalHeading.classList.add( className );
}

//reset modal heading classes

function remove_classes_from_modal_heading(){
	const modalHeading = document.querySelector('.modal-heading');
	modalHeading.className ="modal-heading"; 
}

//fixed body on modal_open

function hide_overflow(scrollAmount){
	const body = document.body;
	const html = document.body.parentElement;

	window.scrollTo(0, scrollAmount - 400);

	html.style.overflowY = 'hidden';
	body.style.overflowY = 'hidden';

}

//scroll body again after modal_close

function visible_overflow(){
	const body = document.body;
	const html = document.body.parentElement;

	html.style.overflowY = 'visible';
	body.style.overflowY = 'visible';
}

/* Find the position of an object. Source: https://www.quirksmode.org/js/findpos.html */
// for getting back to the scrolled part of the window, after modal_close

function findPos(obj) {
	let curleft = curtop = 0;

	if (obj.offsetParent) {
		do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
			} while (obj = obj.offsetParent);
		return [curleft,curtop];
	}
}

//modal main function

function modal(){
	const closeModal = document.querySelector('.close-modal');
	const imageCount = document.querySelectorAll('.image').length;
	let openModal, currentSelectPrice, clickedObject, scrollAmount;
	let scrollFinal = 0;

	for (let j = 0; j < imageCount; j++){
		openModal = document.querySelectorAll('.image')[j];
		openModal.addEventListener('click', function(e){

		const thisItem = this;
		
		const thisItemName = this.parentElement.parentElement.querySelector('.product-name');
		const targetName = e.target.parentElement.parentElement.parentElement.querySelector('.product-name');

		if (thisItemName.textContent === targetName.textContent){
			let sanitizedName = sanitize_text(targetName.textContent);

			clickedObject = document.querySelector('.' + sanitizedName + '-image');
			scrollAmount = findPos(clickedObject)[1];
		}

		let currentSelect = thisItem.parentElement.parentElement.querySelector('.product-name').textContent;
		let currentSelectDesc = thisItem.parentElement.parentElement.querySelector('.product-desc').innerHTML;
		let currentSelectImage = thisItem.parentElement.parentElement.querySelector('.image img').src;
		if (thisItem.parentElement.parentElement.querySelector('.box-price') != null){
			currentSelectPrice = thisItem.parentElement.parentElement.querySelector('.box-price').textContent;
		}

		modal_open(currentSelect, currentSelectImage, currentSelectDesc, currentSelectPrice, scrollAmount);

		});

	} 

	closeModal.addEventListener("click", () => { modal_close() });
}

// apply contents to modal based on passed information

function modal_open(name, image, info, price, scrollAmount){

	hide_overflow(scrollAmount);

	let className = sanitize_text(name);

	const modalBG = document.querySelector('.modal-bg');
	const modal = document.querySelector('.modal-container');
	const imageModal = document.querySelector('.modal-image-container img');
	const modalHeading = document.querySelector('.modal-heading');
	const modalDesc = document.querySelector('.modal-description');
	const modalPrice = document.querySelector('.modal-price');
	const addToCart = document.querySelector('.addToCartContainer');

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
	modalPrice.textContent = price;
	modal.classList.add('active');
	modalBG.classList.add('active');

}

//reset modal classes and contents

function modal_close(){

	const modalBG = document.querySelector('.modal-bg');
	const modal = document.querySelector('.modal-container');
	const added = document.querySelector('.added');
	const productQuantity = document.querySelector('.quantityCart input');
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

    const orderForm = document.querySelector("#order-form");
    const name = orderForm.querySelector("input[name='order-name']");
    const number = orderForm.querySelector("input[name='order-number']");
    const address = orderForm.querySelector("textarea[name='order-address']");
    const products = orderForm.querySelector("div[name='order-product-quantity']");
    const schedule = orderForm.querySelector("input[name='order-schedule']");
    const modeOfPayment = orderForm.querySelector("input[type='radio'][name='order-mode-of-payment']");
    const modeOfPaymentChecked = orderForm.querySelector("input[type='radio'][name='order-mode-of-payment']:checked") || 'Waley';

    //form labels

    const label_name = name.previousElementSibling.textContent;
    const label_number = number.previousElementSibling.textContent;
    const label_address = address.previousElementSibling.textContent;
    const label_products = products.previousElementSibling.textContent;
    const label_schedule = schedule.previousElementSibling.textContent;
    const label_modeOfPayment = modeOfPayment.parentElement.previousElementSibling.textContent;

    let order_products = products.querySelectorAll('.cart-item');
    let products_final = "";
    let address_sanitized = "";

    //get the data from all the products in the order formn

    for (let i = 0; i < order_products.length; i++){
    	let product_order_name = order_products[i].querySelector('.product').textContent;
    	let product_order_quantity = order_products[i].querySelector('.quantity').textContent;
    	let product_order_price = order_products[i].querySelector('.total-price').textContent;
    	let product_boxes = ' Box of 6';

    	if (product_order_name == 'Assorted'){
    		product_boxes = ' Box of 8';
    	}

    	products_final += product_order_quantity + 'x ' + product_order_name + ' ' + product_boxes + ' ' + product_order_price + ' PHP' + '\n';
    }

    //separate google maps link from actual address

    address_sanitized += address.value.trim().replace("https", "\nhttps");

    //form labels + values

    let order = label_name + " " + name.value + '\n';
		order += label_number + " " + number.value + '\n';
		order += label_address + " \n" + address.value + '\n\n';
		order += label_products + " \n" + products_final + '\n';
		order += 'Total Price: ' + get_total_price() + ' PHP \n\n';
		order += label_schedule + " " + schedule.value + '\n';
		order += label_modeOfPayment + " " + modeOfPaymentChecked.value;

    let input = document.createElement("textarea");

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
    console.log(order.replace('\n', '<br />'));
    console.log('--Copied Order Form');
}

function tap_here_add(){
	const firstItem = document.querySelector('.item-container:first-child');
	firstItem.querySelector('.tap-bubble-container').classList.add('show');
}

function tap_here_remove(){
	const firstItem = document.querySelector('.item-container:first-child');
	firstItem.querySelector('.tap-bubble-container').classList.remove('show');
}

function confirm_copy(){
	const chatBubble = document.querySelector('.confirm-bubble');

	if (chatBubble.classList.contains('confirming')){
		chatBubble.classList.remove("confirming");
	}

	else{
		chatBubble.classList.add("confirming");
		setTimeout(() => {chatBubble.classList.remove("confirming")}, 2000);
	}

}

function dm_us(){
	const chatBubble = document.querySelector('.socmed-bubble');

	if (chatBubble.classList.contains('dm-us')){
		chatBubble.classList.remove("dm-us");
	}

	else{
		chatBubble.classList.add("dm-us");
		setTimeout(() => {chatBubble.classList.remove("dm-us")}, 6000);
	}

}

//sanitization functions

function sanitize_text(texts){
	return texts.trim().toLowerCase()
							.replaceAll(" ", "-")
							.replaceAll("'", "")
							.replaceAll("&", "")
							.replaceAll("--", "-");
}

function strip_whitespaces(string){
	return string.replace(/\t+/g, "");
}

function filter_text_from_string(text,string){
	let filtered = string.replace(text, "");
	return filtered;
}

function filter_price_from_string(string){
	let pattern = /[0-9]+/;
	let price = string.slice(string.length - 7);
	let filteredPrice = price.match(pattern);//i.e. filter to 300, 320... - without the PHP

	return Math.max(filteredPrice);
}

//scroll functions

function no_items_add_a_product(){
	scroll_to('.our-products-header');
}

function scroll_to(element){
	const elementToScrollTo = document.querySelector(element);
	const topPos = elementToScrollTo.offsetTop - 0;

	window.scrollTo(0, topPos);
}

function scroll_to_socmed(){
	const socmed = document.querySelector('.socmed');
	const topPos = socmed.offsetTop - 400;

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
	const productQuantityElement = document.querySelector('.order-product-quantity');
	const productQuantityStore = document.createElement('div');
	const productStorage = document.createElement('div');
	const quantityStorage = document.createElement('div');
	const priceStorage = document.createElement('div');
	const totalPriceStorage = document.createElement('div');
	const removeItem = document.createElement('div');

	let sameName, sameNameQuantity, sameNamePrice;
	let added_already_bool = already_added_to_cart(name);
	let sanitizedName = sanitize_text(name);

	if (added_already_bool === true){

		sameName = productQuantityElement.querySelector('.order-' + sanitizedName + ' .product').textContent;
		sameNameQuantity = parseFloat(productQuantityElement.querySelector('.order-' + sanitizedName + ' .quantity').textContent);
		sameNamePrice = parseFloat(productQuantityElement.querySelector('.order-' + sanitizedName + ' .price').textContent);
		
		if (sameName == name){

			let newQuantity = parseInt(quantity) + sameNameQuantity;
			let newPrice = parseFloat(filter_price_from_string(price)) + parseFloat(sameNamePrice * sameNameQuantity);

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

			let productCount = document.querySelectorAll('.order-product-quantity > div').length;
			let filteredPrice = filter_price_from_string(price);
			let totalPrice = filteredPrice * quantity;

		}

	}
	
}

//check if already added to cart, return a boolean value

function already_added_to_cart(name){
	
	let productCount = document.querySelectorAll('.order-product-quantity > div').length;
	let added = false;
	let sanitizedName = sanitize_text(name);
	let product, productName;

	for(let i=0; i < productCount; i++){
		product = document.querySelectorAll('.order-product-quantity > div')[i];
		
		if (product.querySelector('.product') ){
			productName = product.querySelector('.product').textContent;
		}
		else{
			console.error('No product yet');
		}
		
		let countProduct = 0;

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

	const productQuantity = document.querySelector('.order-product-quantity');
	const noProducts = document.querySelector('.no-products-yet');
	const added = document.querySelector('.added');
	const addButton = document.querySelector('#addToCart p');
	const windowHeight = window.screen.height;
	const windowWidth = window.screen.width;

	if (windowWidth <= 768 && windowWidth > 600 ){
		addButton.textContent = "Added!";
	}

	else if ( windowWidth <= 600 ){
		addButton.textContent = "Added to Orders!";
	}

	else{
		addButton.textContent = "Added to Orders!";
	}

	store_to_cart(quantity, name, price);

	added.classList.add('shown');
	noProducts.classList.add('hide');

	display_total_price(get_total_price());

	setTimeout( () => {
		added.classList.remove('shown');
		addButton.textContent = "Add to Order";
	}, 1500);

}

//check total price based on items added, returns a number

function get_total_price(){
	const priceStore = document.querySelectorAll('.order-product-quantity > div');
	let prices;
	let sum = 0;

	for (let i = 0; i < priceStore.length; i++){
		prices = priceStore[i].querySelector('.total-price').textContent;
		sum += parseInt(prices);
	}

	return sum;
}

function remove_from_cart(name){
	const product = document.querySelector('.order-product-quantity');
	let sanitizedName = sanitize_text(name);

	let priceToBeSubtracted = parseFloat(product.querySelector('.order-' + sanitizedName + ' .total-price').textContent);

	product.querySelector('.order-' + sanitizedName).remove();

	let totalPrice = parseFloat(document.querySelector('.total-price-display').textContent);
	let newTotalPrice = totalPrice - priceToBeSubtracted;

	document.querySelector('.total-price-display').textContent = newTotalPrice;

	if (newTotalPrice == 0){
		document.querySelector('.no-products-yet').classList.remove('hide');
		document.querySelector('.total-price-container').classList.remove('show');
	}
}

function display_total_price(price){
	const totalPrice = document.querySelector('.total-price-display');
	const totalPriceContainer = document.querySelector('.total-price-container');
	totalPriceContainer.classList.add('show');
	totalPrice.textContent = price;
}

/*
 * Debugging functions, for older phones and general problem diagnosis
 * Still can't detect browser errors, only console.logs and console.errors
 * Source: https://stackoverflow.com/questions/6604192/showing-console-errors-and-alerts-in-a-div-inside-the-page
 */

function toggle_debug_mode(){
	const dice = document.querySelector('.dice.large');
	let clicks = 0;
	let bool = false;

	dice.addEventListener('click', function(){

		if (clicks >= 10){
			bool = true;
			clicks = 0;
			debug_mode(bool);
		}

		clicks++;

	});
}

function debug_mode(activate){
	if (activate === true){
		document.querySelector('.debug-mode-display').classList.add('show');
		console_errors_log();

		let checklet = 'hey!';
		let message;

		if (typeof(checklet) !== 'undefined'){
			message = "JS is ES6 and above";
		} else{
			message = "JS is below ES6";
		}

		console.log('//Debug Mode');
		console.log('<br />' +
		'Name: ' + platform.name + '<br />' + // 'IE'
		'Version: ' + platform.version + '<br />' +  // '10.0'
		'Layout: ' + platform.layout + '<br />' +// 'Trident'
		'OS: ' + platform.os + '<br />' + // 'Windows Server 2008 R2 / 7 x64'
		'Description: ' + platform.description+ '<br />' +// 'IE 10.0 x86 (platform preview; running in IE 7 mode) on Windows Server 2008 R2 / 7 x64'
		'Product: ' + platform.product + '<br />' +
		'Manufacturer: ' + platform.manufacturer + '<br />' + '*****');
		
		width_checker();
	}

	return activate;
}

function console_errors_log(){

	const logger = document.querySelector('.console-log');
	logger.classList.add('show');

	if (typeof console  != "undefined") 
    if (typeof console.log != 'undefined')
        console.olog = console.log;
    else
        console.olog = function() {};

	console.log = function(message) {
	    console.olog(message);
	    logger.innerHTML += message + '<br />';
	};
	console.error = console.debug = console.info = console.log;
}

function width_checker(){
	const widthCheck = document.querySelector('.width-checker');
	let windowHeight = window.innerHeight;
	let windowWidth = window.innerWidth;

	widthCheck.classList.add('show');
	widthCheck.innerHTML = 'width: ' + windowWidth + ' x Height: ' + windowHeight;

	window.onresize = widthChecker;
	window.onload = widthChecker;

	window.addEventListener('resize', widthChecker);
	window.addEventListener('load', widthChecker);
}

/* 
 * Browser update notice, for phones that may not render the website properly
 * Suggests to either update their browser or switch to Chrome
 * Display notice update on Chrome Browsers version 82 and below - tested as of 06/10/2021
 * Used ua-parser-js source: https://faisalman.github.io/ua-parser-js/
 * and Platform JS source: https://github.com/bestiejs/platform.js/
 */

function detect_manufacturer(){
	let checklet = 'hey!';
	let message;

	if (typeof(checklet) !== 'undefined'){
		message = "JS is ES6 and above";
	} else{
		message = "JS is below ES6";
	}

	alert(
		message + '\n\n' +
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

function okay_device_notice(){
	document.querySelector('.device-notice').classList.remove('show');
}

function device_notice(){

	/* 
	 * A note on the variables:
	 *
	 * desc = platform.description describes the whole bnowser platform
	 * when tested on huawei devices among others returns something on the lines of
	 * 'Chrome 91.0.4472.77 on Windows 10 64-bit' or 'Android Browser 4.0 (Like Chrome 
	 * Mobile 91.0.4472.77 on Android)', which made it logical to be the common denominator
	 * amongst everyone.
	 *
	 * str removes the first instances up to the tenths of the version number.
	 * str2 is the whole string where we remove the remaining texts we got from str.
	 *
	 */

	let str, str2, chromeVersion, browser;
	let desc = platform.description;

	if ( desc.includes('Mobile') ){
		str = desc.substring(desc.indexOf("Chrome") + 16);
		str2 = desc.substring(desc.indexOf("Chrome") + 0).replace(str, "").replace("Mobile", "");
		chromeVersion = str2.slice(-2);
		browser = str2.slice(0).replace(chromeVersion, "").trim();
		console.log('Mmobile: ' + browser + ': ' + chromeVersion);
	}

	else{
		str = platform.description.substring(platform.description.indexOf("Chrome") + 9);
		str2 = platform.description.substring(platform.description.indexOf("Chrome") + 0).replace(str, "");
		chromeVersion = str2.slice(-2);
		browser = str2.slice(0).replace(chromeVersion, "").trim();
		console.log('Not mobile: ' + browser + ': ' + chromeVersion);
	}

	if (browser == "Chrome" && chromeVersion < 82){
		document.querySelector('.device-notice').classList.add('show');
	}
}