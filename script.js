// Function to generate a random Polish word
function generateRandomPolishWord() {
  const adjectives = ["Ognisty", "Zwinny", "Niezapomniany", "Zabawny", "Szalony", "Magiczny", "Tajemniczy", "Niesamowity", "Wyjątkowy", "Dzielny"];
  const nouns = ["Peja", "Gural", "Tede", "Hades", "Sokół", "Eldo", "Abradab", "Fokus", "O.S.T.R.", "Zeus"];
  // Generate random indices for adjective and noun
  const adjIndex = Math.floor(Math.random() * adjectives.length);
  const nounIndex = Math.floor(Math.random() * nouns.length);
  // Combine to create a password
  return adjectives[adjIndex] + nouns[nounIndex];
}

// Function to generate a random pair name
function generateRandomPairName() {
  const adjectives = ["Zacny", "Lotny", "Kosmiczny", "Wesoły", "Dziki", "Mistyczny", "Zagadkowy", "Fantastyczny", "Unikalny", "Odważny"];
  const emojis = ["🌪️", "🚀", "🌈", "🎉", "🐉", "🔮", "🎭", "🎨", "🏅", "🛡️"];
  // Generate random indices for adjective and emoji
  const adjIndex = Math.floor(Math.random() * adjectives.length);
  const emojiIndex = Math.floor(Math.random() * emojis.length);
  // Combine to create a pair name
  return adjectives[adjIndex] + " " + nouns[adjIndex] + " " + emojis[emojiIndex] + emojis[emojiIndex] + emojis[emojiIndex];
}

// Array to hold the names of participants
const participants = new Array(20).fill(null);

// Function to add a participant's name and preferences
function addParticipant(name, preferences, slotIndex) {
  participants[slotIndex] = { name, preferences };
  updateSlots();
  localStorage.setItem('participants', JSON.stringify(participants));
}

// Function to generate slots
function generateSlots() {
  const slotsContainer = document.getElementById('slots-container');
  const slotPasswords = JSON.parse(localStorage.getItem('slotPasswords')) || {};
  
  for (let i = 0; i < participants.length; i += 2) {
    const slotPair = document.createElement('div');
    slotPair.className = 'slot-pair';
    const pairPassword = slotPasswords[i] || generateRandomPolishWord();
    slotPasswords[i] = pairPassword; // Save or retrieve the password for the pair

    for (let j = 0; j < 2; j++) {
      const slot = document.createElement('div');
      slot.className = 'slot';
      slot.innerText = `ŻmudaMember ${i + j + 1}`;
      slot.onclick = function() { selectSlot(i + j, pairPassword); };
      slotPair.appendChild(slot);
    }
    slotsContainer.appendChild(slotPair);
  }
  
  localStorage.setItem('slotPasswords', JSON.stringify(slotPasswords));
}

// Function to select a slot
function selectSlot(index, pairPassword) {
    // Check if the slot is already taken
    if (participants[index]) {
      const enteredPassword = prompt('Wprowadź hasło dla swojej pary:');
      if (enteredPassword.toLowerCase() === pairPassword.toLowerCase()) {
        // Show the participant's pair
        const pairIndex = index % 2 === 0 ? index + 1 : index - 1;
        if (participants[pairIndex]) {
          alert(`Twój partner to: ${participants[pairIndex].name}`);
        } else {
          alert('Twój partner jeszcze się nie zarejestrował.');
        }
      } else {
        alert('Niestety, hasło jest nieprawidłowe!');
      }
    } else {
      // If the slot is not taken, allow the user to register
      const name = prompt('Podaj swoje imię:');
      if (!name) return;
      const preferences = prompt('Jakie są Twoje preferencje prezentowe?');
      if (!preferences) return;
      addParticipant(name, preferences, index);
      alert(`Twoje hasło to: ${pairPassword}. Zapamiętaj je!`);
    }
  }
  
// Function to update slots
function updateSlots() {
  const slots = document.getElementsByClassName('slot');
  participants.forEach((participant, index) => {
    if (participant) {
      slots[index].innerText = participant.name;
      slots[index].classList.add('slot-taken');
    }
  });
}

// Function to close the instructions
function closeInstructions() {
  document.getElementById('instructions').style.display = 'none';
}

// Admin functionalities
function adminLogin() {
  const adminPassword = prompt('Wprowadź hasło admina:');
  if (adminPassword === "DjSegment") {
    adminPanel();
  } else {
    alert('Niestety, hasło jest nieprawidłowe!');
  }
}

function adminPanel() {
  const action = prompt('Co chcesz zrobić? (1) Usuń użytkownika (2) Zresetuj bazę danych');
  switch (action) {
    case '1':
      const slotToRemove = prompt('Podaj numer slotu do usunięcia:');
      removeParticipant(slotToRemove);
      break;
    case '2':
      if (confirm('Czy na pewno chcesz zresetować całą bazę danych?')) {
        resetDatabase();
      }
      break;
    default:
      alert('Nieprawidłowa akcja.');
      break;
  }
}

function removeParticipant(slotIndex) {
  if (participants[slotIndex]) {
    participants[slotIndex] = null;
    localStorage.setItem('participants', JSON.stringify(participants));
    updateSlots();
    alert('Użytkownik został usunięty.');
  } else {
    alert('Slot jest już pusty.');
  }
}

function resetDatabase() {
  localStorage.clear();
  participants.fill(null);
  updateSlots();
  alert('Baza danych została zresetowana.');
}

// Add the admin button to the bottom of the page
function addAdminButton() {
  const adminButton = document.createElement('button');
  adminButton.innerText = '@ogwerset';
  adminButton.style.backgroundColor = 'red';
  adminButton.onclick = adminLogin;
  document.body.appendChild(adminButton);
}

window.onload = function() {
  generateSlots();
  addAdminButton();
  const storedParticipants = JSON.parse(localStorage.getItem('participants'));
  if (storedParticipants) {
    storedParticipants.forEach((participant, index) => {
      if (participant) addParticipant(participant.name, participant.preferences, index);
    });
  }
};
