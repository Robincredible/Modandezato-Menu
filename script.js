function startup(){
	add_event_listeners();
	modal();
}

document.addEventListener("DOMContentLoaded", startup);

function add_event_listeners(){

	/* float circles */
	const circlesCount = document.querySelectorAll('.circle').length;
	let circle;

	//get all instances of elements with the "circle" class
	for (let i = 0; i < circlesCount; i++){
		circle = document.querySelectorAll('.circle')[i];
		circle.addEventListener("click", float_circles);
	}

	/* roll dice */
	const diceCount = document.querySelectorAll(".dice").length;
	let dice;

	for (let j = 0; j < diceCount; j++){
		dice = document.querySelectorAll('.dice')[j];
		dice.addEventListener("click", dice_roll);
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

function modal_open(name, image, info, price){

	const modal = document.querySelector('.modal-container');
	const imageModal = document.querySelector('.modal-image-container img');
	const modalHeading = document.querySelector('.modal-heading');
	const modalDesc = document.querySelector('.modal-description');
	const modalPrice = document.querySelector('.modal-price');

	imageModal.src =  image;
	imageModal.alt =  name;
	modalHeading.textContent = name;
	modalDesc.textContent = info;
	modalPrice.textContent = price;
	modal.classList.add('active');

}

function modal_close(){
	const modal = document.querySelector('.modal-container');
	modal.classList.remove('active');
}

//copy order form button
function copy_order_form(){
		//form input elements
    const orderForm = document.querySelector("#order-form");
    const name = orderForm.querySelector("input[name='order-name']");
    const number = orderForm.querySelector("input[name='order-number']");
    const address = orderForm.querySelector("input[name='order-address']");
    const products = orderForm.querySelector("input[name='order-product-flavor']");
    const quantity = orderForm.querySelector("input[name='order-quantity']");
    const schedule = orderForm.querySelector("input[name='order-schedule']");
    const modeOfPayment = orderForm.querySelector("input[type='radio'][name='order-mode-of-payment']");
    const modeOfPaymentChecked = orderForm.querySelector("input[type='radio'][name='order-mode-of-payment']:checked") || 'Waley';

    //form labels
    const label_name = name.previousElementSibling.textContent;
    const label_number = number.previousElementSibling.textContent;
    const label_address = address.previousElementSibling.textContent;
    const label_products = products.previousElementSibling.textContent;
    const label_quantity = quantity.previousElementSibling.textContent;
    const label_schedule = schedule.previousElementSibling.textContent;
    const label_modeOfPayment = modeOfPayment.parentElement.previousElementSibling.textContent;

    //form labels + values
    let order = label_name + " " + name.value + '\n';
    		order += label_number + " " + number.value + '\n';
    		order += label_address + " " + address.value + '\n';
    		order += label_products + " " + products.value + '\n';
    		order += label_quantity + " " + quantity.value + '\n';
    		order += label_schedule + " " + schedule.value + '\n';
    		order += label_modeOfPayment + " " + modeOfPaymentChecked.value;

    let input = document.createElement("textarea");

    if(order){
    	input.value = strip_whitespaces(order);
	    document.body.appendChild(input);
	    input.select();
	    document.execCommand("Copy");
	    input.remove();

	    confirm_copy();
	    scroll_to_socmed();
	    dm_us();
    }
}

function confirm_copy(){
	const chatBubble = document.querySelector('.confirm-bubble');

	console.log(chatBubble.classList);

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

//dice roll
function dice_roll(){

	if (this.classList.contains('circulate')){
		this.classList.remove("circulate");
		//this.attr('style').remove();
	}

	else{
		this.classList.add("circulate");
		// this.style.transition = '0.3s';
		//this.style.transform = 'rotate('+ (getCurrentRotation(this)) +'deg)';
	}

	this.addEventListener("animationend", dice_roll);
}

//get current rotation
function getCurrentRotation(el){
  let st = window.getComputedStyle(el, null);
  let tm = st.getPropertyValue("-webkit-transform") ||
           st.getPropertyValue("-moz-transform") ||
           st.getPropertyValue("-ms-transform") ||
           st.getPropertyValue("-o-transform") ||
           st.getPropertyValue("transform") ||
           "none";
  if (tm != "none") {
    let values = tm.split('(')[1].split(')')[0].split(',');
    /*
    a = values[0];
    b = values[1];
    angle = Math.round(Math.atan2(b,a) * (180/Math.PI));
    */
    //return Math.round(Math.atan2(values[1],values[0]) * (180/Math.PI)); //this would return negative values the OP doesn't wants so it got commented and the next lines of code added
    var angle = Math.round(Math.atan2(values[1],values[0]) * (180/Math.PI));
    return (angle < 0 ? angle + 360 : angle); //adding 360 degrees here when angle < 0 is equivalent to adding (2 * Math.PI) radians before
  }
  return 0;
}