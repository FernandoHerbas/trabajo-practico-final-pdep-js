/************************************ Misiones **************************************/
function Mision() {
    this.esRealizablePorUnBarco = function (unBarco){
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
/************************************ Pirata **************************************/
function Pirata(items,Monedas){

    this.items = items;
    this.Monedas = Monedas;
    this.tiene = function(item){
        return items.includes(item);
    }
    this.cantidadDeMonedas = function(){
            return this.Monedas;
    }
}
/************************************ Barco **************************************/
function Barco(capacidad,tripulantes){
    this.capacidad = capacidad; //this: es una referencia al objeto desde que se llama la funcion.
    this.tripulantes = tripulantes;
    this.tieneSuficienteTripulacion = function(){
        return cantidadTripulantes() >= capacidad * 0.9;
    }
    var cantidadTripulantes = function(){
        return tripulantes.length;
    }
}
var barco = new Barco(2, ["pedro","lucas"]);
var unaMision = new Mision();
var unPirata = new Pirata(["grogXD"],4);

BusquedaDelTesoro.prototype = Object.create(Mision.prototype);
BusquedaDelTesoro.prototype.constructor = BusquedaDelTesoro;
var unaBusqueda = new BusquedaDelTesoro();

console.log(unaMision.esRealizablePorUnBarco(barco));
console.log(unaBusqueda.esUtil(unPirata));
