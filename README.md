Getting started:

1) Rename the .env.example file in **ui-automator/demos/backend** into .env and fill in your Open AI api key

2) Run `npm run start:dev` in **ui-automator/demos/backend**

3) Run `npm run dev` in **ui-automator/demos/sveltekit-commerce-main**

4) Go to http://localhost:5174/

Now it is using GPT 3.5, will probably be better with GPT 4. The main logic is in these 2 files:

* **ui-automator/demos/sveltekit-commerce-main/src/components/ChatBox.svelte**
* **ui-automator/demos/backend/src/services/chat-service.js**

Press on "Robot View" to console log out the things that the AI but can see.

See **demos/sveltekit-commerce-main/src/components/SearchBar.svelte** for example on how tagging of elements are done. Also, "ignore" tags can be used when needed, as in **demos/sveltekit-commerce-main/src/routes/product/[handle]/+page.svelte**

Example prompts I've tested:
* open the shopping cart (from front page)
* go to the front page (from search page)
* find me a t-shirt (from front page -> search page -> product page) (sometimes found first after after some browsing around by the bot)
* click on the second product (from front page)