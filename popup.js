// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Get the active tab and send a message to the content script to get the question
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "getQuestion" },
      function (response) {
        if (response && response.question) {
          // Send a message to the background script to get the answer from the API
          chrome.runtime.sendMessage(
            { action: "getAnswer", question: response.question },
            function (response) {
              if (response && response.answer) {
                // Display the answer in the popup
                document.getElementById("answer").textContent = response.answer;
              } else {
                // Display an error message in the popup
                document.getElementById("answer").textContent =
                  "Sorry, an error occurred while fetching the answer.";
              }
            }
          );
        } else {
          // Display an error message in the popup
          document.getElementById("answer").textContent =
            "Please enter a question.";
        }
      }
    );
  });

  // Button click event handler
  document.getElementById("ask-button").addEventListener("click", function () {
    var question = document.getElementById("question-input").value;

    // Send the question to your server
    fetch("https://yourserver.com/api/getAnswer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ question: question })
    })
      .then(response => response.json())
      .then(data => {
        // Display the answer received from your server
        if (data && data.answer) {
          document.getElementById("answer").textContent = data.answer;
        } else {
          document.getElementById("answer").textContent = "Sorry, an error occurred while fetching the answer.";
        }
      })
      .catch(error => {
        console.error(error);
        document.getElementById("answer").textContent = "Sorry, an error occurred while fetching the answer.";
      });
  });
});
