(function () {
	'use strict';

	/* ===== Sample loan requests data ===== */
	const loanRequests = [
		{
			id: 1,
			name: 'Riya Sharma',
			amount: 3000,
			purpose: 'Software subscription',
			description: 'Need Adobe Creative Suite for freelance design work',
			timeline: '1 month',
			riskScore: 'low',
			riskLabel: 'Low Risk'
		},
		{
			id: 2,
			name: 'Karan Patel',
			amount: 5000,
			purpose: 'Equipment upgrade',
			description: 'Camera lens for YouTube vlogs',
			timeline: '2 months',
			riskScore: 'low',
			riskLabel: 'Low Risk'
		},
		{
			id: 3,
			name: 'Ananya Reddy',
			amount: 1500,
			purpose: 'Course / Workshop',
			description: 'Online photography masterclass enrollment',
			timeline: '2 weeks',
			riskScore: 'medium',
			riskLabel: 'Medium Risk'
		},
		{
			id: 4,
			name: 'Dev Malhotra',
			amount: 8000,
			purpose: 'Marketing / Ads',
			description: 'Instagram and YouTube ad campaign for new launch',
			timeline: '3 months',
			riskScore: 'medium',
			riskLabel: 'Medium Risk'
		},
		{
			id: 5,
			name: 'Sneha Iyer',
			amount: 2000,
			purpose: 'Content production',
			description: 'Props and backdrop for product photography',
			timeline: '1 month',
			riskScore: 'low',
			riskLabel: 'Low Risk'
		},
		{
			id: 6,
			name: 'Rahul Verma',
			amount: 10000,
			purpose: 'Emergency fund',
			description: 'Laptop repair — main editing machine broke down',
			timeline: '3 months',
			riskScore: 'high',
			riskLabel: 'High Risk'
		}
	];

	/* ===== DOM references ===== */
	const toggleButtons = document.querySelectorAll('[data-kredit-mode]');
	const panels = document.querySelectorAll('[data-kredit-panel]');
	const loanGrid = document.querySelector('[data-loan-grid]');
	const borrowForm = document.querySelector('[data-borrow-form]');

	/* ===== Toggle between Lend / Borrow ===== */
	toggleButtons.forEach(btn => {
		btn.addEventListener('click', () => {
			const mode = btn.dataset.kreditMode;

			toggleButtons.forEach(b => {
				b.classList.remove('is-active');
				b.setAttribute('aria-pressed', 'false');
			});
			btn.classList.add('is-active');
			btn.setAttribute('aria-pressed', 'true');

			panels.forEach(p => {
				p.classList.toggle('is-active', p.dataset.kreditPanel === mode);
			});
		});
	});

	/* ===== Render loan request cards ===== */
	function getRiskClass(score) {
		if (score === 'low') return 'kredit-risk--low';
		if (score === 'medium') return 'kredit-risk--medium';
		return 'kredit-risk--high';
	}

	function renderLoanCards() {
		if (!loanGrid) return;
		loanGrid.innerHTML = loanRequests.map(loan => `
			<article class="kredit-card">
				<div class="kredit-card__top">
					<div class="kredit-card__avatar">${loan.name.split(' ').map(n => n[0]).join('')}</div>
					<div class="kredit-card__info">
						<h3 class="kredit-card__name">${loan.name}</h3>
						<span class="kredit-card__purpose">${loan.purpose}</span>
					</div>
				</div>
				<p class="kredit-card__desc">${loan.description}</p>
				<div class="kredit-card__meta">
					<div class="kredit-card__amount-wrap">
						<span class="kredit-card__amount">₹${loan.amount.toLocaleString('en-IN')}</span>
						<span class="kredit-card__timeline">${loan.timeline}</span>
					</div>
					<span class="kredit-risk-badge ${getRiskClass(loan.riskScore)}">${loan.riskLabel}</span>
				</div>
				<button class="primary-button kredit-lend-button" type="button" data-lend-id="${loan.id}">Lend ₹${loan.amount.toLocaleString('en-IN')}</button>
			</article>
		`).join('');

		/* Lend button interaction */
		loanGrid.querySelectorAll('[data-lend-id]').forEach(btn => {
			btn.addEventListener('click', () => {
				btn.textContent = 'Lent ✓';
				btn.disabled = true;
				btn.classList.add('kredit-lend-button--done');
			});
		});
	}

	/* ===== Borrow form submission ===== */
	if (borrowForm) {
		borrowForm.addEventListener('submit', e => {
			e.preventDefault();
			const data = new FormData(borrowForm);
			const amount = data.get('amount');
			const purpose = data.get('purpose');
			const description = data.get('description');
			const timeline = data.get('timeline');

			if (!amount || !purpose || !description || !timeline) return;

			const confirmCard = document.createElement('div');
			confirmCard.className = 'kredit-confirm';
			confirmCard.innerHTML = `
				<div class="kredit-confirm__icon">✓</div>
				<h3>Request Submitted!</h3>
				<p>Your loan request for <strong>₹${Number(amount).toLocaleString('en-IN')}</strong> has been posted to the community. You'll be notified when a lender matches.</p>
			`;

			borrowForm.parentElement.appendChild(confirmCard);
			borrowForm.reset();
			borrowForm.style.display = 'none';
		});
	}

	/* ===== Init ===== */
	renderLoanCards();
})();
