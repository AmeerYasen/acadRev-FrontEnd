# Translation System Guide

## Overview
This project uses i18next with React for internationalization. The translation system is organized into multiple namespaces for better organization and maintainability.

## File Structure
```
public/locales/
├── en/
│   ├── common.json           # Common UI elements, buttons, status, etc.
│   ├── pages.json            # All page-specific translations
│   ├── components.json       # All component-specific translations
│   ├── dashboard.json        # Individual page namespace (example)
│   └── [namespace].json      # Individual component/page namespaces
└── ar/
    ├── common.json
    ├── pages.json
    ├── components.json
    ├── dashboard.json
    └── [namespace].json
```

## Namespace Organization

### 1. Common (`common.json`)
Contains frequently used UI elements:
- `buttons`: Save, Cancel, Edit, Delete, etc.
- `status`: Active, Inactive, Pending, etc.
- `navigation`: Home, Dashboard, Settings, etc.
- `forms`: Validation messages, placeholders
- `messages`: Success, error, confirmation messages
- `time`: Time-related terms

### 2. Pages (`pages.json`)
Contains all page-specific translations organized by page:
- `login`: Login page translations
- `settings`: Settings page translations
- `profile`: Profile page translations
- `college`: College management translations
- `department`: Department management translations
- `programs`: Program management translations
- `university`: University management translations
- `users`: User management translations
- `qualitative`: Qualitative assessment translations
- `quantitative`: Quantitative assessment translations
- `results`: Results page translations
- `report`: Reports page translations
- `pageNotFound`: 404 page translations

### 3. Components (`components.json`)
Contains all component-specific translations:
- `header`: Header component translations
- `navbar`: Navigation bar translations
- `footer`: Footer component translations
- `dashboard`: Dashboard component translations
- `languageSwitcher`: Language switcher translations
- `loadingSpinner`: Loading spinner translations
- `notificationBar`: Notification bar translations
- `toast`: Toast notification translations
- `ui`: UI component translations (badge, button, card, etc.)
- `forms`: Form-related translations
- `tables`: Table component translations
- `modals`: Modal dialog translations

### 4. Individual Namespaces
For larger components or pages, you can create individual namespace files:
- `dashboard.json`: Dedicated dashboard translations
- `header.json`: Dedicated header translations
- etc.

## Usage Examples

### Using the Custom Hook
```jsx
import useNamespacedTranslation from '../../hooks/useNamespacedTranslation';

const MyComponent = () => {
  const { 
    translateSettings, 
    translateButton, 
    translateStatus,
    changeLanguage,
    currentLanguage,
    isRTL 
  } = useNamespacedTranslation();

  return (
    <div>
      <h1>{translateSettings('title')}</h1>
      <button>{translateButton('save')}</button>
      <span>{translateStatus('active')}</span>
    </div>
  );
};
```

### Using Standard i18next Hook
```jsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t: tPages } = useTranslation('pages');
  const { t: tCommon } = useTranslation('common');
  
  return (
    <div>
      <h1>{tPages('settings.title')}</h1>
      <button>{tCommon('common.buttons.save')}</button>
    </div>
  );
};
```

### Using Multiple Namespaces
```jsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation(['dashboard', 'common', 'components']);
  
  return (
    <div>
      <h1>{t('welcome')}</h1> {/* from dashboard namespace */}
      <button>{t('common:common.buttons.save')}</button> {/* from common namespace */}
      <div>{t('components:header.title')}</div> {/* from components namespace */}
    </div>
  );
};
```

## Adding New Translations

### 1. For a New Page
1. Add translations to `pages.json` under a new key (e.g., `newPage`)
2. Update the `useNamespacedTranslation` hook to include a helper function
3. Optionally create a dedicated namespace file `newPage.json`

### 2. For a New Component
1. Add translations to `components.json` under a new key (e.g., `newComponent`)
2. Update the `useNamespacedTranslation` hook to include a helper function
3. Optionally create a dedicated namespace file `newComponent.json`

### 3. For Common Elements
Add to the appropriate section in `common.json`:
- Buttons → `common.buttons`
- Status → `common.status`
- Forms → `common.forms`
- Messages → `common.messages`

## Translation Key Naming Conventions

### Hierarchical Structure
Use dot notation for nested translations:
```json
{
  "settings": {
    "title": "Settings",
    "tabs": {
      "language": "Language",
      "account": "Account"
    }
  }
}
```

### Naming Patterns
- Use camelCase for keys
- Use descriptive names
- Group related translations
- Keep consistent naming across languages

### Examples
```json
{
  "buttons": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete"
  },
  "forms": {
    "validation": {
      "required": "This field is required",
      "email": "Invalid email format"
    }
  }
}
```

## Language Support

### Currently Supported
- English (en) - LTR
- Arabic (ar) - RTL

### Adding a New Language
1. Create new folder in `public/locales/[lang-code]/`
2. Copy all JSON files from existing language
3. Translate all content
4. Update `src/i18n/index.js` to include new language in `supportedLngs`
5. Update language selector components

## Best Practices

### 1. Namespace Organization
- Keep related translations together
- Use appropriate namespace for content
- Avoid deep nesting (max 3 levels)

### 2. Translation Keys
- Use descriptive, self-documenting keys
- Maintain consistency across languages
- Avoid hardcoded strings in components

### 3. Pluralization
Use i18next pluralization features:
```json
{
  "item": "item",
  "item_other": "items"
}
```

### 4. Interpolation
Support dynamic content:
```json
{
  "welcome": "Welcome, {{name}}!"
}
```

### 5. RTL Support
- Test all layouts in Arabic
- Use logical CSS properties (margin-inline-start vs margin-left)
- Ensure icons and layouts work in RTL

## Development Workflow

### 1. Adding Translations
1. Identify the appropriate namespace
2. Add English translation first
3. Add Arabic translation
4. Update component to use translation
5. Test in both languages

### 2. Testing
1. Switch between languages
2. Check layout in RTL mode
3. Verify all text is translated
4. Test with longer/shorter text

### 3. Maintenance
1. Keep translation files synchronized
2. Review translations with native speakers
3. Update documentation when adding new namespaces
4. Use translation validation tools if available

## File Templates

### New Page Translation Template
```json
{
  "title": "Page Title",
  "subtitle": "Page Subtitle",
  "description": "Page Description",
  "actions": {
    "add": "Add Item",
    "edit": "Edit Item",
    "delete": "Delete Item"
  },
  "forms": {
    "labels": {
      "name": "Name",
      "description": "Description"
    },
    "placeholders": {
      "enterName": "Enter name",
      "enterDescription": "Enter description"
    }
  },
  "messages": {
    "success": "Operation successful",
    "error": "Operation failed"
  }
}
```

### New Component Translation Template
```json
{
  "title": "Component Title",
  "actions": {
    "action1": "Action 1",
    "action2": "Action 2"
  },
  "labels": {
    "label1": "Label 1",
    "label2": "Label 2"
  },
  "messages": {
    "loading": "Loading...",
    "error": "Error occurred",
    "success": "Success"
  }
}
```
