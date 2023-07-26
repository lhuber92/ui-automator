<script>
  import { nextCommand } from '../store';
  import { navigating } from '$app/stores';

  $: if ($navigating) {
    // If nextCommand store has value, then execute the command
    console.log($nextCommand)
    if ($nextCommand) {
      console.log('Next command:')
      console.log($nextCommand)
      document.getElementById('jsprompt').value = $nextCommand;
      handleClick();
      // nextCommand.set(null); // clear the store after command execution
    }
  }

  const getHtmlCode = () => {
    console.log('getHtmlCode')
    const bodyHTML = document.body.innerHTML;

    const domParser = new DOMParser();
    const docElement = domParser.parseFromString(bodyHTML, 'text/html');

    // Get all elements with 'data-ui-automation-element' attribute
    const uiAutomationElements = docElement.querySelectorAll('[data-ui-automation-element]');

    const container = document.createElement('div');
    uiAutomationElements.forEach((elem) => {
        // Clone the element
        let clonedElem = elem.cloneNode(true);
        
        // Remove any child elements
        clonedElem.innerHTML = '';
        
        // Append to container
        container.appendChild(clonedElem);
    });

    // Replace the body's HTML with the new HTML containing only the desired elements
    const htmlCode = container.innerHTML;

    return htmlCode
  }

  const getCommands = async () => {
    let result
    const staticCommand = false

    if (!staticCommand) {
      const jsprompt = document.getElementById('jsprompt').value;
      const response = await fetch('http://localhost:8200/chat/jsprompt', {
        method: 'POST',
        body: JSON.stringify({ jsprompt: jsprompt, htmlCode: getHtmlCode()}),
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        alert('Error generating JS code.');
        return;
      }
      
      result = await response.json();
    } else {
      result = {
        commands: [
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
    const result = await getCommands()
    const commandObjects = result.commands

    if (commandObjects.length === 0) {
      nextCommand.set(null)
      alert('Done!')
    }

    for (const command of commandObjects) {
      const commandValue = Object.values(command)[0];
      console.log(commandObjects)
      console.log(commandValue)
      let pattern = /document.querySelector\('(.*)'\).value = '(.*)'/;
  
      console.log(document.querySelector('[data-ui-automation-element="search-field"]'))
  
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (pattern.test(commandValue)) {
        console.log('Executing change input command')
        let [_, selector, value] = commandValue.match(pattern);
        window.updateInputValue(selector, value);
      } else {
        console.log('Executing normal command')
        eval(commandValue);
      }
    }
  }

  export const handleClick = () => {
    console.log('handleClick')
    generateJS()
    console.log('Setting next command:')
    console.log(document.getElementById('jsprompt').value)
    nextCommand.set(document.getElementById('jsprompt').value)
  }
</script>

<div class="fixed right-4 bottom-4 bg-white border border-black p-4 z-50 rounded-lg shadow-lg">
  <p class="text-sm text-gray-700 mb-2">UI Automator - Powered by Open AI API</p>

  <input type="text" id="jsprompt" placeholder="Enter a command" class="w-full border mt-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
  <button on:click={handleClick} class="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2">Do it for me!</button>
</div>
