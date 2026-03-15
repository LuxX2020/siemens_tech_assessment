import { parseVariableText, generateVariableText } from '../../utils/parser';
import { DataType } from '../../types';
/**
 * 验证导入文本格式
 */
function validateImportText(text: string): boolean {
  try {
    parseVariableText(text);
    return true;
  } catch {
    return false;
  }
}
describe('Parser Utilities', () => {
  describe('parseVariableText', () => {
    test('should parse standard VAR...END_VAR format', () => {
      const text = `VAR
  counter : INT := 42 // This is a counter
  flag : BOOL := TRUE
END_VAR`;

      const variables = parseVariableText(text);

      expect(variables).toHaveLength(2);
      expect(variables[0]).toEqual({
        index: 1,
        name: 'counter',
        dataType: DataType.INT,
        defaultValue: '42',
        comment: 'This is a counter',
      });
      expect(variables[1]).toEqual({
        index: 2,
        name: 'flag',
        dataType: DataType.BOOL,
        defaultValue: 'TRUE',
        comment: '',
      });
    });

    test('should handle type case insensitivity', () => {
      const text = `VAR
  var1 : bool := true
  var2 : Int := 100
END_VAR`;

      const variables = parseVariableText(text);

      expect(variables[0].dataType).toBe(DataType.BOOL);
      expect(variables[0].defaultValue).toBe('TRUE');
      expect(variables[1].dataType).toBe(DataType.INT);
    });

    test('should auto-fill default value when missing', () => {
      const text = `VAR
  flag : BOOL
  counter : INT
END_VAR`;

      const variables = parseVariableText(text);

      expect(variables[0].defaultValue).toBe('TRUE');
      expect(variables[1].defaultValue).toBe('0');
    });

    test('should throw error for unsupported data type', () => {
      const text = `VAR
  text : STRING := "hello"
END_VAR`;

      expect(() => parseVariableText(text)).toThrow('Unsupported data type: STRING');
    });

    test('should throw error for format error', () => {
      const text = `VAR
  invalid line
END_VAR`;

      expect(() => parseVariableText(text)).toThrow('Format error, cannot parse: invalid line');
    });
  });

  describe('generateVariableText', () => {
    test('should generate standard VAR...END_VAR format', () => {
      const variables = [
        {
          index: 1,
          name: 'counter',
          dataType: DataType.INT,
          defaultValue: '42',
          comment: 'This is a counter',
        },
        {
          index: 2,
          name: 'flag',
          dataType: DataType.BOOL,
          defaultValue: 'TRUE',
          comment: '',
        },
      ];

      const text = generateVariableText(variables);

      expect(text).toBe(`VAR
  counter : INT := 42 // This is a counter;
  flag : BOOL := TRUE;
END_VAR`);
    });

    test('should handle variables without default values', () => {
      const variables = [
        {
          index: 1,
          name: 'flag',
          dataType: DataType.BOOL,
          defaultValue: '',
          comment: 'No default',
        },
      ];

      const text = generateVariableText(variables);

      expect(text).toBe(`VAR
  flag : BOOL // No default;
END_VAR`);
    });

    test('should handle empty variables array', () => {
      const text = generateVariableText([]);
      expect(text).toBe('VAR\nEND_VAR');
    });
  });

  describe('validateImportText', () => {
    test('should return true for valid text', () => {
      const text = `VAR
  counter : INT := 42
END_VAR`;

      expect(validateImportText(text)).toBe(true);
    });

    test('should return false for invalid text', () => {
      const text = `VAR
  invalid line
END_VAR`;

      expect(validateImportText(text)).toBe(false);
    });
  });
});