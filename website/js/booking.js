/**
 * PIVOT AIDE TAX — BOOKING & CONSULTATION HANDLER
 * Provides interactive scheduling modal for consultations, scoping calls,
 * Second Look reviews, and urgent notice triage.
 */

window.openBookingModal = function(serviceType = 'general') {
  let modal = document.getElementById('booking-modal');
  if (!modal) {
    createBookingModalDOM();
    modal = document.getElementById('booking-modal');
  }

  // Pre-select service in dropdown
  const select = modal.querySelector('#booking-service');
  if (select && serviceType) {
    for (let opt of select.options) {
      if (opt.value === serviceType || opt.value.includes(serviceType)) {
        select.value = opt.value;
        break;
      }
    }
  }

  openModal('booking-modal');
};

function createBookingModalDOM() {
  const modalDiv = document.createElement('div');
  modalDiv.id = 'booking-modal';
  modalDiv.className = 'modal-backdrop';
  modalDiv.innerHTML = `
    <div class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal-header">
        <div>
          <span class="eyebrow">Pivot Aide Tax</span>
          <h3 id="modal-title" style="margin-top:2px">Schedule Your Strategy Session</h3>
        </div>
        <button type="button" class="modal-close" aria-label="Close modal">&times;</button>
      </div>
      <div class="modal-body">
        <form id="booking-form" onsubmit="handleBookingSubmit(event)">
          <div class="form-group">
            <label class="form-label" for="booking-service">Service / Consultation Type</label>
            <select id="booking-service" class="form-control" required>
              <option value="scoping">The Standing File — 45-Minute Scoping Call (Free)</option>
              <option value="second-look">Second Look — 3-Year Prior Return Review (Free)</option>
              <option value="triage">Notice Triage — IRS / State Letter Review ($0 Review)</option>
              <option value="consultation">General Tax Consultation (1 Hour, Free)</option>
              <option value="quickprepare">QuickPrepare Filing ($200 Deposit)</option>
              <option value="business">Business & Bookkeeping Onboarding</option>
            </select>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div class="form-group">
              <label class="form-label" for="booking-name">Full Name</label>
              <input type="text" id="booking-name" class="form-control" placeholder="Jane Doe" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="booking-phone">Phone Number</label>
              <input type="tel" id="booking-phone" class="form-control" placeholder="(571) 000-0000" required>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="booking-email">Email Address</label>
            <input type="email" id="booking-email" class="form-control" placeholder="jane@example.com" required>
          </div>

          <div class="form-group">
            <label class="form-label" for="booking-notes">Brief Overview of Your Situation</label>
            <textarea id="booking-notes" class="form-control" rows="3" placeholder="Tell us about your tax filing, business entity, or any letter received..."></textarea>
          </div>

          <div class="callout" style="margin-bottom:18px;font-size:.82rem">
            <span class="h">Our Commitment</span>
            <p>We do not sell client data, we do not employ aggressive sales reps, and we review submissions within two business days.</p>
          </div>

          <div style="display:flex;justify-content:flex-end;gap:10px">
            <button type="button" class="btn btn-o modal-close">Cancel</button>
            <button type="submit" class="btn btn-p">Confirm Consultation Request &rarr;</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(modalDiv);
}

window.handleBookingSubmit = function(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.querySelector('#booking-name').value;
  const email = form.querySelector('#booking-email').value;
  const service = form.querySelector('#booking-service').value;

  const modalBody = form.closest('.modal-body');
  modalBody.innerHTML = `
    <div style="text-align:center;padding:24px 12px">
      <div style="width:52px;height:52px;border-radius:50%;background:rgba(31,138,84,.15);color:var(--ok);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:1.8rem">
        &#10003;
      </div>
      <h3 style="font-size:1.35rem">Consultation Request Received</h3>
      <p class="small" style="margin-top:8px;max-width:44ch;margin-left:auto;margin-right:auto">
        Thank you, <strong>${name}</strong>. An advisor from Pivot Aide Tax will reach out to <strong>${email}</strong> within two business days to confirm your appointment time and prepare your intake.
      </p>
      <div style="margin-top:24px">
        <button type="button" class="btn btn-g" onclick="closeModal('booking-modal')">Close Window</button>
      </div>
    </div>
  `;
};
