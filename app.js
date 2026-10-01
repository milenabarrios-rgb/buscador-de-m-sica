const $ = id => document.getElementById(id);

const canciones = [
  ['Canguro','WOS','rap','energía, rap argentino, fuerza'],['Arrancármelo','WOS','urbano','amor, desamor, intensa'],['Luz Delito','WOS','rap','rap, baile, energía'],
  ['Entre Nosotros','Tiago PZK y LIT killah','urbano','amor, separación, urbano'],['Salimo de Noche','Tiago PZK y Trueno','urbano','noche, fiesta, urbano'],
  ['Dance Crip','Trueno','rap','rap argentino, baile, energía'],['Atrevido','Trueno','rap','rap, actitud, barrio'],['Mamichula','Trueno, Nicki Nicole y Bizarrap','urbano','amor, urbano'],
  ['Colocao','Nicki Nicole','urbano','urbano, relajado'],['Wapo Traketero','Nicki Nicole','urbano','urbano, actitud'],['Ojos Verdes','Nicki Nicole','pop','amor, tristeza, pop'],
  ['Automático','María Becerra','pop','pop, urbano, baile'],['Ojalá','María Becerra','pop','amor, desamor, pop'],['Miénteme','TINI y María Becerra','pop','pop, amor'],
  ['Todo de Ti','Rauw Alejandro','reggaeton','reggaetón, pop, baile'],['Desesperados','Rauw Alejandro y Chencho Corleone','reggaeton','reggaetón, noche, amor'],
  ['La Canción','J Balvin y Bad Bunny','reggaeton','reggaetón, nostalgia, amor'],['Yonaguni','Bad Bunny','reggaeton','reggaetón, nostalgia, amor'],
  ['Ojitos Lindos','Bad Bunny y Bomba Estéreo','indie','amor, tranquilo, latino'],['PUNTO G','Quevedo','reggaeton','reggaetón, fiesta'],
  ['Eres','Café Tacvba','rock','amor, romántica, rock'],['Lamento Boliviano','Enanitos Verdes','rock','rock argentino, nostalgia'],['Mil Horas','Los Abuelos de la Nada','rock','rock argentino, amor'],
  ['Persiana Americana','Soda Stereo','rock','rock argentino, intenso'],['De Música Ligera','Soda Stereo','rock','rock argentino'],['Crimen','Gustavo Cerati','rock','rock, tristeza, melancolía'],
  ['Puente','Gustavo Cerati','rock','rock, amor, melancolía'],['Flaca','Andrés Calamaro','rock','rock argentino, amor, nostalgia'],
  ['Brillas','León Larregui','indie','indie, pop, amor'],['Disfruto','Carla Morrison','indie','indie, romántica, tranquila'],['Amárrame','Mon Laferte y Juanes','pop','pop latino, amor'],
  ['Tu Falta de Querer','Mon Laferte','pop','desamor, tristeza, intensa'],['Hasta la Raíz','Natalia Lafourcade','indie','amor, nostalgia, latina'],['Labios Rotos','Zoé','indie','rock indie, romántico'],
  ['Afuera','Caifanes','rock','rock mexicano, alternativo'],['Eres Para Mí','Julieta Venegas y Ana Tijoux','pop','pop latino, amor'],
  ['Me Voy','Julieta Venegas','pop','pop, desamor'],['Rosas','La Oreja de Van Gogh','pop','pop español, nostalgia'],['Sin Pijama','Becky G y Natti Natasha','reggaeton','reggaetón, urbano, fiesta'],
  ['Provenza','Karol G','reggaeton','reggaetón, verano, relajado'],['TQG','Karol G y Shakira','reggaeton','reggaetón, desamor, energía'],['Despechá','ROSALÍA','pop','pop, baile, verano'],
  ['Malamente','ROSALÍA','pop','pop, flamenco, urbano'],['Bailando','Enrique Iglesias','pop','pop latino, baile'],['Corazón Espinado','Maná y Carlos Santana','rock','rock latino'],
  ['Rayando el Sol','Maná','rock','rock latino, nostalgia'],['A Dios le Pido','Juanes','rock','rock latino, esperanza'],['Me Rehúso','Danny Ocean','pop','pop latino, amor'],
  ['Vuelve','Daddy Yankee y Bad Bunny','reggaeton','reggaetón, amor'],['DÁKITI','Bad Bunny y Jhay Cortez','reggaeton','reggaetón, nocturna, urbano']
].map(x => ({titulo:x[0], artista:x[1], genero:x[2], texto:x[3]}));

let genero = 'todos';
let usados = JSON.parse(localStorage.getItem('sona_usados') || '[]');
let historial = JSON.parse(localStorage.getItem('sona_historial') || '[]');

function norm(t){return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim()}
function clave(c){return norm(c.titulo+'|'+c.artista)}
function palabras(t){return norm(t).split(/[^a-z0-9ñ]+/).filter(x=>x.length>2)}
function youtube(q){return 'https://www.youtube.com/results?search_query='+encodeURIComponent(q)}
function spotify(q){return 'https://open.spotify.com/search/'+encodeURIComponent(q)}
function esc(t){return String(t).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}

