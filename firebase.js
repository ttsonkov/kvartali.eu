// Firebase and data management

// Firebase setup
let firebaseApp;
let db;
let auth;
let currentUser = null;

// Cloud-backed data caches
let allRatings = [];
let userVotedNeighborhoods = [];

// Firestore live updates for results
function attachRatingsListener() {
    db.collection('ratings').onSnapshot(
        (snapshot) => {
            allRatings = snapshot.docs.map(doc => doc.data());
            const currentCityFilter = document.getElementById('filterCity').value || currentCity;
            const currentNeighborhoodFilter = document.getElementById('filterNeighborhood').value || '';
            displayResults(currentCityFilter, currentNeighborhoodFilter);
        },
        (error) => {
            console.error('Snapshot error:', error);
        }
    );
}

// Load neighborhoods voted by this user to enforce one-vote
async function loadUserVotes() {
    try {
        const qs = await db.collection('ratings').where('userId', '==', currentUser.uid).get();
        userVotedNeighborhoods = qs.docs.map(doc => {
            const data = doc.data();
            return makeVoteKey(data.city || 'София', data.neighborhood);
        });
        updateNeighborhoodOptions();
    } catch (err) {
        console.error('Error loading user votes:', err);
    }
}

// Initialize Firebase and start app
function initFirebase() {
    try {
        if (!window.firebaseConfig || !window.firebaseConfig.apiKey) {
            showToast('Firebase конфигурацията не е заредена', 'error');
            console.error('Missing firebase config');
            return;
        }
        
        firebaseApp = firebase.initializeApp(window.firebaseConfig);
        db = firebase.firestore();
        auth = firebase.auth();
        
        auth.signInAnonymously()
            .then((result) => {
                currentUser = result.user;
                console.log('Auth successful:', currentUser.uid);
                // After auth, set initial city state, load votes, attach listener
                const urlParams = getURLParams();
                applyCitySelection(urlParams.city);
                
                // Apply neighborhood filter if present in URL
                if (urlParams.neighborhood) {
                    const filterSelect = document.getElementById('filterNeighborhood');
                    if (filterSelect) {
                        filterSelect.value = urlParams.neighborhood;
                        displayResults(urlParams.city, urlParams.neighborhood);
                    }
                }
                
                attachRatingsListener();
                loadUserVotes();
            })
            .catch((err) => {
                console.error('Auth error:', err);
                console.error('Error code:', err.code);
                console.error('Error message:', err.message);
                showToast(`Грешка при автентикация: ${err.message}`, 'error');
            });
    } catch (e) {
        console.error('Firebase init error:', e);
        showToast(`Грешка при инициализация на Firebase: ${e.message}`, 'error');
    }
}

// Form submission handler
async function handleFormSubmit(e) {
    e.preventDefault();

    if (!currentUser) {
        showToast('Моля изчакайте автентикация...', 'error');
        return;
    }

    const city = document.getElementById('citySelect').value || currentCity;
    currentCity = city;
    const neighborhood = document.getElementById('neighborhood').value;
    const opinion = document.getElementById('opinion').value.trim();

    // Check if already voted for this neighborhood (server-ground truth)
    const voteKey = makeVoteKey(city, neighborhood);
    if (userVotedNeighborhoods.includes(voteKey)) {
        showToast('Вече сте гласували за този квартал!', 'error');
        return;
    }

    // Check if at least something is provided (ratings or opinion)
    const ratingValues = Object.values(currentRatings);
    const ratedCount = ratingValues.filter(rating => rating > 0).length;
    const allRated = ratedCount === 10;
    const noneRated = ratedCount === 0;
    
    if (!allRated && !noneRated) {
        showToast('Моля оценете всички 10 критерия или не оценявайте нито един!', 'error');
        return;
    }
    
    if (noneRated && !opinion) {
        showToast('Моля оценете критериите или напишете мнение!', 'error');
        return;
    }

    const ratingData = {
        city: city,
        neighborhood: neighborhood,
        ratings: { ...currentRatings },
        opinion: opinion,
        userId: currentUser.uid,
        timestamp: new Date().toISOString()
    };

    // Enforce one vote per user per neighborhood via deterministic doc id
    // Encode city and neighborhood to handle special characters
    const docId = `${encodeURIComponent(city)}__${encodeURIComponent(neighborhood)}__${currentUser.uid}`;

    try {
        const docRef = db.collection('ratings').doc(docId);
        const existing = await docRef.get();
        if (existing.exists) {
            showToast('Вече сте гласували за този квартал!', 'error');
            updateNeighborhoodOptions();
            return;
        }

        await docRef.set(ratingData);

        // Update local cache of voted neighborhoods for this user
        userVotedNeighborhoods.push(voteKey);
        updateNeighborhoodOptions();

        // Reset form
        document.getElementById('ratingForm').reset();
        document.getElementById('opinion').value = '';
        Object.keys(currentRatings).forEach(key => currentRatings[key] = 0);
        document.querySelectorAll('.stars').forEach(container => {
            container.querySelectorAll('.star').forEach(star => star.classList.remove('active'));
        });

        showToast('Оценката е запазена успешно!');
        // displayResults() is triggered by the Firestore snapshot listener
    } catch (err) {
        console.error('Error saving rating:', err);
        showToast('Грешка при запис на оценката', 'error');
    }
}
