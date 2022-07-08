var doc = document;
var errorDivButtons = '<div class="confirmation-buttons" style="margin-top: 1em; text-align: center;"> <button class="btn evt-confirm-btn btn-confirm-no" onclick="Dialog.close(\'Errore\')">Capito</button> </div>';

if ( window.frames.length>0 && window.main != null ) doc = window.main.document;

if ( doc.URL.indexOf('screen=barracks') === -1 ) { Dialog.show( 'Errore', 'Usa questo script nella caserma!' + errorDivButtons ); throw new Error("ERROR"); };

function time2sec( timeToSec )
{
  var sec = 0;
  var timeArray = timeToSec.split(':');
  var h = timeArray[0] || 0;
  var m = timeArray[1] || 0;
  var s = timeArray[2] || 0;

  sec = sec + parseInt( s ) || 0;
  sec = sec + ( parseInt( m ) || 0 ) * 60;
  sec = sec + ( parseInt( h ) || 0  ) * 3600;

  return sec;
}

var inputSpear       = doc.forms[0].spear_0;
var inputSword       = doc.forms[0].sword_0;
var inputAxe         = doc.forms[0].axe_0;

var inputSpearSet    = typeof inputSpear != "undefined";
var inputSwordSet    = typeof inputSword != "undefined";
var inputAxeSet      = typeof inputAxe   != "undefined";

var availableWood    = doc.getElementById('wood').innerHTML;
var availableStone   = doc.getElementById('stone').innerHTML;
var availableIron    = doc.getElementById('iron').innerHTML;

var availablePop     = parseInt( doc.getElementById('pop_max_label').innerText ) - parseInt( doc.getElementById('pop_current_label').innerText );

if ( inputSpear )
{
  var spearTimeCost  = time2sec( doc.getElementById('spear_0_cost_time').innerText );
  var spearMax       = parseInt( doc.getElementById('spear_0_a').innerText.replace('(','').replace(')','') );

  var spearWoodCost  = parseInt( doc.getElementById('spear_0_cost_wood').innerText );
  var spearStoneCost = parseInt( doc.getElementById('spear_0_cost_stone').innerText );
  var spearIronCost  = parseInt( doc.getElementById('spear_0_cost_iron').innerText );
}

if ( inputSword )
{
  var swordTimeCost  = time2sec( doc.getElementById('sword_0_cost_time').innerText );
  var swordMax       = parseInt( doc.getElementById('sword_0_a').innerText.replace('(','').replace(')',''));

  var swordWoodCost  = parseInt( doc.getElementById('sword_0_cost_wood').innerText );
  var swordStoneCost = parseInt( doc.getElementById('sword_0_cost_stone').innerText );
  var swordIronCost  = parseInt( doc.getElementById('sword_0_cost_iron').innerText );
}

if ( inputAxe )
{
  var axeTimeCost  = time2sec( doc.getElementById('axe_0_cost_time').innerText );
  var axeMax       = parseInt( doc.getElementById('axe_0_a').innerText.replace('(','').replace(')',''));

  var axeWoodCost  = parseInt( doc.getElementById('axe_0_cost_wood').innerText );
  var axeStoneCost = parseInt( doc.getElementById('axe_0_cost_stone').innerText );
  var axeIronCost  = parseInt( doc.getElementById('axe_0_cost_iron').innerText );
}

var totalWoodCost  = ( spearWoodCost  || 0 ) + ( swordWoodCost  || 0 ) + ( axeWoodCost  || 0 );
var totalStoneCost = ( spearStoneCost || 0 ) + ( swordStoneCost || 0 ) + ( axeStoneCost || 0 );
var totalIronCost  = ( spearIronCost  || 0 ) + ( swordIronCost  || 0 ) + ( axeIronCost  || 0 );

var maxArmyWood    = Math.floor( availableWood/totalWoodCost );
var maxArmyStone   = Math.floor( availableStone/totalStoneCost );
var maxArmyIron    = Math.floor( availableIron/totalIronCost );

var maxArmy        = Math.min( maxArmyWood, maxArmyStone, maxArmyIron );

if
(
     ( typeof inputSword != "undefined" && doc.forms[0].spear_0.value !== "" )
  || ( typeof inputSword != "undefined" && doc.forms[0].sword_0.value !== "" )
  || ( typeof inputAxe   != "undefined" && doc.forms[0].axe_0.value   !== "" )
)
{
  Dialog.show( 'Errore', 'Ripulisci tutti i campi di reclutamento!' + errorDivButtons );
  throw new Error("ERROR");
}

