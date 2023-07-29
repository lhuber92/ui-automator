// export const prompt1 = (message, parsedContext) => {

//   console.log('aaaa')
// return (
//  `
// The goal is to generate JavaScript actions based on user's HTML and their requests. The actions should be in JSON format and use the 'data-ai-id' attributes of HTML elements to locate and interact with them. Make sure the JavaScript strings use single quotes and JSON strings use double quotes. No semicolons should be included in the JavaScript code.

// Given the following array of HTML elements:

// ${JSON.stringify(parsedContext.elementObjects)}

// If the user requests "search for jackets", the actions should be:

// [
//   {
//     "fillSearch": "document.querySelector('[data-ai-id="7nsBzj"]').value = 'jackets'"
//   },
//   {
//     "clickSearch": "document.querySelector('[data-ai-id="txDFRk"]').click()"
//   }
// ]

// If the user requests "open the shopping cart", the action should be:

// [
//   {
//     "clickCartButton": "document.querySelector('[data-ai-id="TIxtmj"]').click()"
//   }
// ]

// However, if the metadata for the current page says "You are now on a product page. If you are here, then do not create any more actions", no actions should be performed, regardless of the user request. In this case, return an empty array to represent that no actions are needed. The format for this would be:

// []

// In the current scenario, the metadata for the page is: ${JSON.stringify(parsedContext.pageMetadata)}. Given this metadata, what actions should be performed in response to any user request: "${message}"?



// `)
// }

export const prompt1 = (message, parsedContext) => {

  console.log('aaaa')
return (
 `
The goal is to generate JavaScript actions based on user's HTML and their requests. The actions should be in JSON format and use the 'data-ai-id' attributes of HTML elements to locate and interact with them. Make sure the JavaScript strings use single quotes and JSON strings use double quotes. No semicolons should be included in the JavaScript code.

Given the following array of HTML elements:

${JSON.stringify(parsedContext.elementObjects)}

If the user requests "search for jackets", the actions should be:

[
  {
    "fillSearch": "document.querySelector('[data-ai-id="7nsBzj"]').value = 'jackets'"
  },
  {
    "clickSearch": "document.querySelector('[data-ai-id="txDFRk"]').click()"
  }
]

If the user requests "open the shopping cart", the action should be:

[
  {
    "clickCartButton": "document.querySelector('[data-ai-id="TIxtmj"]').click()"
  }
]

However, if the metadata for the current page says "You are now on a product page. If you are here, then do not create any more actions", no actions should be performed, regardless of the user request. In this case, return an empty array to represent that no actions are needed.

In the current scenario, the metadata for the page is: ${JSON.stringify(parsedContext.pageMetadata)}.

Given this metadata and the array of HTML elements, interpret the user request "${message}" in context and generate appropriate actions. If the request can be interpreted as a search, check if it conflicts with the page metadata. If it does, try to generate another suitable action instead, such as clicking on a relevant link on the page. If no suitable action can be generated, return an empty array.




`)
}