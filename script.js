const steps = Array.from(document.querySelectorAll('[data-step]'));
let currentStep = 0;
let chartInstance = null;

const state = {
  riskAnswers: {},
  riskProfile: null,
  goal: {
    goalName: '',
    targetAmount: null,
    tenor: null,
    initialInvestment: 0,
    recurringContribution: 0,
    frequency: ''
  },
  portfolio: null
};

const riskQuestions = [
  {
    id: 'horizon',
    question: 'What is your preferred investment horizon?',
    answers: [
      { value: 'short', label: 'Less than 2 years', score: 1 },
      { value: 'medium', label: '2 - 5 years', score: 2 },
      { value: 'long', label: 'More than 5 years', score: 3 }
    ]
  },
  {
    id: 'drawdown',
    question: 'How do you feel about temporary losses?',
    answers: [
      { value: 'low', label: 'Avoid losses at all cost', score: 1 },
      { value: 'moderate', label: 'Accept small fluctuations', score: 2 },
      { value: 'high', label: 'Comfortable with volatility', score: 3 }
    ]
  },
  {
    id: 'experience',
    question: 'How experienced are you with investments?',
    answers: [
      { value: 'beginner', label: 'New to investing', score: 1 },
      { value: 'intermediate', label: 'Some experience', score: 2 },
      { value: 'advanced', label: 'Seasoned investor', score: 3 }
    ]
  },
  {
    id: 'goal',
    question: 'What best describes your primary investment goal?',
    answers: [
      { value: 'preserve', label: 'Preserve capital', score: 1 },
      { value: 'balance', label: 'Blend of income and growth', score: 2 },
      { value: 'growth', label: 'Maximise long-term growth', score: 3 }
    ]
  },
  {
    id: 'reaction',
    question: 'If your portfolio dropped 15% in a month, you would…',
    answers: [
      { value: 'sell', label: 'Sell to avoid further losses', score: 1 },
      { value: 'hold', label: 'Stay invested', score: 2 },
      { value: 'buy', label: 'Invest more to buy at a discount', score: 3 }
    ]
  }
];

const portfolios = [
  {
    id: 'conservative',
    name: 'Conservative Income',
    risk: 'Very Low',
    expectedReturn: 0.03,
    description: 'Focused on capital preservation with steady income generation.',
    fee: 0.004,
    instruments: [
      {
        name: 'OCBC SGD Bond Fund',
        allocation: '40%',
        factSheet: 'https://www.ocbc.com/group/investments/bond-fund'
      },
      {
        name: 'OCBC Asia Short Duration Bond',
        allocation: '35%',
        factSheet: 'https://www.ocbc.com/group/investments/short-duration-bond'
      },
      {
        name: 'OCBC Money Market Fund',
        allocation: '25%',
        factSheet: 'https://www.ocbc.com/group/investments/money-market'
      }
    ]
  },
  {
    id: 'income',
    name: 'Stable Income',
    risk: 'Low to Moderate',
    expectedReturn: 0.045,
    description: 'Income-focused holdings with a touch of growth.',
    fee: 0.005,
    instruments: [
      {
        name: 'OCBC Dividend Equity Fund',
        allocation: '30%',
        factSheet: 'https://www.ocbc.com/group/investments/dividend-equity'
      },
      {
        name: 'OCBC Global Bond Fund',
        allocation: '40%',
        factSheet: 'https://www.ocbc.com/group/investments/global-bond'
      },
      {
        name: 'OCBC SGD Cash Fund',
        allocation: '30%',
        factSheet: 'https://www.ocbc.com/group/investments/cash-fund'
      }
    ]
  },
  {
    id: 'balanced',
    name: 'Balanced Growth',
    risk: 'Moderate',
    expectedReturn: 0.06,
    description: 'Evenly diversified mix for long-term wealth creation.',
    fee: 0.006,
    instruments: [
      {
        name: 'OCBC Global Equity Fund',
        allocation: '45%',
        factSheet: 'https://www.ocbc.com/group/investments/global-equity'
      },
      {
        name: 'OCBC Asia Bond Fund',
        allocation: '35%',
        factSheet: 'https://www.ocbc.com/group/investments/asia-bond'
      },
      {
        name: 'OCBC REIT Select',
        allocation: '20%',
        factSheet: 'https://www.ocbc.com/group/investments/reit-select'
      }
    ]
  },
  {
    id: 'growth',
    name: 'Dynamic Growth',
    risk: 'High',
    expectedReturn: 0.08,
    description: 'Aggressive allocation seeking higher long-term returns.',
    fee: 0.0075,
    instruments: [
      {
        name: 'OCBC Technology Leaders Fund',
        allocation: '50%',
        factSheet: 'https://www.ocbc.com/group/investments/technology-leaders'
      },
      {
        name: 'OCBC Emerging Markets Equity',
        allocation: '30%',
        factSheet: 'https://www.ocbc.com/group/investments/emerging-markets'
      },
      {
        name: 'OCBC Global Bond Hedged',
        allocation: '20%',
        factSheet: 'https://www.ocbc.com/group/investments/global-bond-hedged'
      }
    ]
  }
];

