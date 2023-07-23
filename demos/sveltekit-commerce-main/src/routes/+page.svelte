<script>
  import ThreeItemGrid from '$components/ThreeItemGrid.svelte';
  import Carousel from '$components/Carousel.svelte';
  import ChatBox from '$components/ChatBox.svelte'; // Import ChatBox here

  /** @type {import('./$types').PageData} */
  export let data;

  $: clothesCollection = data.products[0]?.node?.products?.edges;
  $: featuredCollection = data.products[1]?.node?.products?.edges;
  console.log('111')

  async function generateJS() {
      const jsprompt = document.getElementById('jsprompt').value;
      const response = await fetch('http://localhost:8200/chat/jsprompt', {
          method: 'POST',
          body: JSON.stringify({ jsprompt: jsprompt }),
          headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
          alert('Error generating JS code.');
          return;
      }
      
      const jsCode = (await response.text()).trim();
      const jsCodeWithoutQuotes = jsCode.replace(/(^")|("$)/g, '');
      eval(jsCodeWithoutQuotes); 
  }
</script>

<svelte:head>
  <title>Home – SvelteKit Commerce</title>
</svelte:head>

<main>
  <section>
    <div class="lg:h-[90vh]">
      <ThreeItemGrid products={featuredCollection} />
    </div>
  </section>
  <section>
    <Carousel items={clothesCollection} />
  </section>
  <section>
    <div
      class="flex flex-col px-8 py-20 text-white border border-black bg-dark lg:flex-row lg:items-center"
    >
      <div
        class="flex-none mb-4 mr-8 text-3xl font-black text-left md:text-4xl lg:mb-0 lg:w-1/3 lg:text-right lg:text-6xl"
      >
        Shoppr.
      </div>
      <div>
        <div class="lg:text-2xl">
          <p>Powered by UI Automator!</p>
          <p>Welcome to the Next.js Enthusiast Webshop – the one-stop online shop for all things Next.js!
          </p>
          <p>Here, we're not just about selling merchandise. We're a community of passionate developers and enthusiasts who live and breathe Next.js. Our store is a celebration of the powerful JavaScript framework that has helped us create fantastic server-side rendering and static site generation applications.
          </p>
        </div>
        <button class="mt-4 font-bold text-svelteOrange hover:text-svelteDark lg:text-2xl">
          Read it here
        </button>
      </div>
    </div>
  </section>
  <section>
    <div class="text-black">
      <ChatBox {generateJS} />
    </div>
  </section>
</main>
