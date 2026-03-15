/**
 * 数据类型枚举
 */
export enum DataType {
  BOOL = 'BOOL',
  INT = 'INT',
}

/**
 * 变量接口定义
 */
export interface Variable {
  /** 索引，自动生成，只读 */
  index: number;
  /** 变量名称，大小写不敏感唯一 */
  name: string;
  /** 数据类型 */
  dataType: DataType;
  /** 默认值 */
  defaultValue: string;
  /** 注释，可选 */
  comment: string;
}

/**
 * 变量表单数据（用于编辑）
 */
export interface VariableFormData {
  name: string;
  dataType: DataType;
  defaultValue: string;
  comment: string;
}

/**
 * 创建新的变量对象
 */
export function createVariable(
  index: number,
  formData: Partial<VariableFormData> = {}
): Variable {
  const dataType = formData.dataType || DataType.BOOL;
  const defaultValue = formData.defaultValue || (dataType === DataType.BOOL ? 'TRUE' : '0');

  return {
    index,
    name: formData.name || '',
    dataType,
    defaultValue,
    comment: formData.comment || '',
  };
}

/**
 * 检查数据类型是否支持
 */
export function isSupportedDataType(type: string): type is DataType {
  return Object.values(DataType).includes(type as DataType);
}

/**
 * 获取数据类型的默认值
 */
export function getDefaultValueForDataType(dataType: DataType): string {
  switch (dataType) {
    case DataType.BOOL:
      return 'TRUE';
    case DataType.INT:
      return '0';
    default:
      return '';
  }
}