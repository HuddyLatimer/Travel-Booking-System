// Components for Travel Booking System

// Auth Components
class AuthComponents {
  static renderLoginForm() {
    return `
      <form id="login-form" class="auth-form">
        <div class="form-group">
          <label class="form-label" for="username">Username</label>
          <input type="text" id="username" class="form-input" placeholder="Enter username" required>
        </div>
        <div class="form-group">
          <label class="form-label" for="password">Password</label>
          <input type="password" id="password" class="form-input" placeholder="Enter password" required>
        </div>
        <button type="submit" class="btn btn-primary btn-block">
          <i class="fas fa-sign-in-alt"></i>
          Sign In
        </button>
        <div class="auth-switch">
          <p>Don't have an account? <a href="#" onclick="showRegisterForm()">Sign up</a></p>
        </div>
      </form>
    `;
  }

  static renderRegisterForm() {
    return `
      <form id="register-form" class="auth-form">
        <div class="form-group">
          <label class="form-label" for="reg-username">Username</label>
          <input type="text" id="reg-username" class="form-input" placeholder="Choose username" required>
        </div>
        <div class="form-group">
          <label class="form-label" for="reg-email">Email</label>
          <input type="email" id="reg-email" class="form-input" placeholder="Enter email" required>
        </div>
        <div class="form-group">
          <label class="form-label" for="reg-password">Password</label>
          <input type="password" id="reg-password" class="form-input" placeholder="Choose password" required>
        </div>
        <div class="form-group">
          <label class="form-label" for="reg-confirm-password">Confirm Password</label>
          <input type="password" id="reg-confirm-password" class="form-input" placeholder="Confirm password" required>
        </div>
        <button type="submit" class="btn btn-primary btn-block">
          <i class="fas fa-user-plus"></i>
          Create Account
        </button>
        <div class="auth-switch">
          <p>Already have an account? <a href="#" onclick="showLoginForm()">Sign in</a></p>
        </div>
      </form>
    `;
  }
}

// Search Components
class SearchComponents {
  static renderSearchFilters() {
    return `
      <div class="search-filters">
        <div class="filter-group">
          <div class="filter-item">
            <label class="form-label">Travel Type</label>
            <select class="form-input form-select" id="travel-type">
              <option value="all">All</option>
              <option value="flight">Flights</option>
              <option value="hotel">Hotels</option>
              <option value="car">Car Rentals</option>
            </select>
          </div>
          <div class="filter-item">
            <label class="form-label">From</label>
            <input type="text" class="form-input" id="from-location" placeholder="Departure city">
          </div>
          <div class="filter-item">
            <label class="form-label">To</label>
            <input type="text" class="form-input" id="to-location" placeholder="Destination city">
          </div>
          <div class="filter-item">
            <label class="form-label">Date</label>
            <input type="date" class="form-input" id="travel-date">
          </div>
        </div>
        <button class="btn btn-primary" onclick="app.searchTravel()">
          <i class="fas fa-search"></i>
          Search
        </button>
      </div>
    `;
  }

  static renderSearchResults(results = []) {
    if (results.length === 0) {
      return `
        <div class="search-results">
          <div class="text-center">
            <i class="fas fa-search" style="font-size: 3rem; color: var(--gray-400); margin-bottom: 1rem;"></i>
            <p class="text-muted">Enter your search criteria above to find travel options.</p>
          </div>
        </div>
      `;
    }

    return `
      <div class="search-results">
        <div class="results-header">
          <h3>Found ${results.length} results</h3>
        </div>
        <div class="results-grid">
          ${results.map(result => this.renderSearchResult(result)).join('')}
        </div>
      </div>
    `;
  }

