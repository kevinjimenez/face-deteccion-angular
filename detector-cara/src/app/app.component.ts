import { Component, OnInit } from '@angular/core';
import * as faceapi from 'face-api.js';
import * as canvas from 'canvas';
import { TNetInput } from 'face-api.js';
import * as fs from 'fs';

const { Canvas, Image, ImageData } = canvas;

console.log(typeof Canvas, canvas)
const faceDetectionNet = faceapi.nets.faceExpressionNet;
// export const faceDetectionNet = tinyFaceDetector

// SsdMobilenetv1Options
const minConfidence = 0.5

// TinyFaceDetectorOptions
const inputSize = 408
const scoreThreshold = 0.5

// faceapi.env.monkeyPatch({ Canvas, Image, ImageData })
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'detector-cara';

  async ngOnInit() {
    // const input = document.getElementById('myImg');
    // console.log(input instanceof HTMLImageElement); // true
    // // const img = await canvas.loadImage('../images/bbt1.jpg')
    // const detections = await faceapi.detectSingleFace((input as TNetInput))
    // console.log(detections);


    // await faceDetectionNet.loadFromDisk('../../weights')
  console.log(faceapi.nets)
  const img: any = (await canvas.loadImage('assets/descargar.jpg'))
  // await faceDetectionNet.locateFaces('../assets/ssd_mobilenetv1_model-shard1')
  const detections = await faceapi.detectAllFaces(img, this.faceDetectionOptions(faceDetectionNet))

  const out = faceapi.createCanvasFromMedia(img) as any
  faceapi.draw.drawDetections(out, detections)

  // faceapi.env.monkeyPatch({
  //   readFile: () => fs.readFile('../assets/ssd_mobilenetv1_model-shard1')
  //   })
    
    // const detections = await faceapi.detectAllFaces(input)
    // const image = await faceapi.fetchImage('ssets/descargar.jpg');

    // console.log(image instanceof HTMLImageElement); // true

    // // displaying the fetched image content
    // const myImg = document.getElementById('myImg');
    // myImg.src = image.src;
  }

  faceDetectionOptions(net: faceapi.NeuralNetwork<any>){
   

  return net === faceapi.nets.ssdMobilenetv1
    ? new faceapi.SsdMobilenetv1Options({ minConfidence })
    : new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })

  }  
}
