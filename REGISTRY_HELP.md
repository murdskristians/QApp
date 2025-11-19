# How to Use Your Local Registry

## 1. Ensure the Registry is Running
You must have the registry running in a terminal:
```bash
pnpm run registry
```
*You can verify it's running by visiting [http://localhost:4873](http://localhost:4873)*

## 2. Create a User (First Time Only)
Before you can publish, you need to create a user account on your local registry.
Run this command and follow the prompts (username, password, email):
```bash
npm adduser --registry http://localhost:4873
```

## 3. Publishing Packages
### Important: Check `package.json`
By default, your `package.json` has `"private": true`. **You must remove this line** or set it to `false` to publish.

### Publish Command
Once `private` is removed/false, run:
```bash
pnpm publish
```
This will publish the current version of your package to `http://localhost:4873`.

## 4. Installing Packages
To install packages from your local registry (or npm, since it proxies):
```bash
pnpm add <package-name>
```
Example:
```bash
pnpm add q-app
```

## 5. Troubleshooting
- **Version Conflict**: You cannot republish the same version number. Increment the `version` in `package.json` before publishing again.
- **Login Issues**: If `pnpm publish` fails with auth errors, try `npm login --registry http://localhost:4873`.
