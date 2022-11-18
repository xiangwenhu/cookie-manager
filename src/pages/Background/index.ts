console.log('This is the background page.');
console.log('Put the background scripts here.');


// manifest.json https://developer.chrome.com/docs/extensions/mv2/manifest/event_rules/ 
// https://developer.chrome.com/docs/extensions/reference/action/#emulating-pageactions-with-declarativecontent
// Wrap in an onInstalled callback in order to avoid unnecessary work
// every time the background script is run
// chrome.runtime.onInstalled.addListener(() => {
//     // Page actions are disabled by default and enabled on select tabs
//     chrome.action.disable();

//     // Clear all rules to ensure only our expected rules are set
//     chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {

//         console.log("page changed");
//         // Declare a rule to enable the action on example.com pages
//         let rule = {
//             conditions: [
//                 new chrome.declarativeContent.PageStateMatcher({
//                     pageUrl: {
//                         schemes: ['//file'],
//                     },
//                 })
//             ],
//             actions: [new chrome.declarativeContent.ShowAction()],
//         };

//         // Finally, apply our new array of rules
//         let rules = [rule];
//         chrome.declarativeContent.onPageChanged.addRules(rules);
//     });
// });
