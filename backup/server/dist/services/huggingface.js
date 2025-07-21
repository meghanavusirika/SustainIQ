"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.summarizeText = summarizeText;
exports.analyzeSentiment = analyzeSentiment;
const axios_1 = __importDefault(require("axios"));
const child_process_1 = require("child_process");
const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;
if (!HUGGINGFACE_API_TOKEN) {
    throw new Error('HuggingFace API token not set in environment variables');
}
async function summarizeText(text) {
    var _a;
    const summarizationUrl = 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn';
    const response = await axios_1.default.post(summarizationUrl, {
        inputs: text,
        parameters: {
            max_length: 300,
            min_length: 100
        }
    }, {
        headers: {
            Authorization: `Bearer ${HUGGINGFACE_API_TOKEN}`,
            'Content-Type': 'application/json',
        },
        timeout: 60000,
    });
    const summary = ((_a = response.data[0]) === null || _a === void 0 ? void 0 : _a.summary_text) || '';
    return summary;
}
async function analyzeSentiment(text) {
    try {
        const output = (0, child_process_1.execSync)(`python3 ../sentiment.py "${text.replace(/"/g, '\\"')}"`).toString().trim();
        const [label, score] = output.split(' ');
        return { label, score: parseFloat(score) };
    }
    catch (error) {
        throw new Error('Failed to run local sentiment analysis: ' + (error instanceof Error ? error.message : error));
    }
}
