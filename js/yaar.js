/************************************ Misiones **************************************/
function Mision() {
    this.esRealizablePor = function (unBarco){ //this: es una referencia al objeto desde que se llama la funcion.
        return unBarco.tieneSuficienteTripulacion();
    }
}
function BusquedaDelTesoro(){
    Mision.call(this); // heredo de mision
//1
    this.esUtil = function(unPirata){
        return tieneAlgunItemObligatorio(unPirata) && unPirata.cantidadDeMonedas() <= 5; 
        //;
    }
    var tieneAlgunItemObligatorio = function(unPirata){
        return ["brújula", "mapa", "grogXD"].some(unPirata.tiene); //Se comporta como el any, no es necesario mandar el parametro, js infiere
    }                                                              //que es un elemento de la coleccion
}

function ConvertirseEnLeyenda(itemObligatorio){
    Mision.call(this);
    
    this.itemObligatorio = itemObligatorio;
    this.esUtil = function(unPirata){
        return unPirata.cantidadDeItems() >= 10 && unPirata.tiene(this.itemObligatorio);
    }
}

function Saqueo(victima,monedasNecesarias){
    Mision.call(this);
    this.victima = victima;
    this.monedasNecesarias = monedasNecesarias;

    this.esUtil = function(unPirata){
        return  (unPirata.cantidadDeMonedas()<this.monedasNecesarias) && victima.sosSaqueablePor(unPirata);
    }
}
/************************************ Pirata **************************************/
function Pirata(items,monedas,nivelDeEbriedad){

    this.items = items;
    this.monedas = monedas;
    this.nivelDeEbriedad = nivelDeEbriedad;

    this.tiene = function(item){
        return items.includes(item);
    }
    this.cantidadDeMonedas = function(){
            return this.monedas;
    }

    this.cantidadDeItems = function(){
        return items.length;
    }
    this.pasadoDeGrog = function(){
        return this.nivelDeEbriedad >= 90;
    }
    this.nivelEbriedad = function(){
        return this.nivelDeEbriedad;
    }
    /*get nivelEbriedad() { //seria un getter pero no me funciona :/
        return this.nivelDeEbriedad; 
      }*/
    this.tomarGrog = function(){
        this.nivelDeEbriedad += 5;
        gastarMoneda();
    }
    var gastarMoneda = function () {
        validarGastarMonedas();
        this.monedas--;
    }
    var validarGastarMonedas = function(){
        if(this.cantidadDeMonedas() === 0){
            throw console.error( 'Monedas insuficientes');
        }
    }
}
/************************************ Barco **************************************/
function Barco(capacidad,tripulantes,mision){
    this.capacidad = capacidad; 
    this.tripulantes = tripulantes;
    this.mision = mision;
    var self = this;
    this.tieneSuficienteTripulacion = function(){
        return this.cantidadTripulantes() >= this.capacidad * 0.9;
    }
    this.cantidadTripulantes = function(){
        return tripulantes.length;
    }

    this.sosSaqueablePor = function(unPirata) {
		return unPirata.pasadoDeGrog();
    }

//2) a-  
	this.puedeUnirse = function(unPirata){
        return this.hayLugar() && this.mision.esUtil(unPirata);
    }

    this.hayLugar = function(){
        return this.cantidadTripulantes() < this.capacidad;
    }
//   b-
    this.agregar = function(unPirata){
        if(this.puedeUnirse(unPirata)){
            this.tripulantes.push(unPirata);
        }
    }
//   c-
    this.cambiarMision = function(unaMision){
        eliminarInutiles(tripulantes,unaMision);
        this.mision = unaMision; 
    }
    var eliminarInutiles = function(tripulantes,unaMision){//Como no existe un metodo que elimine segun una condicion,
        for(var i = tripulantes.length - 1; i>=0 ;i--){    //ni tampoco un metodo que elimine un objeto determinado, 
            if(!(unaMision.esUtil(tripulantes[i])))        //use un poco de codigo imperativo.
                tripulantes.splice(i,1);
        }
        return tripulantes;
    }
//3  a-
    this.elPirataMasEbrio = function(){
        return tripulantes.reduce((tripulante1,tripulante2) => 
                                   Math.max(tripulante1.nivelEbriedad(),tripulante2.nivelEbriedad()));   
    } 
//   b-
    this.anclarEn = function(unaCiudad){
        this.todosTomanGrog();
        this.perderMasEbrioEn(unaCiudad);    
    }
    this.todosTomanGrog = function(){
        tripulantes.forEach(unTripulante => {
            unTripulante.tomarGrog();
        });
    }
    this.perderMasEbrioEn = function(unaCiudad){
        var posicion = tripulantes.indexOf(tripulantes.elPirataMasEbrio());
        tripulantes.splice(posicion,1);
        unaCiudad.sumarHabitante();
    }
//4  a-
    this.esTemible = function(){
        mision.esRealizablePor(self);
    }
}
/************************************ Ciudad Costera **************************************/
function CiudadCostera(habitantes){
    this.habitantes = habitantes;
    this.sosSaqueablePor = function(unPirata){
        return unPirata.nivelEbriedad() >= 50;
    }
    this.sumarHabitante = function() {
        this.habitantes = this.habitantes +1;
    }
}


/************************************ Para Probar en consola **************************************/

var pirata1    = new Pirata(["mapa","grogXD","loro","brujula","espada","sombrero","pieDePalo",
                            "dienteDeOro","cinturon","manoDeGancho"],4,100);
var pirata2    = new Pirata(["dienteDeOro","cinturon"],4,120);
var pirata3    = new Pirata(["dienteDeOro","sombrero"],4,80);

var unaMision  = new Mision();
var unaCiudad  = new CiudadCostera();

BusquedaDelTesoro.prototype = Object.create(Mision.prototype); // Para que contenga los metodos del prototipo Mision
BusquedaDelTesoro.prototype.constructor = BusquedaDelTesoro; //y tambien los suyos.(o algo asi XD)

ConvertirseEnLeyenda.prototype = Object.create(Mision.prototype); 
ConvertirseEnLeyenda.prototype.constructor = ConvertirseEnLeyenda;

Saqueo.prototype = Object.create(Mision.prototype); 
Saqueo.prototype.constructor = Saqueo;

var unaBusqueda = new BusquedaDelTesoro();
var unaLeyenda  = new ConvertirseEnLeyenda("mapa");
var unSaqueo    = new Saqueo(unaCiudad,5);
var otroBarco  = new Barco(10,[pirata2,pirata3],unaMision);
var otroSaqueo  = new Saqueo(otroBarco,10);
var unBarco    = new Barco(4, [pirata2,pirata3],unSaqueo);



//console.log('Verifica si es una mision es puede ser hecha por un barco',unaMision.esRealizablePor(unBarco));
console.log('Pirata1 es util para la mision busqueda del tesoro:',unaBusqueda.esUtil(pirata1));
console.log('Pirata1 es util para la mision convertirse en leyenda: ',unaLeyenda.esUtil(pirata1));
console.log('Pirata1 es util para la mision saqueo a una ciudad costera: ',unSaqueo.esUtil(pirata1));
console.log('Pirata1 es util para la mision saqueo a un barco: ',otroSaqueo.esUtil(pirata1));

console.log('Saber si Pirata1 puede formar parte de la tripulacion de un barco: ',unBarco.puedeUnirse(pirata1));
console.log('Saber si Pirata1 puede formar parte de la tripulacion de un barco: ',unBarco.puedeUnirse(pirata1));
unBarco.agregar(pirata1);
console.log('Agregar a pirata1 a un barco: ' ,unBarco.cantidadTripulantes() === 3);
