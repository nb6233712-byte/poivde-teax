/**
 * PIVOT AIDE TAX — INTERACTIVE NOTICE TRIAGE
 * Evaluates common IRS and State letters, providing instant plain-English explanations,
 * urgency ratings, and direct routing to Resolution Tiers.
 */

const NOTICE_DATABASE = {
  'cp2000': {
    title: 'IRS Notice CP2000 — Underreporter Inquiry',
    urgency: 'Medium (30-day response window)',
    urgencyClass: 'warn',
    summary: 'The IRS computer matched third-party information (such as 1099s, W-2s, or brokerage statements) against your return and found a discrepancy. It proposes additional tax, interest, and penalties.',
    unclePatSays: 'This is not an audit, and the IRS calculation is very frequently mistaken. They assume gross revenue is 100% net profit without accounting for basis or deductible expenses. Do not pay it blindly.',
    tier: 'Tier 1: Notice Response ($450)',
    action: 'Send us the notice and the related documents. We recalculate the real discrepancy and file the formal rebuttal.'
  },
  'cp14': {
    title: 'IRS Notice CP14 — Balance Due',
    urgency: 'High (Immediate interest & penalty accrual)',
    urgencyClass: 'danger',
    summary: 'The initial notice stating you owe unpaid federal taxes. If ignored, it leads to escalating notices (CP501, CP503, CP504) and eventual levy action.',
    unclePatSays: 'The IRS wants payment. If the balance is correct, we arrange an affordable installment agreement or CNC status. If it is incorrect, we freeze collections while resolving the underlying error.',
    tier: 'Tier 1 or Tier 3: Collections & Resolution',
    action: 'We pull your account transcripts to verify the statutory assessment date and assess penalty abatement eligibility.'
  },
  'cp504': {
    title: 'IRS Notice CP504 — Notice of Intent to Levy',
    urgency: 'Critical (30 days before state tax refund or assets seized)',
    urgencyClass: 'danger',
    summary: 'This is an urgent collections letter warning that the IRS intends to levy state tax refunds and may seize assets or issue wage garnishments if unresolved.',
    unclePatSays: 'Do not wait. A CP504 requires fast intervention to secure a collection hold while an installment plan or settlement is submitted.',
    tier: 'Tier 3: Collections & Resolution (from $1,500)',
    action: 'We establish immediate representation, contact IRS collections, halt enforcement, and negotiate resolution terms.'
  },
  'lt11': {
    title: 'Letter 11 / Letter 1058 — Final Notice of Intent to Levy & Hearing Rights',
    urgency: 'Emergency (Strict 30-day statutory Collection Due Process deadline)',
    urgencyClass: 'danger',
    summary: 'The final statutory warning before bank levies and wage garnishments begin. Triggers your right to request a Collection Due Process (CDP) hearing on Form 12153.',
    unclePatSays: 'The 30-day deadline on this letter cannot be extended by any IRS employee. Missing it loses your statutory judicial appeal rights.',
    tier: 'Tier 3: Collections & Appeals',
    action: 'File Form 12153 immediately to protect judicial rights and move your file to IRS Independent Office of Appeals.'
  },
  'state': {
    title: 'State Department of Revenue Assessment (MD, VA, DC, etc.)',
    urgency: 'High (State collection agencies move faster than federal)',
    urgencyClass: 'danger',
    summary: 'State tax departments (Maryland Comptroller, Virginia Dept of Taxation, DC OTR, etc.) issue notices for missing state returns, nexus adjustments, or withholding discrepancies.',
    unclePatSays: 'National tax-relief mills ignore state agencies. Pivot Aide works directly with all 50 state tax authorities. We know their administrative appeals process inside out.',
    tier: 'State Desk & Resolution ($450 or quoted)',
    action: 'We handle state apportionment disputes, sales tax audits, and state payment agreements.'
  },
  'unfiled': {
    title: 'Multiple Unfiled Tax Years / Non-Filer',
    urgency: 'Urgent (Risk of Substitute for Return - SFR)',
    urgencyClass: 'warn',
    summary: 'Missing tax filings for one or more past years. When unfiled, the IRS files an SFR with zero deductions, creating an artificially high tax assessment.',
    unclePatSays: 'Unfiled returns create sleepless nights. The IRS only requires the last six years for compliance restoration. We pull wage & income transcripts and reconstruct the real returns.',
    tier: 'Tier 4: Back Years & Non-Filers ($350/yr + $500 reconstruction)',
    action: 'Transcript analysis, SFR replacement, and return to good standing.'
  }
};

window.renderNoticeTriage = function(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="triage-step">
      <label class="form-label" style="color:var(--gold)">Step 1: Select the letter or notice you received</label>
      <div class="triage-options">
        <button class="triage-opt selected" data-notice-key="cp2000">
          <h4>IRS CP2000</h4>
          <p>Underreporter / mismatch inquiry with proposed tax change.</p>
        </button>
        <button class="triage-opt" data-notice-key="cp14">
          <h4>IRS CP14 / Balance</h4>
          <p>Initial unpaid tax bill with interest and penalties.</p>
        </button>
        <button class="triage-opt" data-notice-key="cp504">
          <h4>IRS CP504 / Notice of Intent</h4>
          <p>Threat of levy or state refund garnishment.</p>
        </button>
        <button class="triage-opt" data-notice-key="lt11">
          <h4>Letter 11 / Final Notice</h4>
          <p>30-day strict CDP hearing deadline before bank levy.</p>
        </button>
        <button class="triage-opt" data-notice-key="state">
          <h4>State DOR Assessment</h4>
          <p>MD Comptroller, VA Tax, DC OTR, or any of 50 states.</p>
        </button>
        <button class="triage-opt" data-notice-key="unfiled">
          <h4>Multiple Unfiled Years</h4>
          <p>Back returns, non-filing, or IRS SFR assessments.</p>
        </button>
      </div>
      <div id="triage-result-area" class="triage-result"></div>
    </div>
  `;

  const resultArea = container.querySelector('#triage-result-area');
  const buttons = container.querySelectorAll('.triage-opt');

  function updateResult(key) {
    const data = NOTICE_DATABASE[key] || NOTICE_DATABASE['cp2000'];
    resultArea.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;margin-bottom:12px">
        <h3 style="color:#fff;font-size:1.2rem">${data.title}</h3>
        <span class="eyebrow night" style="background:rgba(234,228,47,.15);padding:4px 8px;border-radius:2px">
          ${data.urgency}
        </span>
      </div>
      <p style="color:var(--night-ink);margin-bottom:14px;font-size:.92rem;line-height:1.6">${data.summary}</p>
      <div class="callout" style="background:rgba(0,0,0,.25);border-left-color:var(--gold);margin-bottom:18px">
        <span class="h" style="color:var(--gold)">Uncle Pat's Read</span>
        <p style="color:#fff;font-style:italic">"${data.unclePatSays}"</p>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;border-top:1px solid var(--night-line);padding-top:16px">
        <div>
          <span style="font-family:var(--f-mono);font-size:.7rem;color:var(--gold);text-transform:uppercase;display:block">Recommended Path</span>
          <strong style="color:#fff;font-size:1.02rem">${data.tier}</strong>
        </div>
        <button class="btn btn-g" onclick="openBookingModal('${key}')">
          Request Notice Triage (2-Day Review)
        </button>
      </div>
    `;
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      buttons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      updateResult(btn.getAttribute('data-notice-key'));
    });
  });

  // Initial render
  updateResult('cp2000');
};
