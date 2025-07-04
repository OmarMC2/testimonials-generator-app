function capitalizer(str: string): string {
  if (!str) return str
  return str
    .toLowerCase() // Primero convertimos todo a minúsculas para estandarizar
    .split(' ') // Dividimos por espacios
    .map((palabra) =>
      palabra.length > 0 ? palabra[0].toUpperCase() + palabra.substring(1) : palabra,
    )
    .join(' ') // Volvemos a unir con espacios
}

export default capitalizer
