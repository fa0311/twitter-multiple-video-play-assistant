const observer = new MutationObserver((records) => {
  for (const record of records) {
    for (const nodeList of record.addedNodes) {
      if (nodeList instanceof HTMLElement) {
        const tweet: HTMLElement | null = getVideoTweet(nodeList);
        if (tweet !== null) extVideo(tweet);
      }
    }
  }
});

observer.observe(document.documentElement, { childList: true, subtree: true });

const getVideoTweet = (nodelist: HTMLElement): HTMLElement | null => {
  if (nodelist.childNodes.length == 0) return null;
  if (!(nodelist.childNodes[0] instanceof HTMLVideoElement)) return null;
  const video: HTMLVideoElement = nodelist.childNodes[0];

  const cellInnerDiv: HTMLElement | null = video.closest(
    "div[data-testid=cellInnerDiv]"
  );
  if (cellInnerDiv == null) return null;
  if (cellInnerDiv.getAttribute("tmvpa-checked") === "true") return null;
  cellInnerDiv.setAttribute("tmvpa-checked", "true");

  return cellInnerDiv;
};

const extVideo = (tweet: HTMLElement) => {
  console.log(tweet);
  const videoPlayerList: NodeListOf<Element> = tweet.querySelectorAll(
    "div[data-testid=videoPlayer]"
  );
  if (videoPlayerList.length <= 1) return;
  videoPlayerList.forEach((videoPlayer: Element) => {
    videoPlayer.insertAdjacentHTML(
      "afterbegin",
      '<div class="tmvpa-video-front">'
    );
    const front: Element | null =
      videoPlayer.querySelector(".tmvpa-video-front");
    if (front === null) return;
    if (front.parentElement === null) return;
    const video = front.parentElement.querySelector("video");
    if (video instanceof HTMLVideoElement) {
      front.addEventListener("mouseover", (_) => {
        if (video.paused) {
          video.play();
          video.muted = true;
          video.volume = 0.5;
        }
      });
      front.addEventListener("click", (_) => {
        video.muted = !video.muted;
        video.volume = 0.5;
      });
      front.addEventListener("dblclick", (_) => {
        front.parentElement
          ?.querySelectorAll('div[tabindex="0"]')
          .forEach((tabindex) => {
            (tabindex.children[0].children[0] as HTMLElement).click();
          });
      });
    }
  });
};
