'use strict';

var express = require('express');
var http = require('http');
var socket_io = require('socket.io');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var express__default = /*#__PURE__*/_interopDefaultLegacy(express);

// Importar bibliotecas de conexión con la práctica física o serial para arduino
var rpio = require("rpio");
/*const i2c = require('i2c-bus');
const { SerialPort } = require('serialport')
const port = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 9600 }, () => {
  console.log('Port Opened')
})*/
const { SerialPort , SpacePacketParser, ReadlineParser } = require('serialport');
//const port = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 9600 }, () => {
//  console.log('Port Opened')
//})
const port = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 9600 });
//const parser = new ReadlineParser({ delimiter: '\r\n' })
const parser = new ReadlineParser();
port.pipe(parser);
var serialData = [];

var serialReceived = "";

parser.on('data', data =>{
    //console.log(data);
    serialData.push(data);
  }
);

/*
const { SerialPort } = require('serialport')
const port = new SerialPort({
  path: '/dev/ttyUSB0',
  baudRate: 9600,
})
*/

// Necesario para poder usar PWM, también el programa debe ser ejecutado como root
rpio.init({ gpiomem: false });

const pin_PlacaA=3;
const pin_PlacaB=5;
const pin_PlacaC=7;
const pin_PlacaD=8;
const pin_PlacaE=10;
const pin_PlacaF=12;
const pin_FCD=18;
const pin_FCI=22;
const pin_STEP=29;//Hola
const pin_DIR=31;
const pin_UD=15;
const pin_CS=11;
//const TURN_EVERYTHING_OFF_PIN = 5;
//const LED_PIN = 3;

//const PWM_LED_PIN = 12;
const pin_INC=13;

// Configuración de entradas y salidas
rpio.open(pin_PlacaA, rpio.OUTPUT,rpio.LOW);
rpio.open(pin_PlacaB,rpio.OUTPUT,rpio.LOW);
rpio.open(pin_PlacaC,rpio.OUTPUT,rpio.LOW);
rpio.open(pin_PlacaD,rpio.OUTPUT,rpio.LOW);
rpio.open(pin_PlacaE,rpio.OUTPUT,rpio.LOW);
rpio.open(pin_PlacaF,rpio.OUTPUT,rpio.LOW);
rpio.open(pin_FCD,rpio.INPUT,rpio.PULL_DOWN);
rpio.open(pin_FCI,rpio.INPUT,rpio.PULL_DOWN);
rpio.open(pin_STEP,rpio.OUTPUT,rpio.LOW); //STEP
rpio.open(pin_DIR,rpio.OUTPUT,rpio.LOW); //DIR
rpio.open(pin_UD,rpio.OUTPUT,rpio.LOW);
rpio.open(pin_CS,rpio.OUTPUT,rpio.LOW);
//rpio.open(TURN_EVERYTHING_OFF_PIN, rpio.INPUT);
//rpio.open(LED_PIN, rpio.OUTPUT, rpio.LOW);

rpio.open(pin_INC,rpio.OUTPUT,rpio.LOW);
/*
rpio.open(PWM_LED_PIN, rpio.PWM);

// Configuración de pwm
rpio.pwmSetClockDivider(8);
rpio.pwmSetRange(PWM_LED_PIN, 255);*/

