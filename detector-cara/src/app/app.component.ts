import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as faceapi from 'face-api.js';
import * as canvas from 'canvas';
import { faceDetectionOptions } from './comatntes/detectionOpcion';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'detector-cara';

  @ViewChild('canvas1', { static: true })
  canvas2: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D;

  @ViewChild('video')
  public video: ElementRef;

  @ViewChild('canvas')
  public canvas: ElementRef;

  public captures: Array<any>;

  public constructor() {
    this.captures = [];
  }

  async ngOnInit() {
    this.ctx = this.canvas2.nativeElement.getContext('2d');
    // cargando los modelos
    await faceapi.loadSsdMobilenetv1Model('../assets/weights');
    await faceapi.loadTinyFaceDetectorModel('../assets/weights');
    await faceapi.loadMtcnnModel('../assets/weights');
    await faceapi.loadFaceLandmarkModel('../assets/weights');
    await faceapi.loadFaceLandmarkTinyModel('../assets/weights');
    await faceapi.loadFaceRecognitionModel('../assets/weights');
    await faceapi.loadFaceExpressionModel('../assets/weights');
    // renderizar imagen en canvas
    const img: any = await canvas.loadImage('../assets/images/surprised.jpg');
    this.ctx.drawImage(img, 0, 0, img.width, img.height);
    // deteccion de imagen
    const results = await faceapi
      .detectAllFaces(img, faceDetectionOptions)
      .withFaceLandmarks()
      .withFaceExpressions();
    console.log('results');
    console.log(results);
    const landmarks1 = await faceapi.detectFaceLandmarks(img);
    const landmarks2 = await faceapi.detectFaceLandmarksTiny(img);
    const descriptor = await faceapi.computeFaceDescriptor(img);


    console.log(landmarks1);
    console.log(landmarks2);
    console.log(descriptor);

    const detectionsWithLandmarks = await faceapi
  .detectAllFaces(img)
  .withFaceLandmarks()
// resize the detected boxes and landmarks in case your displayed image has a different size than the original


    // dibujar cuadrado en decteccion de imagen
    // const detectionsForSize = faceapi.resizeResults(results, {
    //   width: img.width,
    //   height: img.height,
    // });
    const c = this.ctx.canvas;
    c.style.width = img.width;
    c.style.height = img.height;
    const resizedResults = faceapi.resizeResults(detectionsWithLandmarks,  {
      width: img.width,
      height: img.height,
    })
// draw detections into the canvas
faceapi.draw.drawDetections(c, resizedResults)
// draw the landmarks into the canvas
faceapi.draw.drawFaceLandmarks(c, resizedResults)
    // faceapi.draw.drawDetections(c, detectionsForSize);
  }

  public ngAfterViewInit() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        console.log(stream);

        var video = this.video.nativeElement;
        video.srcObject = stream;
        this.video.nativeElement.play();
      });
    }
  }

  public capture() {
    var context = this.canvas.nativeElement
      .getContext('2d')
      .drawImage(this.video.nativeElement, 0, 0, 640, 480);
    this.captures.push(this.canvas.nativeElement.toDataURL('image/png'));
  }
}
