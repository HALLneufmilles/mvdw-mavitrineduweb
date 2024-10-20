// textScrambleWorker.js
onmessage = function (e) {
  const { newText, chars, oldText } = e.data;
  const length = Math.max(oldText.length, newText.length);
  let queue = [];

  for (let i = 0; i < length; i++) {
    const from = oldText[i] || "";
    const to = newText[i] || "";
    const start = Math.floor(Math.random() * 80);
    const end = start + Math.floor(Math.random() * 80);
    queue.push({ from, to, start, end });
  }

  postMessage(queue);
};
