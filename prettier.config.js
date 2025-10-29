/**
 * 📄 prettier.config.js
 *
 * Configuración de Prettier para mantener un estilo de código consistente.
 *
 * 💡 Prettier se encarga solo del FORMATO (espacios, comillas, saltos de línea...),
 * mientras que ESLint se enfoca en la CALIDAD del código y buenas prácticas.
 *
 * Esta configuración sigue convenciones modernas y legibles para proyectos en JavaScript.
 */

export default {
  /**
   * 🔹 Agrega punto y coma al final de cada sentencia.
   *   true = usa punto y coma; false = no lo usa.
   */
  semi: true,

  /**
   * 🔹 Usa comillas simples en lugar de dobles.
   *   Facilita la lectura y es una convención común en proyectos JS modernos.
   */
  singleQuote: true,

  /**
   * 🔹 Define el número de espacios por tabulación.
   *   2 es el estándar recomendado por la comunidad de JS.
   */
  tabWidth: 2,

  /**
   * 🔹 Permite usar tabs o espacios.
   *   false = usa espacios (más predecible entre sistemas).
   */
  useTabs: false,

  /**
   * 🔹 Agrega comas al final de objetos, arrays y parámetros cuando es posible.
   *   'es5' = aplica en objetos, arrays, etc. (excepto funciones).
   *   Mejora el control de cambios en Git.
   */
  trailingComma: 'es5',

  /**
   * 🔹 Define el ancho máximo de línea antes de hacer saltos automáticos.
   *   Mantiene el código más legible sin líneas excesivamente largas.
   */
  printWidth: 100,

  /**
   * 🔹 Define cómo manejar los saltos de línea según el sistema operativo.
   *   'auto' = detecta automáticamente (útil para equipos multiplataforma).
   */
  endOfLine: 'auto',

  /**
   * 🔹 Controla el espaciado entre llaves en objetos: { foo: bar }.
   *   true = agrega espacio; false = no.
   */
  bracketSpacing: true,

  /**
   * 🔹 Coloca el cierre de etiquetas JSX en la misma línea o en una nueva.
   *   'preserve' = mantiene como esté en el código fuente.
   */
  jsxBracketSameLine: false,

  /**
   * 🔹 Comillas usadas en atributos JSX.
   *   'prefer-double' es más común para JSX (HTML-like).
   */
  jsxSingleQuote: false,

  /**
   * 🔹 Mantiene o elimina paréntesis en funciones de un solo argumento.
   *   'always' = siempre usar; 'avoid' = omitir cuando no sea necesario.
   *   'always' mejora la consistencia y claridad en revisiones.
   */
  arrowParens: 'always',
};
