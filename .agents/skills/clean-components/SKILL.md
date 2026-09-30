---
name: clean-components
description: Enforces modular component design, 100-line limit, structural page segregation, and 3-file atomic separation of concerns for Next.js and TypeScript. Trigger this whenever creating, modifying, or refactoring UI components.
---

# Web3 Workspace UI Constraints

## 1. Modular Architecture Rules
- **Component Breakdown:** Always extract nested blocks from large structures into clean, single-purpose reusable subcomponents.
- **Line Limitations:** Keep all individual component code files strictly under **100 lines of code**. If code crosses 100 lines, extract internal subcomponents or move helper subroutines to utility hooks.
- **Directory Segregation:** Do not put components generically inside a shared `/components` folder. Group components strictly within the local subfolders of the page or feature context they belong to (e.g., `app/dashboard/_components/`).

## 2. Three-File Structural Separation
When writing or refactoring UI features, split them into exactly three separate files within the feature's subfolder:
1. `index.tsx` (Logical Component): Manages state hooks, wallet bindings, events, and lifecycle rules.
2. `view.tsx` (Presentation View): Holds layout tags and elements. Must remain clean and receive data elements solely via TypeScript props.
3. `styles.ts` (Style Definitions): Exports standalone Tailwind layout objects or class names to eliminate inline className bloating.

## 3. Secure Backend Handling
- All sensitive logic, RPC endpoint keys, signing parameters, and data mutations must run securely server-side via Next.js Route Handlers (`app/api/`). Never leak environment variables to the browser runtime.
