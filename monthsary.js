/* =====================================================================
   MONTHSARY.JS
   All interactivity and animation logic for the monthsary website.
   ===================================================================== */

const userPrefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* =======================================================================
   1. SCROLL PROGRESS CANDY TRAIL
   Fills the side rail and moves the heart marker as the page is scrolled.
   ======================================================================= */
const progressFillElement = document.getElementById('scroll-progress-fill');
const progressHeartElement = document.getElementById('scroll-progress-heart');
const progressRailElement = document.getElementById('scroll-progress-rail');

function updateScrollProgress(){
  const scrolledPixels = window.scrollY;
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = scrollableHeight > 0
    ? Math.min(100, Math.max(0, (scrolledPixels / scrollableHeight) * 100))
    : 0;

  progressFillElement.style.height = scrollPercent + '%';

  const railHeight = progressRailElement.offsetHeight;
  const filledPixels = railHeight * (scrollPercent / 100);
  const heartOffsetY = railHeight / 2 - filledPixels;
  progressHeartElement.style.transform = 'translate(0, calc(-50% + ' + heartOffsetY + 'px))';
}

/* =======================================================================
   2. SCROLL REVEAL
   Fades and rises each ".scroll-reveal" element into view the first time
   it enters the viewport.
   ======================================================================= */
const scrollRevealElements = document.querySelectorAll('.scroll-reveal');

const scrollRevealObserver = new IntersectionObserver((observedEntries) => {
  observedEntries.forEach((revealEntry, entryIndex) => {
    if (revealEntry.isIntersecting){
      revealEntry.target.style.transitionDelay = (entryIndex % 6) * 0.08 + 's';
      revealEntry.target.classList.add('is-visible');
      scrollRevealObserver.unobserve(revealEntry.target);
    }
  });
}, { threshold: 0.15 });

scrollRevealElements.forEach((element) => scrollRevealObserver.observe(element));

/* =======================================================================
   3. FLOATING BACKGROUND DECORATIONS
   Spawns drifting hearts/candies/sparkles inside a given container.
   ======================================================================= */
function spawnFloatingDecorations(containerElementId, emojiList, decorationCount){
  const containerElement = document.getElementById(containerElementId);
  if (!containerElement) return;

  for (let i = 0; i < decorationCount; i++){
    const decorationElement = document.createElement('span');
    decorationElement.className = 'floating-decoration-item';
    decorationElement.textContent = emojiList[Math.floor(Math.random() * emojiList.length)];
    decorationElement.style.left = Math.random() * 100 + '%';
    decorationElement.style.fontSize = (16 + Math.random() * 18) + 'px';
    decorationElement.style.animationDuration = (10 + Math.random() * 10) + 's';
    decorationElement.style.animationDelay = (Math.random() * 10) + 's';
    containerElement.appendChild(decorationElement);
  }
}

if (!userPrefersReducedMotion){
  spawnFloatingDecorations('hero-floating-decorations', ['💕', '🍬', '🍭', '✨', '🍡', '💗'], 14);
  spawnFloatingDecorations('surprise-floating-decorations', ['🎊', '💗', '✨', '🍬'], 10);
}

/* =======================================================================
   4. HEART BURST (used by polaroid clicks and the gift box)
   ======================================================================= */
function triggerHeartBurst(clickEvent){
  const heartEmojiOptions = ['💗', '💕', '💖', '✨'];
  const originX = clickEvent.clientX;
  const originY = clickEvent.clientY;
  const particleCount = 8;

  for (let i = 0; i < particleCount; i++){
    const heartParticle = document.createElement('span');
    heartParticle.className = 'heart-burst-particle';
    heartParticle.textContent = heartEmojiOptions[Math.floor(Math.random() * heartEmojiOptions.length)];
    heartParticle.style.left = originX + 'px';
    heartParticle.style.top = originY + 'px';

    const angleRadians = (Math.PI * 2 / particleCount) * i + Math.random() * 0.4;
    const distancePx = 60 + Math.random() * 40;
    const offsetX = Math.cos(angleRadians) * distancePx;
    const offsetY = Math.sin(angleRadians) * distancePx - 30;
    const rotationDeg = Math.random() * 140 - 70;

    heartParticle.style.setProperty('--burst-offset', 'translate(' + offsetX + 'px,' + offsetY + 'px)');
    heartParticle.style.setProperty('--burst-rotation', rotationDeg + 'deg');

    document.body.appendChild(heartParticle);
    setTimeout(() => heartParticle.remove(), 900);
  }
}

/* =======================================================================
   5. CURSOR SPARKLE TRAIL (desktop pointer devices only)
   ======================================================================= */
const supportsHoverPointer = window.matchMedia('(hover:hover)').matches;
let lastSparkleTimestamp = 0;
const minMillisecondsBetweenSparkles = 60;

