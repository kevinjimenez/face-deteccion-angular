import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as faceapi from 'face-api.js';
import * as canvas from 'canvas';
import { TNetInput } from 'face-api.js';
import * as fs from 'fs';
import { faceDetectionOptions } from './comatntes/detectionOpcion';

const { Canvas, Image, ImageData } = canvas;

console.log(typeof Canvas, canvas);
const faceDetectionNet = faceapi.nets.faceExpressionNet;
// export const faceDetectionNet = tinyFaceDetector

// SsdMobilenetv1Options
const minConfidence = 0.5;

// TinyFaceDetectorOptions
const inputSize = 408;
const scoreThreshold = 0.5;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'detector-cara';
  @ViewChild('canvas', { static: true }) 
  canvas2: ElementRef<HTMLCanvasElement>;  
  private ctx: CanvasRenderingContext2D;
  // imagen = new Image();

  async ngOnInit() {
    this.ctx = this.canvas2.nativeElement.getContext('2d');
    // faceapi.env.monkeyPatch({
    //   readFile: () => fs.readFile('../assets/ssd_mobilenetv1_model-shard1')
    // });
    await faceapi.loadSsdMobilenetv1Model('../assets/weights');
    await faceapi.loadTinyFaceDetectorModel('../assets/weights');
    await faceapi.loadMtcnnModel('../assets/weights');
    await faceapi.loadFaceLandmarkModel('../assets/weights');
    await faceapi.loadFaceLandmarkTinyModel('../assets/weights');
    await faceapi.loadFaceRecognitionModel('../assets/weights');
    await faceapi.loadFaceExpressionModel('../assets/weights');
    console.log(await faceapi.nets.faceLandmark68Net.isLoaded);
    console.log(await faceapi.nets.faceExpressionNet.isLoaded);
    const img: any = await canvas.loadImage('../assets/images/surprised.jpg'); //../images/surprised.jpg
    // this.imagen.src = "../../../../wwwroot/dist/assets/blackBoards/NCAA_mhalfcourt_500x410.png";
    // this.imagen.onload = ()=> {
      let imga:any = document.getElementById("myImg");
      this.ctx.drawImage(img, 0, 0, img.width, img.height);
  //}  
    
    const results = await faceapi.detectAllFaces(img, faceDetectionOptions)
    .withFaceLandmarks()
    .withFaceExpressions();
    console.log('results');
    console.log(results);

    const detectionsForSize = faceapi.resizeResults(results, {
      width: img.width,
      height: img.height,
    });        
    const c = this.ctx.canvas
    c.style.width = img.width;
    c.style.height = img.height;            
    var image = document.getElementById('myImg');
    faceapi.draw.drawDetections(c, detectionsForSize);
    this.ctx.moveTo(100,100);
  }

  faceDetectionOptions(net: faceapi.NeuralNetwork<any>) {
    return net === faceapi.nets.faceExpressionNet
      ? new faceapi.SsdMobilenetv1Options({ minConfidence })
      : new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold });
  }
}
