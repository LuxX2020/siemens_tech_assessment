import { DataType, Variable, createVariable, isSupportedDataType } from '../types';

/**
 * 解析VAR...END_VAR格式的文本
 */
export function parseVariableText(text: string): Variable[] {
  const lines = text.split('\n');
  const variables: Variable[] = [];
  let index = 1;

  for (const line of lines) {
    const trimmedLine = line.trim();

    // 跳过空行和注释行
    if (!trimmedLine || trimmedLine.startsWith('//')) {
      continue;
    }

    // 跳过VAR和END_VAR标记
    if (trimmedLine === 'VAR' || trimmedLine === 'END_VAR') {
      continue;
    }

    // 解析变量定义
    const variable = parseVariableLine(trimmedLine, index);
    if (variable) {
      variables.push(variable);
      index++;
    }
  }

  return variables;
}

/**
 * 解析单行变量定义
 */
function parseVariableLine(line: string, index: number): Variable | null {
  // 匹配格式: name : type [:= defaultValue] [// comment]
  const regex = /^([a-zA-Z_0-9_][a-zA-Z0-9_]*)\s*:\s*([a-zA-Z]+)(?:\s*:=\s*([^/]+))?(?:\s*\/\/\s*(.+))?$/;
  const match = line.match(regex);

  if (!match) {
    throw new Error(`Format error, cannot parse: ${line}`);
  }

  const [, name, typeStr, defaultValueStr, comment] = match;

  // 验证数据类型
  const dataType = typeStr.toUpperCase();
  if (!isSupportedDataType(dataType)) {
    throw new Error(`Unsupported data type: ${typeStr}`);
  }

  // 处理默认值
  let defaultValue = defaultValueStr ? defaultValueStr.trim() : '';
  if (!defaultValue) {
    // 如果没有默认值，使用数据类型的默认值
    defaultValue = dataType === DataType.BOOL ? 'TRUE' : '0';
  }

  // 格式化BOOL值
  if (dataType === DataType.BOOL && defaultValue) {
    defaultValue = defaultValue.toUpperCase();
  }

  return createVariable(index, {
    name: name.trim(),
    dataType,
    defaultValue,
    comment: comment ? comment.trim() : '',
  });
}

/**
 * 生成VAR...END_VAR格式的文本
 */
export function generateVariableText(variables: Variable[]): string {
  if (variables.length === 0) {
    return 'VAR\nEND_VAR';
  }

  const lines = ['VAR'];

  for (const variable of variables) {
    let line = `  ${variable.name} : ${variable.dataType}`;

    // 添加默认值（如果有）
    if (variable.defaultValue) {
      console.log(variable.defaultValue);
      line += ` := ${variable.defaultValue}`;
    }

    // 添加注释（如果有）
    if (variable.comment) {
      line += ` // ${variable.comment}`;
    }

    lines.push(line);
  }

  lines.push('END_VAR');
  return lines.join('\n');
}