  static renderSearchResult(result) {
    return `
      <div class="search-result-card card card-hover">
        <div class="result-header">
          <div class="result-type-icon ${result.type}">
            <i class="fas fa-${this.getTypeIcon(result.type)}"></i>
          </div>
          <div class="result-info">
            <h4 class="result-title">${result.title}</h4>
            <p class="result-subtitle">${result.subtitle}</p>
          </div>
          <div class="result-price">
            <span class="price-amount">$${result.price}</span>
            <span class="price-unit">${result.priceUnit || 'per night'}</span>
          </div>
        </div>
        <div class="result-details">
          <div class="detail-item">
            <i class="fas fa-calendar"></i>
            <span>${result.date}</span>
          </div>
          <div class="detail-item">
            <i class="fas fa-map-marker-alt"></i>
            <span>${result.location}</span>
          </div>
          <div class="detail-item">
            <i class="fas fa-star"></i>
            <span>${result.rating} (${result.reviews} reviews)</span>
          </div>
        </div>
        <div class="result-actions">
          <button class="btn btn-outline" onclick="viewDetails('${result.id}')">
            <i class="fas fa-eye"></i>
            View Details
          </button>
          <button class="btn btn-primary" onclick="bookNow('${result.id}')">
            <i class="fas fa-bookmark"></i>
            Book Now
          </button>
        </div>
      </div>
    `;
  }

  static getTypeIcon(type) {
    const icons = {
      flight: 'plane',
      hotel: 'bed',
      car: 'car'
    };
    return icons[type] || 'question';
  }
}

// Booking Components
class BookingComponents {
  static renderBookingCard(booking) {
    return `
      <div class="booking-card card card-hover">
        <div class="booking-header">
          <div class="booking-type">
            <div class="booking-type-icon ${booking.type}">
              <i class="fas fa-${this.getTypeIcon(booking.type)}"></i>
            </div>
            <div>
              <h4 class="booking-title">${booking.title}</h4>
              <span class="badge badge-${this.getStatusBadge(booking.status)}">${booking.status}</span>
            </div>
          </div>
        </div>
        <div class="booking-body">
          <div class="booking-details">
            <div class="booking-detail">
              <div class="booking-detail-label">Date</div>
              <div class="booking-detail-value">${booking.date || booking.checkIn}</div>
            </div>
            <div class="booking-detail">
              <div class="booking-detail-label">Location</div>
              <div class="booking-detail-value">${booking.from || booking.location} ${booking.to ? `→ ${booking.to}` : ''}</div>
            </div>
            <div class="booking-detail">
              <div class="booking-detail-label">Price</div>
              <div class="booking-detail-value">$${booking.price}</div>
            </div>
          </div>
        </div>
        <div class="booking-footer">
          <div class="booking-actions">
            <button class="btn btn-sm btn-outline" onclick="viewBooking('${booking.id}')">
              <i class="fas fa-eye"></i>
              View
            </button>
            <button class="btn btn-sm btn-danger" onclick="cancelBooking('${booking.id}')">
              <i class="fas fa-times"></i>
              Cancel
            </button>
          </div>
        </div>
      </div>
    `;
  }

  static getTypeIcon(type) {
    const icons = {
      flight: 'plane',
      hotel: 'bed',
      car: 'car'
    };
    return icons[type] || 'question';
  }

  static getStatusBadge(status) {
    const badges = {
      confirmed: 'success',
      pending: 'warning',
      cancelled: 'danger'
    };
    return badges[status] || 'info';
  }
}

// Modal Components
class ModalComponents {
  static showModal(title, content) {
    const modal = document.getElementById('modal-container');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    if (modal && modalTitle && modalBody) {
      modalTitle.textContent = title;
      modalBody.innerHTML = content;
      modal.classList.remove('hidden');
    }
  }

