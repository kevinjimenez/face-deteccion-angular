import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as faceapi from 'face-api.js';
import * as canvas from 'canvas';
import { configuracionModeloTinyFaceDetectorOptions } from './funciones/modelo-deteccion.config';
import { EventManager } from '@angular/platform-browser';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  // obtener elemento canvas del html
  @ViewChild('caraConExpresiones', { static: true })
  caraConExpresiones: ElementRef<HTMLCanvasElement>;
  private cavasRenderCaraConExpresiones: CanvasRenderingContext2D;

  // obtener elemento canvas del html
  @ViewChild('caraConExpresionesDibujar', { static: true })
  caraConExpresionesDibujar: ElementRef<HTMLCanvasElement>;
  private cavasRendercaraConExpresionesDibujar: CanvasRenderingContext2D;

  @ViewChild('video')
  video: ElementRef<HTMLVideoElement>;

  @ViewChild('canvas')
  canvas: ElementRef;

  captures: Array<any>;

  constructor(private readonly _eventManager: EventManager) {
    this.captures = [];
  }

  async ngOnInit() {
    await this.cargarModelosFaceApi();
    await this.detectarCaraImagenConExpresiones();
    await this.detectarCaraImagenConExpresionesDibujar();
    this.streamVideo();
  }

  async ngAfterViewInit() {
    
    
  }

  streamVideo(){
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        console.log(stream);
        var video = this.video.nativeElement;
        video.srcObject = stream;
        this._eventManager.addEventListener(
          this.video.nativeElement,
          'play',
          (evento) => {
            console.log('llegue', evento);
            const canvas = faceapi.createCanvasFromMedia(
              this.video.nativeElement
            );
            this.video.nativeElement.append(canvas)
            // document.body.append(canvas);
            console.log('canvas');
            console.log(canvas);
            const displaySize = {
              width: this.video.nativeElement.width,
              height: this.video.nativeElement.height,
            };
            const a = faceapi.matchDimensions(canvas, displaySize);
            console.log(a);
            
            setInterval(async () => {
              const detections = await faceapi
                .detectAllFaces(
                  this.video.nativeElement,
                  new faceapi.TinyFaceDetectorOptions()
                )
                .withFaceLandmarks()
                .withFaceExpressions();
                console.log(detections);
                
              const resizedDetections = faceapi.resizeResults(
                detections,
                displaySize
              );
              canvas
                .getContext('2d')
                .clearRect(0, 0, canvas.width, canvas.height);
              faceapi.draw.drawDetections(canvas, resizedDetections);
              faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
              faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
            }, 1000);
          }
        );
      });
    }
  }

  capture() {
    var context = this.canvas.nativeElement
      .getContext('2d')
      .drawImage(this.video.nativeElement, 0, 0, 640, 480);
    this.captures.push(this.canvas.nativeElement.toDataURL('image/png'));
  }

  async detectarCaraImagenConExpresiones() {
    // obtener elemento canvas y se crear un render del mismo
    this.cavasRenderCaraConExpresiones = this.caraConExpresiones.nativeElement.getContext(
      '2d'
    );
    // cargar la imagen
    const imagen: any = await canvas.loadImage('../assets/images/bbt5.jpg');
    // visualizar o dibujar la imagen dentro de la etiqueta canvas
    this.cavasRenderCaraConExpresiones.drawImage(
      imagen,
      0,
      0,
      imagen.width,
      imagen.height
    );

    /************************** FACE API ********************************/

    // deteccion de imagen
    const resultadoDeteccionCara = await faceapi
      .detectAllFaces(imagen, configuracionModeloTinyFaceDetectorOptions)
      .withFaceLandmarks()
      .withFaceExpressions();
    console.log('resultadoDeteccionCara');
    console.log(resultadoDeteccionCara);
    // dibujar cuadrado en decteccion de imagen
    const displaySize = { width: imagen.width, height: imagen.height };
    const cuadroDeteccionCara = faceapi.resizeResults(
      resultadoDeteccionCara,
      displaySize
    );
    const canvasImgen = this.cavasRenderCaraConExpresiones.canvas;
    canvasImgen.style.width = imagen.width;
    canvasImgen.style.height = imagen.height;
    // cuadro con porcentaje de acertacion
    faceapi.draw.drawDetections(canvasImgen, cuadroDeteccionCara);
  }

  async detectarCaraImagenConExpresionesDibujar() {
    const probabilidadMinima = 0.05;
    this.cavasRendercaraConExpresionesDibujar = this.caraConExpresionesDibujar.nativeElement.getContext(
      '2d'
    );
    const imagen: any = await canvas.loadImage(
      '../assets/images/surprised.jpg'
    );
    this.cavasRendercaraConExpresionesDibujar.drawImage(
      imagen,
      0,
      0,
      imagen.width,
      imagen.height
    );

    /************************** FACE API ********************************/

    // deteccion de imagen
    const resultadoDeteccionCara = await faceapi
      .detectSingleFace(imagen)
      .withFaceLandmarks()
      .withFaceExpressions();
    console.log('resultadoDeteccionCara');
    console.log(resultadoDeteccionCara);
    // dibujar cuadrado en decteccion de imagen
    const displaySize = { width: imagen.width, height: imagen.height };
    const cuadroDeteccionCara = faceapi.resizeResults(
      resultadoDeteccionCara,
      displaySize
    );
    const canvasImgen = this.cavasRendercaraConExpresionesDibujar.canvas;
    canvasImgen.style.width = imagen.width;
    canvasImgen.style.height = imagen.height;
    // cuadro con porcentaje de acertacion
    faceapi.draw.drawDetections(canvasImgen, cuadroDeteccionCara);
    // dibuja puntos donde detecta la cara
    faceapi.draw.drawFaceLandmarks(canvasImgen, cuadroDeteccionCara);
    // tipo de expresion y porcentaje
    faceapi.draw.drawFaceExpressions(
      canvasImgen,
      cuadroDeteccionCara,
      probabilidadMinima
    );
    // dibuja detecta la cara
    const ountosCara = cuadroDeteccionCara.landmarks.positions;
    faceapi.draw.drawContour(
      this.cavasRendercaraConExpresionesDibujar,
      ountosCara
    );
    const perfilCara = cuadroDeteccionCara.landmarks.getJawOutline();
    const nariz = cuadroDeteccionCara.landmarks.getNose();
    const boca = cuadroDeteccionCara.landmarks.getMouth();
    const ojoIzquierdo = cuadroDeteccionCara.landmarks.getLeftEye();
    const ojoDerecho = cuadroDeteccionCara.landmarks.getRightEye();
    const cejaIzquierda = cuadroDeteccionCara.landmarks.getLeftEyeBrow();
    const cejaDerecha = cuadroDeteccionCara.landmarks.getRightEyeBrow();
    faceapi.draw.drawContour(
      this.cavasRendercaraConExpresionesDibujar,
      perfilCara
    );
    faceapi.draw.drawContour(this.cavasRendercaraConExpresionesDibujar, nariz);
    faceapi.draw.drawContour(this.cavasRendercaraConExpresionesDibujar, boca);
    faceapi.draw.drawContour(
      this.cavasRendercaraConExpresionesDibujar,
      ojoIzquierdo
    );
    faceapi.draw.drawContour(
      this.cavasRendercaraConExpresionesDibujar,
      ojoDerecho
    );
    faceapi.draw.drawContour(
      this.cavasRendercaraConExpresionesDibujar,
      cejaIzquierda
    );
    faceapi.draw.drawContour(
      this.cavasRendercaraConExpresionesDibujar,
      cejaDerecha
    );
  }

  async cargarModelosFaceApi() {
    await faceapi.loadSsdMobilenetv1Model('../assets/weights');
    await faceapi.loadTinyFaceDetectorModel('../assets/weights');
    await faceapi.loadMtcnnModel('../assets/weights');
    await faceapi.loadFaceLandmarkModel('../assets/weights');
    await faceapi.loadFaceLandmarkTinyModel('../assets/weights');
    await faceapi.loadFaceRecognitionModel('../assets/weights');
    await faceapi.loadFaceExpressionModel('../assets/weights');
  }
}
