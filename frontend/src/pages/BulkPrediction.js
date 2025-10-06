import { useState } from "react";
import axios from "axios";
import { CosmicButton } from "../components/CosmicButton";
import { Upload, Download } from "lucide-react";

export default function BulkPrediction() {
  const [file, setFile] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Handle CSV file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith(".csv")) {
        alert("Please upload a CSV file");
        return;
      }
      setFile(selectedFile);
    }
  };

  // Split CSV into chunks to avoid API size issues
  const splitCsv = async (file, chunkSize = 200) => {
    const text = await file.text();
    const lines = text.split("\n");
    const header = lines[0];
    const rows = lines.slice(1);
    const chunks = [];

    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunkRows = rows.slice(i, i + chunkSize);
      const blob = new Blob([header + "\n" + chunkRows.join("\n")], { type: "text/csv" });
      chunks.push(new File([blob], `chunk_${i / chunkSize + 1}.csv`));
    }
    return chunks;
  };

  // Convert API JSON results to CSV string
  const jsonToCsv = (results) => {
    if (!results || !results.length) return "";

    const header = [
      "row_number",
      "prediction",
      "confidence",
      "probability_exoplanet",
      "probability_not_exoplanet",
      ...Object.keys(results[0].input_data)
    ];

    const rows = results.map((r) => [
      r.row_number,
      r.classification, // human-readable prediction
      r.confidence,
      r.probability_exoplanet,
      r.probability_not_exoplanet,
      ...Object.values(r.input_data)
    ]);

    return [header.join(","), ...rows.map(r => r.join(","))].join("\n");
  };

  // Handle upload and API prediction
  const handleUploadAndPredict = async () => {
    if (!file) {
      alert("Please select a CSV file first");
      return;
    }

    setIsProcessing(true);
    setDownloadUrl("");
    setProgress(0);

    try {
      const chunks = await splitCsv(file, 200); // split CSV into chunks
      let mergedResults = [];

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const formData = new FormData();
        formData.append("file", chunk);

        const response = await axios.post(
          "https://touseefahmad-nasa-exoplanet-docker.hf.space/predict_csv",
          formData,
          { responseType: "json" }
        );

        // Parse API JSON response
        const data = response.data;
        if (data.detailed_results) {
          mergedResults = mergedResults.concat(data.detailed_results);
        }

        setProgress(Math.round(((i + 1) / chunks.length) * 100));
      }

      if (mergedResults.length === 0) {
        alert("No data returned from API. Check your CSV file.");
        return;
      }

      const csvData = jsonToCsv(mergedResults);

      const blob = new Blob([csvData], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
      alert("Bulk prediction completed!");
    } catch (error) {
      console.error(error);
      alert("Error during prediction. File may be too large or malformed.");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 bg-background text-foreground">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12 animate-float">
          <h1 className="text-5xl font-heading font-bold mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Bulk Exoplanet Prediction
          </h1>
          <p className="text-foreground/70 text-lg font-body">
            Upload a CSV file containing multiple exoplanet parameters for batch
            classification
          </p>
        </div>

        <div className="holographic-card p-6 mb-8 space-y-6">
          {/* File Upload */}
          <div className="border-2 border-dashed border-primary/40 rounded-2xl p-6 text-center transition-all duration-300 hover:border-primary/70 hover:bg-primary/5">
            <input
              type="file"
              id="csv-upload"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="csv-upload"
              className="cursor-pointer flex flex-col items-center gap-3"
            >
              <Upload className="w-16 h-16 text-primary" />
              <p className="text-xl font-heading font-bold text-foreground mb-2">
                {file ? file.name : "Choose CSV File"}
              </p>
              <p className="text-sm text-muted-foreground font-body">
                Click to browse or drag and drop your CSV file here
              </p>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <CosmicButton
              variant="cosmic"
              size="lg"
              onClick={handleUploadAndPredict}
              disabled={!file || isProcessing}
              className="min-w-[200px] flex justify-center items-center gap-2"
            >
              {isProcessing
                ? `Processing... (${progress}%)`
                : <>
                    <Upload className="w-5 h-5" /> Upload & Predict
                  </>}
            </CosmicButton>

            {downloadUrl && (
              <a href={downloadUrl} download="predictions.csv">
                <CosmicButton
                  variant="holographic"
                  size="lg"
                  className="flex justify-center items-center gap-2"
                >
                  <Download className="w-5 h-5" /> Download Results
                </CosmicButton>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
