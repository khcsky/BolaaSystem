/*
*判断一个字符串是不是json字符串
* str:字符串
* */
isJSON.strict = strict;
export function isJSON (str, pass_object) {
  if (pass_object && isObject(str)) return true;

  if (!isString(str)) return false;

  str = str.replace(/\s/g, '').replace(/\n|\r/, '');

  if (/^\{(.*?)\}$/.test(str))
    return /"(.*?)":(.*?)/g.test(str);

  if (/^\[(.*?)\]$/.test(str)) {
    return str.replace(/^\[/, '')
        .replace(/\]$/, '')
        .replace(/},{/g, '}\n{')
        .split(/\n/)
        .map(function (s) { return isJSON(s); })
        .reduce(function (prev, curr) { return !!curr; });
  }

  return false;
}

function strict (str) {
  if (isObject(str)) {
    return true;
  }

  try {
    return JSON.parse(str) && true;
  } catch (ex) {
    return false;
  }
}

/*
* 判断字符串
* */
export function isString (x) {
  return Object.prototype.toString.call(x) === '[object String]';
}
