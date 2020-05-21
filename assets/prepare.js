#!/usr/bin/env node

/** Fonction principale, affiche les personnages: checkbox + image */
function run () {
	var myForm = document.getElementById("idBoxes");
	var table = document.createElement("TABLE");
	var row_number = 0;

	for (var i = 0; i < roles.length; i++) {

		if ( i % 5 == 0 ) {
			var row = document.createElement("tr");
			table.appendChild(row);
		}
		var cell = document.createElement("td");
		cell.style.border = "solid #E9967A";
		row.appendChild(cell);
		var checkBox = document.createElement("input");
		var label = document.createElement("label");
		var img = document.createElement("img");
		var br = document.createElement("BR");
		checkBox.type = "checkbox";
		checkBox.value = roles[i];
		checkBox.id = "id"+i;
		cell.appendChild(checkBox);
		cell.appendChild(label);
		label.appendChild(document.createTextNode(roles[i]));
		label.htmlFor = "id"+i;
		img.src = './../images/' + encodeURI(roles[i]) + '.png';
		img.width = "200";
		img.height = "260";
		label.appendChild(br);
		label.appendChild(img);
	}
	myForm.appendChild(table);
}

/** onclick, on recupere les roles du form sinon on les choisit aléatoirement */
function get_roles (form) {
	var count = 0;
	var choice = [];
	var limit = 2; // FIXME: what if more that 2 players
	var random_roles = ""

	for (var i = 0; i < form.elements.length; i++ ) {
		if (form.elements[i].type == 'checkbox') {
			if ( form.elements[i].checked ) {
				if (count < limit) {
					choice[count]=form.elements[i].value;
					count++;
				} else if (count >= limit) {
					alert("Vous ne pouvez pas choisir plus de "+limit+" personnages");
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
	window.location.replace("../views/game.html?" +
					"&roleJoueur1=" +  encodeURI(choice[0]) +
					"&roleJoueur2=" +  encodeURI(choice[1]));
}