class ExamplePractice {
  constructor() {
    this.status = "not ready";

    // Variables de ayuda
    this.pwmLedValue = 0;
    this.pwmLedValue_viejo = 0;
    this.pwmLedValue_nuevo = 0;
    this.ledStatus = 0;
    this.contadorPilas = 0;

    // variables de la version anterior
    this.selectedPlaca;
    this.motorPosition = 0; // -100 <-> 100, son 200 pero en pasos pueden ser 400    
    //this.pruebaBTIzquierda=0;
    this.actualMotorPosition=0; // 0 <-> 1000, son 200 pero en pasos pueden ser 400
    this.sliderMotorPosition=0; //Lo que llega del slider en bruto
    this.sliderPotPosition=66; //Lo que llega del slider en bruto
    this.actualPotPosition=66;  //68 estable hasta 66

    this.emergencyButtonState = false;

    // lectura de variables y lógica, similar al loop de arduino
    setInterval(() => {
      // Agregar verificación de gpio y acciones acordes

      //port.write("primerX\n");
      //port.write("segundaX\n");
      var q;
      if(serialData.length > 0)
      {
        q = serialData.shift();
        serialReceived = serialReceived + q;
        console.log("Datos recibidos: " + serialReceived);
        serialReceived = "";
      }

      //codigo del motor version anterior
      let motorPositionDelta =
        this.sliderMotorPosition - this.actualMotorPosition;
      let interruptMotor=false;

      let finalCarreraDerecha=rpio.read(pin_FCD);
      let finalCarreraIzquierda=rpio.read(pin_FCI);
      if (finalCarreraDerecha || finalCarreraIzquierda) {
        interruptMotor=true;
      }      

      if (motorPositionDelta !== 0 && !interruptMotor) {
        let direction=motorPositionDelta < 0 ? -1 : 1;        
        this.makeStep(direction);
        this.actualMotorPosition += direction;
      }

      let potPositionDelta =
        this.sliderPotPosition - this.actualPotPosition;
      
      if (potPositionDelta !== 0) {
        let directionPot=potPositionDelta < 0 ? -1 : 1;        
        this.makeStepPot(directionPot);
        console.log("sliderPosAlfa:",this.sliderPotPosition);
        console.log("actualPosAlfa:",this.actualPotPosition);
        this.actualPotPosition += directionPot;
        console.log("sliderPosBeta:",this.sliderPotPosition);
        console.log("actualPosBeta:",this.actualPotPosition);
      }
      
      //this.emergencyButtonState = this.readEmergencyStopButton();
      if (this.emergencyButtonState) {
        this.ledOff();
        this.setPWMLedValue(0);
      }
    },500);
  }

  // Funciones de ayuda
  on(selectedPlaca) {
    this.off();
    if (selectedPlaca=='placaA') {    
      rpio.write(pin_PlacaA,rpio.HIGH);
    }
    else if (selectedPlaca=='placaB') {    
      rpio.write(pin_PlacaB,rpio.HIGH);
    }
    else if (selectedPlaca=='placaC') {    
      rpio.write(pin_PlacaC,rpio.HIGH);
    }
    else if (selectedPlaca=='placaD') {    
      rpio.write(pin_PlacaD,rpio.HIGH);
    }
    else if (selectedPlaca=='placaE') {    
      rpio.write(pin_PlacaE,rpio.HIGH);
    }
    else if (selectedPlaca=='placaF') {    
      rpio.write(pin_PlacaF,rpio.HIGH);
    }
    //rpio.write(LED_PIN, rpio.HIGH);
    //this.ledStatus = 1;
  }

  off() {
    rpio.write(pin_PlacaA,rpio.LOW);    
    rpio.write(pin_PlacaB,rpio.LOW);    
    rpio.write(pin_PlacaC,rpio.LOW);  
    rpio.write(pin_PlacaD,rpio.LOW);  
    rpio.write(pin_PlacaE,rpio.LOW);    
    rpio.write(pin_PlacaF,rpio.LOW);
    //rpio.write(LED_PIN, rpio.LOW);
    //this.ledStatus = 0;

    //this.contadorPilas += 1;
    //console.log("contadorPilas:",this.contadorPilas)
  }

  makeStep(direction) {
    //let directionPinValue = Boolean(direction + 1);
    //rpio.write(mDirectionPin, direction);
    if (direction===1) {    
      rpio.write(pin_DIR,rpio.HIGH);
    }
    else if (direction===-1) {    
      rpio.write(pin_DIR,rpio.LOW);
    }
    rpio.write(pin_STEP,rpio.HIGH);
    rpio.msleep(1);
    rpio.write(pin_STEP,rpio.LOW);
    rpio.msleep(1);
  }

