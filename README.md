This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Environment Setup

This project uses a centralized EnvironmentService to manage configuration and environment variables. The service handles validation, provides defaults where applicable, and ensures consistent configuration across the application.

#### Environment Configuration Files

IMPORTANT: This project strictly uses only two environment files:
1. `.env` - Contains production values and serves as the base configuration
2. `.env.local` - Contains local development overrides and inherits from `.env`

Note: `.env.development` is NOT supported and should be removed if present to avoid configuration conflicts.

Key Configuration Rules:
- Only `.env` and `.env.local` files are recognized
- All shared variables (except NEXTAUTH_URL) must have identical values in both files
- Duplicate keys are not allowed within or across files
- The EnvironmentService enforces these rules at startup

Important Configuration Rules:
- All shared variables must have identical values in both files
- Only NEXTAUTH_URL is allowed to differ between environments
- The EnvironmentService will throw an error if:
  - Any shared variables have mismatched values
  - Duplicate keys are found in either file
  - `.env.development` file is detected
  - Any unsupported environment files are present

Example configuration showing the required consistency between files:

1. `.env` - Production configuration:
```env
# These values must match in both files
GEMINI_API_KEY=your_gemini_api_key
GEMINI_API_ENDPOINT=https://generativelanguage.googleapis.com/v1beta
GEMINI_REASONING_MODEL=gemini-pro
GEMINI_VISION_MODEL=gemini-pro-vision
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
MAX_FILE_SIZE=26214400

# This value is environment-specific
NEXTAUTH_URL=https://batterybuilds.com

# Other configuration
NEXTAUTH_SECRET=your_nextauth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
DATABASE_URL=your_database_url
```

2. `.env.local` - Local development configuration:
```env
# These values must exactly match .env
GEMINI_API_KEY=your_gemini_api_key
GEMINI_API_ENDPOINT=https://generativelanguage.googleapis.com/v1beta
GEMINI_REASONING_MODEL=gemini-pro
GEMINI_VISION_MODEL=gemini-pro-vision
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
MAX_FILE_SIZE=26214400

# This value can differ for local development
NEXTAUTH_URL=http://localhost:3000

# Other configuration
NEXTAUTH_SECRET=your_nextauth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
DATABASE_URL=your_database_url
```

Note: The EnvironmentService will throw an error if it detects any mismatched values between the files (except for NEXTAUTH_URL). The error message will indicate which variable has mismatched values and remind you to ensure consistency across both files.

Example error message:
```
Error: Environment variable "GEMINI_API_KEY" has different values in .env and .env.local files. Please ensure all shared variables (except NEXTAUTH_URL) have matching values in both files.
```

#### Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| GEMINI_API_KEY | Yes | - | API key for Google's Gemini AI service |
| GEMINI_API_ENDPOINT | No | https://generativelanguage.googleapis.com/v1beta | Base endpoint for Gemini API calls |
| GEMINI_REASONING_MODEL | No | gemini-pro | Model ID for text-based reasoning |
| GEMINI_VISION_MODEL | No | gemini-pro-vision | Model ID for vision-based tasks |
| SUPABASE_URL | Yes | - | Your Supabase project URL |
| SUPABASE_ANON_KEY | Yes | - | Your Supabase anonymous key |
| MAX_FILE_SIZE | No | 26214400 | Maximum file size in bytes (default: 25MB) |

#### About EnvironmentService

The EnvironmentService provides:
- Centralized configuration management
- Runtime validation of environment variables
- Default values for optional configurations
- Type-safe access to environment variables
- Consistent configuration across client and server components

To override default values, simply set the corresponding environment variable in your `.env` or `.env.local` file.

#### Development vs Production Setup

- For local development:
  - Use `.env.local` with `NEXTAUTH_URL=http://localhost:3000`
  - This prevents redirection issues when testing authentication locally
  
- For production deployment:
  - Deploy via a hosting platform (e.g., Vercel)
  - Configure DNS settings for batterybuilds.com
  - Set up SSL certificates
  - Update all environment variables in the hosting provider's settings panel
  - Ensure `NEXTAUTH_URL` is set to https://batterybuilds.com
  - Verify all required environment variables are properly set
  - Test file upload functionality with production MAX_FILE_SIZE setting

Contact the project administrator for the actual values of these environment variables.

#### Environment Validation

The EnvironmentService performs validation checks on startup:
- Verifies presence of required environment variables
- Validates format of URLs and API keys
- Ensures MAX_FILE_SIZE is a valid number
- Checks model names against allowed values

If any validation fails, the application will log appropriate error messages and may prevent startup to avoid runtime issues.

### Dependency Management and Troubleshooting

#### Common Dependency Issues

1. **Stylelint and Prettier Conflicts**
   - If you encounter conflicts between stylelint (v15.11.0) and stylelint-config-prettier:
     ```bash
     # Update stylelint-config-prettier to a compatible version
     npm install --save-dev stylelint-config-prettier@^10.0.0
     ```

2. **Missing Material UI Dependencies**
   - If you see "Module not found: Can't resolve '@mui/icons-material'" or similar errors:
     ```bash
     # Install required Material UI packages
     npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
     ```

