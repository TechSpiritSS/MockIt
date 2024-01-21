import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';

const CameraComponent = () => {
  const webcamRef = useRef(null);
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    console.log(imageSrc);
    // You can handle the captured image as needed
  };

  useEffect(() => {
    const checkCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setIsCameraEnabled(true);
        stream.getTracks().forEach((track) => track.stop());
      } catch (error) {
        console.error('Error accessing camera:', error.message);
        setErrorMessage('Please enable your camera to continue.');
        setIsCameraEnabled(false);
        alert('Please enable your camera to continue.');
      }
    };

    checkCameraPermission();
  }, []);

  return (
    <div>
      {isCameraEnabled ? (
        <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
      ) : (
        <p>{errorMessage}</p>
      )}
    </div>
  );
};

export default CameraComponent;
