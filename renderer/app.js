// Simplified Travel Booking System - Main Application
class TravelApp {
  constructor() {
    this.currentUser = null;
    this.currentPage = 'dashboard';
    this.bookings = [];
    
    this.init();
  }

  async init() {
    try {
      // Show loading screen
      this.showLoading();
      
      // Initialize app
      await this.initializeApp();
      
      // Check authentication
      await this.checkAuth();
      
      // Hide loading and show appropriate screen
      this.hideLoading();
      
      if (this.currentUser) {
        this.showMainApp();
        this.navigateTo('dashboard');
      } else {
        this.showAuth();
      }
      
      // Set up event listeners
      this.setupEventListeners();
      
    } catch (error) {
      console.error('App initialization failed:', error);
      this.showError('Failed to initialize application');
    }
  }

  async initializeApp() {
    // Load user data from localStorage
    this.loadUserData();
    
    // Load bookings data
    this.loadBookingsData();
  }

  async checkAuth() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
        // Validate user data
        if (!this.currentUser.username || !this.currentUser.id) {
          throw new Error('Invalid user data');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        this.currentUser = null;
        localStorage.removeItem('currentUser');
      }
    }
  }

  setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item[data-page]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const page = item.dataset.page;
        this.navigateTo(page);
      });
    });

    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebar-toggle');
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', () => {
        this.toggleSidebar();
      });
    }
  }

  navigateTo(page) {
    if (this.currentPage === page) return;
    
    // Update navigation state
    this.currentPage = page;
    this.updateNavigation(page);
    this.updateBreadcrumb(page);
    
    // Load page content
    this.loadPageContent(page);
  }

  updateNavigation(page) {
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    
    // Add active class to current page
    const activeItem = document.querySelector(`[data-page="${page}"]`);
    if (activeItem) {
      activeItem.classList.add('active');
    }
  }

  updateBreadcrumb(page) {
    const breadcrumb = document.getElementById('breadcrumb');
    if (breadcrumb) {
      const pageNames = {
        dashboard: 'Dashboard',
        search: 'Search & Book',
        bookings: 'My Bookings',
        analytics: 'Analytics',
        profile: 'Profile'
      };
      
      breadcrumb.innerHTML = `<span>${pageNames[page] || page}</span>`;
    }
  }

  async loadPageContent(page) {
    const content = document.getElementById('page-content');
    if (!content) return;
    
    try {
      let html = '';
      
      switch (page) {
        case 'dashboard':
          html = await this.renderDashboard();
          break;
        case 'search':
          html = await this.renderSearch();
          break;
        case 'bookings':
          html = await this.renderBookings();
          break;
        case 'analytics':
          html = await this.renderAnalytics();
          break;
        case 'profile':
          html = await this.renderProfile();
          break;
        default:
          html = await this.renderDashboard();
      }
      
      content.innerHTML = html;
      
    } catch (error) {
      console.error(`Failed to load page ${page}:`, error);
      content.innerHTML = '<div class="alert alert-danger">Failed to load page content</div>';
    }
  }

  async renderDashboard() {
    const stats = this.calculateStats();
    
    return `
      <div class="page-enter">
        <div class="stats-grid">
          <div class="stat-card card-stagger">
            <div class="stat-header">
              <div class="stat-icon primary">
                <i class="fas fa-plane"></i>
              </div>
            </div>
            <div class="stat-value">${stats.totalBookings}</div>
            <div class="stat-label">Total Bookings</div>
            <div class="stat-change positive">+${stats.newThisMonth} this month</div>
          </div>
          
          <div class="stat-card card-stagger">
            <div class="stat-header">
              <div class="stat-icon success">
                <i class="fas fa-dollar-sign"></i>
              </div>
            </div>
            <div class="stat-value">$${stats.totalSpent}</div>
            <div class="stat-label">Total Spent</div>
            <div class="stat-change positive">+$${stats.spentThisMonth} this month</div>
          </div>
          
          <div class="stat-card card-stagger">
            <div class="stat-header">
              <div class="stat-icon warning">
                <i class="fas fa-calendar"></i>
              </div>
            </div>
            <div class="stat-value">${stats.upcomingTrips}</div>
            <div class="stat-label">Upcoming Trips</div>
            <div class="stat-change">Next: ${stats.nextTrip || 'None'}</div>
          </div>
          
          <div class="stat-card card-stagger">
            <div class="stat-header">
              <div class="stat-icon danger">
                <i class="fas fa-map-marker-alt"></i>
              </div>
            </div>
            <div class="stat-value">${stats.uniqueDestinations}</div>
            <div class="stat-label">Destinations</div>
            <div class="stat-change">${stats.mostVisited}</div>
          </div>
        </div>
        
        <div class="grid grid-cols-2">
          <div class="card card-stagger">
            <div class="card-header">
              <h3 class="card-title">Recent Bookings</h3>
            </div>
            <div class="card-body">
              ${this.renderRecentBookings()}
            </div>
          </div>
          
          <div class="card card-stagger">
            <div class="card-header">
              <h3 class="card-title">Quick Actions</h3>
            </div>
            <div class="card-body">
              <button class="btn btn-primary" onclick="app.navigateTo('search')">
                <i class="fas fa-search"></i>
                Search Travel
              </button>
              <button class="btn btn-outline" onclick="app.navigateTo('bookings')">
                <i class="fas fa-calendar-check"></i>
                View Bookings
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async renderSearch() {
    return `
      <div class="page-enter">
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Search & Book Travel</h2>
            <p class="card-subtitle">Find the best deals on flights, hotels, and car rentals</p>
          </div>
          <div class="card-body">
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
            
            <div id="search-results" class="search-results">
              <p class="text-muted">Enter your search criteria above to find travel options.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async renderBookings() {
    return `
      <div class="page-enter">
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">My Bookings</h2>
          </div>
          <div class="card-body">
            <div id="bookings-list" class="bookings-list">
              ${this.renderBookingsList()}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async renderAnalytics() {
    return `
      <div class="page-enter">
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Travel Analytics</h2>
          </div>
          <div class="card-body">
            <p>Analytics dashboard coming soon!</p>
          </div>
        </div>
      </div>
    `;
  }

  async renderProfile() {
    return `
      <div class="page-enter">
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Profile</h2>
          </div>
          <div class="card-body">
            <div class="profile-info">
              <div class="info-group">
                <label class="form-label">Username</label>
                <div class="info-value">${this.currentUser?.username || 'N/A'}</div>
              </div>
              
              <div class="info-group">
                <label class="form-label">Email</label>
                <div class="info-value">${this.currentUser?.email || 'Not provided'}</div>
              </div>
              
              <div class="info-group">
                <label class="form-label">Member Since</label>
                <div class="info-value">${this.currentUser?.createdAt ? new Date(this.currentUser.createdAt).toLocaleDateString() : 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Utility methods
  showLoading() {
    const loading = document.getElementById('loading-screen');
    if (loading) loading.classList.remove('hidden');
  }

  hideLoading() {
    const loading = document.getElementById('loading-screen');
    if (loading) loading.classList.add('hidden');
  }

  showMainApp() {
    const mainApp = document.getElementById('main-app');
    const authContainer = document.getElementById('auth-container');
    if (mainApp) mainApp.classList.remove('hidden');
    if (authContainer) authContainer.classList.add('hidden');
  }

  showAuth() {
    const mainApp = document.getElementById('main-app');
    const authContainer = document.getElementById('auth-container');
    if (mainApp) mainApp.classList.add('hidden');
    if (authContainer) authContainer.classList.remove('hidden');
  }

  toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.toggle('open');
    }
  }

  showSuccess(message) {
    this.showToast(message, 'success');
  }

  showError(message) {
    this.showToast(message, 'error');
  }

  showToast(message, type = 'info') {
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
      
      // Auto remove after 5 seconds
      setTimeout(() => {
        if (toast.parentElement) {
          toast.remove();
        }
      }, 5000);
    }
  }

  getToastIcon(type) {
    const icons = {
      success: 'check-circle',
      error: 'exclamation-circle',
      warning: 'exclamation-triangle',
      info: 'info-circle'
    };
    return icons[type] || 'info-circle';
  }

  // Data management
  loadUserData() {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.length === 0) {
        // Create demo user
        const demoUser = {
          id: 'demo-1',
          username: 'demo',
          email: 'demo@travel.com',
          password: 'demo',
          createdAt: new Date().toISOString(),
          preferences: {
            currency: 'USD',
            language: 'en',
            notifications: {
              email: true,
              push: true
            }
          }
        };
        users.push(demoUser);
        localStorage.setItem('users', JSON.stringify(users));
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  }

  loadBookingsData() {
    try {
      this.bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      if (this.bookings.length === 0) {
        // Create sample bookings
        this.bookings = this.createSampleBookings();
        localStorage.setItem('bookings', JSON.stringify(this.bookings));
      }
    } catch (error) {
      console.error('Failed to load bookings data:', error);
      this.bookings = [];
    }
  }

  createSampleBookings() {
    return [
      {
        id: 'b1',
        type: 'flight',
        title: 'New York to London',
        from: 'New York',
        to: 'London',
        date: '2024-07-15',
        price: 850,
        status: 'confirmed',
        bookingDate: '2024-06-01'
      },
      {
        id: 'b2',
        type: 'hotel',
        title: 'Royal Hotel London',
        location: 'London',
        checkIn: '2024-07-15',
        checkOut: '2024-07-20',
        price: 120,
        status: 'confirmed',
        bookingDate: '2024-06-01'
      },
      {
        id: 'b3',
        type: 'car',
        title: 'Hertz Car Rental',
        location: 'London',
        pickup: '2024-07-16',
        return: '2024-07-19',
        price: 45,
        status: 'confirmed',
        bookingDate: '2024-06-01'
      }
    ];
  }

  calculateStats() {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    
    const totalBookings = this.bookings.length;
    const totalSpent = this.bookings.reduce((sum, booking) => sum + booking.price, 0);
    
    const thisMonthBookings = this.bookings.filter(booking => {
      const bookingDate = new Date(booking.bookingDate);
      return bookingDate.getMonth() === thisMonth && bookingDate.getFullYear() === thisYear;
    });
    
    const newThisMonth = thisMonthBookings.length;
    const spentThisMonth = thisMonthBookings.reduce((sum, booking) => sum + booking.price, 0);
    
    const destinations = [...new Set(this.bookings.map(b => b.to || b.location).filter(Boolean))];
    const uniqueDestinations = destinations.length;
    
    const upcomingTrips = this.bookings.filter(booking => {
      const tripDate = new Date(booking.date || booking.checkIn);
      return tripDate > now && booking.status === 'confirmed';
    }).length;
    
    const nextTrip = this.bookings
      .filter(booking => {
        const tripDate = new Date(booking.date || booking.checkIn);
        return tripDate > now && booking.status === 'confirmed';
      })
      .sort((a, b) => new Date(a.date || a.checkIn) - new Date(b.date || b.checkIn))[0];
    
    const destinationCounts = {};
    this.bookings.forEach(booking => {
      const dest = booking.to || booking.location;
      if (dest) {
        destinationCounts[dest] = (destinationCounts[dest] || 0) + 1;
      }
    });
    
    const mostVisited = Object.keys(destinationCounts).length > 0 
      ? Object.entries(destinationCounts).sort(([,a], [,b]) => b - a)[0][0]
      : 'None';
    
    return {
      totalBookings,
      totalSpent,
      newThisMonth,
      spentThisMonth,
      uniqueDestinations,
      upcomingTrips,
      nextTrip: nextTrip ? new Date(nextTrip.date || nextTrip.checkIn).toLocaleDateString() : null,
      mostVisited
    };
  }

  renderRecentBookings() {
    const recentBookings = this.bookings.slice(0, 5);
    
    if (recentBookings.length === 0) {
      return '<p class="text-muted">No recent bookings</p>';
    }
    
    return recentBookings.map(booking => `
      <div class="booking-item">
        <div class="booking-icon ${booking.type}">
          <i class="fas fa-${this.getBookingIcon(booking.type)}"></i>
        </div>
        <div class="booking-info">
          <div class="booking-title">${booking.title}</div>
          <div class="booking-date">${booking.date || booking.checkIn}</div>
        </div>
        <div class="booking-price">$${booking.price}</div>
      </div>
    `).join('');
  }

  renderBookingsList() {
    if (this.bookings.length === 0) {
      return '<p class="text-muted">No bookings found</p>';
    }
    
    return this.bookings.map(booking => `
      <div class="booking-card card-hover">
        <div class="booking-header">
          <div class="booking-type">
            <div class="booking-type-icon ${booking.type}">
              <i class="fas fa-${this.getBookingIcon(booking.type)}"></i>
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
            <button class="btn btn-sm btn-outline" onclick="app.viewBooking('${booking.id}')">
              <i class="fas fa-eye"></i>
              View
            </button>
            <button class="btn btn-sm btn-danger" onclick="app.cancelBooking('${booking.id}')">
              <i class="fas fa-times"></i>
              Cancel
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  getBookingIcon(type) {
    const icons = {
      flight: 'plane',
      hotel: 'bed',
      car: 'car'
    };
    return icons[type] || 'question';
  }

  getStatusBadge(status) {
    const badges = {
      confirmed: 'success',
      pending: 'warning',
      cancelled: 'danger'
    };
    return badges[status] || 'info';
  }

  // Public methods for global access
  searchTravel() {
    this.showInfo('Search functionality coming soon!');
  }

  viewBooking(id) {
    this.showInfo('Booking details coming soon!');
  }

  cancelBooking(id) {
    this.showWarning('Cancel booking functionality coming soon!');
  }

  showInfo(message) {
    this.showToast(message, 'info');
  }

  showWarning(message) {
    this.showToast(message, 'warning');
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new TravelApp();
});

// Global logout function
window.logout = function() {
  localStorage.removeItem('currentUser');
  window.location.reload();
}; 