3. **React Version Conflicts**
   When installing dependencies, you might encounter a peer dependency conflict (ERESOLVE) related to React versions. This typically occurs because some UI libraries (like @headlessui/react) require React version 16, 17, or 18, while the project might default to React 19.

To resolve this:

1. Recommended Solution:
   - Ensure your package.json specifies React 18:
   ```json
   {
     "dependencies": {
       "react": "^18.2.0",
       "react-dom": "^18.2.0"
     }
   }
   ```
   - Clean your installation:
     ```bash
     rm -rf node_modules
     rm package-lock.json
     npm install
     ```

2. Alternative Workaround (not recommended for production):
   ```bash
   npm install --force
   # or
   npm install --legacy-peer-deps
   ```

Note: Using --force or --legacy-peer-deps is not recommended for production as it may lead to unexpected behavior. Always prefer matching compatible versions.

#### Development Server Commands

1. **Correct Command to Start Development Server**
   ```bash
   npm run dev  # Correct command
   ```
   Note: Do not use 'npm run deve' as this is incorrect and will fail.

2. **Clearing Cache for Persistent Issues**
   If you encounter persistent issues after dependency changes:
   ```bash
   # Remove all caches and dependencies
   rm -rf .next
   rm -rf node_modules
   rm package-lock.json
   
   # Clean install
   npm install
   
   # Start development server
   npm run dev
   ```

### General Dependency and Module Resolution Issues

If you encounter npm install issues or module resolution errors:

1. Clear project caches and reinstall:
   ```bash
   # Remove caches and dependencies
   rm -rf .next
   rm -rf node_modules
   rm -rf package-lock.json
   
   # Clear npm cache (optional)
   npm cache clean --force
   
   # Reinstall dependencies
   npm install
   ```

2. File Casing Issues:
   - Ensure all file names exactly match their import statements
   - Be especially careful with CSS module imports (e.g., `styles.module.css`)
   - Remember that some systems (like Linux) are case-sensitive
   
3. Styling Dependencies:
   - If you encounter conflicts between stylelint and prettier:
     - Consider using prettier-plugin-tailwindcss instead of stylelint-config-prettier
     - Install with: `npm install -D prettier-plugin-tailwindcss`
     - Add to your prettier config:
       ```json
       {
         "plugins": ["prettier-plugin-tailwindcss"]
       }
       ```

### Complete Dependency Reset and Material UI Setup

If you're experiencing persistent dependency issues or missing Material UI modules:

1. Clean up existing dependencies and caches:
   ```bash
   # Remove dependency and build folders
   rm -rf node_modules
   rm -rf .next
   rm package-lock.json
   
   # Clean npm cache
   npm cache clean --force
   ```

2. Reinstall base dependencies:
   ```bash
   npm install
   ```

3. Install Material UI dependencies:
   ```bash
   npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

These steps will resolve most dependency-related issues, including missing module errors for '@mui/icons-material' and any dependency conflicts.

### React Diff Viewer Dependency Issues

If you encounter dependency conflicts with react-diff-viewer:

1. Check for newer compatible versions:
   ```bash
   npm view react-diff-viewer versions
   ```

2. If a newer version compatible with React 18 exists:
   - Update your package.json with the compatible version:
     ```json
     {
       "dependencies": {
         "react-diff-viewer": "^3.x.x" // Replace with compatible version
       }
     }
     ```
   - Reinstall dependencies:
     ```bash
     npm install
     ```

3. If no compatible version exists:
   - Consider using alternative packages that support React 18, such as:
     - react-diff
     - react-diff-view
     - monaco-react-diff
   - Or temporarily install with legacy peer deps (not recommended for production):
     ```bash
     npm install --legacy-peer-deps
     ```

### API and React Component Troubleshooting

#### API Response Issues

If you're receiving HTML responses instead of JSON from API endpoints:

1. Check API Route Response Headers:
   - Ensure your API routes explicitly set the content type:
     ```typescript
     res.setHeader('Content-Type', 'application/json');
     ```
   - Verify error handling returns JSON responses:
     ```typescript
     res.status(400).json({ error: 'Error message' });
     ```

2. File Upload Endpoint Verification:
   - Test endpoints with Postman or curl:
     ```bash
     curl -X POST http://localhost:3000/api/manual-j/init \
       -H "Content-Type: multipart/form-data" \
       -F "file=@/path/to/test.pdf"
     ```
   - Check network tab in browser dev tools for:
     - Correct Content-Type headers
     - Request payload format
     - Response headers and body

3. Session/Authentication Issues:
   - Ensure protected routes properly handle unauthenticated requests with JSON responses
   - Check for middleware redirects that might return HTML
   - Verify session token presence and validity

#### React Component Warnings

1. Styled-Components Props Warnings:
   - If you see warnings about invalid DOM props, use transient props:
     ```typescript
     // Instead of
     const StyledButton = styled.button`
       color: ${props => props.customColor};
     `;

     // Use
     const StyledButton = styled.button`
       color: ${props => props.$customColor};
     `;
     ```
   - Update component usage:
     ```typescript
     // Instead of
     <StyledButton customColor="blue" />

     // Use
     <StyledButton $customColor="blue" />
     ```

2. File Upload Component Checks:
   - Verify form encType:
     ```typescript
     <form encType="multipart/form-data">
     ```
   - Check fetch/axios configuration:
     ```typescript
     const formData = new FormData();
     formData.append('file', file);
     
     await fetch('/api/upload', {
       method: 'POST',
       body: formData,
       // Don't set Content-Type header, let browser set it
     });
     ```

3. Common React Props Issues:
   - Ensure boolean props are properly passed:
     ```typescript
     // Incorrect
     <Component isDisabled="true" />
     
     // Correct
     <Component isDisabled={true} />
     ```
   - Check for undefined props being passed to DOM elements
   - Verify event handler prop types

### Authentication Setup

1. Set up a Google Cloud Project and configure OAuth 2.0:
   - Go to the Google Cloud Console
   - Create a new project or select an existing one
   - Enable the Google OAuth2 API
   - Configure the OAuth consent screen
   - Create OAuth 2.0 credentials (client ID and client secret)
   - Add authorized redirect URIs:
     - Development: http://localhost:3000/api/auth/callback/google
     - Production: https://your-domain.com/api/auth/callback/google

2. Update your `.env` file with the Google OAuth credentials

### Running the Development Server

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Development and Deployment

### Local Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```
   This will start the server at http://localhost:3000

