# Plaza en Racha

App de estudio para opositores al SAS. Funciona como un juego propio: el temario común es un hospital con una planta por tema, la energía se recarga estudiando, cada consulta tiene nota con sello «APTO», hay pomodoros de estudio, racha de días seguidos y Pildi, una mascota con forma de cápsula que reacciona a cada respuesta.

## Cómo se juega

- **Camino de lecciones:** cada tema es una unidad con 4 lecciones y un repaso final (el trofeo). Las lecciones se desbloquean en orden y puedes empezar por el tema que quieras.
- **5 tipos de ejercicio:**
  1. Elegir la respuesta correcta (test).
  2. Verdadero o falso: ¿es correcta esta respuesta?
  3. Completar el número de una norma.
  4. Emparejar cada norma con su nombre.
  5. Ordenar normas por fecha.
- **El hospital:** el temario es un edificio que se sube planta a planta desde Urgencias: UCI, Quirófanos, Consultas externas, Hospitalización, Medicina Preventiva, Admisión, Atención a la Ciudadanía y Dirección. En la azotea está el helipuerto: tu plaza. Cada planta tiene su personal y 4 puestos (boxes, camas, quirófanos…) más un examen; al aprobarlo, se enciende la planta de arriba. Las plantas se configuran en `PLANTAS`, dentro de `preguntas.js`.
- **Energía:** tienes 5 cargas y cada fallo en una consulta gasta una. Se recupera una carga cada 20 minutos, o al momento **estudiando**: en «Recargar energía», cada 2 aciertos de repaso devuelven una carga y los fallos no restan. Empieza por tus preguntas falladas.
- **Fallos:** lo que fallas vuelve al final de la consulta y se guarda para repasarlo.
- **Puntos de baremo:** 2 por acierto, +1 si llevas 3 o más seguidos (ritmo), +5 al terminar la consulta y +5 si no fallas ninguna.
- **Nota:** cada consulta se puntúa de 0 a 10 según los aciertos a la primera, con sello «APTO» a partir de 5. Cada planta muestra tu nota media.
- **Meta diaria y botiquín:** la meta es de 30 puntos al día. Al cumplirla se abre el botiquín del día: +15 puntos y energía al 100 %.
- **Pomodoro de estudio:** temporizador de 25 + 5 o 50 + 10 minutos para estudiar con tus apuntes. Cada bloque de estudio completo da +10 puntos y +1 de energía, y cuenta para la racha. El reloj sigue contando aunque cambies de pantalla.
- **Racha:** cada día que completas al menos un puesto o un pomodoro, tu pulso sigue latiendo y la racha sube.
- **Pildi:** se alegra, se pone triste, celebra el buen ritmo y te avisa si tu racha está en peligro. Si la tocas en el inicio, te da ánimos y datos.
- **Sonido:** melodías de campanilla y marimba; los aciertos seguidos suben de tono. Se activa y se desactiva con el botón del altavoz. En ordenador puedes jugar con el teclado: teclas 1 a 4 para elegir e Intro para comprobar.
- **Ranking:** la tarjeta de ranking abre un ranking semanal (empieza de cero cada lunes) y otro total. Cada persona puede elegir el nombre con el que aparece.

El progreso de cada persona se guarda en su navegador. El ranking es compartido y solo funciona con la app publicada en claude.ai: cada persona escribe solo su propia fila, y solo la creadora de la app puede corregir o borrar filas ajenas. Para aparecer en el ranking, hay que tener permiso para participar en la app (nivel Colaborador o superior); quien solo puede verla, ve el ranking pero no aparece en él.

## Archivos

| Archivo | Qué contiene |
|---|---|
| `index.html` | Las pantallas, el diseño y los iconos |
| `app.js` | La lógica del juego y la mascota |
| `preguntas.js` | El contenido: `PREGUNTAS`, `NORMAS` y las plantas del hospital (`PLANTAS`). **Este es el que irás ampliando** |

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