const layoutToggleButtons = document.querySelectorAll('.layout-toggle__btn');
layoutToggleButtons.forEach((btn) =>
  btn.addEventListener('click', () => {
    const targetLayout = btn.dataset.layoutTarget;
    document.body.dataset.layout = targetLayout;
    document.body.classList.toggle('app--mobile', targetLayout === 'mobile');
    layoutToggleButtons.forEach((button) =>
      button.classList.toggle('layout-toggle__btn--active', button === btn)
    );
  })
);

const questionList = document.getElementById('questionList');
const riskForm = document.getElementById('riskForm');
const goalForm = document.getElementById('goalForm');
const portfolioOptions = document.getElementById('portfolioOptions');
const goToConfirmationBtn = document.getElementById('goToConfirmation');
const projectionContainer = document.getElementById('projection');
const projectionSummary = document.getElementById('projectionSummary');
const instrumentList = document.getElementById('instrumentList');
const optimizationArea = document.getElementById('optimizationArea');
const suggestionBox = document.getElementById('suggestion');
const optimizeBtn = document.getElementById('optimizeBtn');
const confirmationSummary = document.getElementById('confirmationSummary');
const consentFees = document.getElementById('consentFees');
const consentAgreement = document.getElementById('consentAgreement');
const proceedPasswordBtn = document.getElementById('proceedPassword');
const passwordForm = document.getElementById('passwordForm');
const successSummary = document.getElementById('successSummary');
const finishFlowBtn = document.getElementById('finishFlow');

function showStep(index) {
  currentStep = index;
  steps.forEach((step) => {
    step.style.display = Number(step.dataset.step) === index ? 'block' : 'none';
  });
}

function buildRiskQuestions() {
  riskQuestions.forEach((question, idx) => {
    const listItem = document.createElement('li');
    listItem.className = 'question';

    const title = document.createElement('h3');
    title.className = 'question__title';
    title.textContent = `${idx + 1}. ${question.question}`;

    const optionContainer = document.createElement('div');
    optionContainer.className = 'question__options';

    question.answers.forEach((answer) => {
      const label = document.createElement('label');
      label.className = 'question__option';

      const input = document.createElement('input');
      input.type = 'radio';
      input.name = question.id;
      input.value = answer.value;
      input.dataset.score = answer.score;

      const span = document.createElement('span');
      span.textContent = answer.label;

      label.appendChild(input);
      label.appendChild(span);
      optionContainer.appendChild(label);
    });

    listItem.appendChild(title);
    listItem.appendChild(optionContainer);
    questionList.appendChild(listItem);
  });
}

function updateRiskContinueState() {
  const answered = riskQuestions.every((question) => {
    return riskForm.querySelector(`input[name="${question.id}"]:checked`);
  });
  riskForm.querySelector('button[type="submit"]').disabled = !answered;
}

function determineRiskProfile(score) {
  if (score <= 7) return 'Conservative';
  if (score <= 11) return 'Balanced';
  return 'Growth';
}

