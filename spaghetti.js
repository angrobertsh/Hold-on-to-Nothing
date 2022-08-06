const CHAPTER_ORDER = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 'Interlude', 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 'Eulogy', 'P', 'Epilogue']

let CHARACTER_CHAPTER_MAP = {
  misanthropi: [1, 2, 14, 19, 20, 'Interlude', 37, 39, 40, 41, 'Epilogue'], 
  lint: [1, 3, 8, 14, 'Interlude', 36, 40, 'Epilogue'],
  jonbo: [1, 4, 7, 10, 14, 'Interlude', 25, 26, 27, 28, 40, 'Epilogue'],
  martha: [1, 5, 14, 32, 33, 40],
  almeniapia: [1, 'Eulogy'],
  lilpunkin: [1, 6, 38],
  hubert: [1, 15, 16, 19, 31, 41],
  amy: [18, 29, 30],
  nana: [1, 21, 29, 30, 36],
  linn: [1, 4, 15, 16, 19, 31, 41],
  god: [2, 34, 41],
  gortune: [4, 7, 13, 'Interlude', 35, 42, 44],
  deirdre: [5, 12, 23, 'Interlude', 35, 42],
  philtrum: [7, 13, 22, 35, 42, 44],
  clint: [2, 8, 29, 30],
  blubberanna: [4, 9, 21, 32],
  robert: [11, 24, 'Interlude', 'P', 'Epilogue'],
  boston: [17, 19, 43],
  everyone: CHAPTER_ORDER,
};

Object.keys(CHARACTER_CHAPTER_MAP).forEach(character => {
  CHARACTER_CHAPTER_MAP[character] = new Set(CHARACTER_CHAPTER_MAP[character].map(num => num.toString()))
});

let NEXT_BUTTON_LISTENERS = {};

const CHAPTER_CHARACTER_MAP = 
  Object.keys(CHARACTER_CHAPTER_MAP).reduce((acc, character) => {
    CHARACTER_CHAPTER_MAP[character].forEach(chapter => {
      if (acc[chapter]) {
        acc[chapter].push(character);
      } else {
        acc[chapter] = [character];
      }
    })

    return acc;
  }, {});

const CHARACTERS_BY_DAY = {
  0: ['everyone', 'misanthropi', 'lint', 'jonbo'],
  1: ['everyone', 'martha', 'almeniapia', 'nana'],
  2: ['everyone', 'hubert', 'amy', 'lilpunkin'],
  3: ['everyone', 'linn', 'god', 'gortune'],
  4: ['everyone', 'deirdre', 'blubberanna', 'clint'],
  5: ['everyone', 'lint', 'robert', 'boston'],
  6: ['everyone', 'hubert', 'philtrum', 'nana'],
};

let CURRENT_CHARACTER
let CURRENT_CHAPTERS
let CURRENT_CHAPTER

const setCurrentCharacter = (character) => {
  CURRENT_CHARACTER = character;
  CURRENT_CHAPTERS = [...CHARACTER_CHAPTER_MAP[CURRENT_CHARACTER]];
  CURRENT_CHAPTER = CURRENT_CHAPTERS[0];
}

const filterStories = (character) => {
  setCurrentCharacter(character)

  resetNextButtonListeners();
  showChapter(CURRENT_CHAPTERS[0])

  document.querySelectorAll(".chapter").forEach((chapterEl) => {
    const chapterCharacters = new Set(chapterEl.dataset.characters.split(","))

    if (chapterCharacters.has(character)) {
      chapterEl.classList.remove("hidden");
    } else {
      chapterEl.classList.add("hidden");
    }
  })

  setPortraitInDrawer(character);  
}

const setPortraitInDrawer = (character) => {
  const selectedCharacterEl = document.getElementById("selected-character")

  selectedCharacterEl.innerHTML = null

  const characterPortrait = drawCharacterPortrait(character, ["selector-slide-in-trigger"])

  selectedCharacterEl.append(characterPortrait)
}

const addChapterCharacterTags = () => {
  let chapterName;

  document.querySelectorAll(".chapter").forEach((chapter) => {
    const chapterText = chapter.getElementsByClassName("chapter-title")[0].innerText
    const chapterTextArr = chapterText.split("Chapter ")
    chapterName = chapterTextArr[chapterTextArr.length - 1]

    chapter.dataset.chaptername = chapterName
    chapter.dataset.characters = CHAPTER_CHARACTER_MAP[chapterName]
  })
}

const addSlideoutListeners = () => {
  const splashEl = document.getElementById("splash-container")
  const dedicationEl = document.getElementById("dedication")

  splashEl.addEventListener("click", () => splashEl.classList.add("slide-out"))
  dedicationEl.addEventListener("click", () => dedicationEl.classList.add("slide-out"))

  document.getElementById("close-drawer").addEventListener("click", slideOutDrawer)
}

const addGlobalListeners = () => {
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("selector-slide-in-trigger")) {
      document.getElementById("character-selector").classList.remove("slide-out");
      document.getElementById("page-container").classList.add("hide-scroll")
    }
  })
}

