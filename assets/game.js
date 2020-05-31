#!/usr/bin/env node

/** Variables globales */
var paquetJoueur;
var epidemdiesShuffle;
var rolesShuffle = [];
var paquetEpidemie;
var paquetPropagationEntier = [];
var nbTours = 0;
var nbCartesPropagationTournees = 0
var pseudos = [];
var lienSansPseudo = "";

// Permet de bien compter le nombre de tour
var isChronoDejaTourne = false;

var url = "";

/** Retourne la couleur de la carte */
function getCouleur(carte){
	if(bleu.indexOf(carte) >= 0) {
		return 'blue';
	}
	else if (jaune.indexOf(carte) >= 0) {
		return 'Orange';
	}
	else if (noir.indexOf(carte) >= 0) {
		return 'black';
	}
	else if (rouge.indexOf(carte) >= 0) {
		return 'red';
	}
	else if (epidemies.indexOf(carte) >= 0) {
		return 'MediumSeaGreen';
	}
	return 'SlateGray';
}


/** Permet de retirer les 4 premières cartes du paquet joueur
	ainsi que les roles des 2 joueurs */
function miseEnPlaceJoueur(idJoueur) {
	var cartes = "<ul>";
	var carte = "";
	var role=rolesShuffle.shift();
	for(i = 0 ; i <= 3 ; i++) {
		carte = paquetJoueur.shift();
		cartes += "<li><font color='" + getCouleur(carte) + "'>" + carte + "</font></li>";
	}
	cartes += "</ul>";
	document.getElementById(idJoueur).innerHTML = cartes;
	document.getElementById(idJoueur + 'Role').innerHTML = role;
	document.getElementById(idJoueur + 'Image').innerHTML = '<img src=../images/' + encodeURI(role) +'.png width=100 height=130 class="zoomA">';
}


