// 📄 eslint.config.js
// Configuración moderna de ESLint (v9+) usando Flat Config.
// Integra Prettier, buenas prácticas y reglas de documentación con JSDoc.

import js from '@eslint/js';
import globals from 'globals';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import jsdocPlugin from 'eslint-plugin-jsdoc';

export default [
  // 🔹 Configuración base recomendada de ESLint
  js.configs.recommended,

  // 🔹 Definición de entorno y opciones del lenguaje
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // 🔹 Configuración de plugins y reglas personalizadas
  {
    plugins: {
      prettier: prettierPlugin,
      jsdoc: jsdocPlugin,
    },
    rules: {
      // 🧩 Formato Prettier
      ...prettierConfig.rules,
      'prettier/prettier': ['error'],

      // 🧩 Buenas prácticas generales
      'no-unused-vars': 'warn',
      'no-console': 'off',

      // 🧩 Reglas de documentación JSDoc
      // Obliga o sugiere documentar funciones, métodos y clases
      'jsdoc/require-jsdoc': [
        'warn',
        {
          publicOnly: false,
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
            ArrowFunctionExpression: false,
            FunctionExpression: false,
          },
        },
      ],

      // Verifica que las etiquetas JSDoc sean válidas
      'jsdoc/check-tag-names': 'warn',
      'jsdoc/check-param-names': 'warn',
      'jsdoc/require-param': 'warn',
      'jsdoc/require-returns': 'warn',
      'jsdoc/valid-types': 'warn',
    },

    settings: {
      jsdoc: {
        // Permite usar anotaciones de tipo con sintaxis de TypeScript
        mode: 'typescript',
      },
    },
  },
];
