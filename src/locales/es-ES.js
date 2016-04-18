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
  "es-ES": function (n, ord) {
    if (ord) return 'other';
    return (n == 1) ? 'one' : 'other';
  }
};
var fmt = {};

return {
  "tooltip_Convert translations to JavaScript files": function(d) { return "Convertir traducciones a ficheros JavaScript"; },
  tooltip_Settings: function(d) { return "Ajustes"; },
  "button_Copy key": function(d) { return ""; },
  "button_Copy message": function(d) { return "Copiar mensaje"; },
  button_Delete: function(d) { return "Borrar"; },
  button_Revert: function(d) { return "Cancelar cambios"; },
  button_Save: function(d) { return "Guardar"; },
  "tooltip_Add column": function(d) { return "Añadir columna"; },
  "tooltip_Change language": function(d) { return "Cambiar idioma"; },
  "tooltip_Delete message (does NOT delete any translations)": function(d) { return "Borrar mensaje (NO borra ninguna traducción)"; },
  "tooltip_Parse source files to update the message list": function(d) { return "Analizar los ficheros de código para actualizar la lista de mensajes"; },
  "tooltip_Remove column (does NOT delete any translations)": function(d) { return "Quitar columna (NO borra ninguna traducción)"; },
  columnTitle_Messages: function(d) { return "Mensajes"; },
  msgDetailsView_Details: function(d) { return "Detalles"; },
  "msgDetailsView_No message selected": function(d) { return "Ningún mensaje seleccionado"; },
  "msgDetailsView_Used since": function(d) { return "En uso desde"; },
  msgDetailsView_until: function(d) { return "hasta"; },
  button_Cancel: function(d) { return "Cancelar"; },
  "settingsForm_Languages (BCP47 codes):": function(d) { return "Idiomas (códigos BCP47):"; },
  "settingsForm_Mady language:": function(d) { return "Idioma de Mady:"; },
  "settingsForm_Minify output JavaScript": function(d) { return "Minificar el JavaScript de salida"; },
  "settingsForm_Source extensions:": function(d) { return "Extensiones de fichero a buscar:"; },
  "settingsForm_Source paths:": function(d) { return "Carpetas a buscar:"; }
}
};
module.exports = anonymous();
