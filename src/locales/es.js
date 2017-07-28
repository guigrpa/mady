/* eslint-disable */
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
  c29tZUNvbnRleHRfe05VTSwgcGx1cmFsLCBvbmV7MSBoYW1idXJnZXJ9IG90aGVyeyMgaGFtYnVyZ2Vyc319: function(d) { return plural(d.NUM, 0, es, { one: "1 hamburguesa", other: number(d.NUM, "NUM") + " hamburguesas" }); },
  "c29tZUNvbnRleHRfSGVsbG8sIHtOQU1FfSE=": function(d) { return "Hola, " + d.NAME + "!"; },
  "c29tZUNvbnRleHRfSGVsbG8ge05BTUV9LCB5b3UgaGF2ZSB7VU5SRUFEX0NPVU5ULCBudW1iZXJ9IHtVTlJFQURfQ09VTlQsIHBsdXJhbCwgb25lIHttZXNzYWdlfSBvdGhlciB7bWVzc2FnZXN9fQ==": function(d) { return "Hola " + d.NAME + ", tienes " + fmt.number(d.UNREAD_COUNT, "es") + " " + plural(d.UNREAD_COUNT, 0, es, { one: "mensaje", other: "mensajes" }); },
  "c29tZUNvbnRleHRfPGk+SGk8L2k+IDxiPntOQU1FfTwvYj4h": function(d) { return "<i>Hola</i> <b>" + d.NAME + "</b>!"; },
  dG9vbHRpcF9Db252ZXJ0IHRyYW5zbGF0aW9ucyB0byBKYXZhU2NyaXB0IGZpbGVz: function(d) { return "Convertir traducciones a ficheros JavaScript"; },
  YnV0dG9uX0NvcHkga2V5: function(d) { return ""; },
  "YnV0dG9uX0RlbGV0ZQ==": function(d) { return "Borrar"; },
  "YnV0dG9uX1JldmVydA==": function(d) { return "Cancelar cambios"; },
  dG9vbHRpcF9BZGQgY29sdW1u: function(d) { return "Añadir columna"; },
  "dG9vbHRpcF9DaGFuZ2UgbGFuZ3VhZ2U=": function(d) { return "Cambiar idioma"; },
  dG9vbHRpcF9EZWxldGUgbWVzc2FnZSAoZG9lcyBOT1QgZGVsZXRlIGFueSB0cmFuc2xhdGlvbnMp: function(d) { return "Borrar mensaje (NO borra ninguna traducción)"; },
  "dG9vbHRpcF9QYXJzZSBzb3VyY2UgZmlsZXMgdG8gdXBkYXRlIHRoZSBtZXNzYWdlIGxpc3Q=": function(d) { return "Analizar los ficheros de código para actualizar la lista de mensajes"; },
  "dG9vbHRpcF9SZW1vdmUgY29sdW1uIChkb2VzIE5PVCBkZWxldGUgYW55IHRyYW5zbGF0aW9ucyk=": function(d) { return "Quitar columna (NO borra ninguna traducción)"; },
  "bXNnRGV0YWlsc1ZpZXdfTm8gbWVzc2FnZSBzZWxlY3RlZA==": function(d) { return "Ningún mensaje seleccionado"; },
  "bXNnRGV0YWlsc1ZpZXdfVXNlZCBzaW5jZQ==": function(d) { return "En uso desde"; },
  "YnV0dG9uX0NhbmNlbA==": function(d) { return "Cancelar"; },
  "c2V0dGluZ3NGb3JtX0xhbmd1YWdlcyAoQkNQNDcgY29kZXMpOg==": function(d) { return "Idiomas (códigos BCP47):"; },
  c2V0dGluZ3NGb3JtX01hZHkgbGFuZ3VhZ2U6: function(d) { return "Idioma de Mady:"; },
  "c2V0dGluZ3NGb3JtX01pbmlmeSBvdXRwdXQgSmF2YVNjcmlwdA==": function(d) { return "Minificar el JavaScript de salida"; },
  "c2V0dGluZ3NGb3JtX1NvdXJjZSBleHRlbnNpb25zOg==": function(d) { return "Extensiones de fichero a buscar:"; },
  "c2V0dGluZ3NGb3JtX1NvdXJjZSBwYXRoczo=": function(d) { return "Carpetas a buscar:"; },
  "dG9vbHRpcF9Ub3RhbCBtZXNzYWdlcw==": function(d) { return "Total mensajes"; },
  dG9vbHRpcF9Vc2VkIG1lc3NhZ2Vz: function(d) { return "Mensajes en uso"; },
  "dG9vbHRpcF9UcmFuc2xhdGlvbnM=": function(d) { return "Traducciones"; },
  "dG9vbHRpcF9Db3B5IG1lc3NhZ2U=": function(d) { return "Copiar mensaje"; },
  "dG9vbHRpcF9EZWxldGUgdHJhbnNsYXRpb24=": function(d) { return "Borrar traducción"; },
  "dHJhbnNsYXRpb25IZWxwX0NsaWNrIG91dHNpZGUgb3IgVEFCIHRvIHNhdmUuIEVTQyB0byB1bmRvLg==": function(d) { return "Haz clic fuera o pulsa TAB para guardar. Pulsa ESC para deshacer."; },
  "Y29sdW1uVGl0bGVfTWVzc2FnZXM=": function(d) { return "Mensajes"; },
  "YnV0dG9uX1NhdmU=": function(d) { return "Guardar"; },
  "bXNnRGV0YWlsc1ZpZXdfdW50aWw=": function(d) { return "hasta"; },
  aGludF9BZGQgbGFuZ3VhZ2UgY29sdW1u: function(d) { return "Añadir columna de idioma"; },
  "aGludF9Db25maWd1cmUgTWFkeQ==": function(d) { return "Configurar Mady"; },
  "aGludF9FbmpveSB0cmFuc2xhdGluZyE=": function(d) { return "¡Disfruta traduciendo!"; },
  "dG9vbHRpcF9TZXR0aW5ncw==": function(d) { return "Ajustes"; },
  dmFsaWRhdGlvbl90aGUgbnVtYmVyIG9mIGxlZnQgYW5kIHJpZ2h0IGJyYWNrZXRzIGRvZXMgbm90IG1hdGNo: function(d) { return "el número de llaves abiertas y cerradas no coincide"; },
  "dmFsaWRhdGlvbl9NZXNzYWdlRm9ybWF0IHN5bnRheCBlcnJvcg==": function(d) { return "Error de sintaxis MessageFormat"; },
  aGludF9Hb3QgaXQh: function(d) { return "¡Entendido!"; },
  "bXNnRGV0YWlsc1ZpZXdfRGV0YWlscw==": function(d) { return "Detalles"; },
  "ZXJyb3JfQ2hhbmdlcyBjb3VsZCBub3QgYmUgc2F2ZWQ=": function(d) { return "No se pudieron guardar los cambios"; },
  "ZXJyb3JfQ29uZmlndXJhdGlvbiBjb3VsZCBub3QgYmUgc2F2ZWQ=": function(d) { return "No se pudo guardar la configuración"; },
  "ZXJyb3JfSXMgdGhlIHNlcnZlciBydW5uaW5nPw==": function(d) { return "¿El servidor está funcionando?"; },
  "c2V0dGluZ3NGb3JtX01lc3NhZ2UgdHJhbnNsYXRpb24gZnVuY3Rpb25zIHRvIGxvb2sgZm9yOg==": function(d) { return "Funciones de traducción de mensajes a buscar:"; },
  c29tZUNvbnRleHRfTWVzc2FnZSB3aXRoIGVtb2ppOiDwn46J: function(d) { return "Mensaje con emoji: 🎉"; },
  "c29tZUNvbnRleHRfQSB0b29sIGZvciBpbnRlcm5hdGlvbmFsaXphdGlvbg==": function(d) { return "Una herramienta para la internacionalización"; },
  "c29tZUNvbnRleHRfPGk+SGk8L2k+IDxiPntuYW1lfTwvYj4h": function(d) { return "<i>Hola</i> <b>" + d.name + "</b>!"; },
  "c2V0dGluZ3NGb3JtX0FEVkFOQ0VEOiBBZGRpdGlvbmFsIHJlZ3VsYXIgZXhwcmVzc2lvbnMgZm9yIG1lc3NhZ2UgcGFyc2luZzo=": function(d) { return "AVANZADO: Expresiones regulares adicionales para la extracción de mensajes:"; },
  "c2V0dGluZ3NGb3JtX01ha2Ugc3VyZSB5b3VyIHJlZ3VsYXIgZXhwcmVzc2lvbiBoYXMgZXhhY3RseSBvbmUgY2FwdHVyZSBncm91cDogKC4qPyk=": function(d) { return "Asegúrate de que la expresión regular tiene exactamente un grupo de captura: (.*?)"; },
  c2V0dGluZ3NGb3JtX0dlbmVyaWMgSlNPTiBmaWxl: function(d) { return "Fichero JSON genérico"; },
  c2V0dGluZ3NGb3JtX0phdmFTY3JpcHQgbW9kdWxl: function(d) { return "Módulo JavaScript"; },
  "c2V0dGluZ3NGb3JtX0phdmFTY3JpcHQgbW9kdWxlIChyZXF1aXJlZCBpZiB5b3UgdXNlIE1hZHkncyB0cmFuc2xhdGlvbiBmdW5jdGlvbik=": function(d) { return "Módulo JavaScript (necesario si usas la función de traducción de Mady)"; },
  c2V0dGluZ3NGb3JtX01ha2Ugc3VyZSB5b3VyIHJlZ3VsYXIgZXhwcmVzc2lvbiBoYXMgZXhhY3RseSBvbmUgY2FwdHVyZSBncm91cCwgcG9yIGVqZW1wbG86ICguKj8p: function(d) { return "Asegúrate de que la expresión regular tiene exactamente un grupo de captura, por ejemplo: (.*?)"; },
  c2V0dGluZ3NGb3JtX01pbmlmaWVk: function(d) { return "Minificado"; },
  c2V0dGluZ3NGb3JtX1JlYWN0IEludGwgSlNPTiBmaWxl: function(d) { return "Fichero JSON para React Intl"; },
  "c2V0dGluZ3NGb3JtX091dHB1dDo=": function(d) { return "Ficheros de salida:"; },
  c2V0dGluZ3NGb3JtX01ha2Ugc3VyZSB5b3VyIHJlZ3VsYXIgZXhwcmVzc2lvbiBoYXMgZXhhY3RseSBvbmUgY2FwdHVyZSBncm91cCwgZm9yIGV4YW1wbGU6ICguKj8p: function(d) { return "Asegúrate de que la expresión regular tiene exactamente un grupo de captura, por ejemplo: (.*?)"; },
  dG9vbHRpcF9EdWJpb3VzIHRyYW5zbGF0aW9uIChjbGljayB0byB0b2dnbGUp: function(d) { return "Traducción dudosa (haz clic para cambiar)"; },
  "ZmlsdGVyX0FsbCAobm8gZmlsdGVyKQ==": function(d) { return "Todos (sin filtro)"; },
  "ZmlsdGVyX0FsbCAocmVtb3ZlIGZpbHRlcik=": function(d) { return "Todos (quitar filtro)"; },
  ZmlsdGVyX0R1YmlvdXMgdHJhbnNsYXRpb25z: function(d) { return "Traducciones dudosas"; },
  "ZmlsdGVyX0R1YmlvdXM=": function(d) { return "Dudas"; },
  ZmlsdGVyX01pc3NpbmcgdHJhbnNsYXRpb25z: function(d) { return "Traducciones pendientes"; },
  "ZmlsdGVyX01pc3Npbmc=": function(d) { return "Pendientes"; },
  "ZmlsdGVyX1VudXNlZCBtZXNzYWdlcw==": function(d) { return "Mensajes no usados"; },
  "ZmlsdGVyX1VudXNlZA==": function(d) { return "No usados"; },
  "aGludF9GaWx0ZXIgcmVsZXZhbnQgbWVzc2FnZXM=": function(d) { return "Filtrar mensajes relevantes"; },
  "dG9vbHRpcF9GaWx0ZXI=": function(d) { return "Filtro"; },
  ZXJyb3JfT29wcywgYW4gZXJyb3Igb2NjdXJyZWQh: function(d) { return "¡Uy, ha ocurrido un error!"; }
}
};
module.exports = anonymous();
/* eslint-enable */
