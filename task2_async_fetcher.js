// pretend API that sometimes works, sometimes fails
// random stuff so we can see retry logic work
function weirdApiCall(link) {
    return new Promise((ok, fail) => {
      setTimeout(() => {
        if (Math.random() > 0.3) ok({ status: 200, info: { msg: "yay", link, time: new Date().toISOString() } });
        else fail(new Error("API died for " + link));
      }, 500); // wait a bit like network
    });
  }
  
  // my own fetch with retry idea
  async function tryFetch(stuff, repeat) {
    if (!repeat) repeat = 3; // default retries
    let lastErr = null; 
    let total = repeat + 1; // first try + retries
  
    for (let run = 1; run <= total; run++) {
      try {
        let thing = await weirdApiCall(stuff); // just call the API
        return thing.info; // return the info part
      } catch (oops) {
        lastErr = oops; // remember error
        if (run === 1 && (!stuff || typeof stuff !== "string")) throw new Error("URL bad"); // weird early check
        if (run < total) {
          console.log("Try " + run + " failed, retrying... " + (total - run) + " left");
          await new Promise(res => setTimeout(res, 1000)); // pause
        }
      }
    }
  
    throw new Error("All tries failed: " + lastErr.message); // all fail
  }
  
  // testing messy version
  (async () => {
    try {
      let data = await tryFetch("https://something.com/api", 2);
      console.log("Got:", data);
    } catch (x) {
      console.log("Err:", x.message);
    }
  })();
  
