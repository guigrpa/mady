
function anonymous() {
var es = function(n, ord) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
};
var number = function (value, name, offset) {
  if (!offset) return value;
  if (isNaN(value)) throw new Error('Can\'t apply offset:' + offset + ' to argument `' + name +
                                    '` with non-numerical value ' + JSON.stringify(value) + '.');
  return value - offset;
};
var plural = function(value, offset, lcfunc, data, isOrdinal) {
  if ({}.hasOwnProperty.call(data, value)) return data[value];
  if (offset) value -= offset;
  var key = lcfunc(value, isOrdinal);
  if (key in data) return data[key];
  return data.other;
};
var fmt = {
  number: function (v,lc,p
  ) {
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
  "bXNnRGV0YWlsc1ZpZXdfRGV0YWlscw==": function(d) { return "Detalles"; },
  "ZXJyb3JfQ2hhbmdlcyBjb3VsZCBub3QgYmUgc2F2ZWQ=": function(d) { return "No se pudieron guardar los cambios"; },
  "ZXJyb3JfQ29uZmlndXJhdGlvbiBjb3VsZCBub3QgYmUgc2F2ZWQ=": function(d) { return "No se pudo guardar la configuración"; },
  "ZXJyb3JfSXMgdGhlIHNlcnZlciBydW5uaW5nPw==": function(d) { return "¿El servidor está funcionando?"; },
  "c2V0dGluZ3NGb3JtX01lc3NhZ2UgdHJhbnNsYXRpb24gZnVuY3Rpb25zIHRvIGxvb2sgZm9yOg==": function(d) { return "Funciones de traducción de mensajes a buscar:"; },
  c29tZUNvbnRleHRfTWVzc2FnZSB3aXRoIGVtb2ppOiDwn46J: function(d) { return "Mensaje con emoji: 🎉"; },
  "c29tZUNvbnRleHRfQSB0b29sIGZvciBpbnRlcm5hdGlvbmFsaXphdGlvbg==": function(d) { return "Una herramienta para la internacionalización"; },
  "c2V0dGluZ3NGb3JtX0FEVkFOQ0VEOiBBZGRpdGlvbmFsIHJlZ3VsYXIgZXhwcmVzc2lvbnMgZm9yIG1lc3NhZ2UgcGFyc2luZzo=": function(d) { return "AVANZADO: Expresiones regulares adicionales para la extracción de mensajes:"; },
  c2V0dGluZ3NGb3JtX0dlbmVyaWMgSlNPTiBmaWxl: function(d) { return "Fichero JSON genérico"; },
  "c2V0dGluZ3NGb3JtX0phdmFTY3JpcHQgbW9kdWxlIChyZXF1aXJlZCBpZiB5b3UgdXNlIE1hZHkncyB0cmFuc2xhdGlvbiBmdW5jdGlvbik=": function(d) { return "Módulo JavaScript (necesario si usas la función de traducción de Mady)"; },
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
  ZXJyb3JfT29wcywgYW4gZXJyb3Igb2NjdXJyZWQh: function(d) { return "¡Uy, ha ocurrido un error!"; },
  dG9vbHRpcF9BdXRvdHJhbnNsYXRl: function(d) { return "Traducir automáticamente"; },
  "dG9vbHRpcF9TY29wZQ==": function(d) { return "Ámbito"; },
  "bXNnRGV0YWlsc1ZpZXdfU2NvcGU=": function(d) { return "Ámbito"; },
  ZmlsdGVyX1Vuc2NvcGVk: function(d) { return "Sin ámbito"; },
  "c29tZUNvbnRleHRfTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdC4gUHJvaW4gc2l0IGFtZXQgcmlzdXMgZmVsaXMuIERvbmVjIHNlZCB2aXZlcnJhIHVybmEuIFByYWVzZW50IHBvcnR0aXRvciBsb3JlbSBpZCB1cm5hIGJsYW5kaXQsIG5lYyBzY2VsZXJpc3F1ZSByaXN1cyB2YXJpdXMuIE51bGxhbSBldWlzbW9kIHN1c2NpcGl0IHNjZWxlcmlzcXVlLiBNYXVyaXMgcGxhY2VyYXQgc2NlbGVyaXNxdWUgbmlzaSwgdmVsIHJ1dHJ1bSBwdXJ1cyBkYXBpYnVzIGV0LiBRdWlzcXVlIG1hdHRpcyBwdWx2aW5hciBlcm9zIGluIG1vbGVzdGllLiBTdXNwZW5kaXNzZSBlbGVpZmVuZCBwcmV0aXVtIG5pc2kgdmVsIHNhZ2l0dGlzLiBJbiBtb2xsaXMgZGlhbSBzZW0sIGVnZXQgcG9ydGEgbWFnbmEgYXVjdG9yIG5lYy4gTWFlY2VuYXMgcnV0cnVtIGV1IG1hZ25hIHNpdCBhbWV0IGZldWdpYXQuIE51bmMgbmVjIHZpdmVycmEgZHVpLiBTdXNwZW5kaXNzZSBpZCBsYWN1cyBzdXNjaXBpdCwgdm9sdXRwYXQgc2FwaWVuIGhlbmRyZXJpdCwgaW50ZXJkdW0gcmlzdXMuIE1hdXJpcyBldSBtb2xsaXMgbGFjdXMsIGFjIHBvc3VlcmUgdG9ydG9yLiBJbnRlZ2VyIHF1aXMgcHJldGl1bSBtZXR1cy4gVXQgY29uZGltZW50dW0gYXVjdG9yIGVsaXQsIGV1IGFsaXF1ZXQgdXJuYS4gQ3VyYWJpdHVyIHNpdCBhbWV0IHZ1bHB1dGF0ZSBsb3JlbSwgYSBsb2JvcnRpcyByaXN1cy4KCkFsaXF1YW0gZmluaWJ1cyBsYWNpbmlhIGlhY3VsaXMuIE51bGxhIG1hdHRpcyBsb3JlbSBuZWMgZWZmaWNpdHVyIHZhcml1cy4gTWF1cmlzIHRlbXB1cyB2ZWxpdCBpZCBhdWN0b3IgaW50ZXJkdW0uIFNlZCBmYWNpbGlzaXMsIG51bmMgaWQgdGluY2lkdW50IHNvbGxpY2l0dWRpbiwgZW5pbSBhdWd1ZSBwdWx2aW5hciBsaWd1bGEsIHZlbCBjb25zZWN0ZXR1ciBsb3JlbSB1cm5hIG5vbiB2ZWxpdC4gVmVzdGlidWx1bSBhbnRlIGlwc3VtIHByaW1pcyBpbiBmYXVjaWJ1cyBvcmNpIGx1Y3R1cyBldCB1bHRyaWNlcyBwb3N1ZXJlIGN1YmlsaWEgQ3VyYWU7IE1vcmJpIGVnZXQgYXVjdG9yIGVuaW0sIHNpdCBhbWV0IGV1aXNtb2QgdGVsbHVzLiBJbnRlZ2VyIHZpdGFlIG9kaW8gaW4gbGlndWxhIHByZXRpdW0gaW50ZXJkdW0gYWMgbmVjIGVuaW0uIFZlc3RpYnVsdW0gdGVsbHVzIG9yY2ksIGhlbmRyZXJpdCBldSB0b3J0b3IgcXVpcywgcHJldGl1bSBwaGFyZXRyYSBtYXNzYS4gSW4gcXVpcyBxdWFtIHZlbmVuYXRpcywgYXVjdG9yIGVyb3MgbmVjLCBjb252YWxsaXMgZmVsaXMuIERvbmVjIG1hdHRpcyBvcmNpIGFsaXF1YW0gZWxpdCBwbGFjZXJhdCwgYWMgZmluaWJ1cyB0dXJwaXMgaW50ZXJkdW0uIFByb2luIGxvcmVtIHF1YW0sIGRpZ25pc3NpbSB2ZWwgcXVhbSBhYywgbW9sbGlzIGltcGVyZGlldCBpcHN1bS4gRXRpYW0gaWFjdWxpcyBlbGVtZW50dW0gbGVvLiBOdWxsYSBldSBsZWN0dXMgbmVjIG1ldHVzIGdyYXZpZGEgY29uZ3VlLiBQZWxsZW50ZXNxdWUgdGVtcHVzIG1hdXJpcyB2ZWwgbWF1cmlzIGxhY2luaWEsIGlhY3VsaXMgdm9sdXRwYXQgZXJvcyBzb2RhbGVzLiBDcmFzIGV1IGxlbyBsaWd1bGEuIFByb2luIHRvcnRvciBleCwgdml2ZXJyYSBlZmZpY2l0dXIgcmlzdXMgbmVjLCBhY2N1bXNhbiBzb2xsaWNpdHVkaW4gZXN0Lg==": function(d) { return "Lorem ipsum dolor sit amet, elit consectetur adipiscing. Por lo tanto, una gran cantidad de gatos risa. Pero hasta que tire olla. Presente porttitor lorem blandit Identificación urna, el chocolate, ni las risas de las varillas. Rendimiento recibe relé térmico. Pero el más grande de chocolate de bienes raíces o proteína de chile y el maquillaje. Cada lote de voleibol de maní en la televisión. deducible de estrés si el precio o los disparos. El diámetro resistentes sem, la puerta de un gran autor ni la necesidad. fútbol maquillaje Mecenas con una gran cantidad de la UE. Ahora no tire de la pena. lacus Suspendisse suscipit, hendrerit volutpat sapiens, congue Aenean. Mauris eu mollis lacus, ac lectus eget lectus. temor por los precios enteros. Para la competición autor salsa, los plátanos de fútbol olla. Estoy muy feliz vulputate LOREM una risa cartón.\n\nLos últimos extremos de la falda dirigidos. Nulla Mattis lorem ncp trajo alrededor de las varillas. Mauris a veces el autor de las veces, que él desea. Pero antioxidantes, ahora que sollicitudin tincidunt, enim porttitor ut ligula pulvinar, urna consectetur lorem o no quieren. Antes de la primera de baloncesto fijó sus mandíbulas dolor y la atención clínica; Morbi eget auctor enim, sit amet elit euismod. Porque no hay odio en Canberra, y los rectos de la vida y, a veces el precio. Kibbeh Estados Unidos, los intereses estratégicos de cualquier temperatura, precio aljaba de masas. En quis rutrum quam, nec erat auctor eros, convallis felis. Por desgracia, algunos inversores invierten una gran cantidad de frustración, y hasta los confines de la base a veces. Proin quam lorem, dignissim vel quam ac, peinado suave muy importante. También apuntado elemento de león. Ningún ordenador o en casa embarazada miedo. falda Sed mauris Mauris, dirigida miembros de fin de semana de maní. redes de león de fútbol mañana. Proin sentarse, se convierte en la risa de la nec tirón, accumsan sollicitudin est."; },
  "ZmlsdGVyX1F1aWNrIGZpbmQ=": function(d) { return "Búsqueda rápida"; }
}
}
module.exports = anonymous();
