function startup(){
	add_event_listeners();
}

document.addEventListener("DOMContentLoaded", startup);

function add_event_listeners(){

	console.log("woah");

	const circlesCount = document.querySelectorAll('.circle').length;
	let circle;

	for (let i = 0; i <= circlesCount; i++){

		console.log("yo " + circle);

		circle = document.querySelectorAll('.circle')[i];
		circle.addEventListener("click", float_circles);


	}

}

function float_circles(){
	this.classList.add("float");
}