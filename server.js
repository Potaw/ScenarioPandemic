var http = require('http');
var fs = require('fs');
var server = http.createServer(function (req, res) {
    let path;
    if (req.url === '/') {
        path = './web_index.html';
    } else {
        path = '.' + req.url.split('?')[0];
    }
    if (/.(jpg|png)$/.test(path)) {
        fs.readFile(path, 'Base64', function (error, content) {
            res.writeHead(200, {'Content-Type': 'image/jpg'});
            res.end(content, 'Base64');
        });
    } else if (/.(css)$/.test(path)) {
        fs.readFile(path, 'utf-8', function (error, content) {
            res.writeHead(200, {'Content-Type': 'text/css'});
            res.end(content);
        });
    } else {
        fs.readFile(path, 'utf-8', function (error, content) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(content);
        });
    }
});
var io = require('socket.io').listen(server);


/** Définition des constantes de l'ensemble des cartes */
const bleu = ['Atlanta', 'New York', 'Whashington', 'Montreal', 'San Fransisco', 'Londres', 'Paris', 'Essen', 'Madrid', 'Milan', 'Chicago', 'Saint Petersbourg'];
const jaune = ['Los Angeles', 'Mexico', 'Miami', 'Bogota', 'Lima', 'Santiago', 'Buenos Aires', 'Sao Paulo', 'Lagos', 'Khartoum', 'Kinshasa', 'Johannesburg'];
const noir = ['Alger', 'Le Caire', 'Istanbul', 'Moscou', 'Téhéran', 'Bagdad', 'Riyad', 'Karachi', 'Delhi', 'Mumbai', 'Calcutta', 'Chennai'];
const rouge = ['Jakarta', 'Sydney', 'Manille', 'Ho Chi Minh Ville', 'Bangkok', 'Hong Kong', 'Taipei', 'Osaka', 'Tokyo', 'Shanghai', 'Pékin', 'Séoul'];
const evenements = ['Pont aérien', 'Subvention publique', 'Hôpital mobile', 'Rééxaminer les recherches', 'Traitements à distance', 'Ordres spéciaux', 'Temps emprunté', 'Déploiement de vaccins rapides'];
const epidemies = ['Pente fatale', 'Structure moléculaire complexe', 'Pertes inacceptables', 'Effet chronique', 'Ingérence gouvernementale', 'Populations non calculées'];
const roles = ['Scientifique', 'Epidémiologiste', 'Opérateur de terrain', 'Spécialiste en quarantaine', 'Généraliste', 'Chercheuse', 'Archiviste', 'Spécialiste en confinement', 'Expert aux opérations', 'Planificateur d\'urgence', 'Médecin'];

/** Variables globales */
var paquetJoueur;
var epidemdiesShuffle;
var rolesShuffle = [];
var paquetEpidemie;
var paquetPropagationEntier = [];
var pseudos = [];
var lienSansPseudo = "";

/** Retourne un nombre aléatoire entre min et max */
function randomInt(min, max) {
    return (min + Math.floor((max - min + 1) * Math.random()));
}

/** Mélange le tableau passer en paramètre */
function shuffle(items) {
    var i, j;
    var item;
    if ((!items.length) || (items.length === 1))
        return;
    for (i = items.length - 1; i !== 0; i--) {
        j = randomInt(0, i);
        item = items[j];
        items[j] = items[i];
        items[i] = item;
    }
}

