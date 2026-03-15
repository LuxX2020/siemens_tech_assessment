import { 
  DataType,  
  validateVariableName,
  validateBoolValue,
  validateIntValue,
  validateDefaultValue,
  formatBoolValue 
} from '../../types';

describe('Validation Utilities', () => {
  describe('validateVariableName', () => {
    test('should reject empty name', () => {
      const result = validateVariableName('', ['existing']);
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('cannot be empty');
    });

    test('should reject duplicate name (case insensitive)', () => {
      const result = validateVariableName('Counter', ['counter', 'other']);
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('already exists');
    });

    test('should allow unique name', () => {
      const result = validateVariableName('newVar', ['existing']);
      expect(result.isValid).toBe(true);
    });

    test('should allow same name for current row', () => {
      const result = validateVariableName('counter', ['counter', 'other'], 0);
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateBoolValue', () => {
    test('should accept TRUE (case insensitive)', () => {
      expect(validateBoolValue('TRUE').isValid).toBe(true);
      expect(validateBoolValue('true').isValid).toBe(true);
      expect(validateBoolValue('True').isValid).toBe(true);
    });

    test('should accept FALSE (case insensitive)', () => {
      expect(validateBoolValue('FALSE').isValid).toBe(true);
      expect(validateBoolValue('false').isValid).toBe(true);
      expect(validateBoolValue('False').isValid).toBe(true);
    });

    test('should reject invalid bool values', () => {
      expect(validateBoolValue('yes').isValid).toBe(false);
      expect(validateBoolValue('1').isValid).toBe(false);
      expect(validateBoolValue('0').isValid).toBe(false);
      expect(validateBoolValue('on').isValid).toBe(false);
    });
  });

  describe('validateIntValue', () => {
    test('should accept valid integers', () => {
      expect(validateIntValue('0').isValid).toBe(true);
      expect(validateIntValue('42').isValid).toBe(true);
      expect(validateIntValue('-100').isValid).toBe(true);
      expect(validateIntValue('2147483647').isValid).toBe(true);
      expect(validateIntValue('-2147483648').isValid).toBe(true);
    });

    test('should reject non-integers', () => {
      expect(validateIntValue('3.14').isValid).toBe(false);
      expect(validateIntValue('abc').isValid).toBe(false);
      expect(validateIntValue('12.0').isValid).toBe(false);
    });

    test('should reject out of range integers', () => {
      expect(validateIntValue('9999999999').isValid).toBe(false);
      expect(validateIntValue('-9999999999').isValid).toBe(false);
    });
  });

  describe('validateDefaultValue', () => {
    test('should validate BOOL values', () => {
      expect(validateDefaultValue('TRUE', DataType.BOOL).isValid).toBe(true);
      expect(validateDefaultValue('false', DataType.BOOL).isValid).toBe(true);
      expect(validateDefaultValue('yes', DataType.BOOL).isValid).toBe(false);
    });

    test('should validate INT values', () => {
      expect(validateDefaultValue('42', DataType.INT).isValid).toBe(true);
      expect(validateDefaultValue('3.14', DataType.INT).isValid).toBe(false);
      expect(validateDefaultValue('9999999999', DataType.INT).isValid).toBe(false);
    });
  });

  describe('formatBoolValue', () => {
    test('should format bool values to uppercase', () => {
      expect(formatBoolValue('true')).toBe('TRUE');
      expect(formatBoolValue('FALSE')).toBe('FALSE');
      expect(formatBoolValue('True')).toBe('TRUE');
      expect(formatBoolValue('false')).toBe('FALSE');
    });

    test('should return original value for invalid bool', () => {
      expect(formatBoolValue('yes')).toBe('yes');
      expect(formatBoolValue('1')).toBe('1');
    });
  });
});