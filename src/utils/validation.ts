import { Variable, ValidationResult, validateVariableName, validateDefaultValue } from '../types';

/**
 * 验证变量对象
 */
export function validateVariable(
  variable: Variable,
  existingVariables: Variable[],
  currentIndex?: number
): ValidationResult {
  // 验证名称
  const existingNames = existingVariables.map(v => v.name);
  const nameValidation = validateVariableName(variable.name, existingNames, currentIndex);
  if (!nameValidation.isValid) {
    return nameValidation;
  }

  // 验证默认值
  const defaultValueValidation = validateDefaultValue(variable.defaultValue, variable.dataType);
  if (!defaultValueValidation.isValid) {
    return defaultValueValidation;
  }

  return { isValid: true };
}

/**
 * 验证变量名称（重新导出）
 */
export { validateVariableName } from '../types/validation';

/**
 * 验证默认值（重新导出）
 */
export { validateDefaultValue, validateBoolValue, validateIntValue } from '../types/validation';

/**
 * 格式化值（重新导出）
 */
export { formatBoolValue, formatIntValue } from '../types/validation';