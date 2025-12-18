import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Appelle le ML Python
 * @param {Object} data
 * @returns {Promise<{score_ml:number, anomaly:boolean}>}
 */
export function predictScoreML(data) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.resolve(
      __dirname,
      "../../ml/predict.py"
    );

    const py = spawn("py", ["predict.py"], {
      cwd: path.resolve(__dirname, "../../ml"),
      stdio: ["pipe", "pipe", "pipe"]
    });

    let stdout = "";
    let stderr = "";

    py.stdin.write(JSON.stringify(data));
    py.stdin.end();

    py.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    py.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    py.on("close", () => {
      try {
        const result = JSON.parse(stdout.trim());
        resolve(result);
      } catch (e) {
        console.error("❌ ML parse error:", stdout, stderr);
        reject(stderr || stdout);
      }
    });
  });
}
