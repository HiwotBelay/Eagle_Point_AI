// mock API function that randomly succeeds or fails so we can test retry logic - i made it random because real APIs sometimes fail and we need to test what happens when it fails
function mockApiCall(url) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      // randomly decide if it succeeds or fails - using 0.3 threshold means 70% success rate, this is good for testing because sometimes it will fail and we can see the retry logic work
      if (Math.random() > 0.3)
        resolve({
          status: 200,
          data: {
            message: "Success!",
            url: url,
            timestamp: new Date().toISOString(),
          },
        });
      else reject(new Error("API call failed for " + url));
    }, 500);
  }); // wait 500ms to simulate network delay because real API calls take time, not instant
}
// main function that fetches data with retry logic - if it fails, try again up to maxRetries times, waits 1 second between retries, returns data or throws error after all retries fail
async function fetchWithRetry(url, maxRetries) {
  // set default retry count if not provided - i chose 3 as default because it seems reasonable, if someone doesn't specify how many retries, 3 is a good number to try
  if (maxRetries === undefined) maxRetries = 3; // check if url is valid first - better to fail early with a clear error message, if the url is wrong, no point in trying to fetch it multiple times, just tell them it's wrong
  if (!url || typeof url !== "string")
    throw new Error("URL must be a valid string"); // save the error in case all retries fail - we need to remember what went wrong, also calculate total attempts - if maxRetries is 3, we try 4 times total (1 initial + 3 retries), i do maxRetries + 1 because the first attempt isn't a retry, it's the initial try
  var last_error = null,
    total_attempts = maxRetries + 1; // try the request multiple times - loop through all attempts, i start at 1 instead of 0 because it's easier to understand "attempt 1" than "attempt 0"
  for (var attempt = 1; attempt <= total_attempts; attempt++) {
    try {
      // try to get the data by calling the mock API function, if this works, we can return the data immediately, if we get here it worked! return the data part of the response, the result has status and data, but we only need the data part
      var result = await mockApiCall(url);
      return result.data;
    } catch (err) {
      // if the request failed, save the error so we can use it later if all retries fail, we need to remember what went wrong so we can tell the user, only wait and retry if this isn't the last attempt, no point waiting after the final try, we're just going to throw an error anyway
      last_error = err;
      if (attempt < total_attempts) {
        // wait 1 second before retrying - this gives the server time to recover if it was temporarily down, also prevents hammering the server with requests too quickly, log what's happening so we can see the retry in action, this is helpful for debugging and understanding what's going on
        await new Promise(function (resolve) {
          setTimeout(resolve, 1000);
        });
        console.log(
          "Attempt " +
            attempt +
            " failed, retrying... (" +
            (total_attempts - attempt) +
            " retries left)"
        );
      }
    }
  } // if we get here, all attempts failed - throw an error explaining what happened, include how many attempts were made and what the original error was, this gives the user useful information about why it failed
  throw new Error(
    "Failed after " + total_attempts + " attempts: " + last_error.message
  );
}