  static hideModal() {
    const modal = document.getElementById('modal-container');
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  static renderBookingDetails(booking) {
    return `
      <div class="booking-details-modal">
        <div class="detail-section">
          <h4>Booking Information</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <label>Booking ID:</label>
              <span>${booking.id}</span>
            </div>
            <div class="detail-item">
              <label>Type:</label>
              <span>${booking.type}</span>
            </div>
            <div class="detail-item">
              <label>Status:</label>
              <span class="badge badge-${this.getStatusBadge(booking.status)}">${booking.status}</span>
            </div>
            <div class="detail-item">
              <label>Price:</label>
              <span>$${booking.price}</span>
            </div>
          </div>
        </div>
        <div class="detail-section">
          <h4>Travel Details</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <label>Date:</label>
              <span>${booking.date || booking.checkIn}</span>
            </div>
            <div class="detail-item">
              <label>Location:</label>
              <span>${booking.from || booking.location} ${booking.to ? `→ ${booking.to}` : ''}</span>
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-outline" onclick="ModalComponents.hideModal()">Close</button>
          <button class="btn btn-danger" onclick="cancelBooking('${booking.id}')">Cancel Booking</button>
        </div>
      </div>
    `;
  }

  static getStatusBadge(status) {
    const badges = {
      confirmed: 'success',
      pending: 'warning',
      cancelled: 'danger'
    };
    return badges[status] || 'info';
  }
}

// Toast Components
class ToastComponents {
  static show(message, type = 'info', duration = 5000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} toast-enter`;
    toast.innerHTML = `
      <div class="toast-content">
        <i class="fas fa-${this.getToastIcon(type)}"></i>
        <span>${message}</span>
      </div>
      <button class="toast-close" onclick="this.parentElement.remove()">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    const container = document.getElementById('toast-container');
    if (container) {
      container.appendChild(toast);
      
      // Auto remove after duration
      setTimeout(() => {
        if (toast.parentElement) {
          toast.remove();
        }
      }, duration);
    }
  }

  static getToastIcon(type) {
    const icons = {
      success: 'check-circle',
      error: 'exclamation-circle',
      warning: 'exclamation-triangle',
      info: 'info-circle'
    };
    return icons[type] || 'info-circle';
  }
}

// Global functions for HTML onclick handlers
window.showLoginForm = function() {
  const authForms = document.getElementById('auth-forms');
  if (authForms) {
    authForms.innerHTML = AuthComponents.renderLoginForm();
    setupAuthListeners();
  }
};

window.showRegisterForm = function() {
  const authForms = document.getElementById('auth-forms');
  if (authForms) {
    authForms.innerHTML = AuthComponents.renderRegisterForm();
    setupAuthListeners();
  }
};

window.closeModal = function() {
  ModalComponents.hideModal();
};

window.viewBooking = function(id) {
  const booking = window.app?.bookings?.find(b => b.id === id);
  if (booking) {
    ModalComponents.showModal('Booking Details', ModalComponents.renderBookingDetails(booking));
  }
};

window.cancelBooking = function(id) {
  if (confirm('Are you sure you want to cancel this booking?')) {
    ToastComponents.show('Booking cancelled successfully', 'success');
    // Add actual cancellation logic here
  }
};

window.viewDetails = function(id) {
  ToastComponents.show('View details functionality coming soon!', 'info');
};

window.bookNow = function(id) {
  ToastComponents.show('Booking functionality coming soon!', 'info');
};

// Setup auth form listeners
function setupAuthListeners() {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }
}

function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  // Simple demo login
  if (username === 'demo' && password === 'demo') {
    const user = {
      id: 'demo-1',
      username: 'demo',
      email: 'demo@travel.com'
    };
    localStorage.setItem('currentUser', JSON.stringify(user));
    window.location.reload();
  } else {
    ToastComponents.show('Invalid credentials. Try demo/demo', 'error');
  }
}

function handleRegister(e) {
  e.preventDefault();
  const username = document.getElementById('reg-username').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;
  const confirmPassword = document.getElementById('reg-confirm-password').value;
  
  if (password !== confirmPassword) {
    ToastComponents.show('Passwords do not match', 'error');
    return;
  }
  
  // Simple demo registration
  const user = {
    id: Date.now().toString(),
    username,
    email,
    createdAt: new Date().toISOString()
  };
  
  localStorage.setItem('currentUser', JSON.stringify(user));
  ToastComponents.show('Account created successfully!', 'success');
  setTimeout(() => window.location.reload(), 1000);
}

// Initialize auth form on page load
document.addEventListener('DOMContentLoaded', () => {
  const authForms = document.getElementById('auth-forms');
  if (authForms) {
    authForms.innerHTML = AuthComponents.renderLoginForm();
    setupAuthListeners();
  }
}); 