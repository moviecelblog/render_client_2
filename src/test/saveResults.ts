import * as fs from 'fs';
import * as path from 'path';
import { dirname } from 'path';

export function saveTestResults(results: any): { jsonPath: string; htmlPath: string; } {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const resultsDir = path.join(process.cwd(), 'test-results');

  // Créer le dossier s'il n'existe pas
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }

  // Sauvegarder les résultats en JSON
  const jsonPath = path.join(resultsDir, `test-results-${timestamp}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));

  // Créer un rapport HTML
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Test Results - ${timestamp}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1, h2 {
      color: #333;
    }
    pre {
      background-color: #f8f8f8;
      padding: 15px;
      border-radius: 4px;
      overflow-x: auto;
    }
    .success {
      color: green;
    }
    .error {
      color: red;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Test Results - ${timestamp}</h1>
    
    <h2>Claude API</h2>
    <div class="${results.claudeResponse ? 'success' : 'error'}">
      Status: ${results.claudeResponse ? 'Success' : 'Error'}
    </div>
    <pre>${JSON.stringify(results.claudeResponse, null, 2)}</pre>

    <h2>GPT API</h2>
    <div class="${results.gptResponse ? 'success' : 'error'}">
      Status: ${results.gptResponse ? 'Success' : 'Error'}
    </div>
    <pre>${JSON.stringify(results.gptResponse, null, 2)}</pre>

    <h2>Runway API</h2>
    <div class="${results.runwayResponse ? 'success' : 'error'}">
      Status: ${results.runwayResponse ? 'Success' : 'Error'}
    </div>
    <pre>${JSON.stringify(results.runwayResponse, null, 2)}</pre>

    <h2>Combined Response</h2>
    <pre>${JSON.stringify(results.combinedResponse, null, 2)}</pre>
  </div>
</body>
</html>
  `;

  const htmlPath = path.join(resultsDir, `test-report-${timestamp}.html`);
  fs.writeFileSync(htmlPath, htmlContent);

  return {
    jsonPath,
    htmlPath
  };
}
