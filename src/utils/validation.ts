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
