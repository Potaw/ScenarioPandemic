#!/usr/bin/env node

const roles = ['Scientifique', 'Epidémiologiste', 'Opérateur de terrain', 'Spécialiste en quarantaine', 'Généraliste', 'Chercheuse', 'Archiviste', 'Spécialiste en confinement', 'Expert aux opérations', 'Planificateur d\'urgence', 'Médecin'];

/** Fonction principale */
function run () {
	var myDiv = document.getElementById("idBoxes");
	
	for (var i = 0; i < roles.length; i++) {
	    var checkBox = document.createElement("input");
	    var label = document.createElement("label");
	    checkBox.type = "checkbox";
	    checkBox.value = roles[i];
	    checkBox.id = "id"+i;
	    myDiv.appendChild(checkBox);
	    myDiv.appendChild(label);
	    label.appendChild(document.createTextNode(roles[i]));
        label.htmlFor = "id"+i;
	}
}

/** Get the roles from boxes and run the games */
function get_roles (form) {
    var count = 0;
    var choice = [];

	for (var i = 0; i < form.elements.length; i++ ) {
		if (form.elements[i].type == 'checkbox') {
			if ( form.elements[i].checked ) {
				if (count < 2) {
					choice[count]=form.elements[i].value;
					count++;
				}
			}
		}
	}

	window.location.replace("../views/scenariopandemic.html?" +
					"&roleJoueur1=" +  encodeURI(choice[0]) +
					"&roleJoueur2=" +  encodeURI(choice[1]));
}
