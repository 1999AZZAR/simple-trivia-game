let correctAnswer = '';
let score = 5;
const winningScore = 10;
let selectedLanguage = 'en';
let selectedDifficulty = 'any';
let selectedCategory = 'any';
let selectedType = 'any';
let questionCache = [];
let currentQuestionIndex = 0;
let isFetching = false;
let questionCount = 0;

const translations = {
    en: {
        startGame: 'Start Game',
        submit: 'Submit 🚀',
        score: 'Score',
        correct: "🎉 Correct! You've gained a point.",
        language: 'Language',
        category: 'Category',
        difficulty: 'Difficulty',
        type: 'Type',
        wrong: '😢 Wrong answer! The correct answer was "{answer}".',
        selectAnswer: "Please select an answer.",
        congrats: "🏆 Congratulations! You've won the game! You have answered a total of {count} questions.",
        gameOver: "Game Over! Your score reached zero. You have answered a total of {count} questions.",
        errorFetching: "Error fetching questions. Please try again.",
        loading: 'Loading...'
    },
    id: {
        startGame: 'Mulai Permainan',
        submit: 'Kirim 🚀',
        score: 'Skor',
        correct: '🎉 Benar! Anda mendapat satu poin.',
        language: 'Bahasa',
        category: 'Kategori',
        difficulty: 'Kesulitan',
        type: 'Tipe',
        wrong: '😢 Jawaban salah! Jawaban yang benar adalah "{answer}".',
        selectAnswer: 'Silakan pilih jawaban.',
        congrats: '🏆 Selamat! Anda telah memenangkan permainan! Anda telah menjawab total {count} pertanyaan.',
        gameOver: 'Permainan Berakhir! Skor Anda mencapai nol. Anda telah menjawab total {count} pertanyaan.',
        errorFetching: 'Kesalahan saat mengambil pertanyaan. Silakan coba lagi.',
        loading: 'Sedang memuat...'
    },
    es: {
        startGame: 'Iniciar Juego',
        submit: 'Enviar 🚀',
        score: 'Puntuación',
        correct: "🎉 ¡Correcto! Has ganado un punto.",
        language: 'Idioma',
        category: 'Categoría',
        difficulty: 'Dificultad',
        type: 'Tipo',
        wrong: '😢 Respuesta incorrecta. La respuesta correcta era "{answer}".',
        selectAnswer: "Por favor, selecciona una respuesta.",
        congrats: "🏆 ¡Felicidades! ¡Has ganado el juego! Has respondido un total de {count} preguntas.",
        gameOver: "Juego terminado. Tu puntuación llegó a cero. Has respondido un total de {count} preguntas.",
        errorFetching: "Error al obtener preguntas. Por favor, inténtalo de nuevo.",
        loading: 'Cargando...'
    },
    fr: {
        startGame: 'Démarrer le jeu',
        submit: 'Soumettre 🚀',
        score: 'Score',
        correct: "🎉 Correct! Vous avez gagné un point.",
        language: 'Langue',
        category: 'Catégorie',
        difficulty: 'Difficulté',
        type: 'Type',
        wrong: '😢 Mauvaise réponse! La bonne réponse était "{answer}".',
        selectAnswer: "Veuillez sélectionner une réponse.",
        congrats: "🏆 Félicitations! Vous avez gagné le jeu! Vous avez répondu à un total de {count} questions.",
        gameOver: "Jeu terminé! Votre score a atteint zéro. Vous avez répondu à un total de {count} questions.",
        errorFetching: "Erreur lors de la récupération des questions. Veuillez réessayer.",
        loading: 'Chargement...'
    },
    de: {
        startGame: 'Spiel starten',
        submit: 'Absenden 🚀',
        score: 'Punktzahl',
        correct: "🎉 Richtig! Sie haben einen Punkt gewonnen.",
        language: 'Sprache',
        category: 'Kategorie',
        difficulty: 'Schwierigkeit',
        type: 'Typ',
        wrong: '😢 Falsche Antwort! Die richtige Antwort war "{answer}".',
        selectAnswer: "Bitte wählen Sie eine Antwort.",
        congrats: "🏆 Glückwunsch! Sie haben das Spiel gewonnen! Sie haben insgesamt {count} Fragen beantwortet.",
        gameOver: "Spiel beendet! Ihre Punktzahl erreichte null. Sie haben insgesamt {count} Fragen beantwortet.",
        errorFetching: "Fehler beim Abrufen der Fragen. Bitte versuchen Sie es erneut.",
        loading: 'Laden...'
    },
    ja: {
        startGame: 'ゲーム開始',
        submit: '送信 🚀',
        score: 'スコア',
        correct: "🎉 正解です！ポイントを獲得しました。",
        language: '言語',
        category: 'カテゴリー',
        difficulty: '難易度',
        type: 'タイプ',
        wrong: '😢 間違った答え！正解は "{answer}" でした。',
        selectAnswer: "回答を選択してください。",
        congrats: "🏆 おめでとうございます！ゲームに勝ちました！合計 {count} 問答えました。",
        gameOver: "ゲームオーバー！スコアがゼロになりました。合計 {count} 問答えました。",
        errorFetching: "質問の取得中にエラーが発生しました。もう一度お試しください。",
        loading: '読み込み中...'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start-game').addEventListener('click', startGame);
    document.getElementById('submitBtn').addEventListener('click', submitAnswer);
    document.getElementById('game-area').addEventListener('click', (event) => {
        if (event.target && event.target.id === 'cancelBtn') {
            resetGame();
        }
    });
    document.getElementById('trivia-language').addEventListener('change', changeLanguage);
    updateInterface();
    document.getElementById('label-language').textContent = translations[selectedLanguage].language;
    document.getElementById('label-category').textContent = translations[selectedLanguage].category;
    document.getElementById('label-difficulty').textContent = translations[selectedLanguage].difficulty;
    document.getElementById('label-type').textContent = translations[selectedLanguage].type;
});

