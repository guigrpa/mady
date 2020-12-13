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
  c29tZUNvbnRleHRfTWVzc2FnZSB3aXRoIGludGVycG9sYXRpb246IHtOVU19: function(d) { return "Mensaje con interpolación: " + d.NUM; },
  c29tZUNvbnRleHRfe05VTSwgcGx1cmFsLCBvbmV7MSBoYW1idXJnZXJ9IG90aGVyeyMgaGFtYnVyZ2Vyc319: function(d) { return plural(d.NUM, 0, es, { one: "1 hamburguesa", other: number(d.NUM, "NUM") + " hamburguesas" }); },
  "c29tZUNvbnRleHRfTWVzc2FnZSB3aXRoIGEgZml4ZWQgZXJyb3Ige01JU1NJTkdfQlJBQ0tFVH0=": function(d) { return "Mensaje con un error fijo " + d.MISSING_BRACKET; },
  "Q29udGV4dC1sZXNzIG1lc3NhZ2U=": function(d) { return "Mensaje sin contexto"; },
  "c29tZUNvbnRleHRfTWVzc2FnZSB3aXRoIGNvbnRleHQ=": function(d) { return "Mensaje con contexto"; },
  "c29tZUNvbnRleHRfTWVzc2FnZSB3aXRoIGVtb2ppIPCfpbA=": function(d) { return "Mensaje con emoji 🥰"; },
  "c29tZUNvbnRleHRfQSBuZXcgbWVzc2FnZQ==": function(d) { return "Un nuevo mensaje"; }
};
