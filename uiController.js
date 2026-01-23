// UI Controller (Single Responsibility - UI Updates)
const UIController = {
    // Update city display
    updateCityDisplay(city) {

        updateHeaderCity(city);
    },
    
    // Update neighborhood selectors
    updateNeighborhoodDisplay(neighborhood) {
        if (neighborhood) {
            Utils.setElementValue('neighborhood', neighborhood);
            Utils.setElementValue('filterNeighborhood', neighborhood);
        }
    },
    
    // Clear form inputs
    clearForm() {
        const form = Utils.getElement('ratingForm');
        if (form) form.reset();
        Utils.setElementValue('opinion', '');
        AppState.clearRatings();
        document.querySelectorAll('.stars span').forEach(star => 
            star.classList.remove('active')
        );
    },
    
    // Update location type UI
    updateLocationTypeUI(type) {
        const isChildcare = type === 'childcare';
        const isDoctors = type === 'doctors';
        const isDentists = type === 'dentists';
        const isShops = type === 'shops';
        
        // Toggle buttons
        const btnNeighborhoods = Utils.getElement('btnNeighborhoods');
        const btnChildcare = Utils.getElement('btnChildcare');
        const btnDoctors = Utils.getElement('btnDoctors');
        const btnDentists = Utils.getElement('btnDentists');
        const btnShops = Utils.getElement('btnShops');
        if (btnNeighborhoods) btnNeighborhoods.classList.toggle('active', !isChildcare && !isDoctors && !isDentists && !isShops);
        if (btnChildcare) btnChildcare.classList.toggle('active', isChildcare);
        if (btnDoctors) btnDoctors.classList.toggle('active', isDoctors);
        if (btnDentists) btnDentists.classList.toggle('active', isDentists);
        if (btnShops) btnShops.classList.toggle('active', isShops);
        
        // Show/hide form groups
        const neighborhoodGroup = Utils.getElement('neighborhood')?.closest('.form-group');
        const neighborhoodSelect = Utils.getElement('neighborhood');
        const doctorNameGroup = Utils.getElement('doctorNameGroup');
        const doctorNameField = Utils.getElement('doctorName');
        const specialtyGroup = Utils.getElement('specialtyGroup');
        const specialtyField = Utils.getElement('specialty');
        const shopCategoryGroup = Utils.getElement('shopCategoryGroup');
        const shopCategoryField = Utils.getElement('shopCategory');
        const shopNameGroup = Utils.getElement('shopNameGroup');
        const shopNameField = Utils.getElement('shopName');
        
        if (neighborhoodGroup) neighborhoodGroup.style.display = (isDoctors || isDentists || isShops) ? 'none' : 'block';
        if (neighborhoodSelect) neighborhoodSelect.required = !(isDoctors || isDentists || isShops);
        
        if (doctorNameGroup) doctorNameGroup.style.display = (isDoctors || isDentists) ? 'block' : 'none';
        if (doctorNameField) doctorNameField.required = (isDoctors || isDentists);
        
        // Specialty only for doctors, not for dentists
        if (specialtyGroup) specialtyGroup.style.display = isDoctors ? 'block' : 'none';
        if (specialtyField) specialtyField.required = isDoctors;
        
        // Shop fields - only for shops mode
        if (shopCategoryGroup) shopCategoryGroup.style.display = isShops ? 'block' : 'none';
        if (shopCategoryField) shopCategoryField.required = isShops;
        if (shopNameGroup) shopNameGroup.style.display = isShops ? 'none' : 'none'; // Initially hidden until category is selected
        if (shopNameField) shopNameField.required = isShops;
        
        // Update doctor name field label and placeholder based on type
        const doctorNameLabel = doctorNameGroup?.querySelector('label[for="doctorName"]');
        if (doctorNameLabel) {
            doctorNameLabel.textContent = isDentists ? 'Име на зъболекар:' : 'Име на лекар:';
        }
        const doctorName = Utils.getElement('doctorName');
        if (doctorName) {
            doctorName.placeholder = isDentists ? 'Въведете име на зъболекар...' : 'Въведете име на лекар...';
        }
        
        // Update labels and placeholders
        const labels = {
            neighborhoodLabel: isChildcare ? 'Детска градина/ясла:' : 'Квартал:',
            neighborhoodPlaceholder: isChildcare ? 'Изберете детска градина...' : 'Изберете квартал...',
            filterNeighborhoodPlaceholder: isDoctors ? 'Всички специалности' : (isDentists ? 'Всички зъболекари' : (isShops ? 'Всички магазини' : (isChildcare ? 'Всички детски градини' : 'Всички квартали'))),
            headerSubtitle: isDoctors
                ? `Оцени лекарите на град ${AppState.getCity()} и дай мнение за тях.`
                : (isDentists
                    ? `Оцени зъболекарите на град ${AppState.getCity()} и дай мнение за тях.`
                    : (isShops
                        ? `Оцени магазините на град ${AppState.getCity()} и дай мнение за тях.`
                        : (isChildcare 
                            ? `Оцени детските градини и ясли на град ${AppState.getCity()} и дай мнение за тях.`
                            : 'Оценете кварталите на всички областни градове по 10 критерия')))
        };
        
        Object.entries(labels).forEach(([id, text]) => {
            const element = Utils.getElement(id);
            if (element) element.textContent = text;
        });
        
        // Update opinion placeholder
        const opinion = Utils.getElement('opinion');
        if (opinion) {
            opinion.placeholder = isDoctors
                ? 'Напишете вашето мнение за лекаря...'
                : (isDentists
                    ? 'Напишете вашето мнение за зъболекаря...'
                    : (isShops
                        ? 'Напишете вашето мнение за магазина...'
                        : (isChildcare 
                            ? 'Напишете вашето мнение за детската градина...'
                            : 'Напишете вашето мнение за квартала...')));
        }
        
        // Toggle criteria sections
        const neighborhoodCriteria = Utils.getElement('neighborhoodCriteria');
        const childcareCriteria = Utils.getElement('childcareCriteria');
        const shopsCriteria = Utils.getElement('shopsCriteria');
        
        if (neighborhoodCriteria) {
            neighborhoodCriteria.style.display = (!isChildcare && !isDoctors && !isDentists && !isShops) ? 'grid' : 'none';
        }
        if (childcareCriteria) {
            childcareCriteria.style.display = (isChildcare || isDoctors || isDentists) ? 'grid' : 'none';
        }
        if (shopsCriteria) {
            shopsCriteria.style.display = isShops ? 'grid' : 'none';
        }
        
        // Populate specialty dropdown if doctors mode
        if (isDoctors) {
            const specialtySelect = Utils.getElement('specialty');
            if (specialtySelect && typeof medicalSpecialties !== 'undefined') {
                specialtySelect.innerHTML = '<option value="">Изберете специалност...</option>';
                medicalSpecialties.forEach(specialty => {
                    const option = document.createElement('option');
                    option.value = specialty;
                    option.textContent = specialty;
                    specialtySelect.appendChild(option);
                });
            }
            
            // Populate filter dropdown with specialties for doctors
            const filterNeighborhood = Utils.getElement('filterNeighborhood');
            if (filterNeighborhood && typeof medicalSpecialties !== 'undefined') {
                filterNeighborhood.innerHTML = '<option value="" id="filterNeighborhoodPlaceholder">Всички специалности</option>';
                medicalSpecialties.forEach(specialty => {
                    const option = document.createElement('option');
                    option.value = specialty;
                    option.textContent = specialty;
                    filterNeighborhood.appendChild(option);
                });
            }
        }
    },
    
    // Initialize star ratings
    initStarRatings() {
        document.querySelectorAll('.stars').forEach(starsContainer => {
            const criterion = starsContainer.dataset.criterion;
            AppState.setRating(criterion, 0);
            
            for (let i = 1; i <= 5; i++) {
                const star = document.createElement('span');
                star.className = 'star';
                star.textContent = '★';
                star.dataset.value = i;
                
                star.addEventListener('click', () => {
                    AppState.setRating(criterion, i);
                    updateStars(starsContainer, i);
                });
                
                starsContainer.appendChild(star);
            }
        });
    }
};

// Expose globally
window.UIController = UIController;
