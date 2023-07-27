<script>
  import { nextAction } from '../store';
  import { navigating } from '$app/stores';

  $: if ($navigating) {
    // If nextAction store has value, then execute the action
    console.log($nextAction)
    if ($nextAction) {
      console.log('Next action:')
      console.log($nextAction)
      document.getElementById('jsprompt').value = $nextAction;
      handleClick();
      // nextAction.set(null); // clear the store after action execution
    }
  }

    const getHtmlCode = () => {
      const bodyHTML = document.body.innerHTML;
      const domParser = new DOMParser();
      const docElement = domParser.parseFromString(bodyHTML, 'text/html');

      docElement.querySelectorAll('[data-ui-automation-ignore]').forEach(node => node.remove());

      const uiAutomationElements = docElement.querySelectorAll('[data-ui-automation-element]');

      let pageMetadata = docElement.querySelectorAll('[data-ui-automation-page]')
      if (pageMetadata?.item(0)) {
        pageMetadata = pageMetadata.item(0).getAttribute("data-ui-automation-page")
      } else {
        pageMetadata = "No metadata specified for page."
      }
      
      const elementObjects = Array.from(uiAutomationElements).map(element => {
        return {
          tag: element.tagName.toLowerCase(),
          element: element.getAttribute('data-ui-automation-element')
        };
      });


      return {
        elementObjects: elementObjects,
        pageMetadata: pageMetadata
      };
  }


  const getactions = async () => {
    let result
    const staticAction = false

    const htmlCode = JSON.stringify(getHtmlCode())

    if (!staticAction) {
      const jsprompt = document.getElementById('jsprompt').value;
      const response = await fetch('http://localhost:8200/chat/jsprompt', {
        method: 'POST',
        body: JSON.stringify({ jsprompt: jsprompt, htmlCode: htmlCode}),
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
            click: `document.querySelector('[data-ui-automation-element="new-short-sleeve-t-shirt"]').click()`
          }
        ],
        extra: 'extraInfo'
      }
    }

    return result
  }

  async function generateJS() {
    const result = await getactions()
    const actionObjects = result.commands

    if (actionObjects.length === 0) {
      nextAction.set(null)
      alert('Done!')
    }

    for (const action of actionObjects) {
      const actionValue = Object.values(action)[0];
      console.log(actionObjects)
      console.log(actionValue)
      let pattern = /document.querySelector\('(.*)'\).value = '(.*)'/;
  
      console.log(document.querySelector('[data-ui-automation-element="search-field"]'))
  
      await new Promise(resolve => setTimeout(resolve, 1000))
      
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

  export const handleClick = () => {
    console.log('handleClick')
    generateJS()
    console.log(getHtmlCode())
    console.log(JSON.stringify(getHtmlCode()))
    console.log('Setting next action:')
    console.log(document.getElementById('jsprompt').value)
    nextAction.set(document.getElementById('jsprompt').value)
  }
</script>

<div class="fixed right-4 bottom-4 bg-white border border-black p-4 z-50 rounded-lg shadow-lg">
  <p class="text-sm text-gray-700 mb-2">UI Automator - Powered by Open AI API</p>

  <input type="text" id="jsprompt" placeholder="Enter a action" class="w-full border mt-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
  <button on:click={handleClick} class="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2">Do it for me!</button>
</div>
