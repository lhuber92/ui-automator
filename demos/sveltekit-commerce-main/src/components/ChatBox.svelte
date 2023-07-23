<script>
  export let generateJS;

  async function handleClick() {
    await generateJS();
  }
</script>

<div class="fixed right-4 bottom-4 bg-white border border-black p-4 z-50 rounded-lg shadow-lg">
  <p class="text-sm text-gray-700 mb-2">UI Automator - Powered by Open AI API</p>
  <button id="button1" onclick="alert('Button 1 clicked!')" class="bg-blue-500 text-white py-2 px-4 rounded mr-2 hover:bg-blue-700">Button 1</button>
  <button id="button2" onclick="alert('Button 2 clicked!')" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">Button 2</button>

  <input type="text" id="jsprompt" placeholder="Enter a command" class="w-full border mt-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
  <button on:click={handleClick} class="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2">Do it for me!</button>
</div>
