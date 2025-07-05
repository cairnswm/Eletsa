# CoPilot Instructions

## Project Setup

- This is a Vite project using both TypeScript and JavaScript.
- TailwindCSS is used for styling.

## Coding Style

- No comments in the code.
- Avoid long files.
- Break down logic into small, reusable custom components.

## When Generating Code

- Use functional components.
- Use TailwindCSS classes for layout and spacing.
- Keep TypeScript definitions clean and minimal.

## File Organization

- Use clear folder structure: `components/`, `pages/`, `lib/`, etc.
- Place each component in its own file.
- do not use index.ts as a filename for components always use the component name

## Pages

- pages are each stored int heir own folde rin the /src/pages folder
- child components for the page can be stored in same folder
- pages should always call accessElf.track(<pagename>) (/src/auth/utils/accessElf.ts)

## Components

The following components have been created for resuse. 

- They each use a Variant prop to define the styleing. Valid variants are: 'primary', 'secondary', 'danger', 'success', 'warning', 'info', 'light', 'dark'
- Button, Alert, Badge

For Layout we use

- Container, Grid, Row Col - for col we can use responside sizing eg: xs={6} sm={4} md={3} lg={2} xl={2}
<Grid>
  <Row>
    <Col>

## For tailind styling of components and pages

- Component extraction: Use @apply or components to avoid repeating long utility class chains. in /src/index.css
- Design tokens: Define colors, spacing, and fonts in tailwind.config.js for consistency.
- Semantic naming: Create meaningful class names like .btn-primary instead of raw utilities.
- Clean structure: Keep styles readable and maintainable by organizing base, components, and utilities separately.    
- we use the following variant styles: 'primary', 'secondary', 'danger', 'success', 'warning', 'info', 'light', 'dark'

## Context and Data

Do not allow data fetching excpept inside useEffects. A useEffect must call a fetchData function to fetch the data.

Do not fetch data inside components. All data fetching and changes must happen in a React Context.

When working with collections of data, add an active<Item> to the context so that we can make an item active and fetch the relevant related data whenever it chnages.

## Webshare

use /src/components/WebShae to wrap shareable content.
