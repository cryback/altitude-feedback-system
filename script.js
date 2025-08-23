class AltitudeFeedbackApp {
    constructor() {
        this.locations = {
            'appleton': 'Altitude Appleton',
            'gastonia': 'Altitude Gastonia', 
            'lombard': 'Altitude Lombard',
            'pueblo': 'Altitude Pueblo',
            'sanjose': 'Altitude San Jose',
            'york': 'Altitude York'
        };

        this.feedbackTypes = [
            { id: 'complaint', label: 'Complaint', icon: 'alert-triangle', color: 'text-red-500' },
            { id: 'praise', label: 'Praise/Compliment', icon: 'thumbs-up', color: 'text-green-500' },
            { id: 'suggestion', label: 'Suggestion', icon: 'lightbulb', color: 'text-blue-500' },
            { id: 'safety', label: 'Safety Concern', icon: 'shield', color: 'text-orange-500' },
            { id: 'staff', label: 'Staff Feedback', icon: 'users', color: 'text-purple-500' },
            { id: 'general', label: 'General Feedback', icon: 'message-square', color: 'text-gray-500' }
        ];

        this.parkAreas = [
            'Main Trampoline Area', 'Foam Pit', 'Dodgeball Courts', 'Basketball Hoops',
            'Kids Area', 'Party Rooms', 'Front Desk/Check-in', 'Restrooms',
            'Snack Bar', 'Arcade', 'Parking Lot', 'Other'
        ];

        this.currentLocation = '';
        this.feedback = {
            type: '',
            rating: 0,
            message: '',
            name: '',
            email: '',
            phone: '',
            visitDate: new Date().toISOString().split('T')[0],
            area: ''
        };

        this.init();
    }

    init() {
        const urlParams = new URLSearchParams(window.location.search);
        const loc = urlParams.get('location');
        
        if (loc && this.locations[loc]) {
            this.currentLocation = loc;
            this.renderFeedbackForm();
        } else {
            this.renderLocationSelect();
        }
    }

    renderLocationSelect() {
        document.getElementById('app').innerHTML = `
            <div class="container">
                <div class="card">
                    <div class="header">
                        <div class="icon-container">
                            <i data-lucide="message-square" class="icon"></i>
                        </div>
                        <h1>Altitude Feedback</h1>
                        <p class="subtitle">Select your location to get started</p>
                    </div>
                    <div class="location-grid">
                        ${Object.entries(this.locations).map(([key, name]) => `
                            <button class="location-option" onclick="app.selectLocation('${key}')">
                                ${name}
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        lucide.createIcons();
    }

    selectLocation(location) {
        this.currentLocation = location;
        this.renderFeedbackForm();
    }

    renderFeedbackForm() {
        document.getElementById('app').innerHTML = `
            <div class="container">
                <div class="card">
                    <div class="header">
                        <div class="icon-container">
                            <i data-lucide="message-square" class="icon"></i>
                        </div>
                        <h1>Share Your Experience</h1>
                        <p class="subtitle">${this.locations[this.currentLocation]}</p>
                    </div>

                    <div class="form-group">
                        <label class="form-label">What would you like to share? *</label>
                        <div class="feedback-grid">
                            ${this.feedbackTypes.map(type => `
                                <div class="feedback-option ${this.feedback.type === type.id ? 'selected' : ''}" 
                                     onclick="app.selectFeedbackType('${type.id}')">
                                    <i data-lucide="${type.icon}" class="icon ${type.color}"></i>
                                    <span class="label">${type.label}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Overall Rating</label>
                        <div class="star-rating">
                            ${[1,2,3,4,5].map(star => `
                                <i data-lucide="star" class="star ${star <= this.feedback.rating ? 'active' : ''}" 
                                   onclick="app.setRating(${star})"></i>
                            `).join('')}
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Which area of the park? *</label>
                        <select class="form-select" onchange="app.updateField('area', this.value)">
                            <option value="">Select an area...</option>
                            ${this.parkAreas.map(area => `
                                <option value="${area}" ${this.feedback.area === area ? 'selected' : ''}>${area}</option>
                            `).join('')}
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Your Message *</label>
                        <textarea class="form-textarea" 
                                  placeholder="Please share your experience, suggestion, or concern..." 
                                  onchange="app.updateField('message', this.value)"
                                  value="${this.feedback.message}"></textarea>
                    </div>

                    <div class="form-group">
                        <h3 style="font-size: 1.125rem; font-weight: 500; color: #374151; margin-bottom: 1rem;">Contact Information (Optional)</h3>
                        <div class="grid-2">
                            <input type="text" class="form-input" placeholder="Your Name" 
                                   onchange="app.updateField('name', this.value)" value="${this.feedback.name}">
                            <input type="email" class="form-input" placeholder="Your Email" 
                                   onchange="app.updateField('email', this.value)" value="${this.feedback.email}">
                        </div>
                        <input type="tel" class="form-input" placeholder="Your Phone Number" 
                               onchange="app.updateField('phone', this.value)" value="${this.feedback.phone}" 
                               style="margin-top: 1rem;">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Visit Date</label>
                        <input type="date" class="form-input" 
                               onchange="app.updateField('visitDate', this.value)" 
                               value="${this.feedback.visitDate}">
                    </div>

                    <button class="btn-primary" onclick="app.submitFeedback()" 
                            ${!this.feedback.type || !this.feedback.message || !this.feedback.area ? 'disabled' : ''}>
                        <i data-lucide="send" style="width: 1.25rem; height: 1.25rem;"></i>
                        Submit Feedback
                    </button>

                    <div class="footer-text">
                        <p>Your feedback helps us improve. Thank you for choosing Altitude!</p>
                    </div>
                </div>
            </div>
        `;
        lucide.createIcons();
    }

    selectFeedbackType(type) {
        this.feedback.type = type;
        this.renderFeedbackForm();
    }

    setRating(rating) {
        this.feedback.rating = rating;
        this.renderFeedbackForm();
    }

    updateField(field, value) {
        this.feedback[field] = value;
    }

    submitFeedback() {
        if (!this.feedback.type || !this.feedback.message || !this.feedback.area) {
            alert('Please fill in all required fields.');
            return;
        }

        // In production, this would send to your backend
        const submission = {
            ...this.feedback,
            location: this.currentLocation,
            timestamp: new Date().toISOString()
        };

        console.log('Feedback submitted:', submission);
        
        // For now, store in localStorage for demo purposes
        const submissions = JSON.parse(localStorage.getItem('altitudeFeedback') || '[]');
        submissions.push(submission);
        localStorage.setItem('altitudeFeedback', JSON.stringify(submissions));

        this.renderSuccessPage();
    }

    renderSuccessPage() {
        document.getElementById('app').innerHTML = `
            <div class="container" style="background: linear-gradient(135deg, #10b981, #3b82f6);">
                <div class="card">
                    <div class="success-container">
                        <div class="success-icon">
                            <i data-lucide="check-circle" class="icon"></i>
                        </div>
                        <h1 style="font-size: 1.5rem; margin-bottom: 1rem;">Thank You!</h1>
                        <p style="color: #6b7280; margin-bottom: 1.5rem;">
                            Your feedback has been received. We appreciate you taking the time to share your experience at ${this.locations[this.currentLocation]}.
                        </p>
                        <div style="font-size: 0.875rem; color: #6b7280;">
                            We'll respond to urgent matters within 2 hours.
                        </div>
                    </div>
                </div>
            </div>
        `;
        lucide.createIcons();

        // Reset form after 5 seconds
        setTimeout(() => {
            this.feedback = {
                type: '',
                rating: 0,
                message: '',
                name: '',
                email: '',
                phone: '',
                visitDate: new Date().toISOString().split('T')[0],
                area: ''
            };
            this.renderFeedbackForm();
        }, 5000);
    }
}

// Initialize app when page loads
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new AltitudeFeedbackApp();
});