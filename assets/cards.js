#!/usr/bin/env node

/** Définition des constantes de l'ensemble des cartes */
const bleu = ['Atlanta', 'New York', 'Washington', 'Montreal', 'San Fransisco', 'Londres', 'Paris', 'Essen', 'Madrid', 'Milan', 'Chicago', 'Saint Petersbourg'];
const jaune = ['Los Angeles', 'Mexico', 'Miami', 'Bogota', 'Lima', 'Santiago', 'Buenos Aires', 'Sao Paulo', 'Lagos', 'Khartoum', 'Kinshasa', 'Johannesburg'];
const noir = ['Alger', 'Le Caire', 'Istanbul', 'Moscou', 'Téhéran', 'Bagdad', 'Riyad', 'Karachi', 'Delhi', 'Mumbai', 'Calcutta', 'Chennai'];
const rouge = ['Jakarta', 'Sydney', 'Manille', 'Ho Chi Minh Ville', 'Bangkok', 'Hong Kong', 'Taipei', 'Osaka', 'Tokyo', 'Shanghai', 'Pékin', 'Séoul'];
const evenements = ['Pont aérien', 'Subvention publique', 'Hôpital mobile', 'Rééxaminer les recherches', 'Traitements à distance', 'Ordres spéciaux', 'Temps emprunté', 'Déploiement de vaccins rapides'];
const epidemies = ['Pente fatale', 'Structure moléculaire complexe', 'Pertes inacceptables', 'Effet chronique', 'Ingérence gouvernementale', 'Populations non calculées'];
const roles = ['Scientifique', 'Epidémiologiste', 'Opérateur de terrain', 'Spécialiste en quarantaine', 'Généraliste', 'Chercheuse', 'Archiviste', 'Spécialiste en confinement', 'Expert aux opérations', 'Planificateur d\'urgence', 'Médecin'];

/** Retourne un nombre aléatoire entre min et max */
function randomInt (min, max) {
	return (min + Math.floor ((max - min + 1) * Math.random ()));
}

/** Mélange le tableau passer en paramètre */
function shuffle (items) {
	var i, j;
	var item;
	if ((!items.length) || (items.length == 1))
		return;
	for (i = items.length - 1; i != 0; i --) {
		j = randomInt (0, i);
		item = items[j];
		items[j] = items[i];
		items[i] = item;
	}
}
