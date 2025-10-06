import { useState } from "react";
import axios from "axios";

export default function SinglePrediction() {
  const [formData, setFormData] = useState({
    period: "",
    radius: "",
    depth: "",
    duration: "",
    stellar_temp: "",
    stellar_radius: "",
    stellar_mass: "",
    snr: "",
    semi_major_axis: "",
    inclination: "",
    eccentricity: "",
  });

  const [result, setResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value === "" ? "" : Number(value),
    });
  };

  const handlePredict = async () => {
    // Validate inputs
    for (const key in formData) {
      if (formData[key] === "" || isNaN(formData[key])) {
        alert(`Please enter a valid number for ${key.replace(/_/g, " ")}`);
        return;
      }
    }

    setIsProcessing(true);
    setResult(null);

    try {
      const response = await axios.post(
        "https://touseefahmad-nasa-exoplanet-docker.hf.space/predict_single",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      let data = response.data;

      // Parse if returned as string
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch (err) {
          console.error("Could not parse API response:", err);
        }
      }

      setResult(data); // Save the entire response
    } catch (error) {
      console.error(error);
      if (error.response?.status === 422) {
        alert("Validation error: check your input values.");
      } else {
        alert("Error predicting transit. Try again later.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6">
      <h2 className="text-3xl font-bold mb-6">Single Exoplanet Prediction</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full mb-4">
        {Object.keys(formData).map((key) => (
          <input
            key={key}
            name={key}
            type="number"
            step="any"
            placeholder={key.replace(/_/g, " ")}
            value={formData[key]}
            onChange={handleChange}
            className="p-3 rounded-lg bg-[hsl(var(--card)/30)] border border-[hsl(var(--primary)/30)] text-white"
          />
        ))}
      </div>

      <button
        onClick={handlePredict}
        disabled={isProcessing}
        className={`px-6 py-2 rounded-lg ${
          isProcessing ? "bg-gray-600" : "bg-green-600 hover:bg-green-500"
        }`}
      >
        {isProcessing ? "Processing..." : "Predict"}
      </button>

      {result && (
        <div className="mt-6 p-4 bg-[hsl(var(--card)/30)] rounded-lg shadow-md w-full max-w-md">
          <h3 className="text-lg font-bold mb-2">Prediction Result:</h3>

          <p className="font-bold text-xl">{result.prediction?.result}</p>
          <p>Classification: {result.prediction?.classification}</p>
          <p>Confidence Level: {result.prediction?.confidence_level}</p>

          <h4 className="mt-4 font-semibold">Probabilities:</h4>
          <p>Exoplanet: {result.probabilities?.exoplanet}%</p>
          <p>Not Exoplanet: {result.probabilities?.not_exoplanet}%</p>

          <h4 className="mt-4 font-semibold">Interpretation:</h4>
          <p>{result.interpretation?.message}</p>
          <p>Probability: {result.interpretation?.probability_percentage}</p>
        </div>
      )}
    </div>
  );
}
