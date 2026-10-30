# Plaza en Racha

App de estudio para opositores al SAS. Funciona como un juego: un camino de lecciones por cada tema del temario común, vidas, puntos de experiencia (XP), combos, racha de días seguidos y Pildi, una mascota con forma de cápsula que reacciona a cada respuesta.

## Cómo se juega

- **Camino de lecciones:** cada tema es una unidad con 4 lecciones y un repaso final (el trofeo). Las lecciones se desbloquean en orden y puedes empezar por el tema que quieras.
- **5 tipos de ejercicio:**
  1. Elegir la respuesta correcta (test).
  2. Verdadero o falso: ¿es correcta esta respuesta?
  3. Completar el número de una norma.
  4. Emparejar cada norma con su nombre.
  5. Ordenar normas por fecha.
- **Vidas:** tienes 5 y cada fallo cuesta una. Se recupera una cada 20 minutos. Si te quedas sin vidas, un repaso te devuelve una.
- **Fallos:** lo que fallas vuelve al final de la lección y se guarda en «Repasar falladas».
- **XP y combos:** 2 XP por acierto, +1 si llevas 3 o más seguidos, +5 al terminar la lección y +5 si no fallas ninguna.
- **Meta diaria y racha:** la meta es de 30 XP al día. Cada día que completas al menos una lección, la racha sube.
- **Cofre diario:** al llegar a la meta diaria, el cofre de la tarjeta de inicio se puede abrir. Da +15 XP y rellena las vidas. Hay uno nuevo cada día.
- **Pildi:** se alegra, se pone triste, celebra los combos y te avisa si tu racha está en peligro. Si la tocas en el inicio, te da ánimos y datos.
- **Estrellas:** cada lección puntúa de 1 a 3 estrellas según los fallos, y el mapa guarda tu mejor resultado.
- **Sonido:** melodías de campanilla y marimba; los aciertos seguidos suben de tono. Se activa y se desactiva con el botón del altavoz. En ordenador puedes jugar con el teclado: teclas 1 a 4 para elegir e Intro para comprobar.
- **Ranking:** el botón del trofeo abre un ranking semanal (empieza de cero cada lunes) y otro total. Cada persona puede elegir el nombre con el que aparece.

El progreso de cada persona se guarda en su navegador. El ranking es compartido y solo funciona con la app publicada en claude.ai: cada persona escribe solo su propia fila, y solo la creadora de la app puede corregir o borrar filas ajenas. Para aparecer en el ranking, hay que tener permiso para participar en la app (nivel Colaborador o superior); quien solo puede verla, ve el ranking pero no aparece en él.

## Archivos

| Archivo | Qué contiene |
|---|---|
| `index.html` | Las pantallas, el diseño y los iconos |
| `app.js` | La lógica del juego y la mascota |
| `preguntas.js` | El contenido: `PREGUNTAS` y `NORMAS`. **Este es el que irás ampliando** |

## Cómo añadir contenido

En `preguntas.js` hay dos listas.

**`PREGUNTAS`** genera los ejercicios de test y de verdadero o falso:

```js
{ id: "ce6", tema: "Constitución Española",
  p: "Enunciado de la pregunta",
  o: ["Opción a", "Opción b", "Opción c", "Opción d"], c: 2,
  e: "Explicación con la norma y el artículo." },
```

`c` es la opción correcta, empezando a contar en 0 (0 = a, 1 = b, 2 = c, 3 = d).

**`NORMAS`** genera automáticamente los ejercicios de emparejar, ordenar y completar:

```js
{ n: "Ley 14/1986", f: "1986-04-25", fecha: "25 de abril", t: "General de Sanidad", tema: "Sanidad pública" },
```

En los dos casos, `tema` tiene que ser uno de los nombres de `TEMAS`, que está al principio del archivo. Si añades un tema nuevo a `TEMAS`, aparece una unidad nueva en el camino.

Antes de publicar contenido, compruébalo con la normativa vigente y con las bases de la convocatoria.

## Cómo abrirla

Abre `index.html` en el navegador.
