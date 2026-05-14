export default class StringUtils {
  static isEmpty(str) {
    return !str || str.length === 0;
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

  static formatCommentToHTML(commentText) {
    return commentText.replace(/\@\[([^\]]+)\]\(([^\)]+)\)/g, `<b>$1</b>`);
  }

  static formatActivityToHTML(activityText, wordsToBold) {
    let tempText = activityText;
    wordsToBold.forEach(word => {
      tempText = tempText.replace(
        new RegExp(`\\b${word}\\b`, 'g'),
        `<b>${word}</b>`,
      );
    });
    return tempText;
    // const pattern = new RegExp(`(${wordsToBold.join('|')})`, 'g');

    // return activityText.replace(pattern, `<b>$1</b>`);
  }

  static getWords(text) {
    // fix if text is null
    if (!text) {
      return [];
    }
    var specialPattern = /@\[[^\]]+\]\(\d+\)/g;

    // Extract all occurrences of the special pattern and store them in an array
    var specialMatches = text.match(specialPattern) || [];

    // Replace all occurrences of the special pattern with a placeholder
    var textWithoutSpecialPattern = text.replace(specialPattern, 'PLACEHOLDER');

    // Use a regular expression to split the text into words
    var words = textWithoutSpecialPattern.split(/\s+/);

    // Replace the placeholders with the original special pattern in the words array
    words = words.map(function (word) {
      return word === 'PLACEHOLDER' ? specialMatches.shift() : word;
    });

    // Filter out empty strings (occurs when there are consecutive spaces)
    words = words.filter(function (word) {
      return word.length > 0;
    });

    // Return the count of words
    return words;
  }

  static convertStringToNumberElseReturnZero(str) {
    try {
      return this.convertStringToNumber(str);
    } catch (e) {
      return 0;
    }
  }

  static getShortTextTruncateMiddle(str, MAX_LENGTH = 30) {
    const MIN_LENGTH = 10;
    const ELLIPSIS_LENGTH = 3;
    if (this.isEmpty(str)) {
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
    if (this.isEmpty(str)) {
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

  static removeSpecialCharacters(text) {
    return text.replace(/['"?]/g, '');
  }

  static removeBlankSpaces(text) {
    return text.trim().replace(/&nbsp;/g, '');
  }

  static convertToPlainText(text) {
    return text.replace(/(<([^>]+)>)/gi, '');
  }

  static removeNewLines(text) {
    return text.replace(/\r?\n|\r/g, '');
  }

  static toSnakeCase(str) {
    if (!str) {
      return str;
    }
    return str.toLowerCase().replace(/[\s-]+/g, '_');
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

  static floatTo2DecimalPointString(number) {
    if (number % 1 === 0) {
      return number;
    }
    return parseFloat(number).toFixed(2);
  }

  static floatTo2DecimalPoint(number) {
    if (number % 1 === 0) {
      return number;
    }
    return parseFloat(parseFloat(number).toFixed(2));
  }

  static floatToDecimal(number) {
    if (number % 1 === 0) {
      return number;
    }
    return Math.round(parseFloat(number).toFixed(2));
  }

  static formattedCount(count, minCompareValue, notion) {
    const formatted = (count / minCompareValue).toFixed(1);
    return formatted.endsWith('.0')
      ? Math.floor(formatted) + notion
      : formatted + notion;
  }

  static getTrimmedNoOfResponses(responseCount) {
    let ONE_THOUSAND = 1000;
    let ONE_MILLION = 1000000;
    let ONE_BILLION = 1000000000;
    let ONE_THOUSAND_BILLION = 1000000000000;
    let ONE_TRILLION = 1000000000000000;
    let ONE_QUADRILLION = 1000000000000000000;

    if (isNaN(responseCount) || responseCount < 0) {
      return '0';
    }
    if (responseCount < ONE_THOUSAND) {
      return responseCount.toString();
    } else if (responseCount < ONE_MILLION) {
      return this.formattedCount(responseCount, ONE_THOUSAND, 'K');
    } else if (responseCount < ONE_BILLION) {
      return this.formattedCount(responseCount, ONE_MILLION, 'M');
    } else if (responseCount < ONE_THOUSAND_BILLION) {
      return this.formattedCount(responseCount, ONE_BILLION, 'B');
    } else if (responseCount < ONE_TRILLION) {
      return this.formattedCount(responseCount, ONE_THOUSAND_BILLION, 'T');
    } else if (responseCount < ONE_QUADRILLION) {
      return this.formattedCount(responseCount, ONE_TRILLION, 'Q');
    } else {
      return responseCount.toString();
    }
  }

  static truncateFileName = (fileName, maxLength = 30) => {
    if (fileName.length <= maxLength) {
      return fileName;
    }

    const start = fileName.slice(0, 11); // Take first 6 characters
    const end = fileName.slice(-16); // Take last 12 characters
    return `${start}...${end}`;
  };

  static truncateCustomerName = (
    name,
    maxLength = 100,
    firstCharatcetCount = 6,
    lastCharatcetCount = 6,
  ) => {
    if (name.length <= maxLength) {
      return name;
    }

    const start = name.slice(0, firstCharatcetCount); // Take first 6 characters
    const end = name.slice(-lastCharatcetCount); // Take last 12 characters
    return `${start}...${end}`;
  };

  static reformatName(user) {
    // Split firstName by any non-alphabetical characters and trim any spaces
    let firstName = user.firstName.trim().split(/[^\w]+/)[0];
    let lastName =
      user.firstName.trim().split(/[^\w]+/)[1] || user.lastName.trim();

    // Capitalize the first letter of both first and last name
    firstName =
      firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
    lastName =
      lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();

    return `${firstName} ${lastName}`;
  }
  static reformatComplexName(name) {
    // Split the name by non-alphabet characters, excluding hyphens
    let nameParts = name.trim().split(/[^a-zA-Z-]+/);

    // Capitalize the first letter of each part, keeping hyphenated names intact
    nameParts = nameParts.map(part =>
      part
        .split('-')
        .map(
          subPart =>
            subPart.charAt(0).toUpperCase() + subPart.slice(1).toLowerCase(),
        )
        .join('-'),
    );

    // Join the name parts back into a full name
    return nameParts.join(' ');
  }

  static validatePhoneNumber = formattedPhoneNumber => {
    // Check if the phone number starts with a + followed by 1-3 digits (country code)
    const countryCodePattern = /^\+\d{1,3}/;
    const isCountryCodeValid = countryCodePattern.test(formattedPhoneNumber);

    if (!isCountryCodeValid) return false; // Invalid if country code doesn't match

    // Remove the country code for further validation
    const phoneNumber = formattedPhoneNumber
      .replace(countryCodePattern, '')
      .trim();

    // Check if the remaining part contains only 6-14 digits
    const phonePattern = /^\d{6,14}$/;
    const isPhoneNumberValid = phonePattern.test(phoneNumber);

    return isPhoneNumberValid;
  };
}
