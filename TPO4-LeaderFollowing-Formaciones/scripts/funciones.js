function evadir(perseguidor, perseguido) {
    var velDeseada = obtenerVector(perseguidor, perseguido.position); //Obtenemos el vector normalizado
    var distancia = Phaser.Math.distance(0, 0, velDeseada.x, velDeseada.y);

    var vel = Phaser.Math.distance(0, 0, perseguidor.body.velocity.x, perseguidor.body.velocity.y);
    var prediccion;

    //Esto se hace para mejorar la precision del evade cuando se esta muy cerca entre ambos objetos, es decir
    // el perseguidor y el perseguido. 

    if (vel <= distancia / perseguidor.MAX_VELOCIDAD) {
        //Esto es T=(Distancia/Velocidad Maxima) que basicamente es cuantas actualizaciones
        //Hacen falta para que el perseguidor llegue a la posicion del perseguido
        prediccion = 10;//maxPrediction
    }
    else {
        prediccion = distancia / vel;
    }
    var posPredecida = new Phaser.Point(perseguido.position.x, perseguido.position.y);
    //Ahora multiplico los valores por la prediccion calculada arriba segun la distancia
    posPredecida = posPredecida.add(perseguido.body.velocity.x * prediccion, perseguido.body.velocity.y * prediccion);
    return flee(perseguidor, posPredecida); //Hacemo un flee para que huya desde la posicion del perseguidor desde la posPredecida
}

function obtenerVector(desde, puntoHasta) {
    var vector = Phaser.Point.subtract(puntoHasta, desde.position); //Obtenemos la velocidad deseada
    vector.normalize();	 //La normalizamos	
    return vector;
}

function flee(vehiculo, destino) {
    var vel = velocidadDeseada(vehiculo, destino); //Obtenemos la velocidad deseada
    vel.multiply(-1, -1);
    vel = steering(vel, vehiculo.body.velocity); //Obtenermos el steering
    return vel;
}

//Devuelve el vector con la velocidad deseada normalizada
function velocidadDeseada(posicion, target) {
    var vector = Phaser.Point.subtract(target, posicion); //Obtenemos la velocidad deseada
    vector.normalize();	 //La normalizamos
    vector.multiply(posicion.MAX_VELOCIDAD, posicion.MAX_VELOCIDAD); //Luego de normalizar multiplicamos por la velocidad maxima
    return vector;
}

//Obtenemos la segunda fuerza que es el steering
function steering(velDeseada, velocidad) {
    var steering = Phaser.Point.subtract(velDeseada, velocidad);
    return steering;

}

function cambiarPosicion(posicion, vector) {
    posicion.body.velocity.add(vector.x, vector.y);
}


function truncar(vector, max) {  //Éste metodo sirve para limitar la fuerza aplicada de acuerdo a la máxima velocidad que soporta el agente
    if (vector.getMagnitude() > max) {
        vector.normalize();
        vector.multiply(max, max);
    }
    return vector;
}

//Verifica la posicion de la entidad que entra por parametro, si se sale del juego
// Si se va por la izquiera lo manda por la derecha, lo mismo para arriba y por abajo
function verificarPosicion(entidad) {
    if (entidad.position.x < 0) { //Si se va por la izquiera lo manda a la derecha
        entidad.x = game.world.bounds.width / 2;
        entidad.y = game.world.bounds.height / 2;
    }
    if (entidad.position.y < 0) { //Si sev a para abjo lo manda arriba
        entidad.x = game.world.bounds.width / 2;
        entidad.y = game.world.bounds.height / 2;
    }
    if (entidad.position.x > game.world.bounds.width) { //Si se va por la dercha lo manda a la izquierda
        entidad.x = game.world.bounds.width / 2;
        entidad.y = game.world.bounds.height / 2;
    }
    if (entidad.position.y > game.world.bounds.height) { //Si se va por abajo lo manda por arriba
        entidad.x = game.world.bounds.width / 2;
        entidad.y = game.world.bounds.height / 2;
    }
}




function apuntar(vector) {  //Una vez aplicada la fuerza al agente, éste método cambia la orientación del personaje en caso de ser necesario
    var nuevoAngulo = Math.atan2(vector.x, -vector.y) * 180 / Math.PI;
    return nuevoAngulo;
}






function render() {  //esto lo hicimos para mostrar el radio del agente (activar en la presentación del trabajo)
    for (var i = 0; i < numeroNaves; ++i) {
        var circulo = new Phaser.Circle(grupo[i].position.x, grupo[i].position.y, grupo[i].RADIO);
        game.debug.geom(circulo, false);
    }
}

function setearRadio(nuevoRadio) {
    for (var i = 0; i < numeroNaves; ++i) {
        var nave = grupo[i];
        nave.RADIO = nuevoRadio;
    }
}




function teclado() {
    nave.body.velocity.x=0;
    nave.body.velocity.y=0;

    if (cursors.up.isDown) { //Se desplaza hacia arriba
        nave.body.velocity.y = -150;
    }
    if (cursors.down.isDown) { //Se desplaza hacia arriba
        nave.body.velocity.y = 150;
    }
    if (cursors.left.isDown) {
        nave.body.velocity.x = -150;
    }
    if (cursors.right.isDown) {
        nave.body.velocity.x = 150;
    }
}

