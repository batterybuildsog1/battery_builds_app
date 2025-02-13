# Project Setup Checklist

[ ] Initialize the Next.js project with TypeScript support:
   - Run: `npx create-next-app@latest manual-j-calculator --typescript`

[ ] Change directory into the project:
   - Run: `cd manual-j-calculator`

[ ] Install production dependencies with explicit version numbers:
   - Run: `npm install next-auth@4.24.5 @prisma/client@5.9.0 @supabase/supabase-js@2.39.3 axios@1.6.5 @radix-ui/react-slot@latest @radix-ui/react-dialog@latest @radix-ui/react-dropdown-menu@latest @radix-ui/react-label@latest @radix-ui/react-scroll-area@latest @radix-ui/react-separator@latest @radix-ui/react-popover@latest @radix-ui/react-radio-group@latest @radix-ui/react-checkbox@latest @radix-ui/react-tooltip@latest @radix-ui/react-toast@latest @radix-ui/react-menubar@latest @radix-ui/react-navigation-menu@latest @radix-ui/react-accordion@latest @radix-ui/react-alert-dialog@latest @radix-ui/react-aspect-ratio@latest @radix-ui/react-avatar@latest @radix-ui/react-context-menu@latest @radix-ui/react-collapsible@latest @radix-ui/react-hover-card@latest @radix-ui/react-progress@latest @radix-ui/react-select@latest @radix-ui/react-slider@latest @radix-ui/react-switch@latest @radix-ui/react-tabs@latest @radix-ui/react-toggle@latest @radix-ui/react-toggle-group@latest @radix-ui/react-toolbar@latest tailwind-merge@latest clsx@latest lucide-react@latest react-day-picker@latest react-hook-form@latest zod@latest @hookform/resolvers@latest @uploadthing/react@latest`

[ ] Install development dependencies with explicit version numbers:
   - Run: `npm install -D prisma@5.9.0 concurrently nodemon tailwindcss@3.4.1 postcss@8.4.33 autoprefixer@10.4.17`

[ ] Set up Tailwind CSS configuration files:
   - Run: `npx tailwindcss init -p`

[ ] Verify that `package.json` lists all dependencies and devDependencies with the correct version numbers.

[ ] Run the Next.js development server:
   - Run: `npm run dev` and navigate to `http://localhost:3000` in your browser.

[ ] Confirm that the default Next.js homepage loads without any build or startup errors.