/** Fonction principale */
function run () {
	// S'il existe des paramètres dans la requête, on s'en sert
	var vars = {};
	vars['roleJoueur1'] = "";
	vars['roleJoueur2'] = "";
	vars['paquetJoueur'] = "";
	vars['paquetPropagationEntier'] = "";
	vars['pseudos'] = "";
	vars['idUnique'] = ""
	//var u = 0;
	var idUnique = 0;

	window.location.href.replace(location.hash, '').replace( 
		/[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
		function( m, key, value ) { // callback
			vars[key] = value !== undefined ? value : '';
		}
	);

	if (vars['idUnique'].length >= 1) {
		idUnique = vars['idUnique'];
	}

	// Si les rôles sont passés en paramètre, on les prend
	if(vars['roleJoueur1'].length >= 1 && vars['roleJoueur2'].length >= 1) {
		rolesShuffle[0] = decodeURI(vars['roleJoueur1']);
		rolesShuffle[1] = decodeURI(vars['roleJoueur2']);
	}
	// Sinon, on mélange les rôles existants
	else {
		rolesShuffle = roles.slice();
		shuffle(rolesShuffle);
	}

	// Si le paquetJoueur est passé en paramètre, on le prend
	if(vars['paquetJoueur'].length >= 1) {
		paquetJoueur = decodeURI(vars['paquetJoueur']).split('*');
	}
	// Sinon, on le génère
	else {
		// Tableau temporaire d'évènements
		var evenementsHasard = evenements;

		// Mélange du tableau d'évènements
		shuffle(evenementsHasard);

		// Création du paquet joueur, avec que 5 évènements
		paquetJoueur = bleu.concat(jaune).concat(noir).concat(rouge).concat(evenementsHasard.slice(3));

		// Mélange du paquet joueur
		shuffle(paquetJoueur);

		// Mélange le paquet des 6 épidémies
		epidemdiesShuffle = epidemies.slice();
		shuffle(epidemdiesShuffle);

		// Ajout des 6 épidémies en partant de la fin
		paquetJoueur.splice(47 + randomInt(0,7), 0, epidemdiesShuffle.shift());
		paquetJoueur.splice(39 + randomInt(0,7), 0, epidemdiesShuffle.shift());
		paquetJoueur.splice(32 + randomInt(0,7), 0, epidemdiesShuffle.shift());
		paquetJoueur.splice(24 + randomInt(0,8), 0, epidemdiesShuffle.shift());
		paquetJoueur.splice(16 + randomInt(0,8), 0, epidemdiesShuffle.shift());
		paquetJoueur.splice(8 + randomInt(0,8), 0, epidemdiesShuffle.shift());
	}

	// Si le paquet propagation est passé en paramètre, on le prend
	if(vars['paquetPropagationEntier'].length >= 1) {
		paquetPropagationEntier = decodeURI(vars['paquetPropagationEntier']).split('*');
	}
	// Sinon, on le génère
	else {
		// Préparation paquet épdémie
		paquetEpidemie = bleu.concat(jaune).concat(noir).concat(rouge);

		// Mélange du paquet épidémie
		shuffle(paquetEpidemie);

		// Préparation du paquet entier de Propagation
		prepatationPaquetPropagations();
	}

	// On teste s'il y a des pseudos
	if (vars['pseudos'].length >= 1) {
		var joueurs = [];
		pseudos = decodeURI(vars['pseudos']).split('*');
		pseudos.forEach(function(item, index, array) {
			// item est du type = potaw.1.0.10 (pseudo . nbTour . gagnePerdu . nbCartePropa)
			var tab = item.split('.');
			joueurs[index] = tab[0];
		});

		// On n'affiche pas dans l'ordre les joueurs qui ont joués, pour ne pas influencer
		shuffle(joueurs);
		alert("Nombre de personnes ayant joué ce scénario (" + idUnique + ") : " +pseudos.length + "\n - " + joueurs.join("\n - "));
	}
	else {
		idUnique = Date.now();
		alert("Vous êtes le 1er à jouer ce scénario (" + idUnique + ").\n\"Bon chance !\"");
	}


	// On génère le lien de la partie
	lienSansPseudo = "scenariopandemic.html?" +
					(idUnique == 0 ? "" : "idUnique=" + idUnique) +
					"&roleJoueur1=" +  encodeURI(rolesShuffle[0]) +
					"&roleJoueur2=" +  encodeURI(rolesShuffle[1]) +
					"&paquetJoueur=" + encodeURI(paquetJoueur.join('*')) +
					"&paquetPropagationEntier=" + encodeURI(paquetPropagationEntier.join('*'));

	// Permet de tirer les 4 cartes pour les 2 joueurs
	miseEnPlaceJoueur('idJoueur1');
	miseEnPlaceJoueur('idJoueur2');

	// On écrit toutes les cartes au cas où
	document.getElementById('idSpoilPaquetJoueur').innerHTML = paquetJoueur.join("<br />");
	document.getElementById('idSpoilPaquetPropagation').innerHTML = paquetPropagationEntier.join("<br />");
}


/** Affiche et supprime la 1ère carte du paquet joueur */
function tirerCartes(idCarte) {
	// On affiche les idCarte au cas où elles étaients masquées
	document.getElementById('idCarte1').style.display = "block";
	document.getElementById('idCarte2').style.display = "block";

	document.getElementById('idCarteJoueurs').className = 'enCours carteJoueur';
	document.getElementById('idDivCartesPropagation').className = 'pasEnCours';

	var isIdCarte1 = idCarte == 'idCarte1';
	if (isIdCarte1) {
		isChronoDejaTourne = false;
		document.getElementById('idGoJoueur').className = "";
		document.getElementById('idCartesPropagation').innerHTML = "";
		isPseudoGagnePerduCeTour("J");
		document.getElementById('idCarte2').innerHTML = "...";
		document.getElementById('idButtonCarte1').style.display = "none";
		document.getElementById('idButtonCarte2').style.display = "block";
	}
	else {
		document.getElementById('idButtonCarte1').style.display = "block";
		document.getElementById('idButtonCarte1').disabled = true;
		document.getElementById('idButtonCarte2').style.display = "none";
		document.getElementById('idTournePropagation').disabled = false;
	}

	// S'il n'y a plus de carte dans le paquet, alors la partie est perdue
	if(paquetJoueur.length == 0) {
		alert("Désolé, il ne reste plus de carte... vous avez perdu !");
		document.getElementById('idTournePropagation').disabled = true;
		return;
	}

	// On prend la prochaine carte du paquet
	var carte = paquetJoueur.shift();
	document.getElementById(idCarte).innerHTML = "<font color='" + getCouleur(carte) + "'>" + carte + "</font>";
	document.getElementById('idRecap').innerHTML += carte + "<br />";
}


/** Cacher ou afficher des div passés en paramètre */
function cacherAfficherCartes(idAmodifier, idLienAmodifier) {
	var noneBlock = document.getElementById(idAmodifier).style.display == "block" ? "none" : "block";
	if (noneBlock == 'block') {
		document.getElementById(idLienAmodifier).innerHTML = "Cacher";
	}
	else {
		document.getElementById(idLienAmodifier).innerHTML = "Afficher";
	}
	document.getElementById(idAmodifier).style.display = noneBlock;
}


/** Retourne combien de cartes ville du paquet propatation il faut tirer */
function combienTirerDeCartes (nbEpidemies) {
	if (nbEpidemies <= 2) {
		return 2;
	}
	else if (nbEpidemies <= 4) {
		return 3;
	}
	return 4;
}


/** On crée un paquet de cartes avec déjà toutes les épidémies */
function prepatationPaquetPropagations() {
	var defaussePropagation = [];
	var nbEpidemies = 0;
	var villePropagation = [];

	// Compteur du paquet paquetPropagationEntier
	var j = 0;

	// Compteur du paquet defaussePropagation
	var k = 0;

	// On tire les 9 premières cartes des maladies
	for (var i = 1 ; i <= 9 ; i++) {
		villePropagation = paquetEpidemie.shift();
		paquetPropagationEntier[j++] = i + "/9 - " + villePropagation;
		defaussePropagation[k++] = villePropagation;
	}

	// On parcourt chaque carte du paquet joueur
	for (var i = 8 ; i < paquetJoueur.length ; i++) {
		var nbEpidemiesEn2Cartes = 0;

		// Combien d'épidémies dans les 2 prochaines cartes ?
		if (epidemies.indexOf(paquetJoueur[i]) >= 0) {
			nbEpidemiesEn2Cartes++;
		}
		if (epidemies.indexOf(paquetJoueur[i + 1]) >= 0) {
			nbEpidemiesEn2Cartes++;
		}

		// On boucle sur le nombre de cartes épidémies tournées en 2 cartes
		for (var epi = 1 ; epi <= nbEpidemiesEn2Cartes ; epi++) {
			nbEpidemies++;
			// On pioche la carte de sous le paquet
			villeEpidemie = paquetEpidemie.pop();

			// On ajoute la carte épidémie à la défausse
			defaussePropagation[k++] = villeEpidemie;

			// On ajoute dans le paquetPropagationEntier l'épidémie
			paquetPropagationEntier[j++] = "Epidemie n° " + nbEpidemies + " - " + villeEpidemie;

			// On mélange la défausse
			shuffle(defaussePropagation);

			// on la met au-dessus du paquet
			paquetEpidemie = defaussePropagation.concat(paquetEpidemie);

			// On vide le paquet defaussePropagation
			defaussePropagation.length = 0;
			k = 0;
		}

		var nbCartes = combienTirerDeCartes(nbEpidemies);
		for(var carte = 1; carte <= nbCartes ; carte++) {
			villePropagation = paquetEpidemie.shift();
			paquetPropagationEntier[j++] = carte + "/" + nbCartes + " - " + villePropagation;
			defaussePropagation[k++] = villePropagation;
		}

		// On tire les cartes 2 par 2
		i++;
	}
}

/** Informe par message si un joueur a déjà gagné ou perdue au tour en cours */
function isPseudoGagnePerduCeTour(typeCarte) {
	pseudos.forEach(function(item, index, array) {
		// item est du type = potaw.1.0.10 (pseudo . nbTour . gagnePerdu . nbCartePropa)
		var tab = item.split('.');

		/* Cas général :
		 - on perd quand on tire une carte propagation
		 - on gagne avant de tirer une carte du paquet joueur
		Cas particulier :
		 - on peut perdre si on tire la dernière carte du paquet joueur
		*/

		// Cas particulier
		if (paquetJoueur.length == 1 && nbTours == 26 && nbTours == tab[1]) {
			alert("Le joueur " + tab[0] + " a perdu aussi par manque de carte dans le paquet joueur.");
		}

		// Cas général
		// Si on tire une carte Propagation, on regarde si quelqu'un a perdu
		if (typeCarte == "P" && tab[1] <= 25 ) {
			// Si la partie était perdue et qu'on a tournée le même nombre de cartes
			if (tab[2] == '0' && nbCartesPropagationTournees == tab[3]) {
				alert("Le joueur " + tab[0] + " a perdu sur cette prochaine carte propagation.");
				}
			}

		// Si on tire une carte Joueur, on regarde si un quelqu'un a gagné
		if (typeCarte == "J") {
			// Si la partie était gagnée et qu'on est on même nombre
			if (tab[2] == '1' && nbTours == tab[1]) {
				alert("Le joueur " + tab[0] + " a gagné au tour précédent.");
			}
		}
	});
}


/** Permet de tourner les cartes du paquet propagation */
function tournePropogation(){
	nbCartesPropagationTournees++;

	document.getElementById('idCartesPropagation').style.display = "block";
	document.getElementById('idCarteJoueurs').className = 'pasEnCours';
	document.getElementById('idDivCartesPropagation').className = 'enCours cartePropagation';

	// On récupère 1ère carte du paquet propagation
	var carte = paquetPropagationEntier.shift();

	// On coupe la carte au '-' pour récupérer la 2° partie (qui ne contient que la ville)
	var ville = carte.split('-');

	document.getElementById('idCartesPropagation').innerHTML += ville[0] + "<font color='" + getCouleur(ville[1].substr(1)) + "'>" + ville[1] + "</font><br />";
	document.getElementById('idRecap').innerHTML += carte + "<br />";

	// Ici, on tire la X° carte sur X cartes à tirer du paquet propagation
	if (carte.charAt(0) == carte.charAt(2)) {
		var joueur = (paquetJoueur.length + 1) % 4 == 0 ? 1 : 2;
		document.getElementById('idTournePropagation').disabled = true;
		document.getElementById('idOneClick').disabled = true;
		document.getElementById('idOneClick').innerHTML = document.getElementById('idButtonCarte1').innerHTML;
		document.getElementById('idGoJoueur').innerHTML = "Tour : " + document.getElementById('idJoueur' + joueur + 'Role').innerHTML;
		document.getElementById('idGoJoueur').className = "goJoueur";
	}
	isPseudoGagnePerduCeTour("P");
}


/** Réaffiche le tour en cours */
function reAfficher() {
	document.getElementById('idButtonCarte1').disabled = true;
	document.getElementById('idCarte1').style.display = "block";
	document.getElementById('idCarte2').style.display = "block";
	document.getElementById('idCartesPropagation').style.display = "block";
	document.getElementById('idDivCartesPropagation').className = 'enCours cartePropagation';
}


/** Lorqu'on est en survol du chrono */
function nouveauTour() {
	if (document.getElementById('idGoJoueur').className == "goJoueur") {
		document.getElementById('idDivCartesPropagation').className = 'enCours';
		document.getElementById('idButtonCarte1').disabled = false;
		document.getElementById('idCarte1').style.display = "none";
		document.getElementById('idCarte2').style.display = "none";
		document.getElementById('idCartesPropagation').style.display = "none";
		if (isChronoDejaTourne == false) {
			nbTours++;
			isChronoDejaTourne = true;
			document.getElementById('idRecap').innerHTML += "<b>Tour " + nbTours + " : " + document.getElementById('idGoJoueur').innerHTML + "</b><br />";
		}
	}
}


/** Partie terminée */
function partieTerminee(){
	var gagnePerdue = -1 ;
	var ps = document.getElementById('idPseudo').value;

	// Si le pseudo n'est pas rempli
	if(ps == "") {
		alert("Vous devez saisir un pseudo");
		return;
	}

	// On vérifier qu'un bouton radio ait été coché
	if (document.getElementById('idGagne').checked) {
		gagnePerdue = 1;
		alert("Félicitations " + ps + " !");
	}
	if (document.getElementById('idPerdu').checked) {
		gagnePerdue = 0;
		alert("Dommage " + ps + "...");
	}

	// Si le joueur n'a pas cliqué sur Gagné ou Perdu
	if (gagnePerdue == -1) {
		alert("Vous devez cocher une case");
		return;
	}
	pseudos[pseudos.length] = ps + "." + nbTours + "." + gagnePerdue + "." + nbCartesPropagationTournees;
}


/** Génère le lien de la partie */
function genererLienPartie() {
	// On génère le lien à la demande si on souhaite rentrer plusieurs pseudos en cours de parties
	document.getElementById('idLienPartie').href = lienSansPseudo + "&pseudos=" + pseudos.join('*');
	document.getElementById('idSpanLienPartie').style.display = "block";
}

/** */
function nouvellePartie() {
	if(confirm("Voulez-vous démarrer une nouvelle partie ?")) {
		window.location.replace("../views/index.html");
	}
}

/** Permet de rendre visible quelques données de débugage */
function debug() {
	document.getElementById('idDivDebug').style.display = document.getElementById('idDebug').checked ? "block" : "none";
}


/** Rend actif le bouton oneClick */
function rendVisibleOneClick() {
	document.getElementById('idOneClick').disabled = false;
}


/** Bouton unique pour gagner du temps :) */
function oneClick() {
	//alert(document.getElementById('idButtonCarte1').disabled);
	if (document.getElementById('idButtonCarte2').style.display == "block") {
		tirerCartes('idCarte2');
		document.getElementById('idOneClick').innerHTML = document.getElementById('idTournePropagation').innerHTML;
	}
	else if (document.getElementById('idTournePropagation').disabled == false) {
		tournePropogation();
	}
	else if (document.getElementById('idGoJoueur').disabled == false) {
		nouveauTour();
	}
	else if (document.getElementById('idButtonCarte1').style.display == "block") {
		tirerCartes('idCarte1');
		document.getElementById('idOneClick').innerHTML = document.getElementById('idButtonCarte2').innerHTML;
	}
	else {
		alert("rien");
	}
}


/** Rempli le tableau de l'historique des joueurs de la partie */
function historiquePartie () {
	cacherAfficherCartes('idSpoilHistoJoueurs', 'idLienSpoilHistoJoueurs');
	var monTableau = "<table border='1'> "+
						"<tr> "+
						"	<td>Joueurs</td> "+
						"	<td>Status</td> "+
						"	<td>Nb tour (paquet joueur)</td> "+
						"	<td>Nb cartes Propagation</td> "+
						"</tr>";

	pseudos.forEach(function(item, index, array) {
		// item est du type = potaw.1.0.10 (pseudo . nbTour . gagnePerdu . nbCartePropa)
		var tab = item.split('.');
		monTableau += "<tr> "+
						"<td>" + tab[0] + "</td>"+
						"<td>" + (tab[2] == 0 ? "Perdu" : "Gagné") + "</td>"+
						"<td>" + tab[1] + "</td>"+
						"<td>" + tab[3] + "</td>"+
					"</tr>";
	});
	document.getElementById('idSpoilHistoJoueurs').innerHTML = monTableau + "</table>";
}
