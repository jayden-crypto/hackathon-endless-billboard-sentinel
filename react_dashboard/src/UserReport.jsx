import React, { useState, useRef } from 'react';
import './UserReport.css';

export default function UserReport() {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [reportData, setReportData] = useState({
    description: '',
    location: '',
    urgency: 'medium',
    consent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Use back camera on mobile
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOpen(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
    setCapturedImage(null);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);
      
      canvas.toBlob((blob) => {
        const imageUrl = URL.createObjectURL(blob);
        setCapturedImage({ blob, url: imageUrl });
        closeCamera();
      }, 'image/jpeg', 0.8);
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
            className="camera-video"
          />
          <div className="camera-controls">
            <button className="btn btn-primary" onClick={capturePhoto}>
              📸 Capture Photo
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
            <button className="btn btn-primary photo-btn" onClick={openCamera}>
              📸 Take Photo of Billboard
            </button>
            <p className="photo-hint">Take a clear photo showing the unauthorized billboard</p>
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