function formDataToNumber(value) {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function handleGoalInputChange() {
  const initialInvestment = goalForm.elements['initialInvestment'].value;
  const recurringContribution = goalForm.elements['recurringContribution'].value;
  const frequency = goalForm.elements['frequency'].value;
  const continueBtn = goalForm.querySelector('button[type="submit"]');
  continueBtn.disabled = !(
    initialInvestment && recurringContribution && frequency
  );
}

function showProjection(portfolio) {
  projectionContainer.hidden = false;
  const { goal } = state;
  const initial = goal.initialInvestment;
  const recurring = goal.recurringContribution;
  const freq = goal.frequency;
  const targetAmount = goal.targetAmount;
  const tenor = goal.tenor;

  const frequencyMap = {
    monthly: 12,
    quarterly: 4,
    semiannual: 2
  };

  const periodsPerYear = frequencyMap[freq] || 12;
  const years = tenor || 10;
  const totalPeriods = years * periodsPerYear;
  const annualRate = portfolio.expectedReturn;
  const periodRate = Math.pow(1 + annualRate, 1 / periodsPerYear) - 1;

  const projectedValues = [];
  let cumulative = initial;
  for (let year = 0; year <= years; year++) {
    if (year === 0) {
      projectedValues.push(cumulative);
      continue;
    }
    const periods = periodsPerYear;
    const growthFactor = Math.pow(1 + periodRate, periods);
    const contributionGrowth =
      periodRate === 0
        ? recurring * periods
        : recurring * ((growthFactor - 1) / periodRate);
    const yearEndValue = cumulative * growthFactor + contributionGrowth;
    cumulative = yearEndValue;
    projectedValues.push(yearEndValue);
  }

  const projectedTotal = projectedValues[projectedValues.length - 1];

  const labels = Array.from({ length: years + 1 }, (_, idx) => `Year ${idx}`);
  const summaryParts = [
    `Projected value after ${years} years: S$${projectedTotal.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`
  ];

  let targetAchievable = true;
  if (targetAmount) {
    summaryParts.push(`Target amount: S$${targetAmount.toLocaleString()}`);
    targetAchievable = projectedTotal >= targetAmount;
    summaryParts.push(
      targetAchievable
        ? 'Great news! You are on track to hit your target.'
        : 'You might need to adjust your plan to reach your target.'
    );
  } else {
    summaryParts.push(
      'Review the projected performance to understand expected returns.'
    );
  }

  projectionSummary.textContent = summaryParts.join(' • ');

  if (chartInstance) {
    chartInstance.destroy();
  }

  const ctx = document.getElementById('projectionChart');
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: portfolio.name,
          data: projectedValues,
          borderColor: 'rgba(196, 31, 62, 1)',
          backgroundColor: 'rgba(196, 31, 62, 0.15)',
          tension: 0.35,
          fill: true,
          pointRadius: 3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          ticks: {
            callback: (value) => `S$${Number(value).toLocaleString()}`
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context) =>
              `S$${Number(context.parsed.y).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}`
          }
        }
      }
    }
  });

  updateInstrumentList(portfolio);

  if (targetAmount && tenor) {
    optimizationArea.hidden = targetAchievable;
    suggestionBox.hidden = true;
  } else {
    optimizationArea.hidden = true;
    suggestionBox.hidden = true;
  }

  optimizeBtn.onclick = () => {
    const requiredContribution = calculateRequiredContribution(
      portfolio,
      targetAmount,
      tenor,
      initial
    );
    const tenorSuggestion = Math.ceil(
      calculateRequiredTenor(portfolio, targetAmount, initial, recurring, periodsPerYear)
    );
    suggestionBox.innerHTML = `
      <h4>Suggested Adjustment</h4>
      <p>
        Increase your recurring contribution to approximately
        <strong>S$${requiredContribution.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}</strong> per ${frequencyLabel(freq)}
        or extend your tenor to about <strong>${tenorSuggestion} years</strong> to hit your goal.
      </p>
    `;
    suggestionBox.hidden = false;
  };
}

function frequencyLabel(freq) {
  switch (freq) {
    case 'monthly':
      return 'month';
    case 'quarterly':
      return 'quarter';
    case 'semiannual':
      return 'half-year';
    default:
      return 'period';
  }
}

function calculateRequiredContribution(portfolio, targetAmount, tenor, initial) {
  const frequencyMap = {
    monthly: 12,
    quarterly: 4,
    semiannual: 2
  };
  const periodsPerYear = frequencyMap[state.goal.frequency] || 12;
  const years = tenor || 10;
  const totalPeriods = years * periodsPerYear;
  const annualRate = portfolio.expectedReturn;
  const periodRate = Math.pow(1 + annualRate, 1 / periodsPerYear) - 1;
  const futureValueInitial = initial * Math.pow(1 + periodRate, totalPeriods);
  const numerator = targetAmount - futureValueInitial;
  if (numerator <= 0) return state.goal.recurringContribution;
  if (periodRate === 0) {
    return numerator / totalPeriods;
  }
  const denominator = (Math.pow(1 + periodRate, totalPeriods) - 1) / periodRate;
  return numerator / denominator;
}

