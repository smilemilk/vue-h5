// 时间格式化
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null;
  }
  if (time === undefined || time === null) {
    return '-';
  }

  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;
  if (typeof time === 'object') {
    date = time;
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000;

    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    if (key === 'a') {
      return ['一', '二', '三', '四', '五', '六', '日'][value - 1];
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value;
    }
    return value || 0;
  });
  return time_str;
}

// 金额格式化
export function moneyFormat(value) {
  let number = (value + '').replace(/\,/g, '')
  if (isNaN(number) || number === '') {
    return ''
  }
  number = Math.round(number * 100) / 100;
  if (number < 0) {
    return (
      '-' +
      outputDollars(Math.floor(Math.abs(number) - 0) + '') +
      outputCents(Math.abs(number) - 0)
    );
  } else {
    return outputDollars(Math.floor(number - 0) + '') + outputCents(number - 0);
  }

  // 格式化金额
  function outputDollars(number) {
    if (number.length <= 3) {
      return number === '' ? '0' : number
    } else {
      let mod = number.length % 3;
      let output = mod === 0 ? '' : number.substring(0, mod);
      for (let i = 0; i < Math.floor(number.length / 3); i++) {
        if (mod === 0 && i === 0) {
          output += number.substring(mod + 3 * i, mod + 3 * i + 3);
        } else {
          output += ',' + number.substring(mod + 3 * i, mod + 3 * i + 3);
        }
      }
      return output;
    }
  }
  function outputCents(value) {
    let amount = Math.round((value - Math.floor(value)) * 100);
    return amount < 10 ? '.0' + amount : '.' + amount;
  }
}