const addDrawerSlideinListeners = () => {
  document.querySelectorAll(".drawer-slide-in-trigger").forEach((element) => {
    element.addEventListener("click", (e) => {
      document.getElementById("drawer").classList.remove("slide-out-right");
    })
  })
}

const slideInDrawer = () => {
  document.getElementById("drawer").classList.remove("slide-out-right");
}

const slideOutDrawer = () => {
  document.getElementById("drawer").classList.add("slide-out-right");
}

const drawCharacterSelection = () => {
  const d = new Date();
  CHARACTERS_BY_DAY[d.getDay()].forEach(character => {
    const characterPortrait = drawCharacterPortrait(character, ["character-selection", "selector-slide-out-trigger"])

    characterPortrait.addEventListener("click", (e) => {
      filterStories(e.target.dataset.character)
      document.getElementById("character-selector").classList.add("slide-out");
      document.getElementById("page-container").classList.remove("hide-scroll");
    })

    document.getElementById("characters-container").append(characterPortrait)
  })
}

const drawCharacterPortrait = (character, extraClasses = []) => {
  const characterPortrait = document.createElement("div")
  characterPortrait.classList.add(character, "character-portrait", ...extraClasses)
  characterPortrait.dataset.character = character

  const characterPortraitLabel = document.createElement("div")
  characterPortraitLabel.classList.add("character-portrait-text")
  characterPortraitLabel.dataset.character = character
  characterPortraitLabel.append(character.toUpperCase())

  characterPortrait.append(characterPortraitLabel)

  return characterPortrait
}

const drawNextButtons = () => {
  let nextButton;
  let nextButtonContainer;

  document.querySelectorAll(".chapter-main").forEach(chapter => {
    nextButton = document.createElement("div")
    nextButton.classList.add("next-button")
    nextButton.dataset.chaptername = chapter.dataset.chaptername
    nextButton.append("Next")

    nextButtonContainer = document.createElement("div")
    nextButtonContainer.classList.add("next-button-container")
    nextButtonContainer.append(nextButton)

    chapter.append(nextButtonContainer)
  })
}

const resetNextButtonListeners = () => {
  document.querySelectorAll(".next-button").forEach(nextButton => {
    const chapterName = nextButton.dataset.chaptername;

    if (NEXT_BUTTON_LISTENERS[chapterName]) {
      nextButton.removeEventListener("click", NEXT_BUTTON_LISTENERS[chapterName])

      NEXT_BUTTON_LISTENERS[chapterName] = null;      
    }

    addNextButtonListener(nextButton);
  })
}

const addNextButtonListener = (nextButton) => {
  const chapterName = nextButton.dataset.chaptername;

  const chapterIdx = CURRENT_CHAPTERS.indexOf(chapterName)
  const nextChapterName = CURRENT_CHAPTERS[chapterIdx + 1]

  let newCallback; 

  if (chapterIdx !== -1) {
    if (nextChapterName) {
      nextButton.innerHTML = "Next"
      newCallback = () => showChapter(nextChapterName);
    } else {
      nextButton.innerHTML = "The End"
      newCallback = () => window.alert("Congratulations bbdoll, you've finished. Robert luvs ya.");
    }
  } 

  nextButton.addEventListener("click", newCallback);

  NEXT_BUTTON_LISTENERS[chapterName] = newCallback;
}

const addGrayscaleListeners = () => {
  // document.getElementById("character-portrait").addEventListener("click", () => {
  //   document.getElementById("character-portrait").classList.add("grayscale")
  // })
}

const reset = () => { document.getElementById("chapter-nav").innerHTML = null }

const drawDrawerChapters = () => {
  let chapterTitle

  CHAPTER_ORDER.forEach(chapterName => {
    if (isNaN(parseInt(chapterName))) {
      chapterTitle = chapterName
    } else {
      chapterTitle = `Chapter ${chapterName}`
    }

    const outer = document.createElement("div")
    outer.classList.add("chapter", "chapter-sidebar")

    const inner = document.createElement("div")
    inner.classList.add("chapter-title")
    inner.append(chapterTitle)

    outer.append(inner)

    outer.addEventListener("click", (e) => showChapter(chapterName))

    document.getElementById("chapter-nav").append(outer);
  })
};

const showChapter = (chapter) => {
  document.querySelectorAll('.chapter-main').forEach(currentChap => {
    if (currentChap.dataset.chapterName !== chapter) {
      currentChap.classList.add('none');      
    }
  })

  document.querySelectorAll(`[data-chapterName="${chapter}"]`).forEach(nextChapter => {
    nextChapter.classList.remove('none');
  })

  CURRENT_CHAPTER = chapter;

  window.setTimeout(() => window.scroll({ top: 0, behavior: 'smooth'}), 0.5)  

  slideOutDrawer()
}

const addSlideListeners = () => {
  addGlobalListeners();
  addDrawerSlideinListeners();
  addSlideoutListeners();
}

document.addEventListener('DOMContentLoaded', () => {
  drawDrawerChapters();
  addChapterCharacterTags();
  drawCharacterSelection();
  drawNextButtons();
  addSlideListeners();
  addGrayscaleListeners();
});
