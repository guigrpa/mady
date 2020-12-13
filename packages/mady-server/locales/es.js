var es = function(n, ord
) {
  if (ord) return 'other';
  return (n == 1) ? 'one' : 'other';
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
  c29tZUNvbnRleHRfe05VTSwgcGx1cmFsLCBvbmV7MSBoYW1idXJnZXJ9IG90aGVyeyMgaGFtYnVyZ2Vyc319: function(d) { return plural(d.NUM, 0, es, { one: "1 hamburger", other: number(d.NUM, "NUM") + " hamburgers" }); },
  "c29tZUNvbnRleHRfTWVzc2FnZSB3aXRoIGEgZml4ZWQgZXJyb3Ige01JU1NJTkdfQlJBQ0tFVH0=": function(d) { return "Message with a fixed error " + d.MISSING_BRACKET; },
  "Y29udGFjdF9nZXQgaW4gdG91Y2g=": function(d) { return "ponte en contacto"; },
  "Y29udGFjdF9BbnkgcXVlc3Rpb25zIG9yIGNvbW1lbnRzPw==": function(d) { return "¿Preguntas, comentarios?"; },
  "Y29udGFjdF9lbWFpbA==": function(d) { return "correo electrónico"; },
  Y29udGFjdF9tZXNzYWdl: function(d) { return "mensaje"; },
  Y29udGFjdF9zdWJqZWN0: function(d) { return "tema"; },
  Y29udGFjdF9uYW1l: function(d) { return "nombre"; },
  "YnV0dG9uX3NlbmQ=": function(d) { return "enviar"; },
  "Y292aWRfQWN0dWFsIG1lYXN1cmVtZW50cw==": function(d) { return "Mediciones reales"; },
  "Y292aWRfQWRkIHRoaXMgd2lkZ2V0IHRvIHlvdXIgc2l0ZQ==": function(d) { return "Agrega este widget a tu sitio web"; },
  Y292aWRfQW1zdGVyZGFt: function(d) { return "Amsterdam"; },
  "Y292aWRfQmFja2dyb3VuZA==": function(d) { return "Niveles de fondo"; },
  Y292aWRfQmFyY2Vsb25h: function(d) { return "Barcelona"; },
  "Y292aWRfQnJ1c3NlbHM=": function(d) { return "Bruselas"; },
  "Y292aWRfQ29weQ==": function(d) { return "Copiar"; },
  Y292aWRfQ3JlZGl0OiBCYXMgTWlqaW5nLCBLTk1J: function(d) { return "Créditos: Bas Mijing, KNMI"; },
  "Y292aWRfRGFpbHkgTk/igoIgY29uY2VudHJhdGlvbiBpbiBCYXJjZWxvbmEgLSBFaXhhbXBsZSAoRVMxNDM4QSk=": function(d) { return "Concentración diaria de NO₂ en Barcelona - Eixample"; },
  "Y292aWRfRGF0YSB1cGRhdGVzIGRhaWx5IGR1cmluZyB0aGUgcXVhcmFudGluZSBwZXJpb2Q=": function(d) { return "Actualización de datos diariamente durante el período de cuarentena."; },
  "Y292aWRfRGlmZmVyZW5jZQ==": function(d) { return "Diferencia"; },
  Y292aWRfRW1iZWQgdGhpcyB3aWRnZXQgaW4geW91ciBzaXRl: function(d) { return "Agrega este widget a tu sitio web"; },
  Y292aWRfRm9yZWNhc3QgKHdpdGhvdXQgQ09WSUQtMTkp: function(d) { return "Pronóstico (sin COVID-19)"; },
  "Y292aWRfTGljZW5zZSBhbmQgY3JlZGl0cw==": function(d) { return "Licencia y créditos"; },
  "Y292aWRfTG9ja2Rvd24=": function(d) { return "Confinamiento"; },
  Y292aWRfTG9uZG9u: function(d) { return "Londres"; },
  Y292aWRfTWFkcmlk: function(d) { return "Madrid"; },
  "Y292aWRfTWlsYW4=": function(d) { return "Milán"; },
  "Y292aWRfTk/igoIgaW4gQW1zdGVyZGFt": function(d) { return "NO₂ en Amsterdam"; },
  "Y292aWRfTk/igoIgaW4gQmFyY2Vsb25h": function(d) { return "NO₂ en Barcelona"; },
  "Y292aWRfTk/igoIgaW4gQmVybGlu": function(d) { return "NO₂ en Berlín"; },
  "Y292aWRfTk/igoIgaW4gQnJ1c3NlbHM=": function(d) { return "NO₂ en Bruselas"; },
  "Y292aWRfTk/igoIgaW4gTWFkcmlk": function(d) { return "NO₂ en Madrid"; },
  "Y292aWRfTk/igoIgaW4gTG9uZG9u": function(d) { return "NO₂ en Londres"; },
  "Y292aWRfTk/igoIgaW4gTWlsYW4=": function(d) { return "NO₂ en Milán"; },
  "Y292aWRfTk/igoIgaW4gUGFyaXM=": function(d) { return "NO₂ en París"; },
  "Y292aWRfUGFyaXM=": function(d) { return "París"; },
  "Y292aWRfUm9hZHNpZGU=": function(d) { return "Tráfico"; },
  "Y292aWRfVHJhZmZpYyBjb250cmlidXRpb24=": function(d) { return "Contribución del tráfico"; },
  "Y292aWRfVHJhZmZpYyBjb250cmlidXRpb24gdG8gTk/igoIgY29uY2VudHJhdGlvbnM=": function(d) { return "Contribución del tráfico a las concentraciones de NO₂"; },
  Y292aWRfRHVyaW5n: function(d) { return "Durante"; },
  "Y292aWRfQ3JlYXRlZCBieQ==": function(d) { return "Creado por"; },
  Y292aWRfQmVmb3Jl: function(d) { return "Antes"; },
  Y292aWRfQWJvdXQgdGhpcyBkYXRh: function(d) { return "Sobre estos datos"; },
  "Y292aWRfQnk=": function(d) { return "Por"; },
  "Y292aWRfTk/igoIgaW4gUm9tZQ==": function(d) { return "NO₂ en Roma"; },
  "Y292aWRfTk/igoIgaW4gQnVjaGFyZXN0": function(d) { return "NO₂ en Bucarest"; },
  "Y292aWRfTGFzdCB1cGRhdGVkOg==": function(d) { return "Última actualización:"; },
  "Y292aWRfVGFibGUgb2YgY29udGVudHM=": function(d) { return "Índice"; },
  "Y292aWRfQWRkIHRoZXNlIGNoYXJ0cyB0byB5b3VyIHNpdGU=": function(d) { return "Añade estos gráficos a tu site"; },
  Y292aWRfQ29uY2VudHJhdGlvbnMgZXZvbHV0aW9uIGNoYXJ0: function(d) { return "Tabla de evolución de las concentraciones"; },
  Y292aWRfR2V0IHRoZSBjb2Rl: function(d) { return "Copia el código"; },
  "Y292aWRfU2VsZWN0IGNpdHk=": function(d) { return "Selecciona ciudad"; },
  "Y292aWRfU2VsZWN0IHdpZGdldA==": function(d) { return "Selecciona widget"; },
  Y292aWRfRGF0YSB1cGRhdGVzIHdlZWtseSBkdXJpbmcgdGhlIHF1YXJhbnRpbmUgcGVyaW9k: function(d) { return "Actualización de datos semanalmente durante el período de cuarentena."; },
  "Y292aWRfVGltZSBzZXJpZXM=": function(d) { return "Serie temporal"; },
  "Y292aWRfQ29tcGFyaXNvbg==": function(d) { return "Comparación"; },
  Y292aWRfQW5pbWF0aW9u: function(d) { return "Animación"; },
  Y292aWRfQnVjaGFyZXN0: function(d) { return "Bucarest"; },
  "Y292aWRfTk/igoIgY29uY2VudHJhdGlvbnM=": function(d) { return "Concentraciones de NO₂"; },
  "Y292aWRfUm9tZQ==": function(d) { return "Roma"; }
};
