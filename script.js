function startup(){
	add_event_listeners();
	modal();
}

document.addEventListener("DOMContentLoaded", startup);

function add_event_listeners(){

	//Main Function

	//tap
	setTimeout(()=>{ tap_here_add() }, 2000);
	setTimeout(()=>{ tap_here_remove() }, 8000);

	document.addEventListener('scroll', tap_here_remove);
	document.addEventListener('click', tap_here_remove);

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

	/* add to cart */
	const addToCartButton = document.querySelector('#addToCart');
	const textArea = document.querySelector('#order-product-quantity');
	let addToCartClicks = 0;
	let cartAdd = [];
	
	addToCartButton.addEventListener('click', function(){

		const quantityField = document.querySelector('.quantityCart input');

		let thisProduct = this.parentElement.parentElement.querySelector('.modal-heading').textContent;
		let thisProductPrice = this.parentElement.parentElement.querySelector('.modal-price').textContent;
		let thisProductQuantity = this.parentElement.parentElement.querySelector('.quantityCart input').value;

		add_to_cart(thisProductQuantity, thisProduct, thisProductPrice);

		addToCartClicks++;

		if (addToCartClicks > 2){
			textArea.rows += 1;
		}

	});

}

function filter_text_from_string(text,string){
	let filtered = string.replace(text, "");
	return filtered;
}

//dropdown change
function collections_change(text){
	let collectionID = text.replace(/\s/g, "").replace("Collection", "-Collection").toLowerCase();
	let collectionsContainer = document.querySelector(".collections ." + collectionID );

	if (collectionsContainer.previousElementSibling.classList.contains("active") ){
		collectionsContainer.previousElementSibling.classList.remove("active");
		collectionsContainer.classList.add("active");
	}

	else if (collectionsContainer.nextElementSibling.classList.contains("active") ){
		collectionsContainer.classList.add("active");
		collectionsContainer.nextElementSibling.classList.remove("active");
	}

	else{
		collectionsContainer.previousElementSibling.classList.remove("active");
		collectionsContainer.classList.add("active");	
	}
	
}

function modalHeight(){
	const modalContainer = document.querySelector('.modal-content-container');
	const modalImageContainer = document.querySelector('.modal-image-container');
	const windowHeight = window.screen.height;
	const windowWidth = window.screen.width;

	if (windowWidth <= 992 && windowWidth >= 576){
		modalImageContainer.style.maxHeight = (modalContainer.offsetHeight / 2) + 'px';
	}

	else if (windowWidth <= 576){
		modalImageContainer.style.maxHeight = ( (modalContainer.offsetHeight / 2) - 50 ) + 'px';

		if(windowHeight <= 600){
			modalImageContainer.style.maxHeight = ( (modalContainer.offsetHeight / 2) - 80 ) + 'px';
		}
	}

	else{
		modalImageContainer.style.maxHeight = modalContainer.offsetHeight + 'px';
	}
}

function modal(){
	const closeModal = document.querySelector('.close-modal');
	const imageCount = document.querySelectorAll('.image').length;
	let openModal;

	for (let j = 0; j < imageCount; j++){
		openModal = document.querySelectorAll('.image')[j];
		openModal.addEventListener('click', function(){

		const thisItem = this;

		let currentSelect = thisItem.parentElement.parentElement.querySelector('.product-name').textContent;
		let currentSelectDesc = thisItem.parentElement.parentElement.querySelector('.product-desc').textContent;
		let currentSelectImage = thisItem.parentElement.parentElement.querySelector('.image img').src;
		let currentSelectPrice = thisItem.parentElement.parentElement.querySelector('.box-price').textContent;

		modal_open(currentSelect, currentSelectImage, currentSelectDesc, currentSelectPrice);

		});
	} 

	closeModal.addEventListener("click", modal_close);

}

function add_to_cart(quantity, name, price){

	const productQuantity = document.querySelector('.product-quantity textarea');
	const added = document.querySelector('.added');
	const addButton = document.querySelector('#addToCart p');

	addButton.textContent = "Added to Orders!";

	productQuantity.textContent += quantity + " - " + name + " " + price + '\n';
	added.classList.add('shown');

	setTimeout( () => {
		added.classList.remove('shown');
		addButton.textContent = "Add to Order";
	}, 1500);

}

function remove_emojis(string, emoji){
	return string.replace(emoji, " ");
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

function modal_open(name, image, info, price){

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

}

//copy order form button
function copy_order_form(){
		//form input elements
    const orderForm = document.querySelector("#order-form");
    const name = orderForm.querySelector("input[name='order-name']");
    const number = orderForm.querySelector("input[name='order-number']");
    const address = orderForm.querySelector("textarea[name='order-address']");
    const products = orderForm.querySelector("textarea[name='order-product-quantity']");
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

    //form labels + values
    let order = label_name + " " + name.value + '\n';
    		order += label_number + " " + number.value + '\n';
    		order += label_address + " \n" + address.value + '\n\n';
    		order += label_products + " \n" + products.value + '\n';
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
	    }, 2000);
	    
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

function scroll_to_socmed(){
	const socmed = document.querySelector('.socmed');
	const topPos = socmed.offsetTop - 400;

	window.scrollTo(0, topPos);
}

//add/remove "float" class
function float_circles(){

	if (this.classList.contains('float')){
		this.classList.remove("float");
	}

	else{
		this.classList.add("float");
	}

	this.addEventListener("animationend", float_circles);
}

/*Experimental Functionalities */
function get_total_price(){
	const priceStore = document.querySelector('.price-store');
	let prices = document.querySelectorAll('.price-store p');
	let sum = 0;

	for (let i=0; i < prices.length; i++){
		sum += parseInt(prices[i].textContent);
	}
	return sum;
}

function remove_from_cart(string){
	const productTextArea = document.querySelector('#order-product-quantity');
	let data = productTextArea.value;

	productTextArea.value = productTextArea.value.replace(string, "");
}

function store_prices(price, quantity){
	let absoluteElement = document.querySelector('.price-store');
	let multipliedPrice = parseInt(price) * quantity;
	let para = document.createElement('p');
	absoluteElement.appendChild(para).textContent += multipliedPrice;
}

function display_total_price(price){
	const totalPrice = document.querySelector('.total-price');
	const totalPriceContainer = document.querySelector('.total-price-container');
	totalPriceContainer.classList.add('show');
	totalPrice.textContent = price;
}

function filter_price_from_string(string){
	let pattern = /[0-9]+/;
	let price = string.slice(string.length - 7);
	let filteredPrice = price.match(pattern);//i.e. filter to 300, 320... - without the PHP

	return Math.max(filteredPrice);
}
/* End Experiments */