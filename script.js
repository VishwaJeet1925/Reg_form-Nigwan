// Form Elements
const form = document.getElementById('registrationForm');
const fullNameInput = document.getElementById('fullName');
const addressInput = document.getElementById('address');
const mobileInput = document.getElementById('mobile');
const emailInput = document.getElementById('email');
const genderInputs = document.querySelectorAll('input[name="gender"]');
const dobDisplay = document.getElementById('dobDisplay');
const submitBtn = document.getElementById('submitBtn');

// Date Picker Elements
const customDatePicker = document.getElementById('customDatePicker');
const calendarGrid = document.getElementById('calendarGrid');
const prevMonthBtn = document.getElementById('prevMonthBtn');
const nextMonthBtn = document.getElementById('nextMonthBtn');
const monthBtn = document.getElementById('monthBtn');
const yearBtn = document.getElementById('yearBtn');
const monthSelector = document.getElementById('monthSelector');
const yearSelector = document.getElementById('yearSelector');
const monthGrid = document.getElementById('monthGrid');
const yearGrid = document.getElementById('yearGrid');
const closeMonthSelector = document.getElementById('closeMonthSelector');
const prevYearRange = document.getElementById('prevYearRange');
const nextYearRange = document.getElementById('nextYearRange');
const yearRangeLabel = document.getElementById('yearRangeLabel');
const currentMonthYear = document.getElementById('currentMonthYear');

// Date Picker State
let currentDate = new Date();
let selectedDate = null;
let currentYearRange = new Date().getFullYear();

// Modal Elements
const previewModal = document.getElementById('previewModal');
const successModal = document.getElementById('successModal');
const closeModalBtn = document.getElementById('closeModal');
const editBtn = document.getElementById('editBtn');
const confirmBtn = document.getElementById('confirmBtn');
const newFormBtn = document.getElementById('newFormBtn');
const previewContent = document.getElementById('previewContent');
const successMessage = document.getElementById('successMessage');

// Validation Rules
const validators = {
    fullName: (value) => {
        if (!value.trim()) return 'Full Name is required';
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'Full Name must contain only alphabets';
        return '';
    },
    address: (value) => {
        if (!value.trim()) return 'Address is required';
        return '';
    },
    mobile: (value) => {
        if (!value.trim()) return 'Mobile Number is required';
        if (!/^\d{10}$/.test(value)) return 'Mobile Number must be exactly 10 digits';
        return '';
    },
    email: (value) => {
        if (!value.trim()) return 'Email ID is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return '';
    },
    gender: () => {
        const selected = Array.from(genderInputs).some(input => input.checked);
        if (!selected) return 'Please select a gender';
        return '';
    },
    dob: (value) => {
        if (!value) return 'Date of Birth is required';
        return '';
    }
};

// Validate individual field
function validateField(fieldName) {
    let value = '';
    let errorElement = document.getElementById(`${fieldName}Error`);
    let inputElement = document.getElementById(fieldName);

    if (fieldName === 'gender') {
        value = Array.from(genderInputs).find(input => input.checked)?.value || '';
    } else if (fieldName === 'dob') {
        value = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
        inputElement = dobDisplay;
    } else {
        value = document.getElementById(fieldName).value;
    }

    const error = validators[fieldName](value);

    if (error) {
        errorElement.textContent = error;
        if (inputElement) inputElement.classList.add('error');
        return false;
    } else {
        errorElement.textContent = '';
        if (inputElement) inputElement.classList.remove('error');
        return true;
    }
}

// Validate all fields
function validateForm() {
    const fields = ['fullName', 'address', 'mobile', 'email', 'gender', 'dob'];
    return fields.every(field => validateField(field));
}

// Check if form is valid and enable/disable submit button
function updateSubmitButton() {
    const isValid = validateForm();
    submitBtn.disabled = !isValid;
}

