//Functionality
var first_card_clicked = null;
var second_card_clicked = null;
var total_possible_matches = 18;
var match_counter = 0;
var is_timeout_done = true;
//Stats
var attempts = 0;
var accuracy = 0;
var games_played = 0;
var pokemon_first_evolution = ['images/bulbasaur.gif',
                               'images/charmander.gif',
                               'images/squirtle.gif',
                               'images/chikorita.gif',
                               'images/cyndaquil.gif',
                               'images/totodile.gif',
                               'images/treecko.gif',
                               'images/torchic.gif',
                               'images/mudkip.gif'];
var pokemon_evolution_chart = {
    'images/bulbasaur.gif':'images/ivysaur.gif',
    'images/ivysaur.gif':'images/venusaur.gif',
    'images/charmander.gif':'images/charmeleon.gif',
    'images/charmeleon.gif':'images/charizard.gif',
    'images/squirtle.gif':'images/wartortle.gif',
    'images/wartortle.gif':'images/blastoise.gif',
    'images/chikorita.gif':'images/bayleef.gif',
    'images/bayleef.gif':'images/meganium.gif',
    'images/cyndaquil.gif':'images/quilava.gif',
    'images/quilava.gif':'images/typhlosion.gif',
    'images/totodile.gif':'images/croconaw.gif',
    'images/croconaw.gif':'images/feraligatr.gif',
    'images/treecko.gif':'images/grovyle.gif',
    'images/grovyle.gif':'images/sceptile.gif',
    'images/torchic.gif':'images/combusken.gif',
    'images/combusken.gif':'images/blaziken.gif',
    'images/mudkip.gif':'images/marshtomp.gif',
    'images/marshtomp.gif':'images/swampert.gif'
};
var pokemon_first_state = {
    'images/venusaur.gif':'images/bulbasaur.gif',
    'images/charizard.gif':'images/charmander.gif',
    'images/blastoise.gif':'images/squirtle.gif',
    'images/meganium.gif':'images/chikorita.gif',
    'images/typhlosion.gif':'images/cyndaquil.gif',
    'images/feraligatr.gif':'images/totodile.gif',
    'images/sceptile.gif':'images/treecko.gif',
    'images/blaziken.gif':'images/torchic.gif',
    'images/swampert.gif':'images/mudkip.gif',
    'images/ivysaur.gif':'images/bulbasaur.gif',
    'images/charmeleon.gif':'images/charmander.gif',
    'images/wartortle.gif':'images/squirtle.gif',
    'images/bayleef.gif':'images/chikorita.gif',
    'images/quilava.gif':'images/cyndaquil.gif',
    'images/croconaw.gif':'images/totodile.gif',
    'images/grovyle.gif':'images/treecko.gif',
    'images/combusken.gif':'images/torchic.gif',
    'images/marshtomp.gif':'images/mudkip.gif',
    'images/bulbasaur.gif':'images/bulbasaur.gif',
    'images/charmander.gif':'images/charmander.gif',
    'images/squirtle.gif':'images/squirtle.gif',
    'images/chikorita.gif':'images/chikorita.gif',
    'images/cyndaquil.gif':'images/cyndaquil.gif',
    'images/totodile.gif':'images/totodile.gif',
    'images/treecko.gif':'images/treecko.gif',
    'images/torchic.gif':'images/torchic.gif',
    'images/mudkip.gif':'images/mudkip.gif'
}
var pokemon_list = {
    'images/bulbasaur.gif':['Bulbasaur','height_50px'],
    'images/ivysaur.gif':['Ivysaur','height_70px'],
    'images/venusaur.gif':['Venusaur','height_90px'],
    'images/charmander.gif':['Charmander','height_60px'],
    'images/charmeleon.gif':['Charmeleon','height_70px'],
    'images/charizard.gif':['Charizard','height_130px'],
    'images/squirtle.gif':['Squirtle','height_50px'],
    'images/wartortle.gif':['Wartortle','height_70px'],
    'images/blastoise.gif':['Blastoise','height_90px'],
    'images/chikorita.gif':['Chikorita','height_60px'],
    'images/bayleef.gif':['Bayleef','height_90px'],
    'images/meganium.gif':['Meganium','height_90px'],
    'images/cyndaquil.gif':['Cyndaquil','height_40px'],
    'images/quilava.gif':['Quilava','height_40px'],
    'images/typhlosion.gif':['Typhlosion','height_90px'],
    'images/totodile.gif':['Totodile','height_60px'],
    'images/croconaw.gif':['Croconaw','height_70px'],
    'images/feraligatr.gif':['Feraligatr','height_90px'],
    'images/treecko.gif':['Treecko','height_60px'],
    'images/grovyle.gif':['Grovyle','height_70px'],
    'images/sceptile.gif':['Sceptile','height_90px'],
    'images/torchic.gif':['Torchic','height_60px'],
    'images/combusken.gif':['Combusken','height_80px'],
    'images/blaziken.gif':['Blaziken','height_90px'],
    'images/mudkip.gif':['Mudkip','height_60px'],
    'images/marshtomp.gif':['Marshtomp','height_80px'],
    'images/swampert.gif':['Swampert','height_90px']
};
function display_stats(){
    $('#games_played .value').text(games_played);
    $('#matches .value').text(match_counter);
    $('#attempts .value').text(attempts);
    $('#accuracy .value').text(Math.round(accuracy*100)+'%');
}
function reset_stats(){
    accuracy = 0;
    attempts = 0;
    match_counter = 0;
    display_stats();
}