  makeStepPot(directionPot) {
    if (directionPot===-1) {    
      rpio.write(pin_CS,rpio.LOW);
      rpio.write(pin_UD,rpio.LOW);
      
    }
    else if (directionPot===1) {    
      rpio.write(pin_CS,rpio.LOW);
      rpio.write(pin_UD,rpio.HIGH);
      
    }
    rpio.write(pin_INC,rpio.HIGH);
    rpio.msleep(10);
    rpio.write(pin_INC,rpio.LOW);
    rpio.msleep(10);
    rpio.write(pin_CS,rpio.HIGH);
    
    //let directionPinValue = Boolean(direction + 1);
    //rpio.write(mDirectionPin, direction);
    /*
    if (direction===1) {    
      rpio.write(pin_DIR,rpio.HIGH);
    }
    else if (direction===-1) {    
      rpio.write(pin_DIR,rpio.LOW);
    }
    rpio.write(pin_STEP,rpio.HIGH);
    rpio.msleep(1);
    rpio.write(pin_STEP,rpio.LOW);
    rpio.msleep(1);*/
  }

  setPWMLedValue(value) {
    this.pwmLedValue_nuevo = value;
    if (this.pwmLedValue_nuevo > this.pwmLedValue_viejo) {
      //this.setPWMLedValue(0);
      rpio.write(pin_CS,rpio.LOW);
      rpio.write(pin_UD,rpio.HIGH);      
      rpio.pwmSetData(PWM_LED_PIN, value);
      //console.log("PIN PWM",value); 
      rpio.write(pin_CS,rpio.HIGH);
      this.pwmLedValue = value;
      //console.log(this.pwmLedValue_viejo); 
      this.pwmLedValue_viejo = this.pwmLedValue_nuevo;
      //console.log(this.pwmLedValue_nuevo);             
    }
    else if (this.pwmLedValue_nuevo < this.pwmLedValue_viejo) {
      //this.setPWMLedValue(0);
      rpio.write(pin_CS,rpio.LOW);    
      rpio.write(pin_UD,rpio.LOW);      
      rpio.pwmSetData(PWM_LED_PIN, value);
      rpio.write(pin_CS,rpio.HIGH);
      this.pwmLedValue = value;
      //console.log(this.pwmLedValue_viejo); 
      this.pwmLedValue_viejo = this.pwmLedValue_nuevo;
      //console.log(this.pwmLedValue_nuevo);
    }
    //rpio.pwmSetData(PWM_LED_PIN, value);
    //this.pwmLedValue = value;
  }

  readEmergencyStopButton() {
    return rpio.read(TURN_EVERYTHING_OFF_PIN);
  }

  // Se definen las acciones para cada comando
  command(command, value) {
    if (this.status === "initializing") {
      return {
        status: "error",
        message:
          "Regresando a valores iniciales, espera a que esté lista la práctica",
      };
    }

    if (this.emergencyButtonState) {
      return {
        status: "error",
        message:
          "No se puede recibir ningún comando mientras el botón de emergencia esté presionado",
      };
    }

    // Agregar acciones
    switch (command) {
      case "corrienteOn":
        this.on(this.selectedPlaca);
        break;
      case "corrienteOff":
        this.off();
        break;
      case "motorDerecha":
        if (value===true) {  
          port.write("D1\n");  
        }
        else if (value===false) {    
          port.write("D0\n");
        }
        break;
      case "motorIzquierda":
        if (value===true) {
          port.write("I1\n");    
        }
        else if (value===false) {
          port.write("I0\n");    
        }
        break;
      case "velocidadAlta":
        if (value===true) {
          port.write("A1\n");    
        }
        else if (value===false) {
          port.write("A0\n");    
        }
        break;
      case "velocidadMedia":
        if (value===true) {
          port.write("M1\n");    
        }
        else if (value===false) {
          port.write("M0\n");    
        }
        break;
      case "velocidadBaja":
        if (value===true) {
          port.write("B1\n");    
        }
        else if (value===false) {
          port.write("B0\n");    
        }
        break;
      case "selectPlaca":
        console.log("slectPlaca:",value);
        this.selectedPlaca=value;
        //console.log("positionPlacaF: ",value)
        break;
      case "positionPlacaG":
        console.log("positionPlacaG:",value);
        this.sliderMotorPosition=value;
        break;
      /*case "ledStatus":
        if (value === true) {
          this.ledOn();
        } else if (value === false) {
          this.ledOff();
        }
        break;*/
      case "corrienteMode":
        //onsole.log("corrienteMode:",value)
        //this.setPWMLedValue(value);

        this.sliderPotPosition=value;
        break;
      default:
        return {
          status: "error",
          message: `No se reconoce el comando ${command}`,
        };
    }

    return { status: "success" };
  }

