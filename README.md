This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Environment Setup

This project requires several environment variables to be set up in a `.env` file at the root of the project. The following variables are required:

```env
DATABASE_URL=your_database_url
NEXTAUTH_URL=http://localhost:3000 # In development
NEXTAUTH_SECRET=your_nextauth_secret # Generate with: openssl rand -base64 32
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GEMINI_API_KEY=your_gemini_api_key
```

Contact the project administrator for the actual values of these environment variables.

### Dependency Management and Troubleshooting

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

## Additional Documentation

For more detailed information about the project setup and implementation:
- Refer to `checklist.md` for the complete setup checklist
- See `what-we-have-done.md` for development context and progress tracking
