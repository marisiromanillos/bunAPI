Bun.serve({
    fetch(req) {
      return new Response("hello from bun");
    },
});
console.log("Bun server running :)");