  // Se ejecuta cuando la interfaz se conecta por primera vez
  init() {
    // Checar el estatus de las cosas y si no está en el 'estado inicial' cambio el
    // estado de la práctica a 'initializing' y mando los comandos para que esté en
    // el estado inicial

    this.off();
    this.setPWMLedValue(0);

    this.status = "ready";
  }
}

var data = { name:"Fuerza de origen magnético sobre conductores",
  objective:"El alumno comprenderá los efectos producidos por la interacción de campos magnéticos y obtendrá el modelo matemático de la fuerza magnética sobre conductores con corriente eléctrica.",
  actions:{ corrienteOn:{ name:"Encender corriente" },
    corrienteOff:{ name:"Apagar corriente" },
    velocidadBaja:{ name:"velocidad Baja",
      type:"toggle" },
    velocidadMedia:{ name:"velocidad Media",
      type:"toggle" },
    velocidadAlta:{ name:"velocidad Alta",
      type:"toggle" },
    motorDerecha:{ name:"Derecha",
      type:"toggle" },
    motorIzquierda:{ name:"Izquierda",
      type:"toggle" },
    corrienteMode:{ name:"Ajustar corriente",
      type:"slider",
      minValue:66,
      maxValue:99,
      step:1 },
    positionPlacaG:{ name:"Posición gruesa de la placa",
      type:"slider",
      minValue:0,
      maxValue:1500,
      step:1 },
    positionPlacaF:{ name:"Posición fina de la placa",
      type:"slider",
      minValue:0,
      maxValue:100,
      step:1 },
    selectPlaca:{ name:"Seleccionar una placa",
      type:"selector",
      values:{ placaA:"Placa 1",
        placaB:"Placa 2",
        placaC:"Placa 3",
        placaD:"Placa 4",
        placaE:"Placa 5",
        placaF:"Placa 6" } },
    unkownCommand:{ name:"Comando desconocido" } },
  data:{ opticaPositionD:{ name:"Limite seguro derecho",
      labels:{ "0":"Dentro del sistema",
        "1":"Fuera del sistema" } },
    opticaPositionI:{ name:"Limite seguro izquierdo",
      labels:{ "0":"Dentro del sistema",
        "1":"Fuera del sistema" } },
    mecanicaPositionD:{ name:"Limite peligroso derecho",
      labels:{ "0":"Dentro del sistema (limite max)",
        "1":"Fuera del sistema (limite max)" } },
    mecanicaPositionI:{ name:"Limite peligroso izquierdo",
      labels:{ "0":"Dentro del sistema (limite max)",
        "1":"Fuera del sistema (limite max)" } },
    pwmLedValue:{ name:"Valor de PWM del led",
      units:"grados" },
    desplazamiento:{ name:"Motor a pasos",
      labels:{ "false":"Apagada",
        "true":"Encendida" } },
    otherData:{ name:"Other data" } },
  videos:{ temperatureVideo:{ name:"Monitor de temperatura",
      url:"http://159.223.156.70:8080?action=stream",
      width:640,
      height:480 } },
  pages:[ { instructions:[ "Seleccione una placa.",
        "En caso de no estar posicionada mueva la placa con los sliders.",
        "Asegurese de que la placa seleccionada quede dentro de los limites del imán." ],
      dataIds:[ "pwmLedValue",
        "opticaPositionD",
        "opticaPositionI",
        "mecanicaPositionD",
        "mecanicaPositionI",
        "desplazamiento" ],
      actionIds:[ "selectPlaca",
        "motorDerecha",
        "motorIzquierda",
        "velocidadAlta",
        "velocidadMedia",
        "velocidadBaja",
        "unkownCommand" ],
      videoIds:[ "temperatureVideo" ] },
    { instructions:[ "Variar la corriente de 0.5A a 3A.",
        "Las muestras deben variar a 0.5A de la anterior.",
        "Cuando se tenga el valor deseado de la primera muestra de corriente encender el suministro de energía.",
        "Al terminar apagar el suministro de energía." ],
      dataIds:[ "pwmLedValue" ],
      actionIds:[ "corrienteOn",
        "corrienteOff",
        "corrienteMode" ],
      videoIds:[ "temperatureVideo" ] },
    { instructions:[ "Variar y seleccionar un valor de corriente para mantenerla constante." ],
      dataIds:[ "pwmLedValue" ],
      actionIds:[ "corrienteMode" ],
      videoIds:[ "temperatureVideo" ] },
    { instructions:[ "Seleccionar y posicionar cada placa dentro de los limittes del imán.",
        "El suministro de energía debe estar apagado, después de posicionar las placas se debe encender.",
        "Antes de volver a mover las placas se debe apagar el suministro de energía.",
        "Estos pasos se repiten las veces necesarias y al cabar con el experimento se debe apagar el suministro de energía." ],
      dataIds:[ "pwmLedValue",
        "opticaPositionD",
        "opticaPositionI",
        "mecanicaPositionD",
        "mecanicaPositionI",
        "desplazamiento" ],
      actionIds:[ "corrienteOn",
        "corrienteOff",
        "selectPlaca",
        "motorDerecha",
        "motorIzquierda",
        "velocidadAlta",
        "velocidadMedia",
        "velocidadBaja" ],
      videoIds:[ "temperatureVideo" ] } ] };

