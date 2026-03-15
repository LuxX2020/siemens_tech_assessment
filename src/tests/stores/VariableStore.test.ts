import { VariableStore } from '../../stores/VariableStore';
import { DataType } from '../../types';

describe('VariableStore', () => {
  let store: VariableStore;

  beforeEach(() => {
    store = new VariableStore();
  });

  describe('initial state', () => {
    test('should have empty variables array', () => {
      expect(store.variables).toHaveLength(0);
    });

    test('should have empty selected row keys', () => {
      expect(store.selectedRowKeys).toHaveLength(0);
    });

    test('should have empty messages', () => {
      expect(store.errorMessage).toBe('');
      expect(store.successMessage).toBe('');
    });
  });

  describe('addVariable', () => {
    test('should add variable to empty store', () => {
      store.addVariable();

      expect(store.variables).toHaveLength(1);
      expect(store.variables[0].index).toBe(1);
      expect(store.variables[0].name).toBe('');
      expect(store.variables[0].dataType).toBe(DataType.BOOL);
      expect(store.variables[0].defaultValue).toBe('TRUE');
    });

    test('should add variable with auto-increment index', () => {
      // 添加第一个变量
      store.addVariable();
      expect(store.variables[0].index).toBe(1);

      // 添加第二个变量
      store.addVariable();
      expect(store.variables[1].index).toBe(2);
    });
  });

  describe('deleteSelectedVariables', () => {
    beforeEach(() => {
      // 添加3个变量
      store.addVariable();
      store.addVariable();
      store.addVariable();
    });

    test('should delete selected variables', () => {
      store.setSelectedRowKeys([2]); // 选中第二个变量
      store.deleteSelectedVariables();

      expect(store.variables).toHaveLength(2);
      expect(store.variables.map(v => v.index)).toEqual([1, 2]);
      expect(store.selectedRowKeys).toHaveLength(0);
    });

    test('should reindex variables after deletion', () => {
      store.setSelectedRowKeys([1, 3]); // 选中第一个和第三个变量
      store.deleteSelectedVariables();

      expect(store.variables).toHaveLength(1);
      expect(store.variables[0].index).toBe(1);
    });

    test('should show error when no rows selected', () => {
      store.deleteSelectedVariables();

      expect(store.errorMessage).toBe('Please select at least one row to delete');
      expect(store.variables).toHaveLength(3); // 变量未被删除
    });
  });

  describe('updateVariable', () => {
    beforeEach(() => {
      store.addVariable();
    });

    test('should update variable successfully', () => {
      const success = store.updateVariable(1, { name: 'counter', dataType: DataType.INT, defaultValue: '42' });

      expect(success).toBe(true);
      expect(store.variables[0].name).toBe('counter');
      expect(store.variables[0].dataType).toBe(DataType.INT);
      expect(store.variables[0].defaultValue).toBe('42');
    });

    test('should reject duplicate names', () => {
      // 添加第二个变量
      store.addVariable();
      store.updateVariable(2, { name: 'var1' });

      // 尝试将第一个变量重命名为相同的名称
      const success = store.updateVariable(1, { name: 'var1' });

      expect(success).toBe(false);
      expect(store.errorMessage).toContain('already exists');
    });

    test('should reject invalid default value', () => {
      // 首先设置变量名称
      store.updateVariable(1, { name: 'testVar', dataType: DataType.INT, defaultValue: '42' });

      // 然后尝试设置无效的默认值
      const success = store.updateVariable(1, { defaultValue: 'not-a-number' });

      expect(success).toBe(false);
      expect(store.errorMessage).toContain('must be an integer');
    });
  });

  describe('updateVariableDataType', () => {
    beforeEach(() => {
      store.addVariable();
      // 设置变量名称
      store.updateVariable(1, { name: 'testVar' });
    });

    test('should update data type and reset default value', () => {
      store.updateVariableDataType(1, DataType.INT);

      expect(store.variables[0].dataType).toBe(DataType.INT);
      expect(store.variables[0].defaultValue).toBe('0');
    });

    test('should not reset default value when type unchanged', () => {
      store.updateVariable(1, { defaultValue: 'FALSE' });
      store.updateVariableDataType(1, DataType.BOOL);

      expect(store.variables[0].defaultValue).toBe('FALSE');
    });
  });

  describe('importFromText', () => {
    test('should import variables from valid text', () => {
      const text = `VAR
  counter : INT := 42 // Counter variable
  flag : BOOL := TRUE
END_VAR`;

      const success = store.importFromText(text);

      expect(success).toBe(true);
      expect(store.variables).toHaveLength(2);
      expect(store.successMessage).toBe('Import successful');
    });

    test('should handle import error', () => {
      const text = `VAR
  invalid line
END_VAR`;

      const success = store.importFromText(text);

      expect(success).toBe(false);
      expect(store.errorMessage).toContain('Format error');
      expect(store.variables).toHaveLength(0);
    });
  });

  describe('exportToText', () => {
    test('should export variables to text', () => {
      store.addVariable();
      store.updateVariable(1, { name: 'counter', dataType: DataType.INT, defaultValue: '42', comment: 'Test' });

      const text = store.exportToText();

      expect(text).toContain('VAR');
      expect(text).toContain('counter : INT := 42 // Test');
      expect(text).toContain('END_VAR');
    });

    test('should handle empty variables', () => {
      const text = store.exportToText();
      expect(text).toBe('VAR\nEND_VAR');
    });
  });

});