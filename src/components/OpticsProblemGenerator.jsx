import React, { useState, useEffect } from 'react';


const generateFriendlyFractionPair = () => {
  const denominators = [2, 3, 4, 5, 6, 8, 10, 12];
  let firstDenominator = denominators[Math.floor(Math.random() * denominators.length)];
  let secondDenominator;
  do {
    secondDenominator = denominators[Math.floor(Math.random() * denominators.length)];
  } while (secondDenominator === firstDenominator);

  // Ensure the second fraction is always smaller than the first
  if (firstDenominator > secondDenominator) {
    [firstDenominator, secondDenominator] = [secondDenominator, firstDenominator];
  }

  return {
    first: firstDenominator,
    second: secondDenominator
  };
};

  const generateProblemType = () => {
    const types = [
      { knowns: ['do', 'ho', 'di'], unknowns: ['f', 'hi', 'm'] },
      { knowns: ['f', 'do', 'ho'], unknowns: ['di', 'hi', 'm'] },
      { knowns: ['f', 'do', 'hi'], unknowns: ['di', 'ho', 'm'] },
      { knowns: ['f', 'di', 'ho'], unknowns: ['do', 'hi', 'm'] },
      { knowns: ['di', 'ho', 'm'], unknowns: ['do', 'hi', 'f'] },
      { knowns: ['do', 'hi', 'm'], unknowns: ['f', 'di', 'ho'] },
    ];
    return types[Math.floor(Math.random() * types.length)];
  };
  
  const calculateSALT = (mirrorType, focalLength, imageDistance, imageHeight, objectHeight) => {
    const f = Math.abs(focalLength);
    const di = imageDistance;
    const hi = imageHeight;
    const ho = objectHeight;
  
    let size, attitude, location, type;
  
    // Size
    size = Math.abs(hi) > Math.abs(ho) ? "Bigger" : Math.abs(hi) < Math.abs(ho) ? "Smaller" : "Same size";
  
    // Attitude
    attitude = hi < 0 ? "Inverted" : "Upright";
  
    // Location
    if (mirrorType === "convex") {
      location = "Behind the mirror, between the focal point and the mirror";
    } else { // convex
      if (di < 0) {
        location = "Behind the mirror";
      } else if (Math.abs(di) > f && Math.abs(di) < 2*f) {
        location = "Between c and f";
      } else if (Math.abs(di) === 2*f) {
        location = "At c";
      } else {
        location = "Beyond c";
      }
    }
  
    // Type
    type = di > 0 ? "Real" : "Virtual";
  
    return { size, attitude, location, type };
  };

  const generateWordProblem = () => {
    const objects = ["pencil", "flower", "toy car", "book", "candle"];
    const scenarios = [
      "A student is experimenting with a {mirror_type} mirror in the science lab.",
      "During an optics demonstration, a teacher uses a {mirror_type} mirror to show image formation.",
      "In a funhouse, a {mirror_type} mirror is used to create interesting visual effects.",
      "An astronomer is testing a new telescope design using a {mirror_type} mirror.",
      "A dental mirror, which is a small {mirror_type} mirror, is being used by a dentist."
    ];
  
    const mirrorType = Math.random() < 0.5 ? "concave" : "convex";
    const objectChoice = objects[Math.floor(Math.random() * objects.length)];
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)].replace("{mirror_type}", mirrorType);
  
    let focalLength = Math.random() * 45 + 5;
    focalLength = Math.round(focalLength);
    let objectDistance = Math.random() * 90 + 10;
    objectDistance = Math.round(objectDistance);
  
    if (mirrorType === "convex") {
      focalLength = -focalLength;
    }
  
    // Perform calculations with full precision
    const imageDistance = 1 / (1 / focalLength - 1 / objectDistance);
    const magnification = -imageDistance / objectDistance;
    const objectHeight = Math.round(Math.random() * 9 + 1);
    const imageHeight = objectHeight * magnification;
  
    const problemType = generateProblemType();
  
    const problemInfoMap = {
      f: `The focal length of the mirror is ${Math.abs(focalLength).toFixed(2)} cm.`,
      do: `A ${objectChoice} is placed ${objectDistance.toFixed(2)} cm in front of the mirror.`,
      ho: `The ${objectChoice} is ${objectHeight.toFixed(2)} cm tall.`,
      di: `The image is formed ${Math.abs(imageDistance).toFixed(2)} cm ${imageDistance > 0 ? 'in front of' : 'behind'} the mirror.`,
      hi: `The image is ${Math.abs(imageHeight).toFixed(2)} cm tall${imageHeight < 0 ? ' and inverted' : ''}.`,
      m: `The magnification of the image is ${Math.abs(magnification).toFixed(2)}${magnification < 0 ? ' (inverted)' : ''}.`
    };
  
    let problem = `${scenario} `;
    const givenInfo = [];
  
    problemType.knowns.forEach(known => {
      problem += problemInfoMap[known] + " ";
      givenInfo.push(known);
    });
  
    const unknownNames = {
      f: "focal length",
      do: "object distance",
      ho: "object height",
      di: "image distance",
      hi: "image height",
      m: "magnification"
    };
  
    const unknownsToFind = problemType.unknowns.map(u => unknownNames[u]).join(", ");
    problem += `Find the ${unknownsToFind} for this mirror system.`;
  
    const equations = [
      "1. Mirror equation: 1/f = 1/di + 1/do",
      "2. Magnification equation: m = hi/ho = -di/do"
    ];
  
    const detailedInfoMap = {
      type: `Type of mirror: ${mirrorType}`,
      f: `The focal length of the mirror is ${Math.abs(focalLength).toFixed(2)} cm. f = ${focalLength.toFixed(2)} cm`,
      do: `A ${objectChoice} is placed ${objectDistance.toFixed(2)} cm in front of the ${mirrorType} mirror. do = ${objectDistance.toFixed(2)} cm`,
      ho: `The ${objectChoice} is ${objectHeight.toFixed(2)} cm tall. ho = ${objectHeight.toFixed(2)} cm`,
      di: `The image is formed ${Math.abs(imageDistance).toFixed(2)} cm ${imageDistance > 0 ? 'in front of' : 'behind'} the mirror. di = ${imageDistance.toFixed(2)} cm`,
      hi: `The image is ${Math.abs(imageHeight).toFixed(2)} cm tall${imageHeight < 0 ? ' and inverted' : ''}. hi = ${imageHeight.toFixed(2)} cm`,
      m: `The magnification of the image is ${Math.abs(magnification).toFixed(2)}${magnification < 0 ? ' (inverted)' : ''}. m = ${magnification.toFixed(2)}`
    };
  
    const answers = {
      f: `Focal length (f): ${focalLength.toFixed(2)} cm`,
      do: `Object distance (do): ${objectDistance.toFixed(2)} cm`,
      ho: `Object height (ho): ${objectHeight.toFixed(2)} cm`,
      di: `Image distance (di): ${imageDistance.toFixed(2)} cm`,
      hi: `Image height (hi): ${imageHeight.toFixed(2)} cm`,
      m: `Magnification (m): ${magnification.toFixed(2)}`
    };
  
    const salt = calculateSALT(mirrorType, focalLength, imageDistance, imageHeight, objectHeight);
  
    return { problem, givenInfo, detailedInfoMap, equations, problemType, answers, salt };
  };
  
  
  
  const OpticsProblemGenerator = () => {
    const [problem, setProblem] = useState(null);
    const [showHelp, setShowHelp] = useState(false);
    const [showAnswers, setShowAnswers] = useState(false);
  
    useEffect(() => {
      handleGenerateProblem();
    }, []);
  
    const handleGenerateProblem = () => {
      setProblem(generateWordProblem());
      setShowHelp(false);
      setShowAnswers(false);
    };
  
    const toggleHelp = () => setShowHelp(!showHelp);
    const toggleAnswers = () => setShowAnswers(!showAnswers);
  
    if (!problem) return <div>Loading...</div>;
  

      return (
        <div className="p-8 max-w-3xl mx-auto bg-gray-50 min-h-screen">
          <h1 className="text-2xl font-bold mb-6">Optics Word Problem Generator</h1>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="font-bold mb-2">Problem</h2>
            <p>{problem.problem}</p>
          </div>
        <div className="flex justify-between mb-6">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={showHelp}
              onChange={toggleHelp}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2">Show Help</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={showAnswers}
              onChange={toggleAnswers}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2">Show Answers</span>
          </label>
        </div>
        {showHelp && (
        <>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="font-bold mb-2">Given Information</h2>
            <ul className="list-disc pl-5">
              <li>{problem.detailedInfoMap.type}</li>
              {problem.givenInfo.map((info, index) => (
                <li key={index}>{problem.detailedInfoMap[info]}</li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="font-bold mb-2">Equations to Use</h2>
            <ul className="list-disc pl-5">
              {problem.equations.map((equation, index) => (
                <li key={index}>{equation}</li>
              ))}
            </ul>
          </div>
        </>
      )}
{showAnswers && (
        <>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="font-bold mb-2">Correct Answers</h2>
            <ul className="list-disc pl-5">
              {problem.problemType.unknowns.map((unknown, index) => (
                <li key={index}>{problem.answers[unknown]}</li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="font-bold mb-2">Image Characteristics (SALT)</h2>
            <ul className="list-disc pl-5">
              <li>Size: {problem.salt.size}</li>
              <li>Attitude: {problem.salt.attitude}</li>
              <li>Location: {problem.salt.location}</li>
              <li>Type: {problem.salt.type}</li>
            </ul>
          </div>
        </>
      )}
      <button 
        onClick={handleGenerateProblem}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Generate New Problem
      </button>
    </div>
  );
};
  
  export default OpticsProblemGenerator;