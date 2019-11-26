/************************************ Misiones **************************************/
function Mision() {
    this.esRealizablePorUnBarco = function (unBarco){ //this: es una referencia al objeto desde que se llama la funcion.
        return unBarco.tieneSuficienteTripulacion();
    }
}
function BusquedaDelTesoro(){
    Mision.call(this); // heredo de mision

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
}
/************************************ Barco **************************************/
function Barco(capacidad,tripulantes){
    this.capacidad = capacidad; 
    this.tripulantes = tripulantes;
    this.tieneSuficienteTripulacion = function(){
        return cantidadTripulantes() >= capacidad * 0.9;
    }
    var cantidadTripulantes = function(){
        return tripulantes.length;
    }

    this.sosSaqueablePor = function(unPirata) {
		return unPirata.pasadoDeGrog();
    }
	
}
/************************************ Ciudad Costera **************************************/
function CiudadCostera(){
    this.sosSaqueablePor = function(unPirata){
        return unPirata.nivelEbriedad() >= 50;
    }
}


/************************************ Para Probar en consola **************************************/
var unBarco    = new Barco(2, ["pedro","lucas"]);
var otroBarco  = new Barco(10,["luisito","pepe"]);
var unaMision  = new Mision();
var unPirata   = new Pirata(["mapa","grogXD","loro","brujula","espada","sombrero","pieDePalo",
                            "dienteDeOro","cinturon","manoDeGancho"],4,100);
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
var otroSaqueo  = new Saqueo(otroBarco,10);


console.log(unaMision.esRealizablePorUnBarco(unBarco));
console.log(unaBusqueda.esUtil(unPirata));
console.log(unaLeyenda.esUtil(unPirata));
console.log(unSaqueo.esUtil(unPirata));
console.log(otroSaqueo.esUtil(unPirata));