// Add event listeners for real-time validation
fullNameInput.addEventListener('blur', () => {
    validateField('fullName');
    updateSubmitButton();
});

fullNameInput.addEventListener('input', () => {
    validateField('fullName');
    updateSubmitButton();
});

addressInput.addEventListener('blur', () => {
    validateField('address');
    updateSubmitButton();
});

addressInput.addEventListener('input', () => {
    validateField('address');
    updateSubmitButton();
});

mobileInput.addEventListener('blur', () => {
    validateField('mobile');
    updateSubmitButton();
});

mobileInput.addEventListener('input', () => {
    validateField('mobile');
    updateSubmitButton();
});

emailInput.addEventListener('blur', () => {
    validateField('email');
    updateSubmitButton();
});

emailInput.addEventListener('input', () => {
    validateField('email');
    updateSubmitButton();
});

genderInputs.forEach(input => {
    input.addEventListener('change', () => {
        validateField('gender');
        updateSubmitButton();
    });
});

dobDisplay.addEventListener('blur', () => {
    validateField('dob');
    updateSubmitButton();
});

// Format date for display (DD/MM/YYYY)
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Format date for preview display (Long format)
function formatDateLong(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Parse date from user input (DD/MM/YYYY format)
function parseDateInput(dateString) {
    const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    const match = dateString.trim().match(dateRegex);
    
    if (!match) return null;
    
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);
    
    // Validate day and month
    if (day < 1 || day > 31 || month < 1 || month > 12) return null;
    
    const date = new Date(year, month - 1, day);
    
    // Check if date is valid and not in the future
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
        return null;
    }
    
    const today = new Date();
    if (date > today) return null;
    
    return date;
}

// Handle manual date input
dobDisplay.addEventListener('input', () => {
    const inputValue = dobDisplay.value.trim();
    
    if (inputValue === '') {
        selectedDate = null;
        dobDisplay.classList.remove('error');
        document.getElementById('dobError').textContent = '';
        updateSubmitButton();
        return;
    }
    
    const parsedDate = parseDateInput(inputValue);
    
    if (parsedDate) {
        selectedDate = parsedDate;
        currentDate = new Date(parsedDate);
        dobDisplay.value = formatDate(parsedDate.toISOString().split('T')[0]);
        dobDisplay.classList.remove('error');
        document.getElementById('dobError').textContent = '';
        renderCalendar();
        updateSubmitButton();
    }
});

// Custom Date Picker Functions
function renderCalendar() {
    calendarGrid.innerHTML = '';
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();
    
    // Update month-year display
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
    currentMonthYear.textContent = `${monthNames[month]} ${year}`;
    
    // Disable next month button if we're at current month
    const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
    nextMonthBtn.disabled = isCurrentMonth;
    
    // Add day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.className = 'day-header';
        header.textContent = day;
        calendarGrid.appendChild(header);
    });
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    // Previous month dates
    for (let i = firstDay - 1; i >= 0; i--) {
        const cell = document.createElement('div');
        cell.className = 'date-cell other-month';
        cell.textContent = daysInPrevMonth - i;
        calendarGrid.appendChild(cell);
    }
    
    // Current month dates
    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement('div');
        cell.className = 'date-cell';
        cell.textContent = day;
        
        const cellDate = new Date(year, month, day);
        
        // Disable future dates
        if (cellDate > today) {
            cell.classList.add('disabled');
        } else {
            cell.addEventListener('click', () => selectDate(cellDate));
        }
        
        // Highlight today
        if (cellDate.toDateString() === today.toDateString()) {
            cell.classList.add('today');
        }
        
        // Highlight selected date
        if (selectedDate && cellDate.toDateString() === selectedDate.toDateString()) {
            cell.classList.add('selected');
        }
        
        calendarGrid.appendChild(cell);
    }
    
    // Next month dates
    const totalCells = calendarGrid.children.length - 7; // Subtract day headers
    const remainingCells = 42 - totalCells; // 6 rows * 7 days
    for (let day = 1; day <= remainingCells; day++) {
        const cell = document.createElement('div');
        cell.className = 'date-cell other-month';
        cell.textContent = day;
        calendarGrid.appendChild(cell);
    }
}

