<script>
  const getHtmlCode = () => {
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

  const getCommand = async () => {
    let commandObject
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
      
      console.log(response)
      commandObject = await response.json();
    } else {
      commandObject = {
        commands: {
          click: `document.querySelector('[data-ui-automation-element="new-short-sleeve-t-shirt"]').click()`
        },
        extra: 'extraInfo'
      }
    }

    return commandObject
  }

  async function generateJS() {
    const commandObject = (await getCommand()).commands
    const commandValue = Object.values(commandObject)[0];
    console.log(commandObject)
    console.log(commandValue)
    let pattern = /document.querySelector\('(.*)'\).value = '(.*)'/;

    console.log(document.querySelector('[data-ui-automation-element="search-field"]'))

    // await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (pattern.test(commandValue)) {
      console.log('Executing change input command')
      let [_, selector, value] = commandValue.match(pattern);
      window.updateInputValue(selector, value);
    } else {
      console.log('Executing normal command')
      eval(commandValue);
    }
  }

  async function handleClick() {
    await generateJS();
  }
</script>


<div class="fixed right-4 bottom-4 bg-white border border-black p-4 z-50 rounded-lg shadow-lg">
  <p class="text-sm text-gray-700 mb-2">UI Automator - Powered by Open AI API</p>

  <input type="text" id="jsprompt" placeholder="Enter a command" class="w-full border mt-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
  <button on:click={handleClick} class="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2">Do it for me!</button>
</div>