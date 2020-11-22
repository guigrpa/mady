var en = function(n, ord
) {
  var s = String(n).split('.'), v0 = !s[1], t0 = Number(s[0]) == n,
      n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
  if (ord) return (n10 == 1 && n100 != 11) ? 'one'
      : (n10 == 2 && n100 != 12) ? 'two'
      : (n10 == 3 && n100 != 13) ? 'few'
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
  c29tZUNvbnRleHRfe05VTSwgcGx1cmFsLCBvbmV7MSBoYW1idXJnZXJ9IG90aGVyeyMgaGFtYnVyZ2Vyc319: function(d) { return plural(d.NUM, 0, en, { one: "1 hamburger", other: number(d.NUM, "NUM") + " hamburgers" }); },
  "c29tZUNvbnRleHRfTWVzc2FnZSB3aXRoIGEgZml4ZWQgZXJyb3Ige01JU1NJTkdfQlJBQ0tFVH0=": function(d) { return "Message with a fixed error " + d.MISSING_BRACKET; },
  "U2NvcGVkIG1lc3NhZ2Ugd2l0aCB7TlVNfSBpdGVtcw==": function(d) { return "Scoped message with " + d.NUM + " items"; }
};
