/**
 * PIVOT AIDE TAX — S-CORP SAVINGS & BREAKEVEN CALCULATOR
 * Demonstrates the self-employment tax differential between a Schedule C Sole Prop / LLC
 * and an S-Corporation election with reasonable owner compensation benchmarking.
 */

window.initSCorpCalculator = function(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="calc-card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px">
        <div>
          <span class="eyebrow">Interactive Entity Fit Check</span>
          <h3 style="margin-top:4px">S-Corp Tax Savings Estimator</h3>
          <p class="small" style="color:var(--ink-2);margin-top:4px">
            See if your business profit has crossed the threshold where an S-Corp election saves real money.
          </p>
        </div>
        <div style="text-align:right">
          <span style="font-family:var(--f-mono);font-size:.7rem;color:var(--ink-3);display:block">Net Annual Profit</span>
          <span id="calc-profit-display" style="font-family:var(--f-mono);font-size:1.6rem;font-weight:600;color:var(--blue-dk)">$120,000</span>
        </div>
      </div>

      <div class="calc-slider-wrap">
        <input type="range" id="profit-slider" class="calc-slider" min="40000" max="350000" step="5000" value="120000">
        <div style="display:flex;justify-content:space-between;font-family:var(--f-mono);font-size:.7rem;color:var(--ink-3);margin-top:6px">
          <span>$40,000 (Breakeven Zone)</span>
          <span>$150,000</span>
          <span>$350,000+</span>
        </div>
      </div>

      <div class="calc-metrics">
        <div class="calc-metric">
          <span class="lbl">Schedule C SE Tax (15.3%)</span>
          <span id="metric-se-tax" class="val" style="color:var(--danger)">$16,955</span>
          <span class="small" style="font-size:.72rem">100% of profit subject to self-employment tax</span>
        </div>
        <div class="calc-metric">
          <span class="lbl">S-Corp Payroll Tax (FICA)</span>
          <span id="metric-scorp-tax" class="val" style="color:var(--ink-2)">$9,180</span>
          <span class="small" style="font-size:.72rem">Based on 50% reasonable W-2 salary split</span>
        </div>
        <div class="calc-metric">
          <span class="lbl">Net Annual Tax Savings</span>
          <span id="metric-savings" class="val savings">$5,775 / yr</span>
          <span class="small" style="font-size:.72rem">After accounting for payroll and filing overhead</span>
        </div>
      </div>

      <div id="scorp-verdict" style="margin-top:22px;padding:16px;background:var(--surface-2);border-radius:var(--r);font-size:.88rem;color:var(--ink-2)">
        Loading analysis...
      </div>

      <div style="margin-top:20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px">
        <span class="small">Our $1,500 S-Corp package includes Form 2553, reasonable comp memo, and accountable plan.</span>
        <a href="tax-strategy.html" class="btn btn-p">Explore S-Corp Strategy &rarr;</a>
      </div>
    </div>
  `;

  const slider = container.querySelector('#profit-slider');
  const profitDisplay = container.querySelector('#calc-profit-display');
  const seTaxEl = container.querySelector('#metric-se-tax');
  const scorpTaxEl = container.querySelector('#metric-scorp-tax');
  const savingsEl = container.querySelector('#metric-savings');
  const verdictEl = container.querySelector('#scorp-verdict');

  function calculate(profit) {
    profitDisplay.textContent = '$' + profit.toLocaleString();

    // Sole Prop SE tax: 92.35% of profit subject to 15.3% (up to Social Security wage cap ~$176,100, then 2.9% Medicare)
    const ssCap = 176100;
    const netSubject = profit * 0.9235;
    let solePropSETax = 0;
    if (netSubject <= ssCap) {
      solePropSETax = netSubject * 0.153;
    } else {
      solePropSETax = (ssCap * 0.153) + ((netSubject - ssCap) * 0.029);
    }

    // S-Corp Reasonable Salary benchmark (typically ~45-55% depending on profit, benchmark at 50% clamped)
    const salary = Math.min(profit * 0.5, ssCap);
    const sCorpFica = salary * 0.153;

    // Overhead for S-Corp: Payroll service ($125/mo = $1,500) + 1120-S corporate return difference (~$500)
    const overhead = 2000;

    const rawSavings = solePropSETax - sCorpFica;
    const netSavings = Math.round(rawSavings - overhead);

    seTaxEl.textContent = '$' + Math.round(solePropSETax).toLocaleString();
    scorpTaxEl.textContent = '$' + Math.round(sCorpFica).toLocaleString();

    if (netSavings > 0) {
      savingsEl.textContent = '+$' + netSavings.toLocaleString() + ' / yr';
      savingsEl.style.color = 'var(--ok)';
      verdictEl.innerHTML = `<strong>Uncle Pat's Recommendation:</strong> At $${profit.toLocaleString()} net profit, an S-Corp election is clearly profitable. You save an estimated <strong>$${netSavings.toLocaleString()} every single year</strong> in self-employment tax even after bookkeeping and payroll software costs.`;
    } else {
      savingsEl.textContent = '$0 (Under Breakeven)';
      savingsEl.style.color = 'var(--ink-3)';
      verdictEl.innerHTML = `<strong>Uncle Pat's Recommendation:</strong> At $${profit.toLocaleString()}, the administrative overhead of payroll and a corporate tax return (~$2,000/yr) outweighs the FICA savings. You are better off remaining a Sole Proprietor / Single-Member LLC until net profits reach roughly $65,000-$75,000.`;
    }
  }

  slider.addEventListener('input', (e) => {
    calculate(parseInt(e.target.value, 10));
  });

  // Initial calculation
  calculate(120000);
};
