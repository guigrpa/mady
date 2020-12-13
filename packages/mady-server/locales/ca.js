var ca = function(n, ord
) {
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
  if (isNaN(value)) throw new Error("Can't apply offset:" + offset + ' to argument `' + name + '` with non-numerical value ' + JSON.stringify(value) + '.');
  return value - offset;
};
var plural = function (value, offset, lcfunc, data, isOrdinal) {
  if ({}.hasOwnProperty.call(data, value)) return data[value];
  if (offset) value -= offset;
  var key = lcfunc(value, isOrdinal);
  return key in data ? data[key] : data.other;
};

module.exports = {
  c29tZUNvbnRleHRfTWVzc2FnZSB3aXRoIGludGVycG9sYXRpb246IHtOVU19: function(d) { return "Message with interpolation: " + d.NUM; },
  c29tZUNvbnRleHRfe05VTSwgcGx1cmFsLCBvbmV7MSBoYW1idXJnZXJ9IG90aGVyeyMgaGFtYnVyZ2Vyc319: function(d) { return plural(d.NUM, 0, ca, { one: "1 hamburger", other: number(d.NUM, "NUM") + " hamburgers" }); },
  "c29tZUNvbnRleHRfTWVzc2FnZSB3aXRoIGEgZml4ZWQgZXJyb3Ige01JU1NJTkdfQlJBQ0tFVH0=": function(d) { return "Message with a fixed error " + d.MISSING_BRACKET; },
  "Y29udGFjdF9nZXQgaW4gdG91Y2g=": function(d) { return "posa't en contacte"; },
  "Y29udGFjdF9BbnkgcXVlc3Rpb25zIG9yIGNvbW1lbnRzPw==": function(d) { return "Preguntes, comentaris?"; },
  Y29udGFjdF9uYW1l: function(d) { return "nom"; },
  "Y29udGFjdF9lbWFpbA==": function(d) { return "correu electrònic"; },
  Y29udGFjdF9tZXNzYWdl: function(d) { return "missatge"; },
  "YnV0dG9uX3NlbmQ=": function(d) { return "enviar"; },
  Y29udGFjdF9zdWJqZWN0: function(d) { return "tema"; },
  "Y292aWRfQWRkIHRoaXMgd2lkZ2V0IHRvIHlvdXIgc2l0ZQ==": function(d) { return "Afegeix aquest widget al teu site"; },
  Y292aWRfQW1zdGVyZGFt: function(d) { return "Amsterdam"; },
  Y292aWRfQmFyY2Vsb25h: function(d) { return "Barcelona"; },
  "Y292aWRfQnJ1c3NlbHM=": function(d) { return "Brussel·les"; },
  "Y292aWRfQ29weQ==": function(d) { return "Copia"; },
  Y292aWRfQ3JlZGl0OiBCYXMgTWlqaW5nLCBLTk1J: function(d) { return "Crèdits: Bas Mijing, KNMI"; },
  "Y292aWRfRGFpbHkgTk/igoIgY29uY2VudHJhdGlvbiBpbiBCYXJjZWxvbmEgLSBFaXhhbXBsZSAoRVMxNDM4QSk=": function(d) { return "Concentració diària de NO₂ a Barcelona - Eixample (ES1438A)"; },
  "Y292aWRfRGF0YSB1cGRhdGVzIGRhaWx5IGR1cmluZyB0aGUgcXVhcmFudGluZSBwZXJpb2Q=": function(d) { return "Les dades s’actualitzen diàriament durant el període de quarantena"; },
  Y292aWRfRW1iZWQgdGhpcyB3aWRnZXQgaW4geW91ciBzaXRl: function(d) { return "Incrusta aquest widget al teu site"; },
  "Y292aWRfTGljZW5zZSBhbmQgY3JlZGl0cw==": function(d) { return "Llicència i crèdits"; },
  Y292aWRfTG9uZG9u: function(d) { return "Londres"; },
  Y292aWRfTWFkcmlk: function(d) { return "Madrid"; },
  "Y292aWRfTWlsYW4=": function(d) { return "Milà"; },
  "Y292aWRfTk/igoIgaW4gQW1zdGVyZGFt": function(d) { return "NO₂ a Amsterdam"; },
  "Y292aWRfTk/igoIgaW4gQmFyY2Vsb25h": function(d) { return "NO₂ a Barcelona"; },
  "Y292aWRfTk/igoIgaW4gQmVybGlu": function(d) { return "NO₂ a Berlín"; },
  "Y292aWRfTk/igoIgaW4gQnJ1c3NlbHM=": function(d) { return "NO₂ a Brussel·les"; },
  "Y292aWRfTk/igoIgaW4gTG9uZG9u": function(d) { return "NO₂ a Londres"; },
  "Y292aWRfTk/igoIgaW4gTWFkcmlk": function(d) { return "NO₂ a Madrid"; },
  "Y292aWRfTk/igoIgaW4gTWlsYW4=": function(d) { return "NO₂ a Milà"; },
  "Y292aWRfTk/igoIgaW4gUGFyaXM=": function(d) { return "NO₂ a París"; },
  "Y292aWRfUGFyaXM=": function(d) { return "París"; },
  "Y292aWRfUm9hZHNpZGU=": function(d) { return "Trànsit"; },
  "Y292aWRfVHJhZmZpYyBjb250cmlidXRpb24=": function(d) { return "Aportació de trànsit"; },
  "Y292aWRfVHJhZmZpYyBjb250cmlidXRpb24gdG8gTk/igoIgY29uY2VudHJhdGlvbnM=": function(d) { return "Contribució del trànsit a les concentracions de NO₂"; },
  "Y292aWRfQmFja2dyb3VuZA==": function(d) { return "Nivells de fons"; },
  "Y292aWRfRGlmZmVyZW5jZQ==": function(d) { return "Diferència"; },
  Y292aWRfRm9yZWNhc3QgKHdpdGhvdXQgQ09WSUQtMTkp: function(d) { return "Predicció (sense COVID-19)"; },
  "Y292aWRfTG9ja2Rvd24=": function(d) { return "Confinament"; },
  "Y292aWRfQWN0dWFsIG1lYXN1cmVtZW50cw==": function(d) { return "Mesures actuals"; },
  Y292aWRfQmVmb3Jl: function(d) { return "Abans"; },
  "Y292aWRfQ3JlYXRlZCBieQ==": function(d) { return "Creat per"; },
  Y292aWRfRHVyaW5n: function(d) { return "Durant"; },
  Y292aWRfQWJvdXQgdGhpcyBkYXRh: function(d) { return "Sobre les dades"; },
  "Y292aWRfQnk=": function(d) { return "Per"; },
  "Y292aWRfTk/igoIgaW4gUm9tZQ==": function(d) { return "NO₂ a Roma"; },
  "Y292aWRfTk/igoIgaW4gQnVjaGFyZXN0": function(d) { return "NO₂ a Bucarest"; },
  "Y292aWRfTGFzdCB1cGRhdGVkOg==": function(d) { return "Última actualització:"; },
  "Y292aWRfVGFibGUgb2YgY29udGVudHM=": function(d) { return "Índex"; },
  "Y292aWRfQWRkIHRoZXNlIGNoYXJ0cyB0byB5b3VyIHNpdGU=": function(d) { return "Afegeix aquests gràfics al teu site"; },
  Y292aWRfQ29uY2VudHJhdGlvbnMgZXZvbHV0aW9uIGNoYXJ0: function(d) { return "Gràfic d'evolució de les concentracions"; },
  Y292aWRfR2V0IHRoZSBjb2Rl: function(d) { return "Copia el codi"; },
  "Y292aWRfU2VsZWN0IGNpdHk=": function(d) { return "Escull la ciutat"; },
  "Y292aWRfU2VsZWN0IHdpZGdldA==": function(d) { return "Escull el widget"; },
  Y292aWRfRGF0YSB1cGRhdGVzIHdlZWtseSBkdXJpbmcgdGhlIHF1YXJhbnRpbmUgcGVyaW9k: function(d) { return "Les dades s’actualitzen setmanalment durant el període de quarantena"; },
  "Y292aWRfVGltZSBzZXJpZXM=": function(d) { return "Sèrie temporal"; },
  "Y292aWRfQ29tcGFyaXNvbg==": function(d) { return "Comparació"; },
  Y292aWRfQW5pbWF0aW9u: function(d) { return "Animació"; },
  "Y292aWRfUm9tZQ==": function(d) { return "Roma"; },
  "Y292aWRfTk/igoIgY29uY2VudHJhdGlvbnM=": function(d) { return "Concentracions de NO₂"; },
  Y292aWRfQnVjaGFyZXN0: function(d) { return "Bucarest"; },
  "c29tZUNvbnRleHRfTWVzc2FnZSB3aXRoIGVtb2ppIPCfpbA=": function(d) { return "Missatge amb emoji 🥰"; }
};
