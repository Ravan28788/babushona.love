document.addEventListener("DOMContentLoaded", function () {
  const video = document.getElementById("mistyVideo");
  if (!video) return;

  video.controls = true;
  video.setAttribute("playsinline", "");
  video.style.pointerEvents = "auto";

  const wrapper = video.parentElement;
  wrapper.style.position = "relative";

  const btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = "▶ Play Reel";
  btn.setAttribute("aria-label", "Play romantic reel");

  Object.assign(btn.style, {
    display: "block",
    margin: "12px auto",
    padding: "12px 24px",
    background: "#e91e63",
    color: "white",
    border: "none",
    borderRadius: "30px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    position: "relative",
    zIndex: "999"
  });

  video.insertAdjacentElement("afterend", btn);

  btn.addEventListener("click", async function () {
    try {
      if (video.paused) {
        video.muted = false;
        await video.play();
        btn.textContent = "⏸ Pause Reel";
      } else {
        video.pause();
        btn.textContent = "▶ Play Reel";
      }
    } catch (error) {
      console.error("Reel playback error:", error);
      alert("Video play nahi ho rahi: " + error.message);
    }
  });

  video.addEventListener("ended", function () {
    btn.textContent = "▶ Play Reel";
  });
});