function calculateRequiredTenor(
  portfolio,
  targetAmount,
  initial,
  recurring,
  periodsPerYear
) {
  if (!targetAmount) return state.goal.tenor || 10;
  let years = state.goal.tenor || 10;
  const annualRate = portfolio.expectedReturn;
  const periodRate = Math.pow(1 + annualRate, 1 / periodsPerYear) - 1;
  let projected = 0;
  while (years < 50) {
    const totalPeriods = years * periodsPerYear;
    const futureValueInitial = initial * Math.pow(1 + periodRate, totalPeriods);
    const growthFactor = Math.pow(1 + periodRate, totalPeriods);
    const futureValueRecurring =
      periodRate === 0
        ? recurring * totalPeriods
        : recurring * ((growthFactor - 1) / periodRate);
    projected = futureValueInitial + futureValueRecurring;
    if (projected >= targetAmount) {
      return years;
    }
    years += 1;
  }
  return years;
}

function updateInstrumentList(portfolio) {
  const list = document.createElement('ul');
  list.className = 'instrument-list';
  portfolio.instruments.forEach((instrument) => {
    const item = document.createElement('li');
    item.className = 'instrument-item';
    const info = document.createElement('div');
    info.className = 'instrument-item__info';
    const name = document.createElement('strong');
    name.textContent = instrument.name;
    const allocation = document.createElement('span');
    allocation.className = 'instrument-item__allocation';
    allocation.textContent = instrument.allocation;
    info.appendChild(name);
    info.appendChild(allocation);

    const link = document.createElement('a');
    link.href = instrument.factSheet;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = 'instrument-item__link';
    link.textContent = 'Fund Factsheet';

    item.appendChild(info);
    item.appendChild(link);
    list.appendChild(item);
  });
  instrumentList.innerHTML = '';
  instrumentList.appendChild(list);
}

function populatePortfolioOptions() {
  portfolios.forEach((portfolio) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'portfolio-card';
    card.dataset.portfolioId = portfolio.id;

    const title = document.createElement('h3');
    title.className = 'portfolio-card__title';
    title.textContent = portfolio.name;

    const risk = document.createElement('span');
    risk.className = 'portfolio-card__risk';
    risk.textContent = `${portfolio.risk} Risk`;

    const expected = document.createElement('span');
    expected.className = 'portfolio-card__return';
    expected.textContent = `Projected annual return ~ ${(portfolio.expectedReturn * 100).toFixed(
      1
    )}%`;

    const description = document.createElement('p');
    description.textContent = portfolio.description;

    card.appendChild(title);
    card.appendChild(risk);
    card.appendChild(expected);
    card.appendChild(description);

    card.addEventListener('click', () => {
      document
        .querySelectorAll('.portfolio-card')
        .forEach((c) => c.classList.remove('portfolio-card--selected'));
      card.classList.add('portfolio-card--selected');
      state.portfolio = portfolio;
      goToConfirmationBtn.disabled = false;
      showProjection(portfolio);
    });

    portfolioOptions.appendChild(card);
  });
}

function updateConfirmationSummary() {
  if (!state.portfolio) return;
  const goal = state.goal;
  const summaryHTML = `
    <div class="summary__section">
      <h3>Risk Profile</h3>
      <div class="summary__row">
        <span>Profile</span>
        <strong>${state.riskProfile}</strong>
      </div>
    </div>
    <div class="summary__section">
      <h3>Investment Goal</h3>
      <div class="summary__row">
        <span>Goal</span>
        <strong>${goal.goalName || 'Not specified'}</strong>
      </div>
      <div class="summary__row">
        <span>Target Amount</span>
        <strong>${goal.targetAmount ? `S$${Number(goal.targetAmount).toLocaleString()}` : 'Not specified'}</strong>
      </div>
      <div class="summary__row">
        <span>Tenor</span>
        <strong>${goal.tenor ? `${goal.tenor} years` : 'Not specified'}</strong>
      </div>
      <div class="summary__row">
        <span>Initial Investment</span>
        <strong>S$${goal.initialInvestment.toLocaleString()}</strong>
      </div>
      <div class="summary__row">
        <span>Recurring Contribution</span>
        <strong>S$${goal.recurringContribution.toLocaleString()} (${frequencyLabel(
    goal.frequency
  )})</strong>
      </div>
    </div>
    <div class="summary__section">
      <h3>Selected Portfolio</h3>
      <div class="summary__row">
        <span>Model</span>
        <strong>${state.portfolio.name}</strong>
      </div>
      <div class="summary__row">
        <span>Risk Level</span>
        <strong>${state.portfolio.risk}</strong>
      </div>
      <div class="summary__row">
        <span>Advisory Fee</span>
        <strong>${(state.portfolio.fee * 100).toFixed(2)}% p.a.</strong>
      </div>
    </div>
  `;
  confirmationSummary.innerHTML = summaryHTML;
}

