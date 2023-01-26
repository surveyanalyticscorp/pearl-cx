export default class StringUtils {
  static isEmpty(str) {
    return !str || str.length === 0;
  }

  static isNullString(str) {
    return this.isNotEmpty(str) && str.toLowerCase() === 'null';
  }

  static isNotEmpty(str) {
    return !this.isEmpty(str);
  }

  static emptyIfUndefined(str) {
    return this.isEmpty(str) ? '' : str;
  }

  static convertStringToNumber(str) {
    let value = Number(str);
    if (isNaN(value)) {
      throw Error('Input string should have numeric value');
    }

    return value;
  }

  static isNumericValue(str) {
    let value = Number(str);
    return !isNaN(value);
  }

  static getTextFromHtmlString(html) {
    let div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }

  static cleanWordHTML(html) {
    html = html.replace(/<o:p>\s*<\/o:p>/g, '');
    html = html.replace(/<o:p>.*?<\/o:p>/g, '&nbsp;');
    html = html.replace(/\s*mso-[^:]+:[^;"]+;?/gi, '');
    html = html.replace(/\s*MARGIN: 0cm 0cm 0pt\s*;/gi, '');
    html = html.replace(/\s*MARGIN: 0cm 0cm 0pt\s*"/gi, '"');
    html = html.replace(/\s*TEXT-INDENT: 0cm\s*;/gi, '');
    html = html.replace(/\s*TEXT-INDENT: 0cm\s*"/gi, '"');
    html = html.replace(/\s*TEXT-ALIGN: [^\s;]+;?"/gi, '"');
    html = html.replace(/\s*PAGE-BREAK-BEFORE: [^\s;]+;?"/gi, '"');
    html = html.replace(/\s*FONT-VARIANT: [^\s;]+;?"/gi, '"');
    html = html.replace(/\s*tab-stops:[^;"]*;?/gi, '');
    html = html.replace(/\s*tab-stops:[^"]*/gi, '');
    html = html.replace(/\s*face="[^"]*"/gi, '');
    html = html.replace(/\s*face=[^ >]*/gi, '');
    html = html.replace(/\s*FONT-FAMILY:[^;"]*;?/gi, '');
    html = html.replace(/<(\w[^>]*) class=([^ |>]*)([^>]*)/gi, '<$1$3');
    html = html.replace(/<(\w[^>]*) style="([^\"]*)"([^>]*)/gi, '<$1$3');
    html = html.replace(/\s*style="\s*"/gi, '');
    html = html.replace(/<SPAN\s*[^>]*>\s*&nbsp;\s*<\/SPAN>/gi, '&nbsp;');
    html = html.replace(/<SPAN\s*[^>]*><\/SPAN>/gi, '');
    html = html.replace(/<(\w[^>]*) lang=([^ |>]*)([^>]*)/gi, '<$1$3');
    html = html.replace(/<SPAN\s*>(.*?)<\/SPAN>/gi, '$1');
    html = html.replace(/<FONT\s*>(.*?)<\/FONT>/gi, '$1');
    html = html.replace(/<\\?\?xml[^>]*>/gi, '');
    html = html.replace(/<\/?\w+:[^>]*>/gi, '');
    html = html.replace(/<H\d>\s*<\/H\d>/gi, '');
    html = html.replace(/<H1([^>]*)>/gi, '');
    html = html.replace(/<H2([^>]*)>/gi, '');
    html = html.replace(/<H3([^>]*)>/gi, '');
    html = html.replace(/<H4([^>]*)>/gi, '');
    html = html.replace(/<H5([^>]*)>/gi, '');
    html = html.replace(/<H6([^>]*)>/gi, '');
    html = html.replace(/<table([^>]*)>/gi, '');
    html = html.replace(/<tr([^>]*)>/gi, '');
    html = html.replace(/<td([^>]*)>/gi, '');
    html = html.replace(/<b([^>]*)>/gi, '');
    html = html.replace(/<strong([^>]*)>/gi, '');
    html = html.replace(/<ul([^>]*)>/gi, '');
    html = html.replace(/<li([^>]*)>/gi, '');
    html = html.replace(/<ol([^>]*)>/gi, '');
    html = html.replace(/<(U|I|STRIKE)>&nbsp;<\/\1>/g, '&nbsp;');
    html = html.replace(/<(B|b)>&nbsp;<\/\b|B>/g, '');
    html = html.replace(/<\/H\d>/gi, '<br>'); //remove this to take out breaks where Heading tags were
    html = html.replace(/<([^\s>]+)[^>]*>\s*<\/\1>/g, '');
    html = html.replace(/<([^\s>]+)[^>]*>\s*<\/\1>/g, '');
    html = html.replace(/<([^\s>]+)[^>]*>\s*<\/\1>/g, '');

    //some RegEx code for the picky browsers
    var re = new RegExp('(<P)([^>]*>.*?)(</P>)', 'gi');
    html = html.replace(re, '<div$2</div>');

    var re2 = new RegExp('(<font|<FONT)([^*>]*>.*?)(</FONT>|</font>)', 'gi');
    html = html.replace(re2, '<div$2</div>');
    html = html.replace(/size|SIZE = ([\d]{1})/g, '');

    return html;
  }

  static removeLines(str) {
    return str.replace(/\s{2,}/g, '');
  }

  static convertStringToNumberElseReturnZero(str) {
    try {
      return convertStringToNumber(str);
    } catch (e) {
      return 0;
    }
  }

  static getShortTextTruncateMiddle(str, MAX_LENGTH = 30) {
    const MIN_LENGTH = 10;
    const ELLIPSIS_LENGTH = 3;
    if (isEmpty(str)) {
      return str;
    }

    if (str.length > MAX_LENGTH && str.length > MIN_LENGTH) {
      let halfLength = MAX_LENGTH / 2;
      let secondPartLength = MAX_LENGTH - halfLength - ELLIPSIS_LENGTH;
      let firstPartEndIndex = halfLength;
      let secondPartStartIndex = str.length - secondPartLength;

      return (
        str.substring(0, firstPartEndIndex + 1) +
        '...' +
        str.substring(secondPartStartIndex, str.length + 1)
      );
    }

    return str;
  }

  static getShortTextTruncateEnd(str, lengthLimit) {
    if (isEmpty(str)) {
      return str;
    }

    if (str.length > lengthLimit) {
      return str.substring(0, lengthLimit) + '...';
    }

    return str;
  }

  static isEmptyOrNull(str) {
    return str === undefined || str === null;
  }

  static getRandomAlphanumericString() {
    return Math.random().toString(36).substring(7);
  }

  static getTextArraySeparatedByNewline(text) {
    let textLines = text || '';
    textLines = textLines.replace('\r\n', '\n');
    return textLines.split('\n');
  }

  static getTextArraySeparatedBy(text, symbol) {
    let textLines = text || '';
    return textLines.split(symbol);
  }

  static getTextForPropertySeparatedByNewline(obj, property) {
    const lastItemIndex = obj[property].length - 1;
    let itemsTextSeparatedByNewLine = '';
    for (let i = 0; i < obj[property].length; i++) {
      let item = obj[property][i];

      itemsTextSeparatedByNewLine += emptyIfUndefined(item.text);
      const isNotLastItem = i != lastItemIndex;
      itemsTextSeparatedByNewLine += isNotLastItem ? '\n' : '';
    }

    return itemsTextSeparatedByNewLine;
  }

  static isSafariBrowserOnMacOS() {
    return (
      navigator != null &&
      navigator.userAgent != null &&
      navigator.userAgent.indexOf('Safari') != -1 &&
      navigator.userAgent.indexOf('Chrome') == -1 &&
      navigator.userAgent.indexOf('Mac') > 0
    );
  }

  static addCssClassToTargetMacSafariBrowser(cssClass) {
    return cssClass + (isSafariBrowserOnMacOS() ? ' mac-safari' : '');
  }

  static removeSpecialCharacters(text) {
    return text.replace(/['"?]/g, '');
  }

  static removeBlankSpaces(text) {
    return text.trim().replace(/&nbsp;/g, '');
  }

  static convertToPlainText(text) {
    return text.replace(/(<([^>]+)>)/gi, '');
  }

  static getPlainTextWithoutSpecialCharacters(text) {
    return convertToPlainText(removeSpecialCharacters(text));
  }

  static removeNewLines(text) {
    return text.replace(/\r?\n|\r/g, '');
  }

  static uppercaseFirstChar(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  static uppercaseFirstCharRestLowercase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  static getStringFromNumber(number) {
    return number.toString();
  }
}
