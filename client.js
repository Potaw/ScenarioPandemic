// var socket = io.connect('http://109.208.207.112:8080');
var socket = io.connect('http://localhost:8080');
socket.on('message', function (message) {
    alert(message);
});
let pseudo = prompt('Quel est votre pseudo ?');
socket.emit('add_new_player', pseudo);
socket.emit('get_players');

function startGame() {
    socket.emit('get_game_parameters', location.search.substring(1).length > 0 ? JSON.parse(
        '{"'
        + decodeURI(
        location.search.substring(1).replace(
            /&/g,
            "\",\"").replace(
            /=/g,
            "\":\"")) + '"}') : null);
}

socket.on('game_parameters', function (url_parameters) {
    run(url_parameters);
});

socket.on('players_list', function (players) {
    alert('Joueurs connectés : ' + players.join(', '));
});