if (supportsHoverPointer && !userPrefersReducedMotion){
  document.addEventListener('mousemove', (mouseEvent) => {
    const now = Date.now();
    if (now - lastSparkleTimestamp < minMillisecondsBetweenSparkles) return;
    lastSparkleTimestamp = now;

    const sparkleDot = document.createElement('span');
    sparkleDot.className = 'cursor-sparkle-dot';
    sparkleDot.style.left = mouseEvent.clientX + 'px';
    sparkleDot.style.top = mouseEvent.clientY + 'px';
    document.body.appendChild(sparkleDot);
    setTimeout(() => sparkleDot.remove(), 700);
  });
}

/* =======================================================================
   6. LOVE LETTER ENVELOPE
   Click to open/close. See .envelope / .envelope.is-open in monthsary.css.
   ======================================================================= */
function toggleLoveLetterEnvelope(){
  const envelopeElement = document.getElementById('love-letter-envelope');
  envelopeElement.classList.toggle('is-open');
}

/* =======================================================================
   7. FINAL SURPRISE GIFT BOX
   Click to open once; triggers a small staggered heart-burst celebration.
   ======================================================================= */
function openSurpriseGiftBox(clickEvent){

    const giftBoxElement = document.getElementById(
        'surprise-gift-box'
    );


    const photoElement = document.getElementById(
        'surprise-photo'
    );


    if(
        giftBoxElement.classList.contains('is-open')
    ) return;



    giftBoxElement.classList.add(
        'is-open'
    );


    giftBoxElement.classList.add(
        'opened'
    );



    // heart explosion

    triggerHeartBurst(clickEvent);


    setTimeout(() => {

        triggerHeartBurst({

            clientX: clickEvent.clientX - 30,

            clientY: clickEvent.clientY - 10

        });


    },150);



    setTimeout(() => {

        triggerHeartBurst({

            clientX: clickEvent.clientX + 30,

            clientY: clickEvent.clientY - 10

        });


    },300);



    // show photo after gift opens

    setTimeout(()=>{


        if(photoElement){

            photoElement.classList.add(
                'show'
            );

        }


        triggerHeartBurst({

            clientX:
            window.innerWidth / 2,


            clientY:
            window.innerHeight / 2

        });


    },700);


}

/* =======================================================================
   INIT
   ======================================================================= */
window.addEventListener('scroll', updateScrollProgress, { passive: true });
window.addEventListener('resize', updateScrollProgress);
updateScrollProgress();

/* =====================================================
   MUSIC PLAYER HEART EFFECT
===================================================== */


const musicPlayer = document.getElementById(
    "love-song-player"
);


if(musicPlayer){

    musicPlayer.addEventListener(
        "click",
        function(event){

            triggerHeartBurst({

                clientX:event.clientX,

                clientY:event.clientY

            });

        }
    );

}


/* =====================================================
   AUTO PLAY LOVE SONG
===================================================== */

const loveSong = document.getElementById("love-song");
const musicButton = document.getElementById("music-button");


async function startLoveSong(){

    if(!loveSong) return;


    loveSong.volume = 0.5;


    try{

        await loveSong.play();

        console.log("Music started");


        if(musicButton){

            musicButton.innerHTML = "🔊";

        }


    }catch(error){

        console.log(
            "Autoplay blocked:",
            error
        );

    }

}



// Try immediately when JS loads

startLoveSong();



// Backup: start when user interacts

document.addEventListener(
"click",
()=>{

    if(loveSong && loveSong.paused){

        startLoveSong();

    }

},
{once:true}
);



// Play / Pause button

if(musicButton){

    musicButton.addEventListener(
    "click",
    (event)=>{


        event.stopPropagation();


        if(loveSong.paused){


            startLoveSong();

            musicButton.innerHTML="🔊";


        }else{


            loveSong.pause();

            musicButton.innerHTML="🔇";


        }


    });

}
/* =====================================================
   RELATIONSHIP DAY COUNTER
   Started: March 24, 2024
===================================================== */


function updateRelationshipTime(){

    const startDate = new Date("2024-03-24");
    const today = new Date();


    // Format today's date
    const options = {
        month: "long",
        day: "numeric",
        year: "numeric"
    };


    document.getElementById("relationship-date").innerHTML =
        today.toLocaleDateString("en-US", options);



    // Calculate years and months

    let years = today.getFullYear() - startDate.getFullYear();

    let months = today.getMonth() - startDate.getMonth();

    let days = today.getDate() - startDate.getDate();



    if(days < 0){

        months--;

        const previousMonth = new Date(
            today.getFullYear(),
            today.getMonth(),
            0
        );

        days += previousMonth.getDate();

    }


    if(months < 0){

        years--;

        months += 12;

    }



    let message = "";



    if(years > 0){

        message += years + 
        (years === 1 ? " Year " : " Years ");

    }



    if(months > 0){

        message += months +
        (months === 1 ? " Month " : " Months ");

    }



    if(days > 0){

        message += days +
        (days === 1 ? " Day" : " Days");

    }



    document.getElementById("relationship-count").innerHTML =
        message + " Together 💗";


}



updateRelationshipTime();