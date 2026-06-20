const authShell = document.querySelector('[data-auth-shell]');
const authCard = document.querySelector('[data-auth-card]');
const dashboard = document.querySelector('[data-dashboard]');
const barChart = document.querySelector('[data-bar-chart]');
const activityFeed = document.querySelector('[data-activity-feed]');
const modeButtons = document.querySelectorAll('[data-mode-button]');
const authForms = document.querySelectorAll('[data-form]');
const welcomeName = document.querySelector('[data-welcome-name]');
const profileInitials = document.querySelector('[data-profile-initials]');

const earningsData = [
	{ month: 'Jan', value: 36000 },
	{ month: 'Feb', value: 52000 },
	{ month: 'Mar', value: 44000 },
	{ month: 'Apr', value: 68000 },
	{ month: 'May', value: 58000 },
	{ month: 'Jun', value: 76000 }
];

const activityItems = [
	{ badge: 'Payment', time: '2h ago', title: 'Brand collab payout received', text: 'You earned ₹680 from the latest sponsored Reel campaign.' },
	{ badge: 'Growth', time: 'Yesterday', title: 'Audience milestone reached', text: 'Your creator community passed 24K followers across platforms.' },
	{ badge: 'Savings', time: '2d ago', title: 'Savings goal updated', text: 'You moved 5% closer to the monthly reserve target.' },
	{ badge: 'Impact', time: '3d ago', title: 'Donation allocated', text: 'A portion of this week\'s revenue was set aside for impact work.' }
];

const rupeeFormatter = new Intl.NumberFormat('en-IN', {
	style: 'currency',
	currency: 'INR',
	maximumFractionDigits: 0
});

function setMode(mode) {
	if (!authShell || !authCard) {
		return;
	}

	const normalizedMode = mode === 'signup' ? 'signup' : 'login';
	const isSignup = normalizedMode === 'signup';

	authShell.classList.toggle('is-signup', isSignup);
	authCard.dataset.mode = normalizedMode;

	authForms.forEach((form) => {
		const active = form.dataset.form === normalizedMode;
		form.classList.toggle('is-active', active);
		form.setAttribute('aria-hidden', String(!active));
	});

	modeButtons.forEach((button) => {
		const active = button.dataset.modeButton === normalizedMode;
		button.classList.toggle('is-active', active);
		button.setAttribute('aria-pressed', String(active));
	});

	document.title = `CreatorSetu | ${isSignup ? 'Sign Up' : 'Login'}`;
}

function renderDashboard() {
	if (!barChart || !activityFeed) {
		return;
	}

	barChart.innerHTML = earningsData
		.map(
			(item) => `
				<div class="bar-chart__item">
					<div class="bar-chart__bar" style="height: ${Math.max(40, (item.value / 76000) * 100)}%" aria-hidden="true"></div>
					<div class="bar-chart__value">${rupeeFormatter.format(item.value)}</div>
					<div class="bar-chart__label">${item.month}</div>
				</div>
			`
		)
		.join('');

	activityFeed.innerHTML = activityItems
		.map(
			(item) => `
				<article class="activity-item">
					<div class="activity-item__top">
						<span>${item.title}</span>
						<span class="activity-item__badge">${item.badge}</span>
					</div>
					<p>${item.text}</p>
					<p>${item.time}</p>
				</article>
			`
		)
		.join('');
}

modeButtons.forEach((button) => {
	button.addEventListener('click', () => {
		setMode(button.dataset.modeButton);
	});
});

function toTitleCase(value) {
	return value
		.split(/\s+/)
		.filter(Boolean)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(' ');
}

function getInitials(name) {
	const parts = name.split(/\s+/).filter(Boolean);
	if (parts.length === 0) {
		return '';
	}
	const initials = parts.length === 1
		? parts[0].slice(0, 2)
		: parts[0].charAt(0) + parts[parts.length - 1].charAt(0);
	return initials.toUpperCase();
}

function resolveName(form) {
	if (!form) {
		return '';
	}

	const nameInput = form.querySelector('input[name="signupName"]');
	if (nameInput && nameInput.value.trim()) {
		return toTitleCase(nameInput.value.trim());
	}

	const emailInput = form.querySelector('input[type="email"]');
	if (emailInput && emailInput.value.trim()) {
		const localPart = emailInput.value.trim().split('@')[0].replace(/[._-]+/g, ' ');
		return toTitleCase(localPart);
	}

	return '';
}

function applyUserName(name) {
	if (!name) {
		return;
	}

	if (welcomeName) {
		welcomeName.textContent = name;
	}

	if (profileInitials) {
		const initials = getInitials(name);
		if (initials) {
			profileInitials.textContent = initials;
		}
	}
}

function showPostLogin(form) {
	if (!authShell || !dashboard) {
		return;
	}

	applyUserName(resolveName(form));

	authShell.hidden = false;
	authShell.classList.add('is-post-login');
	dashboard.hidden = false;
	dashboard.classList.add('is-visible');
	document.title = 'CreatorSetu | Dashboard';
	renderDashboard();
}

authForms.forEach((form) => {
	form.addEventListener('submit', (event) => {
		event.preventDefault();
		showPostLogin(form);
	});
});

setMode('login');
