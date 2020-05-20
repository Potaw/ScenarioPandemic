#!/usr/bin/env node

/** Fonction principale */
function run () {
	var myDiv = document.getElementById("idBoxes");

	for (var i = 0; i < roles.length; i++) {
		var checkBox = document.createElement("input");
		var label = document.createElement("label");
		var img = document.createElement("img");
		checkBox.type = "checkbox";
		checkBox.value = roles[i];
		checkBox.id = "id"+i;
		myDiv.appendChild(checkBox);
		myDiv.appendChild(label);
		label.appendChild(document.createTextNode(roles[i]));
		label.htmlFor = "id"+i;
		img.src = './../images/' + encodeURI(roles[i]) + '.png'
		label.appendChild(img);
	}
}

/** Get the roles from boxes and run the games */
function get_roles (form) {
	var count = 0;
	var choice = [];
	var limit = 2; // same as number of players
	var random_roles = ""

	for (var i = 0; i < form.elements.length; i++ ) {
		if (form.elements[i].type == 'checkbox') {
			if ( form.elements[i].checked ) {
				if (count < limit) {
					choice[count]=form.elements[i].value;
					count++;
				} else if (count >= limit) {
					alert("Vous ne pouvez choisir plus de "+limit+" personnages");
					return;
				}
			}
		}
	}
	if (count != limit) { // some roles would be random
		// Get a copy and remove the choosen roles if any
		roles_copy = roles.slice();
        for (var k = 0; k < limit; k++) {
			roles_copy = roles_copy.filter(e => e !== choice[k]);
		}
		// Ask Ben to shuffle
		shuffle(roles_copy);
        for (var j = 0; j < limit-count; j++) {
			choice[limit-j-1] = roles_copy[j];
            random_roles+=choice[limit-j-1]+" "
		}
	}
	if (random_roles) {
		alert("Les roles suivants ont été choisis aléatoirement:\n"+random_roles);
	}

	shuffle(choice);
	window.location.replace("../views/scenariopandemic.html?" +
					"&roleJoueur1=" +  encodeURI(choice[0]) +
					"&roleJoueur2=" +  encodeURI(choice[1]));
}
