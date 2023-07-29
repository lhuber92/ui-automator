<script>
  import { nextAction } from '../store';
  import { navigating } from '$app/stores';
  import { generateId } from '$utils/frontendUtils.js'

  $: if ($navigating) {
    console.log($nextAction)
    console.log('Box value')
    if ($nextAction && document.getElementById('jsprompt').value) {
      console.log('Doing action after navigation:', $nextAction)
      console.log('Value in chatbox:', document.getElementById('jsprompt').value)
      handleClick();
    }
  }

    function getElementObjects(uiAutomationElements) {
      const elementObjects = Array.from(uiAutomationElements).map(element => {
        return {
          "data-ai-type": element.getAttribute('data-ai-type'),
          "data-ai-info": element.getAttribute('data-ai-info'),
          "data-ai-id": element.getAttribute('data-ai-id')
        };
      });

      return elementObjects
    }


    function getHtmlCode () {
      const bodyHTML = document.body.innerHTML;
      const domParser = new DOMParser();
      const docElement = domParser.parseFromString(bodyHTML, 'text/html');

      docElement.querySelectorAll('[data-ai-type="ignore"]').forEach(node => node.remove());

      const uiAutomationElements = docElement.querySelectorAll(
        '[data-ai-type="link"], [data-ai-type="input"], [data-ai-type="content"], [data-ai-type="button"]'
      );


      let pageMetadata = docElement.querySelectorAll('[data-ai-type="metadata"]')
      if (pageMetadata?.item(0)) {
        pageMetadata = pageMetadata.item(0).getAttribute("data-ai-info")
      } else {
        pageMetadata = "No metadata specified for page."
      }
      
      const elementObjects = getElementObjects(uiAutomationElements)

      return {
        elementObjects: elementObjects,
        pageMetadata: pageMetadata
      };
    }


  const getActions = async () => {
    let result
    const staticAction = false

    const htmlCode = JSON.stringify(getHtmlCode())

    if (!staticAction) {
      const jsprompt = document.getElementById('jsprompt').value;
      const response = await fetch('http://localhost:8200/chat/jsprompt', {
        method: 'POST',
        body: JSON.stringify({ jsprompt: jsprompt, context: htmlCode}),
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        alert('Error generating JS code.');
        return;
      }
      
      result = await response.json();
    } else {
      result = {
        actions: [
          {
            clickTShirtLink: `document.querySelector('[data-ai-info="Link that will send the user to short-sleeve-t-shirt"]').click()`
          },
        ],
        extra: 'extraInfo'
      }
    }

    return result
  }

  async function generateJS() {
    const result = await getActions()
    const actionObjects = result.actions

    if (actionObjects.length === 0) {
      nextAction.set(null)
      console.log('Done!')
      console.log(document.getElementById('jsprompt'))
      window.updateInputValue("#jsprompt", "");
    }

    for (const action of actionObjects) {
      const actionValue = Object.values(action)[0];
      let pattern = /document.querySelector\('(.*)'\).value = '(.*)'/;
  
      // await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (pattern.test(actionValue)) {
        console.log('Executing change input action')
        let [_, selector, value] = actionValue.match(pattern);
        window.updateInputValue(selector, value);
      } else {
        console.log('Executing normal action')
        eval(actionValue);
      }
    }
  }

  export const handleClick = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    await generateJS()
    nextAction.set(document.getElementById('jsprompt').value)
  }

  export const handleRobotView = () => {
    const elements = getHtmlCode()
    console.log(elements)
  }
</script>

<div class="fixed right-4 bottom-4 bg-white border border-black p-4 z-50 rounded-lg shadow-lg">
  <p class="text-sm text-gray-700 mb-2">UI Automator - Powered by Open AI API</p>

  <input type="text" id="jsprompt" placeholder="Enter a action" class="w-full border mt-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
  <button on:click={handleClick} class="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2">Do it for me!</button>
  <button on:click={handleRobotView} class="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2">Robot View</button>
</div>