var metadata = data;
data.name;
data.objective;
data.actions;
var data = data.data;
data.videos;
data.pages;

const dataIds = Object.keys(metadata.data);

const practice = new ExamplePractice();
practice.init();

const app = express__default["default"]();
const httpServer = http.createServer(app);
const io = new socket_io.Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", async (socket) => {
  console.log("new socket connection");

  const connections = await io.fetchSockets();
  if (connections.length > 1) {
    console.log(
      "connection rejected: can't have more than one connection at the same time"
    );
    socket.emit("setup", {
      status: "error",
      message: "No se puede tener más de una conexión al mismo tiempo",
    });
    socket.disconnect();
  }

  setInterval(() => {
    const dataValues = dataIds.reduce(
      (previous, dataId) => ({
        ...previous,
        [dataId]: practice[dataId],
      }),
      {}
    );

    socket.emit("updatePracticeData", {
      status: practice.status,
      dataValues,
    });
  }, 500);

  socket.on("setup", ({ user, password, initialize }) => {
    if (user === "admin" && password === "admin") {
      try {
        socket.emit("setup", { status: "success", metadata });
        if (initialize) {
          practice.init();
        }
      } catch (e) {
        socket.emit("setup", {
          status: "error",
          message: e,
        });
      }
    } else {
      socket.emit("setup", {
        status: "ERROR",
        message: "Usuario o contraseña incorrecto",
      });
    }
  });

  socket.on("command", (command, value) => {
    console.log("Command received", { command, value });
    const result = practice.command(command, value);
    if (result.status === "error") {
      socket.emit("message", {
        status: "error",
        message: result.message,
      });
    } else {
      socket.emit("message", {
        status: "success",
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });
});

httpServer.listen(8000);
console.log("connected");
