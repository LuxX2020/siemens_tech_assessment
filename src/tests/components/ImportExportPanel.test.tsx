import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ImportExportPanel } from '../../components/ImportExportPanel';
import { VariableStore } from '../../stores';
import { DataType } from '../../types';

describe('ImportExportPanel Component', () => {
  let store: VariableStore;

  beforeEach(() => {
    store = new VariableStore();
  });

  test('should render import/export panel', () => {
    render(<ImportExportPanel store={store} />);

    expect(screen.getByText('Import/Export')).toBeInTheDocument();
    expect(screen.getByText('Import')).toBeInTheDocument();
    expect(screen.getByText('Export')).toBeInTheDocument();
    expect(screen.getByText('Clear')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Example:/)).toBeInTheDocument();
  });

  test('should handle import', async () => {
    const importText = `VAR
  counter : INT := 42 // Test counter
END_VAR`;

    render(<ImportExportPanel store={store} />);

    const textarea = screen.getByPlaceholderText(/Example:/);
    fireEvent.change(textarea, { target: { value: importText } });

    const importButton = screen.getByText('Import');
    fireEvent.click(importButton);

    await waitFor(() => {
      expect(store.variables).toHaveLength(1);
      expect(store.variables[0].name).toBe('counter');
      expect(store.variables[0].dataType).toBe('INT');
      expect(store.variables[0].defaultValue).toBe('42');
    });
  });

  test('should handle export', () => {
    store.addVariable();
    store.updateVariable(1, { name: 'testVar', dataType: DataType.BOOL, defaultValue: 'TRUE' });

    render(<ImportExportPanel store={store} />);

    const exportButton = screen.getByText('Export');
    fireEvent.click(exportButton);

    const textarea = screen.getByPlaceholderText(/Example:/) as HTMLTextAreaElement;
    expect(textarea.value).toContain('VAR');
    expect(textarea.value).toContain('testVar : BOOL := TRUE');
    expect(textarea.value).toContain('END_VAR');
  });

  test('should handle clear', () => {
    render(<ImportExportPanel store={store} />);

    const textarea = screen.getByPlaceholderText(/Example:/);
    fireEvent.change(textarea, { target: { value: 'test text' } });

    const clearButton = screen.getByText('Clear');
    fireEvent.click(clearButton);

    expect((textarea as HTMLTextAreaElement).value).toBe('');
  });

  test('should show error message on import failure', async () => {
    const invalidText = 'invalid format';

    render(<ImportExportPanel store={store} />);

    const textarea = screen.getByPlaceholderText(/Example:/);
    fireEvent.change(textarea, { target: { value: invalidText } });

    const importButton = screen.getByText('Import');
    fireEvent.click(importButton);

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText(/Format error/)).toBeInTheDocument();
    });
  });

  test('should show success message on export', () => {
    render(<ImportExportPanel store={store} />);

    const exportButton = screen.getByText('Export');
    fireEvent.click(exportButton);

    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('Export successful')).toBeInTheDocument();
  });

  test('should show error when importing empty text', () => {
    render(<ImportExportPanel store={store} />);

    const importButton = screen.getByText('Import');
    fireEvent.click(importButton);

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Please enter text to import')).toBeInTheDocument();
  });
});