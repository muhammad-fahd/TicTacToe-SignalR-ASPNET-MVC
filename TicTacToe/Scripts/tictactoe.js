$(function () {
    var x = new Image();
    x.src = '/Content/Image/TicTacToeX.png';
    var o = new Image();
    o.src = '/Content/Image/TicTacToeO.png';

    $("#register").show();
    $("#findOpponent").hide();
    $("#waitingForOpponent").hide();
    $("#game").hide();
    $("#findAnotherGame").hide();

    var game = $.connection.game;

    game.client.waitingForOpponent = function (message) {
        $("#information").html("");
        $("#information").html("<strong>Waiting for the opponent to play!</strong>");
        $('#debug').append('<li>You need to wait for the opponent to play!</li>');
    };

    game.client.waitingForMarkerPlacement = function (message) {
        $("#information").html("");
        $("#information").html("<strong>Your turn!</strong>");
        $('#debug').append('<li>Your turn! Make your move</li>');
    };

    game.client.foundOpponent = function (message, simbolo) {
        $("#findAnotherGame").hide();
        $("#waitingForOpponent").hide();
        $("#gameInformation").html("You are playing against: " + message);
        $("#simbolo").html("You play with: <img src='" + simbolo + "' height='20' width='20' style='vertical-align:bottom'/>");
        $('#debug').append('<li>You are playing against ' + message + '</li>');

        $("#game").html('<div id="information" /><br/>');
        for (var i = 0; i < 9; i++) {

            $("#game").append("<span id=" + i + " class='box' />");
        }

        $("#game").show();
    };

    game.client.noOpponents = function (message) {
        $("#information").html("<strong>Looking for an opponent!</strong>");
        $('#debug').append('<li>Waiting for an opponent to connect...</li>');
    };

    game.client.addMarkerPlacement = function (message) {
        if (message.Simbolo == "O") {
            $("#" + message.MarkerPosition).addClass("mark2");
            $("#" + message.MarkerPosition).addClass("marked");
            $("#information").html("<strong>Waiting for the opponent to play!</strong>");
        }
        else {
            $("#" + message.MarkerPosition).addClass("mark1");
            $("#" + message.MarkerPosition).addClass("marked");
            $("#information").html("<strong>Waiting for the opponent to play!</strong>");
        }
        $('#debug').append('<li>Move made ​​by ' + message.OpponentName + ' in position ' + message.MarkerPosition + '</li>');
    };

    game.client.opponentDisconnected = function (message) {
        $("#gameInformation").html("<strong>GAME OVER! The opponent quit the game! " + message + " You Win!</strong>");
        $('#debug').append('<li>His opponent folded. Congratulations, you won!</li>');

        $("#findAnotherGame").show();
        $("#game").hide();
    };

    game.client.registerComplete = function (message) {
        $('#debug').append('<li>Are you ready to play Tic Tac Toe!</li>');
    };

    game.client.gameOver = function (message) {
        $("#information").html('<strong>End of game! The winner is: ' + message + '</strong>');
        $('#debug').append('<li>End of game! The winner is: ' + message + '</li>');
        $("#findAnotherGame").show();
    };

    game.client.refreshAmountOfPlayers = function (message) {
        $("#amountOfGames").html(message.amountOfGames);
        $("#amountOfClients").html(message.amountOfClients);
        $("#totalAmountOfGames").html(message.totalGamesPlayed);
    };

    $(".box").live("click", function (event) {

        if ($(this).hasClass("marked")) return;
        game.server.play(event.target.id);
    });

    $("#registerName").click(function () {
        game.server.registerClient($('#gamaName').val());

        $("#register").hide();
        $("#findOpponent").show();
    });

    $(".findGame").click(function () {
        findGame();
    });

    $("#findAnotherGame").click(function () {
        $("#gameInformation").html("");
        $("#game").hide();
        $("#findAnotherGame").hide();
        game.server.registerClient($('#gamaName').val());

        findGame();
    });

    function findGame() {
        game.server.findOpponent();
        $("#waitingForOpponent").show();
        $("#register").hide();
        $("#findOpponent").hide();
    }

    $.connection.hub.start().done();
});