function changeLanguage() {
    selectedLanguage = document.getElementById('trivia-language').value;
    updateInterface();
    document.getElementById('label-language').textContent = translations[selectedLanguage].language;
    document.getElementById('label-category').textContent = translations[selectedLanguage].category;
    document.getElementById('label-difficulty').textContent = translations[selectedLanguage].difficulty;
    document.getElementById('label-type').textContent = translations[selectedLanguage].type;
}

function updateInterface() {
  document.getElementById('start-game').textContent = translations[selectedLanguage].startGame;
  document.getElementById('submitBtn').textContent = translations[selectedLanguage].submit;
  document.getElementById('scoreBoard').innerHTML = `${translations[selectedLanguage].score}: <span id="score">${score}</span>`;
  document.getElementById('loading').textContent = translations[selectedLanguage].loading;
}

async function startGame() {
    selectedLanguage = document.getElementById('trivia-language').value;
    selectedDifficulty = document.getElementById('trivia-difficulty').value;
    selectedCategory = document.getElementById('trivia-category').value;
    selectedType = document.getElementById('trivia-type').value;
    
    document.getElementById('game-setup').style.display = 'none';
    document.getElementById('footer').style.display = 'none';
    document.getElementById('game-area').style.display = 'flex';
    
    const cancelButton = document.createElement('button');
    cancelButton.id = 'cancelBtn';
    cancelButton.textContent = 'X';
    document.getElementById('game-area').appendChild(cancelButton);
    
    score = 5;
    document.getElementById('score').textContent = score;
    questionCache = [];
    questionCount = 0;
    currentQuestionIndex = 0;

    showLoading(true);

    await fetchQuestions();
    await displayNextQuestion();
}

