/* eslint-disable */
  function anonymous() {
    var en_GB = function (n, ord) {
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

return {
  c29tZUNvbnRleHRfe05VTSwgcGx1cmFsLCBvbmV7MSBoYW1idXJnZXJ9IG90aGVyeyMgaGFtYnVyZ2Vyc319: function(d) { return plural(d.NUM, 0, en_GB, { one: "1 hamburger", other: number(d.NUM, "NUM") + " hamburgers" }); },
  "c29tZUNvbnRleHRfSGVsbG8sIHtOQU1FfSE=": function(d) { return "Hello, " + d.NAME + "!"; },
  "c29tZUNvbnRleHRfPGk+SGk8L2k+IDxiPntOQU1FfTwvYj4h": function(d) { return "<i>Hi</i> <b>" + d.NAME + "</b>!"; },
  "c29tZUNvbnRleHRfSGVsbG8ge05BTUV9LCB5b3UgaGF2ZSB7VU5SRUFEX0NPVU5UfSB7VU5SRUFEX0NPVU5ULCBwbHVyYWwsIG9uZSB7bWVzc2FnZX0gb3RoZXIge21lc3NhZ2VzfX0=": function(d) { return "Hello " + d.NAME + ", you have " + d.UNREAD_COUNT + " " + plural(d.UNREAD_COUNT, 0, en_GB, { one: "message", other: "messages" }); },
  "c29tZUNvbnRleHRfQSB0b29sIGZvciBpbnRlcm5hdGlvbmFsaXphdGlvbg==": function(d) { return "A tool for internationalisation"; }
}
  };
  module.exports = anonymous();
  /* eslint-enable */
  