### Production Build Testing

To test your production build locally:
1. Create a production build:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run start
   ```
   This will start the production server at http://localhost:3000

### Git Repository Setup

1. Check your current Git remote configuration:
   ```bash
   git remote -v
   ```

2. If no remote is configured, add your repository:
   ```bash
   git remote add origin <repository-url>
   ```

3. Push your code to the repository:
   ```bash
   git push -u origin main
   ```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

### Deployment Methods

1. **Via Vercel Dashboard:**
   - Connect your GitHub repository in the Vercel dashboard
   - Vercel will automatically build and deploy your site
   - Subsequent pushes to your main branch will trigger automatic deployments

2. **Via Vercel CLI:**
   ```bash
   # Install Vercel CLI globally
   npm i -g vercel

   # Deploy to production
   vercel --prod
   ```

### Deployment Configuration

When deploying to Vercel:
1. Configure the following environment variables in your Vercel project settings:
   - NEXTAUTH_URL (set to your production URL, e.g., https://your-domain.com)
   - NEXTAUTH_SECRET (use the same secret as development)
   - GOOGLE_CLIENT_ID
   - GOOGLE_CLIENT_SECRET
   - DATABASE_URL
   - GEMINI_API_KEY
2. Add your production domain to the authorized redirect URIs in Google Cloud Console
3. Ensure your production domain is properly set in NEXTAUTH_URL

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## API Routes Documentation

### Protected Routes
All API routes under `/api/protected/*` require authentication. These endpoints will return a 401 status code if accessed without proper authentication.

### Available Endpoints

#### Manual-J Calculations
- `POST /api/protected/manual-j/init`
  - Initiates a new Manual-J calculation
  - Requires multipart/form-data with PDF file
  - Max file size: 25MB
  - Returns: `{ jobId: string, status: string }`

#### Project Management
- `GET /api/protected/projects`
  - Lists all projects for authenticated user
  - Supports pagination: `?page=1&limit=10`
  - Returns: `{ projects: Project[], total: number }`

- `POST /api/protected/projects`
  - Creates a new project
  - Body: `{ name: string, description?: string }`
  - Returns: Created project object

#### File Management
- `POST /api/protected/files/upload`
  - Uploads file(s) to project
  - Supports multiple files
  - Validates file types and sizes
  - Returns: `{ files: UploadedFile[] }`

### Error Responses
All API endpoints return standardized error responses:
```typescript
{
  error: {
    code: string,
    message: string,
    details?: any
  }
}
```

## Database Schema and Migrations

### Core Tables

#### Users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Projects
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status project_status DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Running Migrations
```bash
# Apply pending migrations
npm run migrate:up

# Rollback last migration
npm run migrate:down

# Create new migration
npm run migrate:create my_migration_name
```

## Type Safety and Validation

### Zod Schema Validation
All API requests and responses are validated using Zod schemas:

```typescript
// Project schema example
const ProjectSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  status: z.enum(['draft', 'active', 'completed', 'archived'])
});
```

### TypeScript Integration
- All API routes are fully typed
- Database models have corresponding TypeScript interfaces
- Frontend components use strict prop typing
- API response types are shared between frontend and backend

### Error Handling

The application implements a centralized error handling system:

1. API Errors
```typescript
class APIError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
  }
}
```

2. Error Middleware
```typescript
export const errorHandler = (err: Error, req: Request, res: Response) => {
  if (err instanceof APIError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details
      }
    });
  }
  // Handle other types of errors...
};
```

## Additional Documentation

For more detailed information about the project setup and implementation:
- Refer to `checklist.md` for the complete setup checklist
- See `what-we-have-done.md` for development context and progress tracking
