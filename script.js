function startup(){
	add_event_listeners();
	modal();
}

document.addEventListener("DOMContentLoaded", startup);

function add_event_listeners(){

	//Main Function

	//tap bubbles
	setTimeout(()=>{ tap_here_add() }, 4000);
	setTimeout(()=>{ tap_here_remove() }, 10000);

	document.addEventListener('scroll', tap_here_remove);
	document.addEventListener('click', tap_here_remove);

	//no products add a product
	const noProducts = document.querySelector('.add-a-product');
	noProducts.addEventListener('click', no_items_add_a_product);

	/* float circles */
	const circlesCount = document.querySelectorAll('.circle').length;
	let circle;

	//get all instances of elements with the "circle" class
	for (let i = 0; i < circlesCount; i++){
		circle = document.querySelectorAll('.circle')[i];
		circle.addEventListener("click", float_circles);
	}

	/* copy */
	const copyButton = document.querySelector('.copy-button p');
	copyButton.addEventListener("click", copy_order_form);

	/* dropdown */
	let dropdown = document.querySelector('#product-categories');

	dropdown.addEventListener("change", function(){
		let selectedOption = this[this.selectedIndex];
		let text = selectedOption.text;

		collections_change( filter_text_from_string("Categories:", text) );
	});

	/* modal height */
	window.addEventListener('resize', modalHeight);
	window.addEventListener('load', modalHeight);

	/* google maps paste */
	put_space_after_paste();

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

	//remove from cart
	document.addEventListener('click', function(e){
	
	if (e.target && e.target.id == 'remove-item'){
		let thisProduct = e.target.parentElement.querySelector('.product').textContent;

		remove_from_cart(thisProduct);
		}
	});

}

//dropdown change
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

//modal functions
function modalHeight(){
	const modalContainer = document.querySelector('.modal-content-container');
	const modalImageContainer = document.querySelector('.modal-image-container');
	const windowHeight = window.screen.height;
	const windowWidth = window.screen.width;

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

function modal(){
	const closeModal = document.querySelector('.close-modal');
	const imageCount = document.querySelectorAll('.image').length;
	let openModal, scrollAmount;
	let scrollFinal = 0;

	for (let j = 0; j < imageCount; j++){
		openModal = document.querySelectorAll('.image')[j];
		openModal.addEventListener('click', function(e){

		const thisItem = this;
		scrollAmount = e.pageY;

		let currentSelect = thisItem.parentElement.parentElement.querySelector('.product-name').textContent;
		let currentSelectDesc = thisItem.parentElement.parentElement.querySelector('.product-desc').textContent;
		let currentSelectImage = thisItem.parentElement.parentElement.querySelector('.image img').src;
		let currentSelectPrice = thisItem.parentElement.parentElement.querySelector('.box-price').textContent;

		modal_open(currentSelect, currentSelectImage, currentSelectDesc, currentSelectPrice, scrollAmount);

		});

	} 

	closeModal.addEventListener("click", () => { modal_close() });
}

function add_class_to_modal_heading(name){
	const modalHeading = document.querySelector('.modal-heading');
	let className = name.trim()
											 .toLowerCase()
											 .replaceAll(" ", "-")
											 .replaceAll("'", "")
											 .replaceAll("&", "")
											 .replaceAll("--", "-");

	modalHeading.classList.add( className );
}

function remove_classes_from_modal_heading(){
	const modalHeading = document.querySelector('.modal-heading');
	modalHeading.className ="modal-heading"; 
}

function hide_overflow(scrollAmount){

	const body = document.body;
	const html = document.body.parentElement;

	window.scrollTo(0, scrollAmount - 300);

	html.style.overflowY = 'hidden';
	body.style.overflowY = 'hidden';

}

function visible_overflow(){

	const body = document.body;
	const html = document.body.parentElement;

	html.style.overflowY = 'visible';
	body.style.overflowY = 'visible';

}

function modal_open(name, image, info, price, scrollAmount){

	hide_overflow(scrollAmount);

	const modal = document.querySelector('.modal-container');
	const imageModal = document.querySelector('.modal-image-container img');
	const modalHeading = document.querySelector('.modal-heading');
	const modalDesc = document.querySelector('.modal-description');
	const modalPrice = document.querySelector('.modal-price');

	add_class_to_modal_heading(name);

	imageModal.src =  image;
	imageModal.alt =  name;
	modalHeading.textContent = name;
	modalDesc.textContent = info;
	modalPrice.textContent = price;
	modal.classList.add('active');

}

function modal_close(){

	const modal = document.querySelector('.modal-container');
	const added = document.querySelector('.added');
	const productQuantity = document.querySelector('.quantityCart input');
	productQuantity.value = 1;
	added.classList.remove('shown');
	modal.classList.remove('active');

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

//sanitize copied texts
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
	let sanitizedName = name.trim()
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

function already_added_to_cart(name){
	
	let productCount = document.querySelectorAll('.order-product-quantity > div').length;
	let added = false;
	let sanitizedName = name.trim()
											 .toLowerCase()
											 .replaceAll(" ", "-")
											 .replaceAll("'", "")
											 .replaceAll("&", "")
											 .replaceAll("--", "-");
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
	let sanitizedName = name.trim()
											 .toLowerCase()
											 .replaceAll(" ", "-")
											 .replaceAll("'", "")
											 .replaceAll("&", "")
											 .replaceAll("--", "-");

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

function store_prices(price, quantity){
	let absoluteElement = document.querySelector('.price-store');
	let multipliedPrice = parseInt(price) * quantity;
	let para = document.createElement('p');
	absoluteElement.appendChild(para).textContent += multipliedPrice;
}

function display_total_price(price){
	const totalPrice = document.querySelector('.total-price-display');
	const totalPriceContainer = document.querySelector('.total-price-container');
	totalPriceContainer.classList.add('show');
	totalPrice.textContent = price;
}

//detect paste, https://stackoverflow.com/questions/3211505/detect-pasted-text-with-ctrlv-or-right-click-paste
function getTextAreaSelection(textarea) {
    let start = textarea.selectionStart, end = textarea.selectionEnd;
    return {
        start: start,
        end: end,
        length: end - start,
        text: textarea.value.slice(start, end)
    };
}

function detectPaste(textarea, callback) {
    textarea.onpaste = function() {
        let sel = getTextAreaSelection(textarea);
        let initialLength = textarea.value.length;
        window.setTimeout(function() {
            let val = textarea.value;
            let pastedTextLength = val.length - (initialLength - sel.length);
            let end = sel.start + pastedTextLength;
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

	let textarea = document.getElementById("order-address");
	detectPaste(textarea, function(pasteInfo) {
		let str = pasteInfo.text;
		str = str.substring(str.indexOf("https") - 100);
		str2 = str.substring(str.indexOf("https") + 0);

		textarea.value = textarea.value.trim().replace(str, "") + '\n' + str2;
	    // pasteInfo also has properties for the start and end character
	    // index and length of the pasted text
	});

}