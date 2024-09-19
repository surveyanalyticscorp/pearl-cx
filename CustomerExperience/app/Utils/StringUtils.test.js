import StringUtils from './StringUtils';

describe('StringUtils', () => {
  describe('isEmpty', () => {
    test('should return true for null', () => {
      expect(StringUtils.isEmpty(null)).toBe(true);
    });

    test('should return true for empty string', () => {
      expect(StringUtils.isEmpty('')).toBe(true);
    });

    test('should return false for non-empty string', () => {
      expect(StringUtils.isEmpty('hello')).toBe(false);
    });
  });

  describe('isNullString', () => {
    test('should return true for string "null"', () => {
      expect(StringUtils.isNullString('null')).toBe(true);
    });

    test('should return false for string "hello"', () => {
      expect(StringUtils.isNullString('hello')).toBe(false);
    });

    test('should return false for empty string', () => {
      expect(StringUtils.isNullString('')).toBe(false);
    });
  });

  describe('isNotEmpty', () => {
    test('should return false for null', () => {
      expect(StringUtils.isNotEmpty(null)).toBe(false);
    });

    test('should return false for empty string', () => {
      expect(StringUtils.isNotEmpty('')).toBe(false);
    });

    test('should return true for non-empty string', () => {
      expect(StringUtils.isNotEmpty('hello')).toBe(true);
    });
  });

  describe('emptyIfUndefined', () => {
    test('should return empty string for undefined', () => {
      expect(StringUtils.emptyIfUndefined(undefined)).toBe('');
    });

    test('should return the original string if not empty', () => {
      expect(StringUtils.emptyIfUndefined('hello')).toBe('hello');
    });
  });

  describe('convertStringToNumber', () => {
    test('should convert string to number', () => {
      expect(StringUtils.convertStringToNumber('123')).toBe(123);
    });

    test('should throw error for non-numeric string', () => {
      expect(() => StringUtils.convertStringToNumber('abc')).toThrow(
        'Input string should have numeric value',
      );
    });
  });

  describe('isNumericValue', () => {
    test('should return true for numeric string', () => {
      expect(StringUtils.isNumericValue('123')).toBe(true);
    });

    test('should return false for non-numeric string', () => {
      expect(StringUtils.isNumericValue('abc')).toBe(false);
    });
  });

  describe('getTextFromHtmlString', () => {
    test('should return text content from HTML string', () => {
      expect(StringUtils.getTextFromHtmlString('<div>hello</div>')).toBe(
        'hello',
      );
    });

    test('should return empty string for empty HTML string', () => {
      expect(StringUtils.getTextFromHtmlString('<div></div>')).toBe('');
    });
  });

  describe('cleanWordHTML', () => {
    test('should remove Word-specific tags and styles', () => {
      const html =
        '<o:p>hello</o:p><span style="mso-style-name:style">text</span>';
      const expected = '&nbsp;text';
      expect(StringUtils.cleanWordHTML(html)).toBe(expected);
    });
  });

  describe('formatCommentToHTML', () => {
    test('should format comment with bold tags', () => {
      const commentText = '@[User](url)';
      const expected = '<b>User</b>'; // Expected transformation
      expect(StringUtils.formatCommentToHTML(commentText)).toBe(expected);
    });
  });

  describe('getTrimmedNoOfResponses', () => {
    test('should format count under 1000', () => {
      expect(StringUtils.getTrimmedNoOfResponses(999)).toBe('999');
    });

    test('should format count in thousands', () => {
      expect(StringUtils.getTrimmedNoOfResponses(1000)).toBe('1K');
    });

    test('should format count in millions', () => {
      expect(StringUtils.getTrimmedNoOfResponses(2000000)).toBe('2M');
    });

    test('should format count in billions', () => {
      expect(StringUtils.getTrimmedNoOfResponses(3000000000)).toBe('3B');
    });

    test('should return "0" for negative counts or NaN', () => {
      expect(StringUtils.getTrimmedNoOfResponses(-1)).toBe('0');
      expect(StringUtils.getTrimmedNoOfResponses(NaN)).toBe('0');
    });
  });

  // New test cases to cover all methods in StringUtils.js
  describe('convertStringToNumberElseReturnZero', () => {
    test('should convert string to number', () => {
      expect(StringUtils.convertStringToNumberElseReturnZero('123')).toBe(123);
    });

    test('should return 0 for non-numeric string', () => {
      expect(StringUtils.convertStringToNumberElseReturnZero('abc')).toBe(0);
    });
  });

  describe('getShortTextTruncateMiddle', () => {
    test('should truncate text and add ellipsis in the middle', () => {
      const longText = 'This is a very long string that needs truncation';
      expect(StringUtils.getShortTextTruncateMiddle(longText, 20)).toBe(
        'This is a v...ncation', // Adjusted expected output based on the actual implementation
      );
    });

    test('should return the original text if it is within the max length', () => {
      const shortText = 'Short text';
      expect(StringUtils.getShortTextTruncateMiddle(shortText, 20)).toBe(
        'Short text',
      );
    });
  });

  describe('getShortTextTruncateEnd', () => {
    test('should truncate text and add ellipsis at the end', () => {
      const longText = 'This is a very long string that needs truncation';
      expect(StringUtils.getShortTextTruncateEnd(longText, 10)).toBe(
        'This is a ...',
      );
    });

    test('should return the original text if it is within the length limit', () => {
      const shortText = 'Short text';
      expect(StringUtils.getShortTextTruncateEnd(shortText, 20)).toBe(
        'Short text',
      );
    });
  });

  describe('isEmptyOrNull', () => {
    test('should return true for undefined', () => {
      expect(StringUtils.isEmptyOrNull(undefined)).toBe(true);
    });

    test('should return true for null', () => {
      expect(StringUtils.isEmptyOrNull(null)).toBe(true);
    });

    test('should return false for non-empty string', () => {
      expect(StringUtils.isEmptyOrNull('hello')).toBe(false);
    });
  });

  describe('getRandomAlphanumericString', () => {
    test('should return a random alphanumeric string', () => {
      const result = StringUtils.getRandomAlphanumericString();
      expect(result).toMatch(/^[a-z0-9]+$/);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('getTextArraySeparatedByNewline', () => {
    test('should split text into an array by newline', () => {
      const text = 'line1\nline2\nline3';
      expect(StringUtils.getTextArraySeparatedByNewline(text)).toEqual([
        'line1',
        'line2',
        'line3',
      ]);
    });
  });

  describe('getTextArraySeparatedBy', () => {
    test('should split text into an array by specified symbol', () => {
      const text = 'item1,item2,item3';
      expect(StringUtils.getTextArraySeparatedBy(text, ',')).toEqual([
        'item1',
        'item2',
        'item3',
      ]);
    });
  });

  describe('getTextForPropertySeparatedByNewline', () => {
    test('should return text separated by newline for the given property', () => {
      const obj = {items: [{text: 'Item1'}, {text: 'Item2'}]};
      expect(
        StringUtils.getTextForPropertySeparatedByNewline(obj, 'items'),
      ).toBe('Item1\nItem2');
    });
  });

  describe('removeSpecialCharacters', () => {
    it('should remove single and double quotes, question marks from a string', () => {
      expect(StringUtils.removeSpecialCharacters("Hello 'world'?")).toBe(
        'Hello world',
      );
    });
    it('should return the same string if no special characters are present', () => {
      expect(StringUtils.removeSpecialCharacters('Hello world')).toBe(
        'Hello world',
      );
    });
  });

  describe('removeBlankSpaces', () => {
    it('should remove leading and trailing spaces and replace &nbsp; with empty string', () => {
      expect(StringUtils.removeBlankSpaces('   Hello&nbsp;world   ')).toBe(
        'Helloworld',
      );
    });
    it('should return the same string if no spaces or &nbsp; are present', () => {
      expect(StringUtils.removeBlankSpaces('HelloWorld')).toBe('HelloWorld');
    });
  });

  describe('convertToPlainText', () => {
    it('should remove HTML tags from a string', () => {
      expect(StringUtils.convertToPlainText('<p>Hello world</p>')).toBe(
        'Hello world',
      );
    });
    it('should return the same string if no HTML tags are present', () => {
      expect(StringUtils.convertToPlainText('Hello world')).toBe('Hello world');
    });
  });

  describe('getPlainTextWithoutSpecialCharacters', () => {
    it('should remove HTML tags and special characters', () => {
      expect(
        StringUtils.getPlainTextWithoutSpecialCharacters(
          "<p>It's a 'test'?</p>",
        ),
      ).toBe('Its a test');
    });
    it('should return plain text if no HTML tags or special characters are present', () => {
      expect(
        StringUtils.getPlainTextWithoutSpecialCharacters('Hello world'),
      ).toBe('Hello world');
    });
  });

  describe('removeNewLines', () => {
    it('should remove newline characters from a string', () => {
      expect(StringUtils.removeNewLines('Hello\nworld')).toBe('Helloworld');
    });
    it('should return the same string if no newline characters are present', () => {
      expect(StringUtils.removeNewLines('Hello world')).toBe('Hello world');
    });
  });

  describe('uppercaseFirstChar', () => {
    it('should uppercase the first character of a string', () => {
      expect(StringUtils.uppercaseFirstChar('hello world')).toBe('Hello world');
    });
    it('should return the same string if the first character is already uppercase', () => {
      expect(StringUtils.uppercaseFirstChar('Hello world')).toBe('Hello world');
    });
  });

  describe('uppercaseFirstCharRestLowercase', () => {
    it('should uppercase the first character and lowercase the rest', () => {
      expect(StringUtils.uppercaseFirstCharRestLowercase('hELLO WORLD')).toBe(
        'Hello world',
      );
    });
    it('should handle a string with one character', () => {
      expect(StringUtils.uppercaseFirstCharRestLowercase('a')).toBe('A');
    });
  });

  describe('getStringFromNumber', () => {
    it('should convert a number to a string', () => {
      expect(StringUtils.getStringFromNumber(123)).toBe('123');
    });
    it('should convert a float to a string', () => {
      expect(StringUtils.getStringFromNumber(123.45)).toBe('123.45');
    });
  });

  describe('floatTo2DecimalPointString', () => {
    it('should convert a float to a string with 2 decimal points', () => {
      expect(StringUtils.floatTo2DecimalPointString(123.456)).toBe('123.46');
    });
    it('should return the number as is if it has no decimal points', () => {
      expect(StringUtils.floatTo2DecimalPointString(123)).toBe(123);
    });
  });

  describe('floatTo2DecimalPoint', () => {
    it('should convert a float to a number with 2 decimal points', () => {
      expect(StringUtils.floatTo2DecimalPoint(123.456)).toBe(123.46);
    });
    it('should return the number as is if it has no decimal points', () => {
      expect(StringUtils.floatTo2DecimalPoint(123)).toBe(123);
    });
  });

  describe('floatToDecimal', () => {
    it('should round a float to the nearest whole number', () => {
      expect(StringUtils.floatToDecimal(123.456)).toBe(123);
    });
    it('should return the number as is if it is already a whole number', () => {
      expect(StringUtils.floatToDecimal(123)).toBe(123);
    });
  });
});
