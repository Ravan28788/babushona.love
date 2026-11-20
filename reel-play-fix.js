document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("mistyVideo");
  if (!video) return;

  video.controls = true;
  video.playsInline = true;

  let button = document.getElementById("safeReelPlayButton");

  if (!button) {
    button = document.createElement("button");
    button.id = "safeReelPlayButton";
    button.type = "button";
    video.insertAdjacentElement("afterend", button);
  }

  Object.assign(button.style, {
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

  let starting = false;

  function updateButton() {
    button.textContent = video.paused
      ? "▶ Play Reel"
      : "⏸ Pause Reel";
  }

  button.addEventListener("click", async () => {
    if (starting) return;

    if (!video.paused) {
      video.pause();
      updateButton();
      return;
    }

    starting = true;
    button.disabled = true;

    try {
      await video.play();
    } catch (error) {
      console.error("Reel playback failed:", error);

      if (error.name === "AbortError") {
        console.warn("Another script interrupted video playback.");
      } else {
        alert("Reel playback error: " + error.message);
      }
    } finally {
      starting = false;
      button.disabled = false;
      updateButton();
    }
  });

  video.addEventListener("play", updateButton);
  video.addEventListener("pause", updateButton);
  video.addEventListener("ended", updateButton);

  updateButton();
});
