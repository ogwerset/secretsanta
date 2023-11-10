// Function to generate a random Polish word
function generateRandomPolishWord(existingPasswords) {
  const adjectives = ["masny", "dospermiony", "dopierdolony", "swojski", "ciasny", "polski", "czarny", "liryczny", "dyskretny", "spermastyczny"];
  const nouns = ["tede", "werset", "detko", "gural", "grubson", "pikej", "majordomus", "monako", "maclaw", "alvaro"];
  let password;
  do {
    const adjIndex = Math.floor(Math.random() * adjectives.length);
    const nounIndex = Math.floor(Math.random() * nouns.length);
    password = adjectives[adjIndex] + nouns[nounIndex];
  } while (existingPasswords.includes(password));
  return password;
}

// Pre-defined pair names
const pairNames = [
  "Sperm Team 🌪️", "Sprytne Babki 🚀", "#NWJczarodzieje 🌈", "Plażowy Wąż 🎉", 
  "Tede zawał w wywiadzie 🐉", "Morenka 🔮", "TARCHO TERROR 🎭", "Fiut Kędziora 🎨", 
  "508 008 000 🏅", "Łysy Chuj 🛡️"
];

// Function to generate slots
function generateSlots() {
  const slotsContainer = document.getElementById('slots-container');
  let slotPasswords = JSON.parse(localStorage.getItem('slotPasswords')) || [];
  
  for (let i = 0; i < 20; i += 2) {
    const slotPair = document.createElement('div');
    slotPair.className = 'slot-pair';

    // Assign header for each pair
    const header = document.createElement('h3');
    header.innerText = pairNames[i / 2 % pairNames.length];
    slotPair.appendChild(header);

    // Ensure unique password for each pair
    if (!slotPasswords[i]) {
      slotPasswords[i] = generateRandomPolishWord(slotPasswords);
    }

    for (let j = 0; j < 2; j++) {
      const slot = document.createElement('div');
      slot.className = 'slot';
      slot.innerText = `ŻmudaMember ${i + j + 1}`;
      slot.onclick = function() { selectSlot(i + j, slotPasswords[i]); };
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
    if (enteredPassword && enteredPassword.toLowerCase() === pairPassword.toLowerCase()) {
      // Show the participant's pair
      const pairIndex = index % 2 === 0 ? index + 1 : index - 1;
      let message = `Informacje o parze:\n`;
      message += `Uczestnik ${index + 1}: ${participants[index].name}, Preferencje: ${participants[index].preferences}\n`;
      if (participants[pairIndex]) {
        message += `Uczestnik ${pairIndex + 1}: ${participants[pairIndex].name}, Preferencje: ${participants[pairIndex].preferences}`;
      } else {
        message += `Uczestnik ${pairIndex + 1} jeszcze się nie zarejestrował.`;
      }
      alert(message);
    } else {
      alert('Niestety, hasło jest nieprawidłowe!');
    }
  } else {
    // If the slot is not taken, allow the user to register
    const name = prompt('Wpisz swoją nazwę:');
    if (!name) return;
    const preferences = prompt('Co chcesz dostać? Te instrukcje zostaną wyświetlone osobie, która dołączy do twojej pary.');
    if (!preferences) return;
    addParticipant(name, preferences, index);
    alert(`Twoje hasło to: ${pairPassword}. Zapamiętaj je!`);
  }
}

// Remaining functions (addParticipant, updateSlots, closeInstructions, admin functionalities, window.onload) remain unchanged.

// Array to hold the names of participants
const participants = new Array(20).fill(null);

// Function to add a participant's name and preferences
function addParticipant(name, preferences, slotIndex) {
  participants[slotIndex] = { name, preferences };
  updateSlots();
  localStorage.setItem('participants', JSON.stringify(participants));
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
  const action = prompt('Co chcesz zrobić? (1) Usuń użytkownika (2) Zresetuj bazę danych (3) Pokaż hasła');
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
    case '3':
      showPasswords();
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

function showPasswords() {
  const slotPasswords = JSON.parse(localStorage.getItem('slotPasswords')) || [];
  let message = 'Hasła dla par:\n';
  slotPasswords.forEach((password, index) => {
    if (password) {
      message += `Para ${index + 1}: ${password}\n`;
    }
  });
  alert(message);
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
