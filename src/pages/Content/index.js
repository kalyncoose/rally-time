console.log('[Rally Time] Content Script Started')

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.field === "Estimate") {
        updatePlanEstimateElement(request.points)
        sendResponse({status: "Plan Estimate updated!"});
    } else if (request.field === "Actual") {
        updateActualPointsElement(request.points)
        sendResponse({status: "Actual Points updated!"});
    } else {
        sendResponse({status: `Request field "${request.field}" not known.`});
    }
});

function updateTestElement() {
    setTimeout(() => {
        while (true) {
            console.log('[Rally Time] Checking for testElement...')
            const testElement = document.querySelector('#entityId')
            if (testElement) {
                console.log('[Rally Time] Found testElement!')
                testElement.textContent = "TEST99"
                break
            }
        }
    }, 10000)
}

function updatePlanEstimateElement(points) {
    console.log('[Rally Time] Checking for planEstimateElement...')
    const planEstimateElement = document.evaluate("//input[contains(@aria-label, 'Plan Estimate')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE).singleNodeValue;
    if (planEstimateElement) {
        console.log('[Rally Time] Found planEstimateElement!')
        planEstimateElement.value = points
        planEstimateElement.setAttribute('value', points)
        planEstimateElement.dispatchEvent(new Event('input', {bubbles: true}))
    }
}

function updateActualPointsElement(points) {
    console.log('[Rally Time] Checking for actualPointsElement...')
    const actualPointsElement = document.evaluate("//input[contains(@aria-label, 'Actual Points')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE).singleNodeValue;
    if (actualPointsElement) {
        console.log('[Rally Time] Found actualPointsElement!')
        actualPointsElement.value = points
        actualPointsElement.setAttribute('value', points)
        actualPointsElement.dispatchEvent(new Event('input', {bubbles: true}))
    }
}