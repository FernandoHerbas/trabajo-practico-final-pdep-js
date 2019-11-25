function Mision() {
    this.esRealizablePorUnBarco = function (unBarco){
        return unBarco.tieneSuficienteTripulacion();
    }
}
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

console.log(unaMision.esRealizablePorUnBarco(barco));
/*
function Tutor (nombre){
    this.nombre = nombre;
    this.saludar = function(){
        console.log("hola a todos soy " + this.nombre);
    }
}
var fer = new Tutor("Fer");
fer.saludar();*/