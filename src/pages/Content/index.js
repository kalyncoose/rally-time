import { printLine } from './modules/print';

console.log('START CONTENT SCRIPT INDEX.JS')
printLine('START CONTENT SCRIPT INDEX.JS')

const planEstimateElement = document.querySelector('[aria-label="Plan Estimate editor"]');

printLine("planEstimateElement" + planEstimateElement)

const actualPointsElement = document.querySelector('[aria-label="Actual Points editor"]');

printLine("actualPointsElement" + actualPointsElement)
