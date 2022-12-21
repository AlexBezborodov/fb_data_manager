window.addEventListener("load", function () {
  chrome.tabs.getSelected(null, function (tab) {
    console.log("TAB", tab);
  });
});
