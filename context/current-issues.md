Review the editor workspace implementation and fix the following issues. Check `components/editor` first. Do not break existing features.

## Issues

### 1. Collaborator Avatar Image Error

Check Clerk agent skills before implementing this.

Add img.clerk.com to the allowed image hostnames in next.config.js using the correct remotePatterns configuration.

### 2. Remove UserButton from Workspace Navbar

Check Clerk agent skills before implementing this.

Remove the UserButton from the workspace navbar only.

The navbar is shared so make sure the UserButton remains on the editor home navbar. Conditionally render it based on wether the component is being used in the workspace context or the editor home context.

## Scope

- Fix only what is listed above
- Do not change canvas node or edge rendering behavior
- Do not modify the editor home navbar layout
- Do not break existing autosave, presence, or collaboration logic
- npm run build passes
