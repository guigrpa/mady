
function anonymous() {
var ca = function (n, ord) {
  var s = String(n).split('.'), v0 = !s[1];
  if (ord) return ((n == 1
          || n == 3)) ? 'one'
      : (n == 2) ? 'two'
      : (n == 4) ? 'few'
      : 'other';
  return (n == 1 && v0) ? 'one' : 'other';
};
var number = function (value, name, offset) {
  if (!offset) return value;
  if (isNaN(value)) throw new Error('Can\'t apply offset:' + offset + ' to argument `' + name +
                                    '` with non-numerical value ' + JSON.stringify(value) + '.');
  return value - offset;
};
var plural = function (value, offset, lcfunc, data, isOrdinal) {
  if ({}.hasOwnProperty.call(data, value)) return data[value];
  if (offset) value -= offset;
  var key = lcfunc(value, isOrdinal);
  if (key in data) return data[key];
  return data.other;
};
var fmt = {
  number: function (v,lc,p
  /*``*/) {
  return new Intl.NumberFormat(lc,
      p=='integer' ? {maximumFractionDigits:0}
    : p=='percent' ? {style:'percent'}
    : p=='currency' ? {style:'currency', currency:'USD', minimumFractionDigits:2, maximumFractionDigits:2}
    : {}).format(v)
  }
};

return {
  "someContext_{NUM, plural, one{1 hamburger} other{# hamburgers}}": function(d) { return plural(d.NUM, 0, ca, { one: "1 hamburguesa", other: number(d.NUM, "NUM") + " hamburgueses" }); },
  "someContext_Hello, {NAME}!": function(d) { return "Hello, " + d.NAME + "!"; },
  "someContext_Hello {NAME}, you have {UNREAD_COUNT, number} {UNREAD_COUNT, plural, one {message} other {messages}}": function(d) { return "Hello " + d.NAME + ", you have " + fmt.number(d.UNREAD_COUNT, "ca") + " " + plural(d.UNREAD_COUNT, 0, ca, { one: "message", other: "messages" }); },
  "someContext_<i>Hi</i> <b>{NAME}</b>!": function(d) { return "<i>Hi</i> <b>" + d.NAME + "</b>!"; },
  tooltip_Settings: function(d) { return "Ajustos"; },
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
  "settingsForm_Source extensions:": function(d) { return "Extensions de fitxer a buscar:"; },
  "settingsForm_Source paths:": function(d) { return "Carpetes a buscar:"; },
  "tooltip_Total messages": function(d) { return "Total missatges"; },
  "tooltip_Used messages": function(d) { return "Missatges en ús"; },
  tooltip_Translations: function(d) { return "Traduccions"; },
  "tooltip_Delete translation": function(d) { return "Esborrar traducció"; },
  "translationHelp_Click outside or TAB to save. ESC to undo.": function(d) { return "Fes clic a fora o prem TAB per guardar. Prem ESC per desfer."; },
  "hint_Add language column": function(d) { return "Afegir columna d'idioma"; },
  "hint_Configure Mady": function(d) { return "Configurar Mady"; },
  "hint_Enjoy translating!": function(d) { return "Gaudeix traduint!"; },
  "tooltip_Copy message": function(d) { return "Copiar missatge"; },
  "validation_the number of left and right brackets does not match": function(d) { return "el nombre de claus obertes i tancades no coincideix"; },
  "validation_MessageFormat syntax error": function(d) { return "Error de sintaxi MessageFormat"; },
  "error_Changes could not be saved": function(d) { return "No s'han pogut guardar els canvis"; },
  "error_Configuration could not be saved": function(d) { return "No s'ha pogut guardar la configuració"; },
  "error_Is the server running?": function(d) { return "El servidor està funcionant?"; },
  "settingsForm_Message translation functions to look for:": function(d) { return "Funcions de traducció de missatges a buscar:"; },
  "someContext_Message with emoji: 🎉": function(d) { return "Missatge amb emoji: 🎉"; },
  "someContext_A tool for internationalization": function(d) { return "Una eina per la internacionalització"; },
  "settingsForm_ADVANCED: Additional regular expressions for message parsing:": function(d) { return "AVANÇAT: Expressions regulars addicionals per a l'extracció de missatges:"; },
  "settingsForm_Generic JSON file": function(d) { return "Fitxer JSON genèric"; },
  "settingsForm_JavaScript module (required if you use Mady's translation function)": function(d) { return "Mòdul JavaScript (necessari si fas servir la funció de traducció de Mady)"; },
  settingsForm_Minified: function(d) { return "Minificat"; },
  "settingsForm_React Intl JSON file": function(d) { return "Fitxer JSON per a React Intl"; },
  "settingsForm_Output:": function(d) { return "Fitxers de sortida:"; },
  "settingsForm_Make sure your regular expression has exactly one capture group, for example: (.*?)": function(d) { return "Assegura't que l'expressió regular té exactament un grup de captura, per exemple: (.*?)"; },
  "tooltip_Dubious translation (click to toggle)": function(d) { return "Traducció dubtosa (fes clic per canviar)"; },
  "filter_All (no filter)": function(d) { return "Tots (sense filtre)"; },
  "filter_All (remove filter)": function(d) { return "Tots (treure filtre)"; },
  "filter_Dubious translations": function(d) { return "Traduccions dubtoses"; },
  filter_Dubious: function(d) { return "Dubtes"; },
  "filter_Missing translations": function(d) { return "Traduccions pendents"; },
  filter_Missing: function(d) { return "Pendents"; },
  "filter_Unused messages": function(d) { return "Missatges no utilitzats"; },
  filter_Unused: function(d) { return "No utilitzats"; },
  "hint_Filter relevant messages": function(d) { return "Filtrar missatges rellevants"; },
  tooltip_Filter: function(d) { return "Filtre"; },
  "error_Oops, an error occurred!": function(d) { return "Ui, hi ha hagut un error!"; }
}
}
module.exports = anonymous();
