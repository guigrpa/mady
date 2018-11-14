
function anonymous() {
var es = function (n, ord) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
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
  "someContext_{NUM, plural, one{1 hamburger} other{# hamburgers}}": function(d) { return plural(d.NUM, 0, es, { one: "1 hamburguesa", other: number(d.NUM, "NUM") + " hamburguesas" }); },
  "someContext_Hello, {NAME}!": function(d) { return "Hola, " + d.NAME + "!"; },
  "someContext_Hello {NAME}, you have {UNREAD_COUNT, number} {UNREAD_COUNT, plural, one {message} other {messages}}": function(d) { return "Hola " + d.NAME + ", tienes " + fmt.number(d.UNREAD_COUNT, "es") + " " + plural(d.UNREAD_COUNT, 0, es, { one: "mensaje", other: "mensajes" }); },
  "someContext_<i>Hi</i> <b>{NAME}</b>!": function(d) { return "<i>Hola</i> <b>" + d.NAME + "</b>!"; },
  "tooltip_Add column": function(d) { return "Añadir columna"; },
  "tooltip_Change language": function(d) { return "Cambiar idioma"; },
  "tooltip_Delete message (does NOT delete any translations)": function(d) { return "Borrar mensaje (NO borra ninguna traducción)"; },
  "tooltip_Parse source files to update the message list": function(d) { return "Analizar los ficheros de código para actualizar la lista de mensajes"; },
  "tooltip_Remove column (does NOT delete any translations)": function(d) { return "Quitar columna (NO borra ninguna traducción)"; },
  "msgDetailsView_No message selected": function(d) { return "Ningún mensaje seleccionado"; },
  "msgDetailsView_Used since": function(d) { return "En uso desde"; },
  button_Cancel: function(d) { return "Cancelar"; },
  "settingsForm_Languages (BCP47 codes):": function(d) { return "Idiomas (códigos BCP47):"; },
  "settingsForm_Mady language:": function(d) { return "Idioma de Mady:"; },
  "settingsForm_Source extensions:": function(d) { return "Extensiones de fichero a buscar:"; },
  "settingsForm_Source paths:": function(d) { return "Carpetas a buscar:"; },
  "tooltip_Total messages": function(d) { return "Total mensajes"; },
  "tooltip_Used messages": function(d) { return "Mensajes en uso"; },
  tooltip_Translations: function(d) { return "Traducciones"; },
  "tooltip_Copy message": function(d) { return "Copiar mensaje"; },
  "tooltip_Delete translation": function(d) { return "Borrar traducción"; },
  "translationHelp_Click outside or TAB to save. ESC to undo.": function(d) { return "Haz clic fuera o pulsa TAB para guardar. Pulsa ESC para deshacer."; },
  columnTitle_Messages: function(d) { return "Mensajes"; },
  button_Save: function(d) { return "Guardar"; },
  msgDetailsView_until: function(d) { return "hasta"; },
  "hint_Add language column": function(d) { return "Añadir columna de idioma"; },
  "hint_Configure Mady": function(d) { return "Configurar Mady"; },
  "hint_Enjoy translating!": function(d) { return "¡Disfruta traduciendo!"; },
  tooltip_Settings: function(d) { return "Ajustes"; },
  "validation_the number of left and right brackets does not match": function(d) { return "el número de llaves abiertas y cerradas no coincide"; },
  "validation_MessageFormat syntax error": function(d) { return "Error de sintaxis MessageFormat"; },
  msgDetailsView_Details: function(d) { return "Detalles"; },
  "error_Changes could not be saved": function(d) { return "No se pudieron guardar los cambios"; },
  "error_Configuration could not be saved": function(d) { return "No se pudo guardar la configuración"; },
  "error_Is the server running?": function(d) { return "¿El servidor está funcionando?"; },
  "settingsForm_Message translation functions to look for:": function(d) { return "Funciones de traducción de mensajes a buscar:"; },
  "someContext_Message with emoji: 🎉": function(d) { return "Mensaje con emoji: 🎉"; },
  "someContext_A tool for internationalization": function(d) { return "Una herramienta para la internacionalización"; },
  "settingsForm_ADVANCED: Additional regular expressions for message parsing:": function(d) { return "AVANZADO: Expresiones regulares adicionales para la extracción de mensajes:"; },
  "settingsForm_Generic JSON file": function(d) { return "Fichero JSON genérico"; },
  "settingsForm_JavaScript module (required if you use Mady's translation function)": function(d) { return "Módulo JavaScript (necesario si usas la función de traducción de Mady)"; },
  settingsForm_Minified: function(d) { return "Minificado"; },
  "settingsForm_React Intl JSON file": function(d) { return "Fichero JSON para React Intl"; },
  "settingsForm_Output:": function(d) { return "Ficheros de salida:"; },
  "settingsForm_Make sure your regular expression has exactly one capture group, for example: (.*?)": function(d) { return "Asegúrate de que la expresión regular tiene exactamente un grupo de captura, por ejemplo: (.*?)"; },
  "tooltip_Dubious translation (click to toggle)": function(d) { return "Traducción dudosa (haz clic para cambiar)"; },
  "filter_All (no filter)": function(d) { return "Todos (sin filtro)"; },
  "filter_All (remove filter)": function(d) { return "Todos (quitar filtro)"; },
  "filter_Dubious translations": function(d) { return "Traducciones dudosas"; },
  filter_Dubious: function(d) { return "Dudas"; },
  "filter_Missing translations": function(d) { return "Traducciones pendientes"; },
  filter_Missing: function(d) { return "Pendientes"; },
  "filter_Unused messages": function(d) { return "Mensajes no usados"; },
  filter_Unused: function(d) { return "No usados"; },
  "hint_Filter relevant messages": function(d) { return "Filtrar mensajes relevantes"; },
  tooltip_Filter: function(d) { return "Filtro"; },
  "error_Oops, an error occurred!": function(d) { return "¡Uy, ha ocurrido un error!"; },
  tooltip_Autotranslate: function(d) { return "Traducir automáticamente"; }
}
}
module.exports = anonymous();