function get_game_parameters(url_parameters) {
    // S'il existe des paramètres dans la requête, on s'en sert
    var vars = url_parameters;
    if (vars === null) {
        vars = {
            roleJoueur1: "",
            roleJoueur2: "",
            paquetJoueur: "",
            paquetPropagationEntier: "",
            pseudos: "",
            idUnique: ""
        };
    }
    var idUnique = 0;

    if (vars['idUnique'].length >= 1) {
        idUnique = vars['idUnique'];
    }

// Si les rôles sont passés en paramètre, on les prend
    if (vars['roleJoueur1'].length >= 1 && vars['roleJoueur2'].length >= 1) {
        rolesShuffle[0] = decodeURI(vars['roleJoueur1']);
        rolesShuffle[1] = decodeURI(vars['roleJoueur2']);
    }
// Sinon, on mélange les rôles existants
    else {
        rolesShuffle = roles.slice();
        shuffle(rolesShuffle);
    }

// Si le paquetJoueur est passé en paramètre, on le prend
    if (vars['paquetJoueur'].length >= 1) {
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
        paquetJoueur.splice(47 + randomInt(0, 7), 0, epidemdiesShuffle.shift());
        paquetJoueur.splice(39 + randomInt(0, 7), 0, epidemdiesShuffle.shift());
        paquetJoueur.splice(32 + randomInt(0, 7), 0, epidemdiesShuffle.shift());
        paquetJoueur.splice(24 + randomInt(0, 8), 0, epidemdiesShuffle.shift());
        paquetJoueur.splice(16 + randomInt(0, 8), 0, epidemdiesShuffle.shift());
        paquetJoueur.splice(8 + randomInt(0, 8), 0, epidemdiesShuffle.shift());
    }

// Si le paquet propagation est passé en paramètre, on le prend
    if (vars['paquetPropagationEntier'].length >= 1) {
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
        pseudos.forEach(function (item, index) {
            // item est du type = potaw.1.0.10 (pseudo . nbTour . gagnePerdu . nbCartePropa)
            var tab = item.split('.');
            joueurs[index] = tab[0];
        });

        // On n'affiche pas dans l'ordre les joueurs qui ont joués, pour ne pas influencer
        shuffle(joueurs);
    } else {
        idUnique = Date.now();
    }


// On génère le lien de la partie
    lienSansPseudo = "web_index.html?" +
        (idUnique === 0 ? "" : "idUnique=" + idUnique) +
        "&roleJoueur1=" + encodeURI(rolesShuffle[0]) +
        "&roleJoueur2=" + encodeURI(rolesShuffle[1]) +
        "&paquetJoueur=" + encodeURI(paquetJoueur.join('*')) +
        "&paquetPropagationEntier=" + encodeURI(paquetPropagationEntier.join('*')) +
        "&pseudos=" + vars['pseudos'];
    return JSON.parse(
        '{"'
        + decodeURI(
        lienSansPseudo.split('?')[1].replace(
            /&/g,
            "\",\"").replace(
            /=/g,
            "\":\"")) + '"}');
}

/** Retourne combien de cartes ville du paquet propatation il faut tirer */
function combienTirerDeCartes(nbEpidemies) {
    if (nbEpidemies <= 2) {
        return 2;
    } else if (nbEpidemies <= 4) {
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
    var i;

    // On tire les 9 premières cartes des maladies
    for (i = 1; i <= 9; i++) {
        villePropagation = paquetEpidemie.shift();
        paquetPropagationEntier[j++] = i + "/9 - " + villePropagation;
        defaussePropagation[k++] = villePropagation;
    }

    // On parcourt chaque carte du paquet joueur
    for (i = 8; i < paquetJoueur.length; i++) {
        var nbEpidemiesEn2Cartes = 0;

        // Combien d'épidémies dans les 2 prochaines cartes ?
        if (epidemies.indexOf(paquetJoueur[i]) >= 0) {
            nbEpidemiesEn2Cartes++;
        }
        if (epidemies.indexOf(paquetJoueur[i + 1]) >= 0) {
            nbEpidemiesEn2Cartes++;
        }

        // On boucle sur le nombre de cartes épidémies tournées en 2 cartes
        for (var epi = 1; epi <= nbEpidemiesEn2Cartes; epi++) {
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
        for (var carte = 1; carte <= nbCartes; carte++) {
            villePropagation = paquetEpidemie.shift();
            paquetPropagationEntier[j++] = carte + "/" + nbCartes + " - " + villePropagation;
            defaussePropagation[k++] = villePropagation;
        }

        // On tire les cartes 2 par 2
        i++;
    }
}

io.sockets.on('connection', function (socket) {
    socket.on('add_new_player', function (pseudo) {
        socket.pseudo = pseudo;
        io.sockets.emit('new_player', socket.pseudo);
    });
    socket.on('get_players', function () {
        var clients = io.sockets.clients();
        var usernames = [];
        for (var socket in clients.sockets) {
            usernames.push(clients.sockets[socket].pseudo);
        }
        io.sockets.emit('players_list', usernames);
    });
    socket.on('get_game_parameters', function (url_parameters) {
        var new_url_parameters = get_game_parameters(url_parameters);
        io.sockets.emit('game_parameters', new_url_parameters);
    });
});
server.listen(8080);