function train()
{
  var time      = doc.getElementById('time').value;
  var timeArray = time.split(':');

  if ( timeArray.length < 2  || timeArray.some( (x) => x === "" ) )
  {
    Dialog.show( 'Errore', '<p>Formattazione errata!</p>' + errorDivButtons );
    throw new Error("ERROR");
  }

  window.localStorage.setItem( 'tribals_script_time', time );

  var isSpear = doc.getElementById( 'spear' ) ? doc.getElementById( 'spear' ).checked : false;
  var isSword = doc.getElementById( 'sword' ) ?doc.getElementById( 'sword' ).checked : false;
  var isAxe   = doc.getElementById( 'axe' ) ? doc.getElementById( 'axe' ).checked : false;

  window.localStorage.setItem( 'tribals_script_spear',  isSpear );
  window.localStorage.setItem( 'tribals_script_sword', isSword );
  window.localStorage.setItem( 'tribals_script_axe', isAxe );

  var selectedTroupe = 0;

  selectedTroupe += inputSpearSet && isSpear === true ? 1 : 0;
  selectedTroupe += inputSwordSet && isSword === true ? 1 : 0;
  selectedTroupe += inputAxeSet   && isAxe   === true ? 1 : 0;

  if ( selectedTroupe === 0 )
  {
    Dialog.show( 'Errore', 'Seleziona almeno una tipologia di truppa!' + errorDivButtons );
    throw new Error("ERROR");
  }

  var totalMax = 0;
  totalMax += inputSpearSet && isSpear === true ? spearTimeCost : 0;
  totalMax += inputSwordSet && isSword === true ? swordTimeCost : 0;
  totalMax += inputAxeSet   && isAxe   === true ? axeTimeCost   : 0;

  var sec   = time2sec( time );
  var train = Math.floor( sec/totalMax );
  train     = Math.min( maxArmy, train );

  if ( train > availablePop ) train = Math.floor( availablePop / selectedTroupe );

  var spear = inputSpearSet && isSpear === true ? train > spearMax ? spearMax : train : "";
  var sword = inputSwordSet && isSword === true ? train > swordMax ? swordMax : train : "";
  var axe   = inputAxeSet   && isAxe   === true ? train > axeMax   ? axeMax   : train : "";

  if ( typeof inputSpear != "undefined" ) inputSpear.value = spear;
  if ( typeof inputSword != "undefined" ) inputSword.value = sword;
  if ( typeof inputAxe   != "undefined" ) inputAxe.value   = axe;
  Dialog.close( 'content' )
}

(function()
{
  console.log('Script made by IceWizard');
  console.log('Version 1.0.1');
  console.log('Last update: 2022-07-02');

  console.log('availableWood:' + availableWood);
  console.log('availableStone:' + availableStone);
  console.log('availableWood:' + availableWood);
  console.log('availableIron:' + availableIron);
  console.log('availablePop:' + availablePop);

  var contet = '<div id="content">';
  var defaultTime = window.localStorage.getItem( 'tribals_script_time' ) == null ? '' : window.localStorage.getItem( 'tribals_script_time' );

  contet += '<table> <tr> <td> <span>Tempo: </span> </td><td> <input type=\'text\' id=\'time\' placeholder=\'hh:mm\' value="' + defaultTime + '" style="max-width: 10em"/> </td> </tr>';

  var checkSpear = window.localStorage.getItem( 'tribals_script_spear' ) === 'true' ? ' checked ' : '';
  var checkSword = window.localStorage.getItem( 'tribals_script_sword' ) === 'true' ? ' checked ' : '';
  var checkAxe   = window.localStorage.getItem( 'tribals_script_axe' ) === 'true' ? ' checked ' : '';

  contet += '<tr>';
  contet += inputSpearSet ? '<tr><td> <span><img src=\'https://dsit.innogamescdn.com/asset/88a8f29e/graphic/unit/unit_spear.png\' data-title=\'Spear\' /> </span></td><td> <input type=\'checkbox\' id=\'spear\' ' + checkSpear + '/> </td></tr>' : '';
  contet += inputSwordSet ? '<tr><td> <span><img src=\'https://dsit.innogamescdn.com/asset/88a8f29e/graphic/unit/unit_sword.png\' data-title=\'Sword\' /> </span></td><td> <input type=\'checkbox\' id=\'sword\' ' + checkSword + '/> </td></tr>' : '';
  contet += inputAxeSet   ? '<tr><td> <span><img src=\'https://dsit.innogamescdn.com/asset/88a8f29e/graphic/unit/unit_axe.png\' data-title=\'Axe\' /> </span></td><td> <input type=\'checkbox\' id=\'axe\' ' + checkAxe + '/> </td></tr>'   : '';
  contet += '</tr>';

  contet += '<tr></tr><td> <button class=\'btn evt-confirm-btn btn-confirm-ok\' onclick=\'train()\'>Recluta</button> </td></tr>';
  contet += '</table> </div>';

  Dialog.show('content', contet);
}());
