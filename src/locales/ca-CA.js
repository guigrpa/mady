/* eslint-disable */
function anonymous() {
var number = function (value, offset) {
  if (isNaN(value)) throw new Error("'" + value + "' isn't a number.");
  return value - (offset || 0);
};
var plural = function (value, offset, lcfunc, data, isOrdinal) {
  if ({}.hasOwnProperty.call(data, value)) return data[value]();
  if (offset) value -= offset;
  var key = lcfunc(value, isOrdinal);
  if (key in data) return data[key]();
  return data.other();
};
var select = function (value, data) {
  if ({}.hasOwnProperty.call(data, value)) return data[value]();
  return data.other()
};
var pluralFuncs = {
  "ca-CA": function (n, ord) {
    var s = String(n).split('.'), v0 = !s[1];
    if (ord) return ((n == 1
            || n == 3)) ? 'one'
        : (n == 2) ? 'two'
        : (n == 4) ? 'few'
        : 'other';
    return (n == 1 && v0) ? 'one' : 'other';
  }
};
var fmt = {};

return {
  "someContext_{NUM, plural, one{1 hamburger} other{# hamburgers}}": function(d) { return plural(d.NUM, 0, pluralFuncs["ca-CA"], { one: function() { return "1 hamburguesa";}, other: function() { return number(d.NUM) + " hamburgueses";} }); },
  "tooltip_Convert translations to JavaScript files": function(d) { return "Convertir traduccions a fitxers javaScript"; },
  tooltip_Settings: function(d) { return "Ajustos"; },
  button_Delete: function(d) { return "Esborrar"; },
  button_Revert: function(d) { return "Cancel·lar canvis"; },
  button_Save: function(d) { return "Guardar"; },
  "tooltip_Add column": function(d) { return "Afegir columna"; },
  "tooltip_Change language": function(d) { return "Canviar idioma"; },
  "tooltip_Delete message (does NOT delete any translations)": function(d) { return "Esborrar missatge (NO esborra cap traducció)"; },
  "tooltip_Parse source files to update the message list": function(d) { return "Analitzar els fitxers de codi per actualitzar la llista de missatges"; },
  "tooltip_Remove column (does NOT delete any translations)": function(d) { return "Treure columna (NO esborra cap traducció)"; },
  columnTitle_Messages: function(d) { return "Missatges"; },
  msgDetailsView_Details: function(d) { return "Detalls"; },
  "msgDetailsView_No message selected": function(d) { return "Cap missatge seleccionat"; },
  "msgDetailsView_Used since": function(d) { return "En ús des de"; },
  msgDetailsView_until: function(d) { return "fins a"; },
  button_Cancel: function(d) { return "Cancel·lar"; },
  "settingsForm_Languages (BCP47 codes):": function(d) { return "Idiomes (codis BCP47):"; },
  "settingsForm_Mady language:": function(d) { return "Idioma de Mady:"; },
  "settingsForm_Minify output JavaScript": function(d) { return "Minificar el JavaScript de sortida"; },
  "settingsForm_Source extensions:": function(d) { return "Extensions de fitxer a buscar:"; },
  "settingsForm_Source paths:": function(d) { return "Carpetes a buscar:"; },
  "tooltip_Total messages": function(d) { return "Total missatges"; },
  "tooltip_Used messages": function(d) { return "Missatges en ús"; },
  tooltip_Translations: function(d) { return "Traduccions"; },
  "tooltip_Delete translation": function(d) { return "Esborrar traducció"; },
  "translationHelp_Click outside or TAB to save. ESC to undo.": function(d) { return "Fes clic a fora o prem TAB per guardar. Prem ESC per desfer."; },
  "hint_Got it!": function(d) { return "Entesos!"; },
  "hint_Add language column": function(d) { return "Afegir columna d'idioma"; },
  "hint_Configure Mady": function(d) { return "Configurar Mady"; },
  "hint_Enjoy translating!": function(d) { return "Gaudeix traduint!"; },
  "tooltip_Copy message": function(d) { return "Copiar missatge"; },
  "validation_the number of left and right brackets does not match": function(d) { return "el nombre de claus obertes i tancades no coincideix"; },
  "validation_MessageFormat syntax error": function(d) { return "Error de sintaxi MessageFormat"; },
  "error_Changes could not be saved": function(d) { return "No s'han pogut guardar els canvis"; },
  "error_Configuration could not be saved": function(d) { return "No s'ha pogut guardar la configuració"; },
  "error_Is the server running?": function(d) { return "El servidor està funcionant?"; },
  "settingsForm_Message translation functions to look for:": function(d) { return "Funcions de traducció de missatges a buscar:"; }
}
};
module.exports = anonymous();
/* eslint-enable */
