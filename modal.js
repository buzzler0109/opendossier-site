// Custom Modal Component
class CustomModal {
    constructor() {
        this.createModalHTML();
        this.bindEvents();
    }

    createModalHTML() {
        const modalHTML = `
            <div id="customModal" class="custom-modal" style="display: none;">
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="modalTitle">Title</h3>
                        <button class="modal-close" id="modalClose">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p id="modalMessage">Message</p>
                    </div>
                    <div class="modal-footer">
                        <button class="modal-btn modal-btn-primary" id="modalConfirm">OK</button>
                        <button class="modal-btn modal-btn-secondary" id="modalCancel" style="display: none;">Cancel</button>
                    </div>
                </div>
            </div>
        `;

        // Add modal to body if it doesn't exist
        if (!document.getElementById('customModal')) {
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }

        // Add modal styles
        this.addModalStyles();
    }

    addModalStyles() {
        if (document.getElementById('modal-styles')) return;

        const styles = `
            <style id="modal-styles">
                .custom-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .modal-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(5px);
                }

                .modal-content {
                    position: relative;
                    background: linear-gradient(135deg, #1a1a3d, #2a2a5d);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                    padding: 0;
                    max-width: 500px;
                    width: 90%;
                    max-height: 80vh;
                    overflow: hidden;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
                    animation: modalSlideIn 0.3s ease-out;
                }

                @keyframes modalSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-50px) scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem 2rem 1rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .modal-header h3 {
                    color: #ffffff;
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin: 0;
                }

                .modal-close {
                    background: none;
                    border: none;
                    color: #cccccc;
                    font-size: 1.5rem;
                    cursor: pointer;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: all 0.3s ease;
                }

                .modal-close:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: #ffffff;
                }

                .modal-body {
                    padding: 1.5rem 2rem;
                }

                .modal-body p {
                    color: #cccccc;
                    font-size: 1rem;
                    line-height: 1.6;
                    margin: 0;
                }

                .modal-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    padding: 1rem 2rem 2rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }

                .modal-btn {
                    padding: 0.75rem 1.5rem;
                    border: none;
                    border-radius: 25px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 1rem;
                }

                .modal-btn-primary {
                    background: linear-gradient(135deg, #00ff88, #00d4ff);
                    color: #0a0a23;
                }

                .modal-btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 30px rgba(0, 255, 136, 0.3);
                }

                .modal-btn-secondary {
                    background: rgba(255, 255, 255, 0.1);
                    color: #ffffff;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .modal-btn-secondary:hover {
                    background: rgba(255, 255, 255, 0.2);
                }

                /* Success modal */
                .modal-success .modal-header h3 {
                    color: #00ff88;
                }

                /* Error modal */
                .modal-error .modal-header h3 {
                    color: #ff6b6b;
                }

                /* Warning modal */
                .modal-warning .modal-header h3 {
                    color: #ffa726;
                }

                /* Info modal */
                .modal-info .modal-header h3 {
                    color: #00d4ff;
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
    }

    bindEvents() {
        const modal = document.getElementById('customModal');
        const closeBtn = document.getElementById('modalClose');
        const confirmBtn = document.getElementById('modalConfirm');
        const cancelBtn = document.getElementById('modalCancel');
        const overlay = modal.querySelector('.modal-overlay');

        // Close modal events
        [closeBtn, overlay, confirmBtn].forEach(element => {
            element.addEventListener('click', () => this.hide());
        });

        // Cancel button
        cancelBtn.addEventListener('click', () => {
            this.hide();
            if (this.onCancel) this.onCancel();
        });

        // Confirm button
        confirmBtn.addEventListener('click', () => {
            this.hide();
            if (this.onConfirm) this.onConfirm();
        });

        // ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display !== 'none') {
                this.hide();
            }
        });
    }

    show(options = {}) {
        const modal = document.getElementById('customModal');
        const title = document.getElementById('modalTitle');
        const message = document.getElementById('modalMessage');
        const confirmBtn = document.getElementById('modalConfirm');
        const cancelBtn = document.getElementById('modalCancel');

        // Set content
        title.textContent = options.title || 'Information';
        message.textContent = options.message || '';

        // Set modal type
        modal.className = `custom-modal modal-${options.type || 'info'}`;

        // Show/hide buttons
        if (options.showCancel) {
            cancelBtn.style.display = 'block';
            confirmBtn.textContent = options.confirmText || 'OK';
        } else {
            cancelBtn.style.display = 'none';
            confirmBtn.textContent = options.confirmText || 'OK';
        }

        // Set callbacks
        this.onConfirm = options.onConfirm;
        this.onCancel = options.onCancel;

        // Show modal
        modal.style.display = 'flex';
    }

    hide() {
        const modal = document.getElementById('customModal');
        modal.style.display = 'none';
        this.onConfirm = null;
        this.onCancel = null;
    }

    // Convenience methods
    success(message, title = 'Success') {
        this.show({
            type: 'success',
            title,
            message
        });
    }

    error(message, title = 'Error') {
        this.show({
            type: 'error',
            title,
            message
        });
    }

    warning(message, title = 'Warning') {
        this.show({
            type: 'warning',
            title,
            message
        });
    }

    info(message, title = 'Information') {
        this.show({
            type: 'info',
            title,
            message
        });
    }

    confirm(message, title = 'Confirmation', onConfirm, onCancel) {
        this.show({
            type: 'warning',
            title,
            message,
            showCancel: true,
            confirmText: 'Yes',
            onConfirm,
            onCancel
        });
    }
}

// Create global modal instance
window.customModal = new CustomModal();

// Convenience functions
window.showSuccess = (message, title) => window.customModal.success(message, title);
window.showError = (message, title) => window.customModal.error(message, title);
window.showWarning = (message, title) => window.customModal.warning(message, title);
window.showInfo = (message, title) => window.customModal.info(message, title);
window.showConfirm = (message, title, onConfirm, onCancel) => window.customModal.confirm(message, title, onConfirm, onCancel);
