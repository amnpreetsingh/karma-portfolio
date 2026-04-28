const quoteText = "Forged in darkness. Drawn to light.";
const quoteElement = document.getElementById("heroQuote");

const words = quoteText.split(" ");
let currentWord = 0;

function showWords() {
    if (currentWord < words.length) {
        quoteElement.textContent += 
            (currentWord === 0 ? "" : " ") + words[currentWord];

        currentWord++;

        setTimeout(showWords, 450);
    }
}

window.addEventListener("load", () => {
    setTimeout(showWords, 2200);
});

const tiles = document.querySelectorAll('.tile');
const messageBox = document.getElementById('messageBox');

let openedCount = 0;

tiles.forEach(tile => {
    tile.addEventListener('click', () => {
        // If final message is showing and user clicks again,
        // restart the experience from this tile
        if (messageBox.classList.contains('final-message')) {
            messageBox.classList.remove('final-message');
        }

        const message = tile.getAttribute('data-message');
        messageBox.innerText = message;

        //Count unique opened tiles only once per cycle
        if (!tile.classList.contains('opened')) {
            tile.classList.add('opened');
            openedCount++;
        }

        // When all 5 tiles have been opened, show the final message after a short delay
        if (openedCount === 5) {
            setTimeout(() => {
                messageBox.innerText =
                  "What you give to the world eventually finds its way back.";
                  
                  //apply premium styling to final message

              messageBox.classList.add('final-message');

                //reset cycle so user can restart by clicking any tile again
                openedCount = 0;
                tiles.forEach(t => t.classList.remove('opened'));

            }, 1000);
        }
    });
});


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: " AIzaSyCHoaNg2yHsB-IC2xn0FM6zTy_dTiSpaGw",
  authDomain: "karma-ap.firebaseapp.com",
  projectId: "karma-ap",
  storageBucket: "karma-ap.firebasestorage.app",
  messagingSenderId: "875299631674",
  appId: "1:875299631674:web:b2633f573fc2ea366f3b03"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let lastCommentTime = 0;

const commentForm = document.getElementById("commentForm");
const commentList = document.getElementById("commentList");

async function loadComments() {
  commentList.innerHTML = "";

  const q = query(
    collection(db, "comments"),
    orderBy("timestamp", "desc")
  );

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    const data = doc.data();

    //const div = document.createElement("div");
   // div.classList.add("comment-box");

   // div.innerHTML = `
     // <strong>${data.name}</strong>
     // <p>${data.comment}</p>
  //  `;

  //  commentList.appendChild(div);
      const div = document.createElement("div");
div.classList.add("comment-box");

const nameElement = document.createElement("strong");
nameElement.textContent = data.name;

const commentElement = document.createElement("p");
commentElement.textContent = data.comment;

div.appendChild(nameElement);
div.appendChild(commentElement);

commentList.appendChild(div);
  });
}

commentForm.addEventListener("submit", async (e) => {
  e.preventDefault();
    const now = Date.now();

if (now - lastCommentTime < 30000) {
    alert("Please wait 30 seconds before posting again.");
    return;
}



 
  const name =
    document.getElementById("nameInput").value || "Anonymous";

  const comment =
    document.getElementById("commentInput").value;

    const captchaResponse = grecaptcha.getResponse();

if (!captchaResponse) {
    alert("Please verify captcha first.");
    return;
}

  if (!comment.trim()) return;

  await addDoc(collection(db, "comments"), {
    name,
    comment,
    timestamp: serverTimestamp()
  });

    lastCommentTime = now;
  commentForm.reset();
  grecaptcha.reset();
  loadComments();
});

loadComments();
