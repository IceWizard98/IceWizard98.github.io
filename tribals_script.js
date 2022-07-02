var doc = document; 
var errorDivButtons = '<div class="confirmation-buttons" style="margin-top: 1em; text-align: center;"> <button class="btn evt-confirm-btn btn-confirm-no" onclick="Dialog.close(\'Errore\')">Capito</button> </div>';

if ( window.frames.length>0 && window.main != null ) doc = window.main.document;

if ( doc.URL.indexOf('screen=barracks') === -1 ) { Dialog.show( 'Errore', 'Usa questo script nella caserma!' + errorDivButtons ); throw new Error("ERROR"); };

function time2sec( timeToSec )
{
  var sec = 0;
  var timeArray = timeToSec.split(':');
  var h = timeArray[0];
  var m = timeArray[1];
  var s = timeArray[2];

  sec = sec + parseInt( s );
  sec = sec + parseInt( m ) * 60;
  sec = sec + parseInt( h ) * 3600;

  return sec;
}

var imputSpear       = doc.forms[0].spear_0;
var imputSword       = doc.forms[0].sword_0;
var imputAxe         = doc.forms[0].axe_0;

var availableWood    = doc.getElementById('wood').innerHTML;
var availableStone   = doc.getElementById('stone').innerHTML;
var availableIron    = doc.getElementById('iron').innerHTML;

if ( imputSpear )
{
  var spearTimeCost  = time2sec( doc.getElementById('spear_0_cost_time').innerText );
  var spearMax       = parseInt( doc.getElementById('spear_0_a').innerText.replace('(','').replace(')','') );

  var spearWoodCost  = parseInt( doc.getElementById('spear_0_cost_wood').innerText );
  var spearStoneCost = parseInt( doc.getElementById('spear_0_cost_stone').innerText );
  var spearIronCost  = parseInt( doc.getElementById('spear_0_cost_iron').innerText );
}

if ( imputSword )
{
  var swordTimeCost  = time2sec( doc.getElementById('sword_0_cost_time').innerText );
  var swordMax       = parseInt( doc.getElementById('sword_0_a').innerText.replace('(','').replace(')',''));

  var swordWoodCost  = parseInt( doc.getElementById('sword_0_cost_wood').innerText );
  var swordStoneCost = parseInt( doc.getElementById('sword_0_cost_stone').innerText );
  var swordIronCost  = parseInt( doc.getElementById('sword_0_cost_iron').innerText );
}

if ( imputAxe )
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
     ( typeof imputSword != "undefined" && doc.forms[0].spear_0.value !== "" )
  || ( typeof imputSword != "undefined" && doc.forms[0].sword_0.value !== "" )
  || ( typeof imputAxe   != "undefined" && doc.forms[0].axe_0.value   !== "" )
) 
{ 
  Dialog.show( 'Errore', 'Ripulisci tutti i campi di reclutamento!' + errorDivButtons ); 
  throw new Error("ERROR"); 
}
  
function train()
{
  var time      = doc.getElementById('time').value;
  var timeArray = time.split(':');

  if ( timeArray.length !== 3 || timeArray.some( (x) => x === "" ) )
  {
    Dialog.show( 'Errore', '<p>Formattazione errata!</p>' + errorDivButtons ); 
    throw new Error("ERROR"); 
  }

  var totalMax = 0;
  totalMax += typeof imputSpear != "undefined" && doc.getElementById( 'spear' ).checked === true ? spearTimeCost : 0;
  totalMax += typeof imputSword != "undefined" && doc.getElementById( 'sword' ).checked === true ? swordTimeCost : 0;
  totalMax += typeof imputAxe   != "undefined" && doc.getElementById( 'axe' ).checked   === true ? axeTimeCost   : 0;

  if ( totalMax === 0 ) { Dialog.show( 'Errore', 'Seleziona almeno una tipologia di truppa!' + errorDivButtons ); throw new Error("ERROR"); }

  var sec   = time2sec( time );
  var train = Math.floor( sec/totalMax );
  train     = Math.min( maxArmy, train );

  var spear = typeof imputSpear != "undefined" && doc.getElementById('spear').checked === true ? train > spearMax ? spearMax : train : "";
  var sword = typeof imputSword != "undefined" && doc.getElementById('sword').checked === true ? train > swordMax ? swordMax : train : "";
  var axe   = typeof imputAxe   != "undefined" && doc.getElementById('axe').checked   === true ? train > axeMax   ? axeMax   : train : "";

  if ( typeof imputSpear != "undefined" ) imputSpear.value = spear;
  if ( typeof imputSword != "undefined" ) imputSword.value = sword;
  if ( typeof imputAxe   != "undefined" ) imputAxe.value   = axe;
  Dialog.close( 'content' ) 
}
  
(function()
{
  console.log('Script made by IceWizard');
  console.log('Version 1.0.1');
  console.log('Last update: 2020-05-01');
  Dialog.show('content', "<table> <tr> <td> <span>Tempo: </span> <input type='text' id='time' value='hh:mm:ss'/> </td><td> <img src='https://dsit.innogamescdn.com/asset/88a8f29e/graphic/unit/unit_spear.png' class='' data-title='Lanciere'></img> <input type='checkbox' id='spear' checked/> </td><td> <img src='https://dsit.innogamescdn.com/asset/88a8f29e/graphic/unit/unit_sword.png' class='' data-title='Lanciere'></img> <input type='checkbox' id='sword' checked/> </td><td> <img src='https://dsit.innogamescdn.com/asset/88a8f29e/graphic/unit/unit_axe.png' class='' data-title='Lanciere'></img> <input type='checkbox' id='axe' checked/> </td><td> <button class='btn evt-confirm-btn btn-confirm-ok' onclick='train()'>Recluta</button> </td></tr></table>");
}());