function updateSuccessSummary() {
  if (!state.portfolio) return;
  const goal = state.goal;
  const summaryHTML = `
    <div class="summary__section">
      <h3>Subscription Summary</h3>
      <div class="summary__row"><span>Model</span><strong>${state.portfolio.name}</strong></div>
      <div class="summary__row"><span>Initial Investment</span><strong>S$${goal.initialInvestment.toLocaleString()}</strong></div>
      <div class="summary__row"><span>Recurring Contribution</span><strong>S$${goal.recurringContribution.toLocaleString()} (${frequencyLabel(
    goal.frequency
  )})</strong></div>
      <div class="summary__row"><span>Goal</span><strong>${goal.goalName || 'Not specified'}</strong></div>
      <div class="summary__row"><span>Target</span><strong>${
        goal.targetAmount ? `S$${Number(goal.targetAmount).toLocaleString()}` : 'Not specified'
      }</strong></div>
      <div class="summary__row"><span>Tenor</span><strong>${
        goal.tenor ? `${goal.tenor} years` : 'Not specified'
      }</strong></div>
      <div class="summary__row"><span>Portfolio Fee</span><strong>${
        (state.portfolio.fee * 100).toFixed(2)
      }% p.a.</strong></div>
    </div>
  `;
  successSummary.innerHTML = summaryHTML;
}

function resetFlow() {
  state.riskAnswers = {};
  state.riskProfile = null;
  state.goal = {
    goalName: '',
    targetAmount: null,
    tenor: null,
    initialInvestment: 0,
    recurringContribution: 0,
    frequency: ''
  };
  state.portfolio = null;
  riskForm.reset();
  goalForm.reset();
  document.querySelectorAll('.portfolio-card').forEach((card) => {
    card.classList.remove('portfolio-card--selected');
  });
  goToConfirmationBtn.disabled = true;
  projectionContainer.hidden = true;
  optimizationArea.hidden = true;
  suggestionBox.hidden = true;
  consentFees.checked = false;
  consentAgreement.checked = false;
  proceedPasswordBtn.disabled = true;
}

function handleBack() {
  if (currentStep > 0) {
    showStep(currentStep - 1);
  }
}

document.querySelectorAll('[data-action="back"]').forEach((btn) =>
  btn.addEventListener('click', handleBack)
);

document.getElementById('startOnboarding').addEventListener('click', () => {
  showStep(1);
});

riskForm.addEventListener('change', updateRiskContinueState);
riskForm.addEventListener('submit', (event) => {
  event.preventDefault();
  let totalScore = 0;
  riskQuestions.forEach((question) => {
    const selected = riskForm.querySelector(`input[name="${question.id}"]:checked`);
    const score = Number(selected.dataset.score || 0);
    state.riskAnswers[question.id] = selected.value;
    totalScore += score;
  });
  state.riskProfile = determineRiskProfile(totalScore);
  showStep(2);
});

goalForm.addEventListener('input', handleGoalInputChange);
goalForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(goalForm);
  state.goal = {
    goalName: formData.get('goalName')?.trim() || '',
    targetAmount: formDataToNumber(formData.get('targetAmount')),
    tenor: formDataToNumber(formData.get('tenor')),
    initialInvestment: Number(formData.get('initialInvestment')),
    recurringContribution: Number(formData.get('recurringContribution')),
    frequency: formData.get('frequency')
  };
  showStep(3);
  if (state.portfolio) {
    showProjection(state.portfolio);
  }
});

consentFees.addEventListener('change', updateConsentState);
consentAgreement.addEventListener('change', updateConsentState);

function updateConsentState() {
  proceedPasswordBtn.disabled = !(consentFees.checked && consentAgreement.checked);
}

goToConfirmationBtn.addEventListener('click', () => {
  updateConfirmationSummary();
  showStep(4);
});

proceedPasswordBtn.addEventListener('click', () => {
  showStep(5);
});

passwordForm.addEventListener('submit', (event) => {
  event.preventDefault();
  updateSuccessSummary();
  showStep(6);
});

finishFlowBtn.addEventListener('click', () => {
  resetFlow();
  showStep(0);
});

buildRiskQuestions();
populatePortfolioOptions();
showStep(0);
