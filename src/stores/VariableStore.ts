import { makeAutoObservable, runInAction } from 'mobx';
import { Variable, DataType, createVariable, getDefaultValueForDataType } from '../types';
import { validateVariable } from '../utils/validation';
import { parseVariableText, generateVariableText } from '../utils/parser';

export class VariableStore {
  variables: Variable[] = [];
  selectedRowKeys: number[] = [];
  errorMessage: string = '';
  successMessage: string = '';

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * 获取选中的变量
   */
  get selectedVariables(): Variable[] {
    return this.variables.filter(v => this.selectedRowKeys.includes(v.index));
  }

  /**
   * 添加新变量
   */
  addVariable(): void {
    const newIndex = this.variables.length > 0 ? Math.max(...this.variables.map(v => v.index)) + 1 : 1;
    const newVariable = createVariable(newIndex);

    runInAction(() => {
      this.variables = [...this.variables, newVariable];
      this.clearMessages();
    });
  }

  /**
   * 删除选中的变量
   */
  deleteSelectedVariables(): void {
    if (this.selectedRowKeys.length === 0) {
      this.setErrorMessage('Please select at least one row to delete');
      return;
    }

    runInAction(() => {
      // 过滤掉选中的变量
      this.variables = this.variables.filter(v => !this.selectedRowKeys.includes(v.index));

      // 重新计算索引
      this.reindexVariables();

      // 清空选中状态
      this.selectedRowKeys = [];
      this.clearMessages();
    });
  }

  /**
   * 更新变量
   */
  updateVariable(index: number, updates: Partial<Variable>): boolean {
    const variableIndex = this.variables.findIndex(v => v.index === index);
    if (variableIndex === -1) {
      this.setErrorMessage(`Variable with index ${index} not found`);
      return false;
    }

    const variable = this.variables[variableIndex];
    const updatedVariable = { ...variable, ...updates };

    // 验证更新后的变量
    const validation = validateVariable(updatedVariable, this.variables, variableIndex);
    if (!validation.isValid) {
      this.setErrorMessage(validation.message || 'Validation failed');
      return false;
    }

    runInAction(() => {
      this.variables[variableIndex] = updatedVariable;
      this.clearMessages();
    });

    return true;
  }

  /**
   * 更新变量名称
   */
  updateVariableName(index: number, name: string): boolean {
    return this.updateVariable(index, { name });
  }

  /**
   * 更新变量数据类型
   */
  updateVariableDataType(index: number, dataType: DataType): boolean {
    const variable = this.variables.find(v => v.index === index);
    if (!variable) {
      this.setErrorMessage(`Variable with index ${index} not found`);
      return false;
    }

    // 如果数据类型改变，重置默认值
    if (variable.dataType !== dataType) {
      const defaultValue = getDefaultValueForDataType(dataType);
      return this.updateVariable(index, { dataType, defaultValue });
    }

    return true;
  }

  /**
   * 更新变量默认值
   */
  updateVariableDefaultValue(index: number, defaultValue: string): boolean {
    return this.updateVariable(index, { defaultValue });
  }

  /**
   * 更新变量注释
   */
  updateVariableComment(index: number, comment: string): boolean {
    return this.updateVariable(index, { comment });
  }

  /**
   * 设置选中行
   */
  setSelectedRowKeys(keys: number[]): void {
    runInAction(() => {
      this.selectedRowKeys = keys;
    });
  }

  /**
   * 从文本导入变量
   */
  importFromText(text: string): boolean {
    try {
      const importVariables = parseVariableText(text);
      const newVariables = [ ...this.variables ];
      for (const importVariable of importVariables) {
        const varibleExist = this.variables.find(v => v.name === importVariable.name);
        if (!varibleExist) {
          newVariables.push(importVariable);
        } else {
          newVariables[this.variables.indexOf(varibleExist)] = importVariable;
        }
      }

      runInAction(() => {
        this.variables = newVariables;
        this.selectedRowKeys = [];
        this.clearMessages();
        this.setSuccessMessage('Import successful');
      });

      return true;
    } catch (error) {
      this.setErrorMessage(error instanceof Error ? error.message : 'Import failed');
      return false;
    }
  }

  /**
   * 导出变量为文本
   */
  exportToText(): string {
    return generateVariableText(this.variables);
  }

  /**
   * 设置错误消息
   */
  setErrorMessage(message: string): void {
    runInAction(() => {
      this.errorMessage = message;
      this.successMessage = '';
    });
  }

  /**
   * 设置成功消息
   */
  setSuccessMessage(message: string): void {
    runInAction(() => {
      this.successMessage = message;
      this.errorMessage = '';
    });
  }

  /**
   * 清空消息
   */
  clearMessages(): void {
    runInAction(() => {
      this.errorMessage = '';
      this.successMessage = '';
    });
  }

  /**
   * 重新计算变量index
   */
  private reindexVariables(): void {
    this.variables.forEach((variable, index) => {
      variable.index = index + 1;
    });
  }
}