async function fetchQuestions() {
    if (isFetching) return;
    isFetching = true;
    
    let apiUrl = `https://opentdb.com/api.php?amount=25`;
    if (selectedCategory !== 'any') apiUrl += `&category=${selectedCategory}`;
    if (selectedDifficulty !== 'any') apiUrl += `&difficulty=${selectedDifficulty}`;
    if (selectedType !== 'any') apiUrl += `&type=${selectedType}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        questionCache = data.results;
        currentQuestionIndex = 0;
    } catch (error) {
        console.error('Error fetching questions:', error);
        document.getElementById('message').textContent = translations[selectedLanguage].errorFetching;
        document.getElementById('message').classList.add('wrong');
    } finally {
        isFetching = false;
    }
}

function showLoading(show) {
    const loadingContainer = document.getElementById('loading');
    const gameContent = document.getElementById('game-content');

    if (loadingContainer) {
        loadingContainer.style.display = show ? 'flex' : 'none';
    }
    if (gameContent) {
        gameContent.style.display = show ? 'none' : 'contents';
    }
}

function submitAnswer() {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    const messageElement = document.getElementById('message');
    
    messageElement.classList.remove('correct', 'wrong');

    if (selectedAnswer) {
        const userAnswer = selectedAnswer.value;
        questionCount++;
        if (userAnswer === correctAnswer) {
            score++;
            messageElement.textContent = translations[selectedLanguage].correct;
            messageElement.classList.add('correct');
        } else {
            score--;
            messageElement.textContent = translations[selectedLanguage].wrong.replace('{answer}', correctAnswer);
            messageElement.classList.add('wrong');
        }
        document.getElementById('score').textContent = score;

        if (score >= winningScore) {
            messageElement.textContent = translations[selectedLanguage].congrats.replace('{count}', questionCount);
            messageElement.classList.add('correct');
            setTimeout(resetGame, 3000);
        } else if (score <= 0) {
            messageElement.textContent = translations[selectedLanguage].gameOver.replace('{count}', questionCount);
            messageElement.classList.add('wrong');
            setTimeout(resetGame, 3000);
        } else {
            setTimeout(() => {
                displayNextQuestion();
                messageElement.classList.remove('correct', 'wrong');
            }, 1500);
        }
    } else {
        messageElement.textContent = translations[selectedLanguage].selectAnswer;
        messageElement.classList.add('wrong');
    }
}

async function translateText(text, targetLanguage) {
    if (targetLanguage === 'en') {
        return text;
    }
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data[0][0][0];
    } catch (error) {
        console.error('Error translating text:', error);
        return text;
    }
}

async function translateSingleQuestion(questionData) {
    if (questionData.isTranslated) return questionData;

    // Only translate the question, not the answers, to preserve game logic.
    questionData.question = await translateText(questionData.question, selectedLanguage);
    questionData.isTranslated = true;

    return questionData;
}

async function displayNextQuestion() {
    if (currentQuestionIndex >= questionCache.length) {
        showLoading(true);
        await fetchQuestions();
    }
    
    let questionData = questionCache[currentQuestionIndex];

    if (!questionData.isTranslated) {
        showLoading(true);
        questionData = await translateSingleQuestion(questionData);
        showLoading(false);
    }
    
    // Proactively translate the next question in the background
    if (currentQuestionIndex + 1 < questionCache.length) {
        const nextQuestionData = questionCache[currentQuestionIndex + 1];
        if (!nextQuestionData.isTranslated) {
            translateSingleQuestion(nextQuestionData);
        }
    }
    
    correctAnswer = questionData.correct_answer;
    let answers = [...questionData.incorrect_answers, correctAnswer];
    answers.sort(() => Math.random() - 0.5);

    document.getElementById('category').textContent = questionData.category;
    document.getElementById('question').innerHTML = questionData.question;
    const answersContainer = document.getElementById('answers');
    answersContainer.innerHTML = '';

    answers.forEach((answer, index) => {
        const answerId = `answer${index}`;
        const answerLabel = document.createElement('label');
        answerLabel.htmlFor = answerId;

        const answerInput = document.createElement('input');
        answerInput.type = 'radio';
        answerInput.name = 'answer';
        answerInput.id = answerId;
        answerInput.value = answer;
        
        const customRadio = document.createElement('span');
        customRadio.className = 'custom-radio';

        const answerText = document.createElement('span');
        answerText.className = 'answer-text';
        answerText.textContent = answer;

        answerLabel.appendChild(answerInput);
        answerLabel.appendChild(customRadio);
        answerLabel.appendChild(answerText);
        answersContainer.appendChild(answerLabel);
    });

    currentQuestionIndex++;
    document.getElementById('message').textContent = '';
    
    document.getElementById('game-area').style.display = 'flex';
}

function gameOver() {
    const messageElement = document.getElementById('message');
    messageElement.textContent = translations[selectedLanguage].gameOver.replace('{count}', questionCount);
    document.getElementById('submitBtn').disabled = true;
    setTimeout(() => {
        resetGame();
    }, 2000);
}

function resetGame() {
    const messageElement = document.getElementById('message');
    messageElement.textContent = '';
    messageElement.classList.remove('correct', 'wrong');

    document.getElementById('submitBtn').disabled = false;
    document.getElementById('game-area').style.display = 'none';
    document.getElementById('game-setup').style.display = 'flex';
    document.getElementById('footer').style.display = 'block';

    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.remove();
    }

    questionCache = [];
    currentQuestionIndex = 0;
    isFetching = false;
    updateInterface();
}

particlesJS('particles-js', {
    "particles": {
        "number": {
            "value": 80,
            "density": {
                "enable": true,
                "value_area": 800
            }
        },
        "color": {
            "value": ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"]
        },
        "shape": {
            "type": "circle",
            "stroke": {
                "width": 0,
                "color": "#000000"
            },
            "polygon": {
                "nb_sides": 5
            }
        },
        "opacity": {
            "value": 0.8,
            "random": true,
            "anim": {
                "enable": false,
                "speed": 1,
                "opacity_min": 0.1,
                "sync": false
            }
        },
        "size": {
            "value": 5,
            "random": true,
            "anim": {
                "enable": false,
                "speed": 40,
                "size_min": 0.1,
                "sync": false
            }
        },
        "line_linked": {
            "enable": true,
            "distance": 150,
            "color": "#bebebe",
            "opacity": 0.4,
            "width": 1
        },
        "move": {
            "enable": true,
            "speed": 6,
            "direction": "none",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
                "enable": false,
                "rotateX": 600,
                "rotateY": 1200
            }
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": false,
                "mode": "repulse"
            },
            "onclick": {
                "enable": true,
                "mode": "push"
            },
            "resize": true
        },
        "modes": {
            "grab": {
                "distance": 400,
                "line_linked": {
                    "opacity": 1
                }
            },
            "bubble": {
                "distance": 400,
                "size": 40,
                "duration": 2,
                "opacity": 8,
                "speed": 3
            },
            "repulse": {
                "distance": 200,
                "duration": 0.4
            },
            "push": {
                "particles_nb": 4
            },
            "remove": {
                "particles_nb": 2
            }
        }
    },
    "retina_detect": true
});
