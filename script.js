function startup(){
	add_event_listeners();
}

document.addEventListener("DOMContentLoaded", startup);

function add_event_listeners(){

	/* float circles */
	const circlesCount = document.querySelectorAll('.circle').length;
	let circle;

	for (let i = 0; i < circlesCount; i++){
		circle = document.querySelectorAll('.circle')[i];
		circle.addEventListener("click", float_circles);
	}

	/* copy */
	const copyButton = document.querySelector('.copy-button');
	copyButton.addEventListener("click", copy_order_form);

}

function copy_order_form(){
    const copyText = document.querySelector("#order-form");  
    let input = document.createElement("textarea");

    if(copyText){
    	input.value = strip_whitespaces(copyText.textContent);
	    document.body.appendChild(input);
	    input.select();
	    document.execCommand("Copy");
	    input.remove();

	    alert("Order Form Copied!")
    }
}

function strip_whitespaces(string){
	return string.replace(/\t+/g, "");
}

function float_circles(){
	this.classList.add("float");
}