function selectDate(date) {
    selectedDate = date;
    dobDisplay.value = formatDate(date.toISOString().split('T')[0]);
    customDatePicker.classList.remove('active');
    validateField('dob');
    updateSubmitButton();
    renderCalendar();
}

function renderMonthSelector() {
    monthGrid.innerHTML = '';
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
    
    months.forEach((month, index) => {
        const item = document.createElement('div');
        item.className = 'selector-item';
        item.textContent = month;
        
        if (index === currentDate.getMonth()) {
            item.classList.add('selected');
        }
        
        item.addEventListener('click', () => {
            currentDate.setMonth(index);
            monthSelector.style.display = 'none';
            customDatePicker.classList.add('active');
            renderCalendar();
        });
        
        monthGrid.appendChild(item);
    });
}

function renderYearSelector() {
    yearGrid.innerHTML = '';
    const currentYear = new Date().getFullYear();
    const startYear = currentYearRange - 6;
    let endYear = currentYearRange + 5;
    
    // Limit endYear to current year
    if (endYear > currentYear) {
        endYear = currentYear;
    }
    
    yearRangeLabel.textContent = `${startYear} - ${endYear}`;
    
    for (let year = startYear; year <= endYear; year++) {
        const item = document.createElement('div');
        item.className = 'selector-item';
        item.textContent = year;
        
        if (year === currentDate.getFullYear()) {
            item.classList.add('selected');
        }
        
        item.addEventListener('click', () => {
            currentDate.setFullYear(year);
            yearSelector.style.display = 'none';
            customDatePicker.classList.add('active');
            renderCalendar();
        });
        
        yearGrid.appendChild(item);
    }
}

// Adjust calendar position to keep it within viewport
function adjustPickerPosition(picker) {
    if (!picker.classList.contains('active')) return;
    
    setTimeout(() => {
        const rect = picker.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        
        // If picker goes beyond right edge, adjust left position
        if (rect.right > viewportWidth) {
            const overflow = rect.right - viewportWidth + 20;
            picker.style.left = `calc(0px - ${overflow}px)`;
        } else {
            picker.style.left = '0';
        }
        
        // If picker goes beyond bottom, position it above the input
        if (rect.bottom > window.innerHeight) {
            picker.style.top = 'auto';
            picker.style.bottom = '100%';
            picker.style.marginBottom = '5px';
            picker.style.marginTop = '0';
        } else {
            picker.style.top = '100%';
            picker.style.bottom = 'auto';
            picker.style.marginTop = '5px';
            picker.style.marginBottom = '0';
        }
    }, 0);
}

// Date Picker Event Listeners
dobDisplay.addEventListener('click', () => {
    customDatePicker.classList.toggle('active');
    monthSelector.style.display = 'none';
    yearSelector.style.display = 'none';
    adjustPickerPosition(customDatePicker);
});

prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
    const today = new Date();
    if (currentDate.getMonth() < today.getMonth() || currentDate.getFullYear() < today.getFullYear()) {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    }
});

monthBtn.addEventListener('click', () => {
    customDatePicker.classList.remove('active');
    monthSelector.style.display = 'block';
    yearSelector.style.display = 'none';
    renderMonthSelector();
    adjustPickerPosition(monthSelector);
});

yearBtn.addEventListener('click', () => {
    customDatePicker.classList.remove('active');
    yearSelector.style.display = 'block';
    monthSelector.style.display = 'none';
    renderYearSelector();
    adjustPickerPosition(yearSelector);
});

closeMonthSelector.addEventListener('click', () => {
    monthSelector.style.display = 'none';
    customDatePicker.classList.add('active');
});

