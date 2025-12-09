module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {}, // A veces necesario, otras veces @tailwindcss/postcss lo maneja. Tailwind 4 suele incluir autoprefixer. Lo probaremos solo con tailwindcss/postcss si falla.
  },
}
