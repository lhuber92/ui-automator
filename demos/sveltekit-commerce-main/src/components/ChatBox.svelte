<script>
  export let htmlCode;

  window.updateInputValue = (selector, newValue) => {
    let element = document.querySelector(selector);
    element.value = newValue;
    element.dispatchEvent(new Event('input')); // manually trigger the input event
  };


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
    htmlCode = container.innerHTML;

    return htmlCode
  }

  const getCommands = async () => {
    const staticCommands = false

    let commandObjects
    if (!staticCommands) {
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
      
      const responseJson = await response.json();

      commandObjects = responseJson.commands;
    } else {
      commandObjects = [
        {
          clickApparelLink: `document.querySelector('[data-ui-automation-element="apparel-products-link"]').click()`
        },
        {
          clickTShirt: `document.querySelector('[data-test="grid-tile"] a[href="/product/short-sleeve-t-shirt"]').click()`
        }
      ]
    }

    return commandObjects
  }

  async function generateJS() {
    const commandObjects = await getCommands();

    for (let commandObject of commandObjects) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    
      for (let command in commandObject) {
        // check if the command is an assignment to a DOM element's value
        let commandString = commandObject[command];
        let pattern = /document.querySelector\('(.*)'\).value = '(.*)'/;
        if (pattern.test(commandString)) {
          let [_, selector, value] = commandString.match(pattern);
          window.updateInputValue(selector, value);
        } else {
          console.log('bb');
          eval(commandString);
        }
      }
    }
  }

  async function handleClick() {
    await generateJS();
  }
</script>
