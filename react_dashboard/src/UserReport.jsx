import React, { useState, useRef, useEffect } from 'react';
import './UserReport.css';

export default function UserReport() {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoadingCamera, setIsLoadingCamera] = useState(false);
  const [reportData, setReportData] = useState({
    description: '',
    location: '',
    urgency: 'medium',
    consent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [cameraInitialized, setCameraInitialized] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Simple camera check when component mounts
  useEffect(() => {
    console.log('🚀 Component mounted, checking camera support...');
    
    // Simple check for camera support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera not supported in this browser');
      return;
    }
    
    // Set camera as ready for initialization
    setCameraInitialized(true);
    console.log('✅ Camera support detected, ready for user interaction');
  }, []);

  // Auto-retry camera initialization if it fails
  useEffect(() => {
    if (cameraError && !cameraInitialized) {
      const retryTimer = setTimeout(() => {
        console.log('🔄 Auto-retrying camera initialization...');
        // Clear error and try to initialize again
        setCameraError('');
        setCameraInitialized(false);
      }, 3000); // Retry after 3 seconds

      return () => clearTimeout(retryTimer);
    }
  }, [cameraError, cameraInitialized]);

  // Listen for camera permission changes
  useEffect(() => {
    const handlePermissionChange = async () => {
      try {
        const permissions = await navigator.permissions.query({ name: 'camera' });
        if (permissions.state === 'granted' && !cameraInitialized) {
          console.log('🎥 Camera permission granted, initializing...');
          await openCamera(true);
        }
      } catch (error) {
        console.log('Could not check permission changes');
      }
    };

    // Try to set up permission change listener
    try {
      navigator.permissions.query({ name: 'camera' }).then(permissions => {
        permissions.addEventListener('change', handlePermissionChange);
        return () => permissions.removeEventListener('change', handlePermissionChange);
      });
    } catch (error) {
      console.log('Permission change listener not supported');
    }
  }, [cameraInitialized]);

  const openCamera = async (silent = false) => {
    try {
      setCameraError('');
      setIsLoadingCamera(true);
      console.log('=== STARTING CAMERA INITIALIZATION ===');
      
      // Check if camera is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported in this browser');
      }

      // Check if we already have a working stream
      if (streamRef.current && streamRef.current.active) {
        console.log('✅ Camera stream already active, reusing...');
        setIsCameraOpen(true);
        setIsLoadingCamera(false);
        setCameraInitialized(true);
        return;
      }

      // Simplified constraints - start with basic video
      const constraints = {
        video: true
      };

      console.log('Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('✅ Camera access granted!');
      
      streamRef.current = stream;
      
      // Show camera interface immediately
      setIsCameraOpen(true);
      setIsLoadingCamera(false);
      setCameraInitialized(true);
      setCameraError('');
      
      if (videoRef.current) {
        const video = videoRef.current;
        console.log('Setting up video element...');
        
        // Simple setup - just set the stream and play
        video.srcObject = stream;
        
        // Try to play the video
        try {
          await video.play();
          console.log('✅ Video playing successfully');
        } catch (playError) {
          console.error('Video play failed:', playError);
          // Camera interface is already shown, video might work anyway
        }
        
      } else {
        console.log('❌ Video element not found - but camera interface is shown');
      }
    } catch (error) {
      console.error('❌ Camera error:', error);
      setIsLoadingCamera(false);
      
      if (error.name === 'NotAllowedError') {
        setCameraError('Camera permission denied. Please allow camera access.');
      } else if (error.name === 'NotFoundError') {
        setCameraError('No camera found on this device.');
      } else if (error.name === 'NotReadableError') {
        setCameraError('Camera is already in use by another application.');
      } else {
        setCameraError(`Camera error: ${error.message}`);
      }
    }
  };

  const closeCamera = () => {
    console.log('Closing camera...');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        console.log('Stopping track:', track.kind);
        track.stop();
      });
      streamRef.current = null;
    }
    setIsCameraOpen(false);
    // Don't clear capturedImage here - only clear it when retaking photo
    setCameraError('');
  };

  const capturePhoto = () => {
    console.log('Capturing photo...');
    if (videoRef.current) {
      // Check if video is actually ready
      const video = videoRef.current;
      console.log('Video state:', {
        readyState: video.readyState,
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
        paused: video.paused,
        ended: video.ended
      });
      
      if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          
          // Clear canvas first
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Draw the video frame to canvas with proper orientation
          // This ensures the captured image is not mirrored
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Convert to blob with high quality
          canvas.toBlob((blob) => {
            if (blob) {
              const imageUrl = URL.createObjectURL(blob);
              console.log('Photo captured successfully! Blob size:', blob.size, 'bytes');
              console.log('Image URL:', imageUrl);
              console.log('Image dimensions:', canvas.width, 'x', canvas.height);
              
              // Set the captured image before closing camera
              setCapturedImage({ blob, url: imageUrl });
              
              // Close camera after setting the image
              setTimeout(() => {
                closeCamera();
              }, 100);
            } else {
              console.error('Failed to create blob from canvas');
              alert('Failed to capture photo. Please try again.');
            }
          }, 'image/jpeg', 0.9); // Higher quality JPEG
        } catch (error) {
          console.error('Error capturing photo:', error);
          alert('Error capturing photo. Please try again.');
        }
      } else {
        console.error('Video not ready for capture. Ready state:', video.readyState);
        alert('Camera not ready. Please wait a moment and try again.');
      }
    } else {
      alert('Camera not available. Please try again.');
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setReportData(prev => ({
            ...prev,
            location: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enter manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setReportData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const submitReport = async () => {
    if (!capturedImage || !reportData.consent) {
      alert('Please take a photo and give consent to submit a report.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image', capturedImage.blob, 'billboard-detection.jpg');
      formData.append('description', reportData.description);
      formData.append('location', reportData.location);
      formData.append('urgency', reportData.urgency);
      formData.append('timestamp', new Date().toISOString());
      
      // Simulate API call (replace with your actual endpoint)
      const response = await fetch('http://localhost:8000/api/reports', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setShowSuccess(true);
        // Reset form
        setCapturedImage(null);
        setReportData({
          description: '',
          location: '',
          urgency: 'medium',
          consent: false
        });
        
        // Hide success message after 3 seconds
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        throw new Error('Failed to submit report');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    openCamera();
  };

  // Debug function to check camera state
  const debugCamera = () => {
    console.log('=== CAMERA DEBUG INFO ===');
    console.log('isCameraOpen:', isCameraOpen);
    console.log('isLoadingCamera:', isLoadingCamera);
    console.log('cameraError:', cameraError);
    console.log('capturedImage:', capturedImage);
    
    if (videoRef.current) {
      const video = videoRef.current;
      console.log('Video element state:', {
        readyState: video.readyState,
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
        paused: video.paused,
        ended: video.ended,
        srcObject: video.srcObject ? 'Set' : 'Not set',
        currentSrc: video.currentSrc
      });
    } else {
      console.log('Video element not found');
    }
    
    if (streamRef.current) {
      console.log('Stream tracks:', streamRef.current.getTracks().map(t => ({
        kind: t.kind,
        enabled: t.enabled,
        readyState: t.readyState
      })));
    } else {
      console.log('No stream reference');
    }
  };

  // Add debugging for capturedImage state
  useEffect(() => {
    console.log('capturedImage state changed:', capturedImage);
  }, [capturedImage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="user-report">
      {/* Header */}
      <header className="report-header">
        <h1>🚨 Report Billboard</h1>
        <p>Help keep our community safe by reporting unauthorized billboards</p>
      </header>

      {/* Success Message */}
      {showSuccess && (
        <div className="success-message">
          ✅ Report submitted successfully! Thank you for helping our community.
        </div>
      )}

      {/* Photo Captured Message */}
      {photoCaptured && (
        <div className="success-message">
          📸 Photo captured successfully! You can now fill out the report details below.
        </div>
      )}

      {/* Camera Error Message */}
      {cameraError && (
        <div className="error-message">
          ❌ {cameraError}
        </div>
      )}

      {/* Camera Section */}
      {isCameraOpen && (
        <div className="camera-container">
          <div className="camera-header">
            <h3>📸 Take Photo</h3>
            <button className="close-camera" onClick={closeCamera}>✕</button>
          </div>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            className="camera-video"
          />
          <div className="camera-controls">
            <button className="btn btn-primary" onClick={capturePhoto}>
              📸 Capture Photo
            </button>
            <button className="btn btn-secondary" onClick={openCamera}>
              🔄 Retry Camera
            </button>
            <button className="btn btn-secondary" onClick={closeCamera}>
              ❌ Cancel
            </button>
          </div>
        </div>
      )}

      {/* Photo Display */}
      {capturedImage && !isCameraOpen && (
        <div className="photo-section">
          <h3>📸 Captured Photo</h3>
          <div className="photo-preview">
            <img src={capturedImage.url} alt="Billboard detection" />
          </div>
          <div className="photo-actions">
            <button className="btn btn-secondary" onClick={retakePhoto}>
              📷 Retake Photo
            </button>
          </div>
        </div>
      )}

      {/* Report Form */}
      <div className="report-form">
        <h3>📝 Report Details</h3>
        
        {/* Photo Button */}
        {!capturedImage && (
          <div className="photo-button-section">
            <button 
              className={`btn btn-primary photo-btn ${isLoadingCamera ? 'loading' : ''}`} 
              onClick={openCamera}
              disabled={isLoadingCamera}
            >
              {isLoadingCamera ? '📸 Loading Camera...' : 
               cameraInitialized ? '📸 Take Photo of Billboard' : '📸 Initialize Camera'}
            </button>
            
            {cameraError && (
              <div className="camera-error-info">
                <p className="error-text">❌ {cameraError}</p>
                <button 
                  className="btn btn-secondary retry-btn" 
                  onClick={() => openCamera()}
                  style={{ marginTop: '5px' }}
                >
                  🔄 Retry Camera
                </button>
              </div>
            )}
            
            {!cameraError && !cameraInitialized && (
              <p className="camera-status">⏳ Camera initializing...</p>
            )}
            
            {cameraInitialized && !cameraError && (
              <p className="camera-status">✅ Camera ready!</p>
            )}
            
            <button 
              className="btn btn-secondary debug-btn" 
              onClick={debugCamera}
              style={{ marginTop: '10px', fontSize: '0.8rem' }}
            >
              🔍 Debug Camera
            </button>
            <p className="photo-hint">Take a clear photo showing the unauthorized billboard</p>
            <p className="photo-hint">Make sure to allow camera permissions when prompted</p>
          </div>
        )}

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={reportData.description}
            onChange={handleInputChange}
            placeholder="Describe what you see (e.g., 'Large unauthorized billboard blocking traffic view')"
            rows="3"
            required
          />
        </div>

        {/* Location */}
        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <div className="location-input">
            <input
              type="text"
              id="location"
              name="location"
              value={reportData.location}
              onChange={handleInputChange}
              placeholder="Street address or coordinates"
              required
            />
            <button 
              type="button" 
              className="btn btn-secondary location-btn"
              onClick={getCurrentLocation}
            >
              📍 Use My Location
            </button>
          </div>
        </div>

        {/* Urgency */}
        <div className="form-group">
          <label htmlFor="urgency">Urgency Level:</label>
          <select
            id="urgency"
            name="urgency"
            value={reportData.urgency}
            onChange={handleInputChange}
          >
            <option value="low">Low - General violation</option>
            <option value="medium">Medium - Safety concern</option>
            <option value="high">High - Immediate hazard</option>
          </select>
        </div>

        {/* Consent */}
        <div className="form-group consent-group">
          <label className="consent-label">
            <input
              type="checkbox"
              name="consent"
              checked={reportData.consent}
              onChange={handleInputChange}
              required
            />
            <span className="checkmark"></span>
            I consent to submit this report and understand that my photo and location data will be used for civic enforcement purposes.
          </label>
        </div>

        {/* Submit Button */}
        <button
          className={`btn btn-primary submit-btn ${!capturedImage || !reportData.consent ? 'disabled' : ''}`}
          onClick={submitReport}
          disabled={!capturedImage || !reportData.consent || isSubmitting}
        >
          {isSubmitting ? '📤 Submitting...' : '📤 Submit Report'}
        </button>
      </div>

      {/* Instructions */}
      <div className="instructions">
        <h3>📋 How to Report:</h3>
        <ol>
          <li>📸 Take a clear photo of the unauthorized billboard</li>
          <li>📍 Provide the location (or use GPS)</li>
          <li>📝 Describe what you see</li>
          <li>🚨 Select urgency level</li>
          <li>✅ Give consent and submit</li>
        </ol>
        
        <div className="safety-tips">
          <h4>⚠️ Safety Tips:</h4>
          <ul>
            <li>Don't put yourself in danger to take a photo</li>
            <li>Stay on public property</li>
            <li>Don't confront anyone about the billboard</li>
            <li>Report from a safe distance</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
