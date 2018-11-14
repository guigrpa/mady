
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
  "someContext_{NUM, plural, one{1 hamburger} other{# hamburgers}}": function(d) { return plural(d.NUM, 0, en_GB, { one: "1 hamburger", other: number(d.NUM, "NUM") + " hamburgers" }); },
  "someContext_Hello, {NAME}!": function(d) { return "Hello, " + d.NAME + "!"; },
  "someContext_Hello {NAME}, you have {UNREAD_COUNT, number} {UNREAD_COUNT, plural, one {message} other {messages}}": function(d) { return "Hello " + d.NAME + ", you have " + fmt.number(d.UNREAD_COUNT, "en-GB") + " " + plural(d.UNREAD_COUNT, 0, en_GB, { one: "message", other: "messages" }); },
  "someContext_<i>Hi</i> <b>{NAME}</b>!": function(d) { return "<i>Hi</i> <b>" + d.NAME + "</b>!"; },
  "someContext_A tool for internationalization": function(d) { return "A tool for internationalisation"; }
}
}
module.exports = anonymous();
