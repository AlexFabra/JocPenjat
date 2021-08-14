//La base d'aquest codi la he aprés a partir del video 'Vanilla JavaScript Hangman Game Tutorial - No Frameworks'
//https://www.youtube.com/watch?v=dgvyE1sJS3Y&t=1474s

//'paraula' guardarà la paraula aleatòria:
let paraula = "";
//'maximErrors' guarda el màxim d'errors permesos:
let maximErrors = 6;
//'errors' guardarà el nombre d'errors que faci l'usuari:
let errors = 0;
//el vector 'escollides' guardarà les lletres escollides:
let escollides = [];
//'estatParaula' guardarà el que es mostri a pantalla de la paraula a endevinar:
let estatParaula = null;
//'llistaParaules' guarda totes les possibilitats que poden sortir:
var llistaParaules = 
[
    "el amor",
    "la xocolata",
    "un bany de aigua calenta",
    "subjectiu",
    "la aparença de progres",
    "inexistent",
    "la possibilitat de descobrir",
    "la voluntat sempre insatisfeta",
    "la capacitat de ser creatiu",
    "observar l'espectacle del mon",
    "veure videos de gatets",
    "la incertidumbre",
]
//eventTeclat recollirà el valor de les tecles presionades:
let eventTeclat = "";
//el temps de joc serà de 30 segons:
let tempsRestant = 30;
//perdut serà true quan s'hagi perdut la partida:
let perdut = false;

//paraulaAleatoria() retorna al HTML una paraula qualsevol del vector 'llistaParaules'.
function paraulaAleatoria (){
    //per aconseguir una paraula aleatoria, arrodonim el resultat de la operació entre la funció Math.random() i la llargada del vector de les paraules.
    //el resultat pot ser qualsevol nombre entre 0 i el últim número que del vector. 
    paraula = llistaParaules[Math.floor(Math.random()*llistaParaules.length)];
}

//per crear tots els botons de l'HTML de manera simple i elegant, ho farem amb una funció.
//crearBotons crea tots els botons a partir d'una variable amb l'abecedari.
function crearBotons(){
    //dividim la variable amb la operació split i per cada lletra fem un botó HTML;
    //després fem join per enmagatzemarlos en la mateixa vaiable sense separacions.
    //Quan cliquem a aquests botons, executarem la funció 'lletraCorrecta', a la que li 
    //passarem com a paràmetre el valor de 'caracter'.
    let botonsHTML = 'abcçdefghijklmnñopqrstuvwxyz '.split('').map(caracter =>
        `
            <button
                class="btn btn-lg btn-warning m-2"
                id='` + caracter + `'
                onClick="lletraCorrecta('` + caracter + `')"
            >
                ` + caracter + `
            </button>
        `).join('');
    //botonsHTML es posicionarà al HTML, on hi ha el element amb id 'botonsPantalla':
    document.getElementById('botonsPantalla').innerHTML = botonsHTML;
}

//lector d'events de teclat, que s'activa quan es pressiona una tecla, executant la funció a la que
//li passa l'event de la tecla pressionada. 
//quan posem event.key, ens retorna un caràcter, per tant, ja ho podem passar a la funció lletraCorrecta.
//informació molt concreta de com fer-ho a: 'https://alligator.io/js/listening-to-keyboard/'
document.addEventListener('keydown', 
function (event){
    lletraCorrecta(event.key);
}
);
    
//paraulaAEndevinar() mostra les lletres endevinades i les incògnites de la paraula a endevinar:
function paraulaAEndevinar(){
    //es divideix el valor de la variable 'paraula' amb split.
    //per cada valor de paraula ('caracter') s'analitza si apareix l'array de lletres escollides.
    //si apareix i hi és a 'paraula' ho posem a estatParaula; en cas que hi sigui a paraula pero no a escollides, posem un ' _ '. 
    //finalment juntem amb join tots els valors i ho guardem com un únic valor a estatParaula.
    estatParaula = paraula.split('').map(caracter => (escollides.indexOf(caracter) >= 0 ? caracter : " _ ")).join('');
    document.getElementById('estatParaula').innerHTML = estatParaula;
}

//premut un botó, la funció lletraCorrecta() actualitzarà l'estat del joc. 
function lletraCorrecta(lletraEscollida){
    //si fem un indexOf de la variable que guarda les lletres escollides
    //passant-li la lletra escollida i dona -1, significa que no s'ha trobat
    //per tant, si no es troba, l'afegirem. En cas que ja estigui, mostrem un misatge.
    escollides.indexOf(lletraEscollida) === -1 ? escollides.push(lletraEscollida) : alert("Ja s'ha escollit aquesta lletra anteriorment");
    
    //per diferenciar els botons clicats dels no clicats, desabilitarem els clicats:
    document.getElementById(lletraEscollida).setAttribute('disabled',true);

    //si la letra escollida surt a la paraula a endevidar (si el nombre d'aparicions de la lletraEscollida és
    // major o igual a 0):
    if(paraula.indexOf(lletraEscollida)>=0){
        //actualitzem l'estat de la paraula a endevinar:
        paraulaAEndevinar();
        //comprovem si s'ha guanyat la partida:
        partidaGuanyada();

    //si la lletra escollida no surt a la paraula a endevinar
    } else if (paraula.indexOf(lletraEscollida) === -1){
        //incrementem la variable que guarda els errors
        errors++;
        //actualitzem els errors:
        actualitzaErrors();
        //i la imatge:
        actualitzaImatge();
        //com que és posible que l'error sigui el últim permès,
        //es mira si la partida s'ha perdut:
        partidaPerduda();
    }
}

