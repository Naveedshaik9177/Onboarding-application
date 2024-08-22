import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css'; // Import the blur effect
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import Step4 from './components/Step4';
import Step5 from './components/Step5';
import './MultiStepForm.css';

// Import the image if it's in the src directory, use relative path
import initialImage from './image (2).png';

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState('forward');
  const [showImage, setShowImage] = useState(true);

  const steps = [
    <Step1 onNext={() => handleNext()} />,
    <Step2 onNext={() => handleNext()} onBack={() => handleBack()} />,
    <Step3 onNext={() => handleNext()} onBack={() => handleBack()} />,
    <Step4 onNext={() => handleNext()} onBack={() => handleBack()} />,
    <Step5 />
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setDirection('forward');
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection('backward');
      setCurrentStep(currentStep - 1);
    }
  };

  useEffect(() => {
    // Hide the image after the zoom effect completes
    if (currentStep === 0) {
      const timer = setTimeout(() => {
        setShowImage(false);
      }, 2000); // Adjust the time based on zoom duration

      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  return (
    <div className="multi-step-form-container">
      {showImage && currentStep === 0 && (
        <div className="initial-image-container">
          <LazyLoadImage
            src={initialImage} // Use the imported image
            alt="Initial Step"
            effect="blur"
            className={`initial-image ${!showImage ? 'hide' : ''}`}
          />
        </div>
      )}
      <TransitionGroup>
        <CSSTransition
          key={currentStep}
          timeout={500}
          classNames={direction === 'forward' ? 'slide-right' : 'slide-left'}
        >
          <div className="step">
            {steps[currentStep]}
          </div>
        </CSSTransition>
      </TransitionGroup>
      {/* <div className="navigation-buttons">
        {currentStep > 0 && (
          <button className="nav-button" onClick={handleBack}>Back</button>
        )}
        {currentStep < steps.length - 1 && (
          <button className="nav-button" onClick={handleNext}>Next</button>
        )}
      </div> */}
    </div>
  );
};

export default MultiStepForm;