function card_clicked(element){
    //show card face
    $(element).find('.front').before($(element).find('.back'));
    $(element).find('.front').removeClass('transparent');
    if(first_card_clicked===null){ // Add to first_card_clicked if nothing inside
        first_card_clicked = $(element);
    }
    else{ // Add to second_card_clicked
        second_card_clicked = $(element);
        attempts++;
        if($(first_card_clicked).find('.front').find('img').attr('src') === $(second_card_clicked).find('.front').find('img').attr('src')){ // compare front of two card together and if true match stuff
            match_counter++;
            accuracy = match_counter/attempts;
            switch_img_of_matched_pokemon(first_card_clicked,second_card_clicked);
            first_card_clicked = null;
            second_card_clicked = null;
            display_stats();
            if(match_counter === total_possible_matches){ // check for overall win
                $('#info-box').text("You win!");
            }
        }
        else{ // Cards does not match, reset stuff
            $('#info-box').text("That's not the same Pokemon!");
            accuracy = match_counter/attempts;
            display_stats();
            is_timeout_done = false;
            setTimeout(function(){
                $(first_card_clicked).find('.back').before($(first_card_clicked).find('.front'));
                $(second_card_clicked).find('.back').before($(second_card_clicked).find('.front'));
                $(first_card_clicked).find('.front').addClass("transparent");
                $(second_card_clicked).find('.front').addClass("transparent");
                first_card_clicked = null;
                second_card_clicked = null;
                $('#info-box').append("<br>They both ran back into their grass!");
                is_timeout_done = true;
            }, 2000);
        }
    }
}
function randomize_cards(){
    var cards = $('.position');
    for(var i = 0; i<cards.length; i++){
        var target = Math.floor(Math.random() * cards.length -1) + 1;
        var target2 = Math.floor(Math.random() * cards.length -1) + 1;
        document.getElementById('game-area').insertBefore(cards[target2],cards[target]);
    }
}
function creating_div_block(front_image){
    var positioning_div = $('<div>',{
        class: 'position col-xs-2'
    });
    var card_div = $('<div>',{
        class: 'card'
    });
    var front_div = $('<div>',{
        class: 'front transparent'
    });
    var front_img = $('<img>',{
        src: front_image
    });
    var back_div = $('<div>',{
        class: 'back'
    });
    var back_img = $('<img>',{
        src: 'images/pokemon_back.png'
    });
    back_div.append(back_img);
    front_div.append(front_img);
    card_div.append(front_div,back_div);
    positioning_div.append(card_div);
    $('#game-area').append(positioning_div);
}
function change_border_color(id,color){
    $(id).css("border-color",color);
}
function all_buttons_hover(){
    $('#setting img').mouseover(function(){
        change_border_color(this,'#fff335');
    });
    $('#setting img').mouseout(function(){
        change_border_color(this,'#0b6fa4');
    });
    $('#about img').mouseover(function(){
        change_border_color(this,'#fff335');
    });
    $('#about img').mouseout(function(){
        change_border_color(this,'#0b6fa4');
    });
}
function grass_move_when_hover(){
    var isAnimated = false;
    $('.card').mouseover(function(){
        if(!isAnimated && $(this).find('.front').hasClass('transparent')){
            isAnimated = true;
            $(this).find('.back').animate({ "left": "+=3px"}, "fast" );
            $(this).find('.back').animate({ "left": "-=3px" }, "fast" );
        }
        isAnimated = false;
    });
}
function switch_img_of_matched_pokemon(first_card,second_card){ // Pretty much evolution function
    var card_img = $(first_card).find('.front').find('img').attr('src');
    var pre_evolution_card_img = card_img;
    // Change first and second card image to evolved state
    $(first_card).find('.front').find('img').attr('src', pokemon_evolution_chart[card_img]);
    $(second_card).find('.front').find('img').attr('src', pokemon_evolution_chart[card_img]);
    // Change height for evolution
    $(first_card).find('.front').removeClass(pokemon_list[card_img][1]).addClass(pokemon_list[pokemon_evolution_chart[card_img]][1]);
    $(second_card).find('.front').removeClass(pokemon_list[card_img][1]).addClass(pokemon_list[pokemon_evolution_chart[card_img]][1]);
    card_img = $(first_card).find('.front').find('img').attr('src');
    $('#info-box').text(pokemon_list[pre_evolution_card_img][0] +" evolved into " + pokemon_list[card_img][0] + "!");
    if(pokemon_evolution_chart[card_img] !== undefined) {
        is_timeout_done = false;
        setTimeout(function(){
            $(first_card).find('.front').addClass('transparent');
            $(second_card).find('.front').addClass('transparent');
            randomize_cards();
            $('#info-box').append("<br>Every Pokemon ran into a different grass!");
            is_timeout_done = true;
        },2000);
    }
}
//Music
function audio_off(){
    $('.fa-volume-off').removeClass('clicked');
    $('.fa-volume-up').addClass('clicked');
    $('.themesong').trigger('pause');
}
function audio_on(){
    $('.fa-volume-up').removeClass('clicked');
    $('.fa-volume-off').addClass('clicked');
    $('.themesong').trigger('play');
}
$(document).ready(function(){
    for(var i = 0; i<pokemon_first_evolution.length; i++){
        creating_div_block(pokemon_first_evolution[i]);
        creating_div_block(pokemon_first_evolution[i]);
    }
    grass_move_when_hover();
    display_stats();
    randomize_cards();
    $('.card').click(function(){
        if($(this).find('.front').hasClass('transparent') && is_timeout_done){
            card_clicked(this);
        }
    });
    all_buttons_hover();
    $('.reset').click(function(){
        if(attempts!==0){
            games_played++;
            reset_stats();
            var cards = $('.card');
            for(var i=0;i<cards.length;i++){
                $(cards[i]).find('.back').before($(cards[i]).find('.front')); // make so grass is in front of pokemon
                $(cards[i]).find('.front').removeClass(pokemon_list[$(cards[i]).find('.front').find('img').attr('src')][1]);
                $(cards[i]).find('.front').find('img').attr('src',pokemon_first_state[$(cards[i]).find('.front').find('img').attr('src')]);
                $(cards[i]).find('.front').addClass(pokemon_list[pokemon_first_state[$(cards[i]).find('.front').find('img').attr('src')]][1]);
            }
            first_card_clicked = null;
            $('#info-box').text("Welcome to Pokemon Memory Match! Find a matched set of Pokemon and try to catch them all!");
            $('.front').addClass('transparent');
            randomize_cards();
        }
    });
});