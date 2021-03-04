import './App.css';
import Webcam from "react-webcam";
import React , {useRef,useCallback, useEffect} from 'react';
import * as tf from "@tensorflow/tfjs";
import {drawRect} from './utilities';

import * as cocoSsd from "@tensorflow-models/coco-ssd";
function App() {

  useEffect(()=>{

runCoco();

  },[]);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runCoco = async()=>{


    const net = await cocoSsd.load();

    setInterval(()=>{

      detect(net);
    },10);
  };

  const detect = async(net)=>{



    if(typeof webcamRef.current!=="undefined" && webcamRef.current!==null && webcamRef.current.video.readyState===4)
    {

      const video = webcamRef.current.video;

      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;


      console.log("video detected");



      const obj = await net.detect(video);

      const ctx = canvasRef.current.getContext("2d");
      drawRect(obj, ctx); 

      console.log(obj);

    }
  }



  return (
    <div className="App">

    <div className="webcam">

    <Webcam
    
    audio={false}
    height={720}
    ref={webcamRef}
    screenshotFormat="image/jpeg"
    width={1280}
    videoConstraints={videoConstraints}
    />

    <canvas
    ref={canvasRef}
    style={{
      position: "absolute",
      marginLeft: "auto",
      marginRight: "auto",
      left: 0,
      right: 0,
      textAlign: "center",
      zindex: 8,
      width: 640,
      height: 480,
    }}
  />
    </div>

    
    
    </div>
  );
}

export default App;