function elegirArtista(q){
  const n=norm(q);
  return canciones.map(c=>c.artista).filter((v,i,a)=>a.indexOf(v)===i).find(a=>n.includes(norm(a))) || null;
}
function puntaje(c,q){
  const n=norm(q), base=norm(c.titulo+' '+c.artista+' '+c.texto);
  let p=Math.random()*4;
  if(genero!=='todos' && c.genero===genero)p+=9;
  palabras(q).forEach(w=>{if(base.includes(w))p+=5});
  if(n.includes(norm(c.artista)))p+=30;
  if(n.includes(norm(c.titulo)))p+=35;
  return p;
}
function explicacion(c,q){
  const n=norm(q);
  if(n.includes(norm(c.artista)))return 'Pediste este artista, así que aparece entre las opciones.';
  if(/triste|desamor|llorar|melancol|nostalgia/.test(n))return 'Tiene un clima emocional que coincide con lo que contaste.';
  if(/fiesta|bail|noche|energia|energía/.test(n))return 'Tiene más ritmo y energía, de acuerdo con lo que buscaste.';
  if(/amor|romant|enamor/.test(n))return 'La elegí por su temática y su clima romántico.';
  return 'La elegí porque combina con tus preferencias y con lo que escribiste.';
}

function mostrarCanciones(lista,q){
  const box=$('resultados'); box.innerHTML='';
  lista.forEach(c=>{
    usados.push(clave(c));
    const card=document.createElement('article'); card.className='cancion';
    card.innerHTML=`<span class="etiqueta">${esc(c.genero)}</span><h3>${esc(c.titulo)}</h3><p class="artista">${esc(c.artista)}</p><p class="explicacion">${esc(explicacion(c,q))}</p><div class="enlaces"><a href="${youtube(c.artista+' '+c.titulo)}" target="_blank" rel="noopener">YouTube</a><a href="${spotify(c.artista+' '+c.titulo)}" target="_blank" rel="noopener">Spotify</a></div>`;
    box.appendChild(card);
  });
  usados=Array.from(new Set(usados)).slice(-120); localStorage.setItem('sona_usados',JSON.stringify(usados));
}

function busquedaDirecta(q){
  const artista=elegirArtista(q);
  const query=artista ? artista+' '+q.replace(new RegExp(artista,'ig'),'') : q;
  const box=$('resultados'); box.innerHTML=`<div class="busqueda-real"><span class="etiqueta">BÚSQUEDA REAL</span><h3>${esc(artista ? 'Canciones de '+artista : 'Buscar “'+q+'”')}</h3><p>La página no necesita una clave para abrir la búsqueda. La frase que escribiste se envía directamente al buscador de YouTube y al buscador de Spotify.</p><div class="busqueda-botones"><a href="${youtube(query)}" target="_blank" rel="noopener">Buscar en YouTube →</a><a class="sp" href="${spotify(query)}" target="_blank" rel="noopener">Buscar en Spotify →</a></div></div>`;
  $('mensaje').textContent='Abrí la búsqueda para ver los resultados reales de la plataforma.';
  guardarHistorial(q,[artista?('Artista: '+artista):'Búsqueda: '+q]);
}

function buscar(){
  const q=$('detalle').value.trim();
  if(!q){$('mensaje').textContent='Escribí algo primero. Puede ser una canción, un artista o una parte de una letra.';return}
  // La búsqueda por letra no puede ser leída por una página local sin una API autorizada.
  // En lugar de fingir un resultado, se abre la búsqueda real con la frase completa.
  busquedaDirecta(q);
}
function recomendar(){
  const q=$('detalle').value.trim();
  if(!q){$('mensaje').textContent='Contame algo más para poder recomendarte canciones.';return}
  let lista=canciones.filter(c=>genero==='todos'||c.genero===genero).filter(c=>!usados.includes(clave(c)));
  if(!lista.length){usados=[];localStorage.setItem('sona_usados','[]');lista=canciones.filter(c=>genero==='todos'||c.genero===genero)}
  lista.sort((a,b)=>puntaje(b,q)-puntaje(a,q));
  mostrarCanciones(lista.slice(0,6),q);
  $('mensaje').textContent='Listo. Te preparé una selección distinta para esta búsqueda.';
  guardarHistorial(q,lista.slice(0,3).map(c=>c.titulo+' — '+c.artista));
}
function guardarHistorial(q,items){
  historial.unshift({q,items}); historial=historial.slice(0,10); localStorage.setItem('sona_historial',JSON.stringify(historial)); renderHistorial();
}
function renderHistorial(){
  const box=$('historial');
  if(!historial.length){box.innerHTML='<div class="vacio">Todavía no hiciste ninguna búsqueda.</div>';return}
  box.innerHTML=historial.map(h=>`<div class="historial-item"><strong>${esc(h.q)}</strong><span>${h.items.map(esc).join(' · ')}</span></div>`).join('');
}
function limpiar(){historial=[];usados=[];localStorage.removeItem('sona_historial');localStorage.removeItem('sona_usados');renderHistorial();$('resultados').innerHTML='<div class="estado-inicial"><div class="disco">♪</div><p>Todavía no hay resultados.</p><span>Escribí un artista, una canción o una parte de una letra.</span></div>';$('mensaje').textContent='';}

$('generos').addEventListener('click',e=>{if(e.target.tagName!=='BUTTON')return;document.querySelectorAll('.generos button').forEach(b=>b.classList.remove('activo'));e.target.classList.add('activo');genero=e.target.dataset.genero});
$('buscar').addEventListener('click',buscar); $('recomendar').addEventListener('click',recomendar); $('limpiar').addEventListener('click',limpiar);
$('detalle').addEventListener('input',()=>{$('contador').textContent=$('detalle').value.length});
$('detalle').addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter')buscar()});
$('modo').addEventListener('click',()=>{document.body.classList.toggle('oscuro');$('modo').textContent=document.body.classList.contains('oscuro')?'☀':'☾'});
renderHistorial();
