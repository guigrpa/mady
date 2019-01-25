
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
  c29tZUNvbnRleHRfe05VTSwgcGx1cmFsLCBvbmV7MSBoYW1idXJnZXJ9IG90aGVyeyMgaGFtYnVyZ2Vyc319: function(d) { return plural(d.NUM, 0, ca, { one: "1 hamburguesa", other: number(d.NUM, "NUM") + " hamburgueses" }); },
  "c29tZUNvbnRleHRfSGVsbG8sIHtOQU1FfSE=": function(d) { return "Hello, " + d.NAME + "!"; },
  "c29tZUNvbnRleHRfSGVsbG8ge05BTUV9LCB5b3UgaGF2ZSB7VU5SRUFEX0NPVU5ULCBudW1iZXJ9IHtVTlJFQURfQ09VTlQsIHBsdXJhbCwgb25lIHttZXNzYWdlfSBvdGhlciB7bWVzc2FnZXN9fQ==": function(d) { return "Hello " + d.NAME + ", you have " + fmt.number(d.UNREAD_COUNT, "ca") + " " + plural(d.UNREAD_COUNT, 0, ca, { one: "message", other: "messages" }); },
  "c29tZUNvbnRleHRfPGk+SGk8L2k+IDxiPntOQU1FfTwvYj4h": function(d) { return "<i>Hi</i> <b>" + d.NAME + "</b>!"; },
  "dG9vbHRpcF9TZXR0aW5ncw==": function(d) { return "Ajustos"; },
  "YnV0dG9uX1NhdmU=": function(d) { return "Guardar"; },
  dG9vbHRpcF9BZGQgY29sdW1u: function(d) { return "Afegir columna"; },
  "dG9vbHRpcF9DaGFuZ2UgbGFuZ3VhZ2U=": function(d) { return "Canviar idioma"; },
  dG9vbHRpcF9EZWxldGUgbWVzc2FnZSAoZG9lcyBOT1QgZGVsZXRlIGFueSB0cmFuc2xhdGlvbnMp: function(d) { return "Esborrar missatge (NO esborra cap traducció)"; },
  "dG9vbHRpcF9QYXJzZSBzb3VyY2UgZmlsZXMgdG8gdXBkYXRlIHRoZSBtZXNzYWdlIGxpc3Q=": function(d) { return "Analitzar els fitxers de codi per actualitzar la llista de missatges"; },
  "dG9vbHRpcF9SZW1vdmUgY29sdW1uIChkb2VzIE5PVCBkZWxldGUgYW55IHRyYW5zbGF0aW9ucyk=": function(d) { return "Treure columna (NO esborra cap traducció)"; },
  "Y29sdW1uVGl0bGVfTWVzc2FnZXM=": function(d) { return "Missatges"; },
  "bXNnRGV0YWlsc1ZpZXdfRGV0YWlscw==": function(d) { return "Detalls"; },
  "bXNnRGV0YWlsc1ZpZXdfTm8gbWVzc2FnZSBzZWxlY3RlZA==": function(d) { return "Cap missatge seleccionat"; },
  "bXNnRGV0YWlsc1ZpZXdfVXNlZCBzaW5jZQ==": function(d) { return "En ús des de"; },
  "bXNnRGV0YWlsc1ZpZXdfdW50aWw=": function(d) { return "fins a"; },
  "YnV0dG9uX0NhbmNlbA==": function(d) { return "Cancel·lar"; },
  "c2V0dGluZ3NGb3JtX0xhbmd1YWdlcyAoQkNQNDcgY29kZXMpOg==": function(d) { return "Idiomes (codis BCP47):"; },
  c2V0dGluZ3NGb3JtX01hZHkgbGFuZ3VhZ2U6: function(d) { return "Idioma de Mady:"; },
  "c2V0dGluZ3NGb3JtX1NvdXJjZSBleHRlbnNpb25zOg==": function(d) { return "Extensions de fitxer a buscar:"; },
  "c2V0dGluZ3NGb3JtX1NvdXJjZSBwYXRoczo=": function(d) { return "Carpetes a buscar:"; },
  "dG9vbHRpcF9Ub3RhbCBtZXNzYWdlcw==": function(d) { return "Total missatges"; },
  dG9vbHRpcF9Vc2VkIG1lc3NhZ2Vz: function(d) { return "Missatges en ús"; },
  "dG9vbHRpcF9UcmFuc2xhdGlvbnM=": function(d) { return "Traduccions"; },
  "dG9vbHRpcF9EZWxldGUgdHJhbnNsYXRpb24=": function(d) { return "Esborrar traducció"; },
  "dHJhbnNsYXRpb25IZWxwX0NsaWNrIG91dHNpZGUgb3IgVEFCIHRvIHNhdmUuIEVTQyB0byB1bmRvLg==": function(d) { return "Fes clic a fora o prem TAB per guardar. Prem ESC per desfer."; },
  aGludF9BZGQgbGFuZ3VhZ2UgY29sdW1u: function(d) { return "Afegir columna d'idioma"; },
  "aGludF9Db25maWd1cmUgTWFkeQ==": function(d) { return "Configurar Mady"; },
  "aGludF9FbmpveSB0cmFuc2xhdGluZyE=": function(d) { return "Gaudeix traduint!"; },
  "dG9vbHRpcF9Db3B5IG1lc3NhZ2U=": function(d) { return "Copiar missatge"; },
  dmFsaWRhdGlvbl90aGUgbnVtYmVyIG9mIGxlZnQgYW5kIHJpZ2h0IGJyYWNrZXRzIGRvZXMgbm90IG1hdGNo: function(d) { return "el nombre de claus obertes i tancades no coincideix"; },
  "dmFsaWRhdGlvbl9NZXNzYWdlRm9ybWF0IHN5bnRheCBlcnJvcg==": function(d) { return "Error de sintaxi MessageFormat"; },
  "ZXJyb3JfQ2hhbmdlcyBjb3VsZCBub3QgYmUgc2F2ZWQ=": function(d) { return "No s'han pogut guardar els canvis"; },
  "ZXJyb3JfQ29uZmlndXJhdGlvbiBjb3VsZCBub3QgYmUgc2F2ZWQ=": function(d) { return "No s'ha pogut guardar la configuració"; },
  "ZXJyb3JfSXMgdGhlIHNlcnZlciBydW5uaW5nPw==": function(d) { return "El servidor està funcionant?"; },
  "c2V0dGluZ3NGb3JtX01lc3NhZ2UgdHJhbnNsYXRpb24gZnVuY3Rpb25zIHRvIGxvb2sgZm9yOg==": function(d) { return "Funcions de traducció de missatges a buscar:"; },
  c29tZUNvbnRleHRfTWVzc2FnZSB3aXRoIGVtb2ppOiDwn46J: function(d) { return "Missatge amb emoji: 🎉"; },
  "c29tZUNvbnRleHRfQSB0b29sIGZvciBpbnRlcm5hdGlvbmFsaXphdGlvbg==": function(d) { return "Una eina per la internacionalització"; },
  "c2V0dGluZ3NGb3JtX0FEVkFOQ0VEOiBBZGRpdGlvbmFsIHJlZ3VsYXIgZXhwcmVzc2lvbnMgZm9yIG1lc3NhZ2UgcGFyc2luZzo=": function(d) { return "AVANÇAT: Expressions regulars addicionals per a l'extracció de missatges:"; },
  c2V0dGluZ3NGb3JtX0dlbmVyaWMgSlNPTiBmaWxl: function(d) { return "Fitxer JSON genèric"; },
  "c2V0dGluZ3NGb3JtX0phdmFTY3JpcHQgbW9kdWxlIChyZXF1aXJlZCBpZiB5b3UgdXNlIE1hZHkncyB0cmFuc2xhdGlvbiBmdW5jdGlvbik=": function(d) { return "Mòdul JavaScript (necessari si fas servir la funció de traducció de Mady)"; },
  c2V0dGluZ3NGb3JtX01pbmlmaWVk: function(d) { return "Minificat"; },
  c2V0dGluZ3NGb3JtX1JlYWN0IEludGwgSlNPTiBmaWxl: function(d) { return "Fitxer JSON per a React Intl"; },
  "c2V0dGluZ3NGb3JtX091dHB1dDo=": function(d) { return "Fitxers de sortida:"; },
  c2V0dGluZ3NGb3JtX01ha2Ugc3VyZSB5b3VyIHJlZ3VsYXIgZXhwcmVzc2lvbiBoYXMgZXhhY3RseSBvbmUgY2FwdHVyZSBncm91cCwgZm9yIGV4YW1wbGU6ICguKj8p: function(d) { return "Assegura't que l'expressió regular té exactament un grup de captura, per exemple: (.*?)"; },
  dG9vbHRpcF9EdWJpb3VzIHRyYW5zbGF0aW9uIChjbGljayB0byB0b2dnbGUp: function(d) { return "Traducció dubtosa (fes clic per canviar)"; },
  "ZmlsdGVyX0FsbCAobm8gZmlsdGVyKQ==": function(d) { return "Tots (sense filtre)"; },
  "ZmlsdGVyX0FsbCAocmVtb3ZlIGZpbHRlcik=": function(d) { return "Tots (treure filtre)"; },
  ZmlsdGVyX0R1YmlvdXMgdHJhbnNsYXRpb25z: function(d) { return "Traduccions dubtoses"; },
  "ZmlsdGVyX0R1YmlvdXM=": function(d) { return "Dubtes"; },
  ZmlsdGVyX01pc3NpbmcgdHJhbnNsYXRpb25z: function(d) { return "Traduccions pendents"; },
  "ZmlsdGVyX01pc3Npbmc=": function(d) { return "Pendents"; },
  "ZmlsdGVyX1VudXNlZCBtZXNzYWdlcw==": function(d) { return "Missatges no utilitzats"; },
  "ZmlsdGVyX1VudXNlZA==": function(d) { return "No utilitzats"; },
  "aGludF9GaWx0ZXIgcmVsZXZhbnQgbWVzc2FnZXM=": function(d) { return "Filtrar missatges rellevants"; },
  "dG9vbHRpcF9GaWx0ZXI=": function(d) { return "Filtre"; },
  ZXJyb3JfT29wcywgYW4gZXJyb3Igb2NjdXJyZWQh: function(d) { return "Ui, hi ha hagut un error!"; },
  dG9vbHRpcF9BdXRvdHJhbnNsYXRl: function(d) { return "Traduir automàticament"; },
  "dG9vbHRpcF9TY29wZQ==": function(d) { return "Àmbit"; },
  "bXNnRGV0YWlsc1ZpZXdfU2NvcGU=": function(d) { return "Àmbit"; },
  ZmlsdGVyX1Vuc2NvcGVk: function(d) { return "Sense àmbit"; },
  "c29tZUNvbnRleHRfTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdC4gUHJvaW4gc2l0IGFtZXQgcmlzdXMgZmVsaXMuIERvbmVjIHNlZCB2aXZlcnJhIHVybmEuIFByYWVzZW50IHBvcnR0aXRvciBsb3JlbSBpZCB1cm5hIGJsYW5kaXQsIG5lYyBzY2VsZXJpc3F1ZSByaXN1cyB2YXJpdXMuIE51bGxhbSBldWlzbW9kIHN1c2NpcGl0IHNjZWxlcmlzcXVlLiBNYXVyaXMgcGxhY2VyYXQgc2NlbGVyaXNxdWUgbmlzaSwgdmVsIHJ1dHJ1bSBwdXJ1cyBkYXBpYnVzIGV0LiBRdWlzcXVlIG1hdHRpcyBwdWx2aW5hciBlcm9zIGluIG1vbGVzdGllLiBTdXNwZW5kaXNzZSBlbGVpZmVuZCBwcmV0aXVtIG5pc2kgdmVsIHNhZ2l0dGlzLiBJbiBtb2xsaXMgZGlhbSBzZW0sIGVnZXQgcG9ydGEgbWFnbmEgYXVjdG9yIG5lYy4gTWFlY2VuYXMgcnV0cnVtIGV1IG1hZ25hIHNpdCBhbWV0IGZldWdpYXQuIE51bmMgbmVjIHZpdmVycmEgZHVpLiBTdXNwZW5kaXNzZSBpZCBsYWN1cyBzdXNjaXBpdCwgdm9sdXRwYXQgc2FwaWVuIGhlbmRyZXJpdCwgaW50ZXJkdW0gcmlzdXMuIE1hdXJpcyBldSBtb2xsaXMgbGFjdXMsIGFjIHBvc3VlcmUgdG9ydG9yLiBJbnRlZ2VyIHF1aXMgcHJldGl1bSBtZXR1cy4gVXQgY29uZGltZW50dW0gYXVjdG9yIGVsaXQsIGV1IGFsaXF1ZXQgdXJuYS4gQ3VyYWJpdHVyIHNpdCBhbWV0IHZ1bHB1dGF0ZSBsb3JlbSwgYSBsb2JvcnRpcyByaXN1cy4KCkFsaXF1YW0gZmluaWJ1cyBsYWNpbmlhIGlhY3VsaXMuIE51bGxhIG1hdHRpcyBsb3JlbSBuZWMgZWZmaWNpdHVyIHZhcml1cy4gTWF1cmlzIHRlbXB1cyB2ZWxpdCBpZCBhdWN0b3IgaW50ZXJkdW0uIFNlZCBmYWNpbGlzaXMsIG51bmMgaWQgdGluY2lkdW50IHNvbGxpY2l0dWRpbiwgZW5pbSBhdWd1ZSBwdWx2aW5hciBsaWd1bGEsIHZlbCBjb25zZWN0ZXR1ciBsb3JlbSB1cm5hIG5vbiB2ZWxpdC4gVmVzdGlidWx1bSBhbnRlIGlwc3VtIHByaW1pcyBpbiBmYXVjaWJ1cyBvcmNpIGx1Y3R1cyBldCB1bHRyaWNlcyBwb3N1ZXJlIGN1YmlsaWEgQ3VyYWU7IE1vcmJpIGVnZXQgYXVjdG9yIGVuaW0sIHNpdCBhbWV0IGV1aXNtb2QgdGVsbHVzLiBJbnRlZ2VyIHZpdGFlIG9kaW8gaW4gbGlndWxhIHByZXRpdW0gaW50ZXJkdW0gYWMgbmVjIGVuaW0uIFZlc3RpYnVsdW0gdGVsbHVzIG9yY2ksIGhlbmRyZXJpdCBldSB0b3J0b3IgcXVpcywgcHJldGl1bSBwaGFyZXRyYSBtYXNzYS4gSW4gcXVpcyBxdWFtIHZlbmVuYXRpcywgYXVjdG9yIGVyb3MgbmVjLCBjb252YWxsaXMgZmVsaXMuIERvbmVjIG1hdHRpcyBvcmNpIGFsaXF1YW0gZWxpdCBwbGFjZXJhdCwgYWMgZmluaWJ1cyB0dXJwaXMgaW50ZXJkdW0uIFByb2luIGxvcmVtIHF1YW0sIGRpZ25pc3NpbSB2ZWwgcXVhbSBhYywgbW9sbGlzIGltcGVyZGlldCBpcHN1bS4gRXRpYW0gaWFjdWxpcyBlbGVtZW50dW0gbGVvLiBOdWxsYSBldSBsZWN0dXMgbmVjIG1ldHVzIGdyYXZpZGEgY29uZ3VlLiBQZWxsZW50ZXNxdWUgdGVtcHVzIG1hdXJpcyB2ZWwgbWF1cmlzIGxhY2luaWEsIGlhY3VsaXMgdm9sdXRwYXQgZXJvcyBzb2RhbGVzLiBDcmFzIGV1IGxlbyBsaWd1bGEuIFByb2luIHRvcnRvciBleCwgdml2ZXJyYSBlZmZpY2l0dXIgcmlzdXMgbmVjLCBhY2N1bXNhbiBzb2xsaWNpdHVkaW4gZXN0Lg==": function(d) { return "Lorem ipsum dolor sit amet, elit consectetur adipiscing. Per tant, una gran quantitat de gats riure. Però fins que tiri olla. Present porttitor lorem blandit Identificació urna, la xocolata, ni les rialles de les varetes. Rendiment rep relé tèrmic. Però el més gran de xocolata de béns arrels o proteïna de Xile i el maquillatge. Cada lot de voleibol de cacauet a la televisió. deduïble d'estrès si el preu o els trets. El diàmetre resistents sem, la porta d'un gran autor ni la necessitat. futbol maquillatge Mecenes amb una gran quantitat de la UE. Ara no tiri de la pena. lacus Suspendisse suscipit, hendrerit volutpat sapiens, congue Aenean. Mauris eu mollis lacus, ac lectus eget lectus. temor pels preus sencers. Per a la competició autor salsa, els plàtans de futbol olla. Estic molt feliç vulputate LOREM un riure cartró.\n\nEls últims extrems de la faldilla dirigits. Nulla Mattis lorem ncaa va portar al voltant de les varetes. Mauris de vegades l'autor de les vegades, que ell desitja. Però antioxidants, ara que sollicitudin tincidunt, enim porttitor ut lígula pulvinar, urna consectetur lorem o no volen. Abans de la primera de bàsquet va fixar les seves mandíbules dolor i l'atenció clínica; Morbi eget auctor enim, sit amet elit euismod. Perquè no hi ha odi a Canberra, i els rectes de la vida i, de vegades el preu. Kibbeh Estats Units, els interessos estratègics de qualsevol temperatura, preu buirac de masses. En quis rutrum quam, nec erat auctor eros, convallis felis. Per desgràcia, alguns inversors inverteixen una gran quantitat de frustració, i a l'altre de la base de vegades. Proin quam lorem, dignissim vel quam ac, pentinat suau molt important. També apuntat element de lleó. Cap ordinador oa casa embarassada por. faldilla Sigueu mauris Mauris, dirigida membres de cap de setmana de cacauet. xarxes de lleó de futbol demà. Proin seure, es converteix en el riure de la nec tirada, accumsan sollicitudin est."; },
  "ZmlsdGVyX1F1aWNrIGZpbmQ=": function(d) { return "Cerca ràpida"; }
}
}
module.exports = anonymous();
