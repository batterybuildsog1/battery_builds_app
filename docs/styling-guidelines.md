# Styling Guidelines and Conventions

## Introduction

This document outlines the official styling conventions and standards for our project. It serves as a comprehensive guide for maintaining consistent styling approaches across all components and features.

## Styling Approach Decision

After careful consideration of maintainability, developer experience, and performance, we have decided to adopt a hybrid approach with Tailwind CSS as our primary styling solution, while maintaining support for CSS Modules in specific cases.

### Primary: Tailwind CSS
- Use Tailwind CSS for all new components
- Leverage utility-first approach for rapid development
- Utilize Tailwind's built-in responsive design features

### Secondary: CSS Modules
- Reserved for complex, reusable components
- Used when component-specific styles need to be strictly encapsulated
- Appropriate for animation-heavy components

## Styling Guidelines

### Tailwind CSS Usage

1. Component Structure
```jsx
// Preferred structure
const Component = () => {
  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow-md">
      {/* Component content */}
    </div>
  );
};
```

2. Custom Classes
- Use @apply for frequently reused combinations
- Create in `src/styles/tailwind.css`
- Keep custom classes minimal

3. Responsive Design
- Use Tailwind's responsive prefixes (sm:, md:, lg:, xl:)
- Mobile-first approach is standard

### CSS Modules Guidelines

1. File Naming
- Use `.module.css` extension
- Match component name: `ComponentName.module.css`
- Place in same directory as component

2. Class Naming
- Use camelCase for class names
- Be specific and descriptive
- Prefix shared styles with 'common'

3. Import Structure
```jsx
import styles from './ComponentName.module.css';
```

### Styled-Components (Legacy Support)

While we're moving towards Tailwind CSS, existing styled-components should:
- Be maintained as is
- Not be expanded with new styles
- Be gradually migrated to Tailwind CSS

#### Important Styled-Components Guidelines
- Always use transient props (prefixed with $) for custom styling properties to prevent them from being passed to DOM elements
  ```jsx
  // Correct
  const Button = styled.button`
    color: ${props => props.$isActive ? 'blue' : 'black'};
  `;
  
  // Incorrect - will cause React DOM prop warnings
  const Button = styled.button`
    color: ${props => props.isActive ? 'blue' : 'black'};
  `;
  ```
- This prevents React warnings about invalid DOM props and improves component clarity

## Best Practices

1. Style Organization
- Group related styles together
- Comment complex style combinations
- Use consistent spacing and indentation

2. Performance Considerations
- Minimize style duplications
- Use Tailwind's purge options
- Avoid inline styles

3. Accessibility
- Maintain sufficient color contrast
- Use appropriate text sizes
- Support reduced motion preferences

## Troubleshooting Style Module Resolution

### Common Issues and Solutions

1. "Module not found" Error
```
Error: Cannot find module './ComponentName.module.css'
```

Resolution Steps:
1. Verify file location matches import path
2. Ensure correct file extension (.module.css)
3. Clear build cache and rebuild
4. Check webpack/next.js configuration

2. Styles Not Applying
- Verify class names match exactly
- Check for CSS Module import syntax
- Inspect built CSS in browser tools

3. Build-time Errors
- Run `npm run build` to catch style issues
- Check PostCSS configuration
- Verify Tailwind configuration

## File and Import Casing Checks

Maintaining consistent casing between CSS module filenames and their import statements is crucial, especially when deploying to case-sensitive file systems (like Linux servers).

### Common Casing Issues

1. File Naming Consistency
- Always use PascalCase for component files and their corresponding CSS modules
  - Correct: `MessageComposer.module.css`
  - Incorrect: `messageComposer.module.css` or `message-composer.module.css`
- Ensure import statements exactly match the file name:
  ```jsx
  // Correct
  import styles from './MessageComposer.module.css';
  
  // Incorrect - will fail on case-sensitive systems
  import styles from './messageComposer.module.css';
  ```

### Prevention and Detection

1. Manual Checks
- Regularly audit your codebase for casing mismatches
- Review file names in your IDE's file explorer
- Cross-reference import statements with actual file names

2. Automated Checks
- Use ESLint with appropriate plugins to catch import/file mismatches
- Implement a pre-commit hook using tools like husky:
  ```json
  {
    "husky": {
      "hooks": {
        "pre-commit": "node scripts/check-file-casing.js"
      }
    }
  }
  ```
- Consider using tools like `case-sensitive-paths-webpack-plugin` in your build configuration

### Resolution Steps

If you discover casing inconsistencies:
1. List all CSS module files and their import statements
2. Standardize on PascalCase for both files and imports
3. Update version control:
   ```bash
   git mv oldname.module.css NewName.module.css
   ```
4. Update all import statements to match the new file name
5. Test thoroughly on a case-sensitive system before deploying

## Migration Guidelines

When converting existing components:

1. From CSS Modules to Tailwind:
- Identify equivalent Tailwind utilities
- Update className references
- Remove CSS Module imports
- Delete .module.css files

2. From Styled-Components:
- Extract existing styles
- Convert to Tailwind classes
- Remove styled-components dependencies

## Tools and Resources

1. Development Tools
- Tailwind CSS IntelliSense (VSCode)
- PostCSS Language Support
- CSS Module Support

2. Documentation
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [CSS Modules Documentation](https://github.com/css-modules/css-modules)

## Style Review Process

1. Pre-commit
- Run style linting
- Check for unused styles
- Verify responsive behavior

2. Code Review
- Review style consistency
- Check for accessibility
- Validate performance impact

## API Integration Guidelines

### File Upload and API Response Handling

1. JSON Response Consistency
- Ensure all API endpoints consistently return JSON responses
- Handle potential HTML error pages from authentication/session validation failures
- Set appropriate Content-Type headers in API responses

2. File Upload Implementation
- Verify API endpoint responses maintain JSON format even in error scenarios
- Include proper error handling for authentication failures:
  ```javascript
  try {
    const response = await fetch('/api/upload', {
      // ... upload configuration
    });
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Non-JSON response received');
    }
    
    const data = await response.json();
  } catch (error) {
    // Handle non-JSON responses or other errors
  }
  ```
- Implement proper session validation checks in API routes

## Conclusion

This styling guide aims to maintain consistency while leveraging the benefits of modern CSS solutions. Regular updates will be made to reflect evolving best practices and team feedback.
