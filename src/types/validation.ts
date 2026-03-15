import { DataType } from './variable';

/**
 * 验证结果接口
 */
export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

/**
 * 验证变量名称
 */
export function validateVariableName(
  name: string,
  existingNames: string[],
  currentIndex?: number
): ValidationResult {
  // 检查是否为空
  if (!name.trim()) {
    return {
      isValid: false,
      message: 'Variable name cannot be empty',
    };
  }

  // 查找是否有相同的名称（大小写不敏感）
  const sameNames = existingNames.filter((nowName, index) => index !== currentIndex && name.toLowerCase() === nowName.toLowerCase());

  if (sameNames.length > 0) {
    return {
      isValid: false,
      message: `Variable name "${name}" already exists`,
    };
  }

  return { isValid: true };
}

/**
 * 验证BOOL类型默认值
 */
export function validateBoolValue(value: string): ValidationResult {
  const normalizedValue = value.trim().toUpperCase();

  if (normalizedValue === 'TRUE' || normalizedValue === 'FALSE') {
    return { isValid: true };
  }

  return {
    isValid: false,
    message: 'BOOL value must be TRUE or FALSE',
  };
}

/**
 * 验证INT类型默认值
 */
export function validateIntValue(value: string): ValidationResult {
  const trimmedValue = value.trim();

  // 检查是否为整数
  if (!/^-?\d+$/.test(trimmedValue)) {
    return {
      isValid: false,
      message: 'INT value must be an integer',
    };
  }

  return { isValid: true };
}

/**
 * 根据数据类型验证默认值
 */
export function validateDefaultValue(value: string, dataType: DataType): ValidationResult {
  switch (dataType) {
    case DataType.BOOL:
      return validateBoolValue(value);
    case DataType.INT:
      return validateIntValue(value);
    default:
      return {
        isValid: false,
        message: `Unsupported data type: ${dataType}`,
      };
  }
}

/**
 * 格式化BOOL值（统一为大写）
 */
export function formatBoolValue(value: string): string {
  const normalizedValue = value.trim().toUpperCase();
  return normalizedValue === 'TRUE' || normalizedValue === 'FALSE' ? normalizedValue : value;
}

/**
 * 格式化INT值
 */
export function formatIntValue(value: string | number): string {
  return String(value).trim();
}