# Plaza en Racha

App de estudio para opositores al SAS: un reto diario de 10 preguntas del temario común y una racha de días seguidos para mantener la constancia.

## Qué hace

- **Reto diario:** cada día hay 10 preguntas, las mismas durante todo el día. Al completarlo, la racha suma un día. Si un día no lo haces, la racha vuelve a empezar.
- **Corrección al momento:** cada respuesta muestra la opción correcta y la explicación, con el artículo o la norma.
- **Repasar falladas:** las preguntas que fallas se guardan para repasarlas. Cuando las aciertas, salen de la lista.
- **Práctica por tema:** porcentaje de aciertos en cada tema. Esta práctica no cuenta para la racha.

El progreso se guarda en el navegador de cada persona. No hace falta cuenta ni servidor.

## Archivos

| Archivo | Qué contiene |
|---|---|
| `index.html` | La pantalla y el diseño |
| `app.js` | La lógica: racha, reto diario, corrección y estadísticas |
| `preguntas.js` | El banco de preguntas. **Este es el que irás ampliando** |

## Cómo añadir preguntas

En `preguntas.js`, copia un bloque y cambia los datos:

```js
{ id: "ce6", tema: "Constitución Española",
  p: "Enunciado de la pregunta",
  o: ["Opción a", "Opción b", "Opción c", "Opción d"], c: 2,
  e: "Explicación con la norma y el artículo." },
```

- `id`: un código único.
- `tema`: uno de los nombres de `TEMAS`, que está al principio del archivo.
- `c`: la opción correcta, empezando a contar en 0 (0 = a, 1 = b, 2 = c, 3 = d).

Antes de publicar preguntas, compruébalas con la normativa vigente y con las bases de la convocatoria.

## Cómo abrirla

Abre `index.html` en el navegador.
