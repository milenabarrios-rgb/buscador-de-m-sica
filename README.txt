SONÁ — RECOMENDADOR MUSICAL

Esta versión funciona directamente abriendo index.html.

NO necesita:
- Gemini
- YouTube Data API
- Spotify API
- servidor
- npm
- claves

Hay dos funciones distintas:

1. RECOMENDAR CANCIONES
Usa una colección local de canciones en español y cambia las recomendaciones según género, texto y canciones ya mostradas. El historial también queda guardado en el navegador.

2. BUSCAR ESTA CANCIÓN
Si escribís el nombre de una canción, un artista o una parte de una letra, la página abre una búsqueda real en YouTube y otra en Spotify con el texto completo que escribiste.

IMPORTANTE:
Un index.html local, sin ninguna API ni servidor, no puede leer los resultados internos de YouTube o Spotify ni garantizar cuál es el primer video de su buscador. Las APIs oficiales requieren credenciales/autorización. Por eso esta versión NO finge que encontró una canción exacta: abre el buscador real con tu consulta.