//actualitzaImatge() cambia la imatge del HTML (guardada a l'element amb id 'imatge') per la que té per nom el nombre d'errors actual:
function actualitzaImatge(){
    document.getElementById('imatge').src = './resources/' + errors + '.png';
}

//actualitza errors retorna a l'HTML la variable errors actualtzada.
function actualitzaErrors(){
    document.getElementById('errors').innerHTML = errors;
}

//partidaGuanyada() mostra si la partida s'ha guanyat. Si no s'ha guanyat no mostra res.
function partidaGuanyada(){
    //si estatParaula equival a la paraula, vol dir que tots els caràcters estàn descoverts. 
    if( estatParaula===paraula){
        //substituim el teclat de pantalla per un missatge:
        document.getElementById('botonsPantalla').innerHTML = 'Has guanyat. Enhorabona. Ets un màquina.';
    }
}

//partidaPerdida() mostra si la partida s'ha perdut. Si no s'ha perdut no mostra res. 
function partidaPerduda(){
    if( errors===maximErrors){
        //actualitzem el valor de perdut (així no entrarà al condicional de actualtzaTemps()):
        perdut=true;

        //substituim el valor d'estatParaula per un missatge:
        document.getElementById('estatParaula').innerHTML = 'Estàs penjat. Mai sabràs el sentit de la vida.';
        //substituim el teclat de pantalla per un missatge:
        document.getElementById('botonsPantalla').innerHTML = 'O potser sí. Torna-ho a intentar, si vols.';
        //fem que desaparegui el temps:
        document.getElementById('tempsRestant').innerHTML = '';
    }
}

//reiniciar torna a iniciar el joc:
function reiniciar() {
    //actualitzem el valor de perdut, que permetrà que s'entri en la condició principal de actualitzaTemps():
    perdut=false;
    //es tornen a posar els errors a 0:
    errors = 0;
    //i les lletres escollides també:
    escollides = [];
    //reiniciem el temps:
    tempsRestant= 30;
    //tornem a posar la primera imatge:
    actualitzaImatge();
    //es canvia de paraula:
    paraulaAleatoria();
    //es tornen a crear els botons:
    crearBotons();
    //es mostra el nombre d'errors nou per pantalla:
    actualitzaErrors();
    //es mostra la nova incògnita:
    paraulaAEndevinar();
    // una altra manera de reiniciar seria tornar a carregar la pàgina posant a la funció: location.reload();
  }

//actualitzaTemps() actualitzarà la variable tempsRestant i la passarà a l'HTML:
function actualitzaTemps() {
    //si perdut és fals (si encara no s'ha perdut la partida):
    if (perdut==false){
        //mostrem un missatge on hi és l'element temps restant, que informarà a l'usuari del temps que li queda:
        document.getElementById('tempsRestant').innerHTML = 'Ho has de descobrir en ' + tempsRestant + ' segons. Tic tac, tic tac.';
        //si tempsRestant arriba a 0, es perd la partida.
        if(tempsRestant==0){
            //actualitzem els valors de l'html per mostrar que s'ha perdut:
            document.getElementById('imatge').src = './resources/' + maximErrors + '.png';
            document.getElementById('tempsRestant').innerHTML = ''
            //actualitzem els valors clau de l'html anulant la possibilitat de seguir jugant.
            document.getElementById('estatParaula').innerHTML = '';
            document.getElementById('botonsPantalla').innerHTML = 'Estàs perdent el temps.';
            //actualitzem el valor de perdut perque no torni a entrar a actualitzaTemps() fins que no es reinicii el joc.
            perdut=true;
        //si tempsRestant encara no és 0:
        }else{
            //restem un segon a temps restant:
            tempsRestant-=1;
        }
    }
}

//mostrem el nombre màxim d'errors en l'HTML (li passem el valor de maximErrors):
document.getElementById('maximErrors').innerHTML = maximErrors;
//aquestes funcions s'executen automàticament quan s'executa el js:
paraulaAleatoria();
crearBotons();
paraulaAEndevinar();
//cada segón (cada 1000 milisegons) s'executarà actualitzaTemps(). setTimeOut() sembla fer lo mateix que setInterval pero els comportaments son diferents:
// aquí he trobat informació de les diferències i de com fer setInterval() per que funcioni: 'https://javascript.info/settimeout-setinterval'
setInterval(() => actualitzaTemps(), 1000);