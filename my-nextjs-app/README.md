# My Next.js App

This is a Next.js application that serves as a template for building web applications using React and TypeScript.

## Project Structure

```
my-nextjs-app
├── public              # Static assets (images, fonts, etc.)
├── src
│   ├── pages          # Application pages
│   │   ├── _app.tsx   # Custom App component
│   │   └── index.tsx  # Main entry point
│   ├── components     # Reusable components
│   │   └── ExampleComponent.tsx
│   └── styles         # Global styles
│       └── globals.css
├── package.json       # npm configuration
├── tsconfig.json      # TypeScript configuration
└── README.md          # Project documentation
```

## Getting Started

To get started with this project, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd my-nextjs-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser and navigate to:**
   ```
   http://localhost:3000
   ```

## Features

- **Static Asset Serving:** The `public` directory is used for serving static files.
- **Custom App Component:** The `_app.tsx` file allows you to initialize pages and add global styles.
- **Reusable Components:** The `ExampleComponent.tsx` file demonstrates how to create reusable UI components.
- **Global Styles:** The `globals.css` file contains styles that apply to the entire application.

## License

This project is licensed under the MIT License.