prevYearRange.addEventListener('click', () => {
    currentYearRange -= 12;
    renderYearSelector();
});

nextYearRange.addEventListener('click', () => {
    const currentYear = new Date().getFullYear();
    const potentialEndYear = currentYearRange + 12 + 5;
    
    // Only allow navigation if it won't exceed current year
    if (potentialEndYear <= currentYear) {
        currentYearRange += 12;
        renderYearSelector();
    }
});

// Close date picker when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.date-picker-wrapper')) {
        customDatePicker.classList.remove('active');
        monthSelector.style.display = 'none';
        yearSelector.style.display = 'none';
    }
});


// Get form data
function getFormData() {
    return {
        fullName: fullNameInput.value.trim(),
        address: addressInput.value.trim(),
        mobile: mobileInput.value.trim(),
        email: emailInput.value.trim(),
        gender: Array.from(genderInputs).find(input => input.checked).value,
        dob: selectedDate ? selectedDate.toISOString().split('T')[0] : ''
    };
}

// Show preview modal
function showPreview() {
    const data = getFormData();
    
    previewContent.innerHTML = `
        <div class="preview-item">
            <span class="preview-label">Full Name:</span>
            <span class="preview-value">${data.fullName}</span>
        </div>
        <div class="preview-item">
            <span class="preview-label">Address:</span>
            <span class="preview-value">${data.address}</span>
        </div>
        <div class="preview-item">
            <span class="preview-label">Mobile Number:</span>
            <span class="preview-value">${data.mobile}</span>
        </div>
        <div class="preview-item">
            <span class="preview-label">Email ID:</span>
            <span class="preview-value">${data.email}</span>
        </div>
        <div class="preview-item">
            <span class="preview-label">Gender:</span>
            <span class="preview-value">${data.gender}</span>
        </div>
        <div class="preview-item">
            <span class="preview-label">Date of Birth:</span>
            <span class="preview-value">${formatDateLong(data.dob)}</span>
        </div>
    `;
    
    previewModal.classList.add('active');
}

// Hide preview modal
function hidePreview() {
    previewModal.classList.remove('active');
}

// Save to localStorage
function saveToLocalStorage(data) {
    const registrations = JSON.parse(localStorage.getItem('registrations')) || [];
    registrations.push({
        ...data,
        submittedAt: new Date().toISOString()
    });
    localStorage.setItem('registrations', JSON.stringify(registrations));
}

// Show success modal
function showSuccess(data) {
    successMessage.textContent = `Thank you ${data.fullName}! Your registration has been submitted successfully.`;
    successModal.classList.add('active');
}

// Hide success modal
function hideSuccess() {
    successModal.classList.remove('active');
}

// Reset form
function resetForm() {
    form.reset();
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('input, textarea').forEach(el => el.classList.remove('error'));
    submitBtn.disabled = true;
    hideSuccess();
}

// Form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (validateForm()) {
        showPreview();
    }
});

// Preview modal buttons
closeModalBtn.addEventListener('click', hidePreview);

editBtn.addEventListener('click', hidePreview);

confirmBtn.addEventListener('click', () => {
    const data = getFormData();
    saveToLocalStorage(data);
    hidePreview();
    showSuccess(data);
});

newFormBtn.addEventListener('click', resetForm);

// Close modal when clicking outside
previewModal.addEventListener('click', (e) => {
    if (e.target === previewModal) {
        hidePreview();
    }
});

successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
        resetForm();
    }
});

// Set initial calendar on page load
function initializeDatePicker() {
    renderCalendar();
    renderMonthSelector();
    renderYearSelector();
}

// Load saved data on page load (optional - for demonstration)
window.addEventListener('load', () => {
    initializeDatePicker();
    const savedRegistrations = localStorage.getItem('registrations');
    if (savedRegistrations) {
        console.log('Saved registrations:', JSON.parse(savedRegistrations));
    }
});
