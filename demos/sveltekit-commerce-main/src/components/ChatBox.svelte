<script>
  export let htmlCode;

  window.updateInputValue = (selector, newValue) => {
    let element = document.querySelector(selector);
    element.value = newValue;
    element.dispatchEvent(new Event('input')); // manually trigger the input event
  };

  async function generateJS() {
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
    
    const responseJson = await response.json();


    const commandObjects = responseJson.commands;

    // const commandObjects = [
    //   {
    //     command: `document.querySelector('[data-ui-automation-element="search-field"]').value = 'jacket'`
    //   },
    //   {
    //     command: `document.querySelector('[data-ui-automation-element="search-button"]').click()`
    //   }
    // ]

    for (let commandObject of commandObjects) {
      await new Promise(resolve => setTimeout(resolve, 100));
    
      for (let command in commandObject) {
        // check if the command is an assignment to a DOM element's value
        let commandString = commandObject[command];
        let pattern = /document.querySelector\('(.*)'\).value = '(.*)'/;
        if (pattern.test(commandString)) {
          console.log('aaa');
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

<div class="fixed right-4 bottom-4 bg-white border border-black p-4 z-50 rounded-lg shadow-lg">
  <p class="text-sm text-gray-700 mb-2">UI Automator - Powered by Open AI API</p>

  <input type="text" id="jsprompt" placeholder="Enter a command" class="w-full border mt-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
  <button on:click={handleClick} class="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2">Do it for me!</button>
</div>
