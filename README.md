# PLC Variable Table Editor

A React-based application for managing and editing PLC variable definitions with visual editing, data validation, and standard format import/export.

## Features

- **Visual Table Editing**: Add, delete, and edit variables in a user-friendly table interface
- **Automatic Index Management**: Index column is automatically maintained and renumbered
- **Data Validation**:
  - Supported data types: `BOOL`, `INT`
  - Name uniqueness validation (case-insensitive)
  - INT range validation (-2147483648 to 2147483647)
- **Smart Data Type Switching**: Automatically resets default values when changing data types
- **Import/Export**: Support for standard PLC variable definition format (VAR...END_VAR)
- **Real-time Validation**: Immediate feedback on input errors

## Technology Stack

- React 19.2.4 + TypeScript 4.9.5
- Ant Design 6.3.2 (UI Component Library)
- MobX 6.15.0 + mobx-react-lite 4.1.1 (State Management)
- Less + craco-less (Styling)
- React Testing Library (Testing)

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

## Usage

### Adding Variables
1. Click the "Add Row" button to add a new variable
2. The Index column is automatically assigned
3. Edit the Name, Data Type, Default Value, and Comment columns

### Editing Variables
1. Click on any cell to enter edit mode
2. Press Enter or click outside to save changes
3. Real-time validation provides immediate feedback

### Data Types
- **BOOL**: Accepts TRUE or FALSE (case-insensitive)
- **INT**: Accepts integers between -2147483648 and 2147483647

### Import/Export
1. **Import**: Paste VAR...END_VAR formatted text and click "Import"
2. **Export**: Click "Export" to generate formatted text from current table data

### Format Example
```
VAR
  counter : INT := 42 // This is a counter
  flag : BOOL := TRUE
END_VAR
```

## Testing

The application includes comprehensive test coverage for:
- Utility functions (validation, parsing)
- MobX stores (state management)
- React components (UI interactions)

Run tests with:
```bash
npm test
```

## Project Structure

```
src/
├── components/           # React components
│   ├── VariableTable/   # Main table component
│   ├── TableToolbar/    # Table action buttons
│   └── ImportExportPanel/ # Import/export interface
├── stores/              # MobX stores
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── styles/              # Less stylesheets
└── tests/               # Test files
```

## Test Coverage

The implementation covers all 25 test cases from TEST.md:

1. **Table Display** (5 test cases)
2. **Add/Delete Rows** (4 test cases)
3. **Variable Name Editing** (3 test cases)
4. **Data Type and Default Value** (7 test cases)
5. **Comment Editing** (2 test cases)
6. **Import Function** (5 test cases)
7. **Export Function** (2 test cases)

## Development Notes

- Uses MobX for reactive state management
- Implements custom editable cells for the Ant Design Table
- Includes real-time validation with user feedback
- Supports standard PLC variable format for interoperability

## License

This project is created for technical assessment purposes.
