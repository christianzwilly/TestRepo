function createEmptyGoal() {
  return {
    goal: "",
    target: "",
    tenor: "",
    initial: "",
    recurring: "",
    frequency: ""
  };
}

const state = {
  platform: "mobile",
  currentStep: 0,
  riskAnswers: [],
  goal: createEmptyGoal(),
  selectedPortfolio: null,
  autosave: false,
  resumeStep: null,
  chart: null,
  optimized: false,
  password: ""
};

const questions = [
  {
    text: "What is your investment horizon?",
    options: [
      { label: "Less than 2 years", value: "<2" },
      { label: "2 – 5 years", value: "2-5" },
      { label: "5 – 10 years", value: "5-10" },
      { label: "More than 10 years", value: ">10" }
    ]
  },
  {
    text: "How would you describe your investment experience?",
    options: [
      { label: "None", value: "none" },
      { label: "Limited (savings products)", value: "limited" },
      { label: "Moderate (unit trusts / ETFs)", value: "moderate" },
      { label: "Extensive (derivatives, equities)", value: "extensive" }
    ]
  },
  {
    text: "How do you typically react to a market downturn?",
    options: [
      { label: "Sell to avoid losses", value: "sell" },
      { label: "Wait and observe", value: "wait" },
      { label: "Invest more to capitalise", value: "invest" },
      { label: "Rebalance gradually", value: "rebalance" }
    ]
  },
  {
    text: "What is your primary investment goal?",
    options: [
      { label: "Capital preservation", value: "preservation" },
      { label: "Income generation", value: "income" },
      { label: "Balanced growth", value: "balanced" },
      { label: "Aggressive growth", value: "aggressive" }
    ]
  },
  {
    text: "What level of short-term loss are you comfortable with?",
    options: [
      { label: "0%", value: "0" },
      { label: "Up to 5%", value: "5" },
      { label: "Up to 15%", value: "15" },
      { label: "More than 15%", value: "15+" }
    ]
  }
];

const portfolios = [
  {
    id: "conservative",
    name: "Conservative",
    risk: "Low",
    expectedReturn: [3, 4],
    color: "#d6001c",
    volatility: "Low",
    allocations: [
      {
        instrument: "OCBC Global Bond Fund",
        allocation: "50%",
        risk: "Low",
        factsheet:
          "A diversified basket of global government and investment grade bonds to provide steady income."
      },
      {
        instrument: "OCBC SGD Money Market Fund",
        allocation: "30%",
        risk: "Very Low",
        factsheet:
          "Liquidity-focused fund investing in short-term SGD instruments to preserve capital."
      },
      {
        instrument: "OCBC Asia Income Fund",
        allocation: "20%",
        risk: "Low-Medium",
        factsheet:
          "Income-oriented Asian corporate bonds offering moderate yield with low volatility."
      }
    ]
  },
  {
    id: "moderate",
    name: "Moderately Conservative",
    risk: "Low-Medium",
    expectedReturn: [4, 6],
    color: "#b00018",
    volatility: "Low-Medium",
    allocations: [
      {
        instrument: "OCBC Global Bond Fund",
        allocation: "35%",
        risk: "Low",
        factsheet: "Diversified bonds with emphasis on capital preservation and yield."
      },
      {
        instrument: "OCBC Balanced Fund",
        allocation: "35%",
        risk: "Medium",
        factsheet:
          "Balanced allocation between equities and bonds targeting steady appreciation."
      },
      {
        instrument: "OCBC Asia Opportunity Fund",
        allocation: "30%",
        risk: "Medium",
        factsheet: "Growth-oriented Asian equities with tactical tilts."
      }
    ]
  },
  {
    id: "balanced",
    name: "Balanced Growth",
    risk: "Medium",
    expectedReturn: [6, 8],
    color: "#960013",
    volatility: "Medium",
    allocations: [
      {
        instrument: "OCBC Balanced Fund",
        allocation: "40%",
        risk: "Medium",
        factsheet: "Strategic blend of global equities and fixed income."
      },
      {
        instrument: "OCBC Global Equity Fund",
        allocation: "40%",
        risk: "Medium-High",
        factsheet: "Global developed market equities with disciplined factor tilts."
      },
      {
        instrument: "OCBC Asia Opportunity Fund",
        allocation: "20%",
        risk: "Medium",
        factsheet: "Asian equity exposure with growth bias."
      }
    ]
  },
  {
    id: "aggressive",
    name: "Aggressive Growth",
    risk: "High",
    expectedReturn: [8, 10],
    color: "#7c0010",
    volatility: "High",
    allocations: [
      {
        instrument: "OCBC Global Equity Fund",
        allocation: "50%",
        risk: "High",
        factsheet: "High conviction global equities seeking long-term capital gains."
      },
      {
        instrument: "OCBC Disruptive Innovation Fund",
        allocation: "30%",
        risk: "High",
        factsheet: "Exposure to innovative sectors with higher volatility potential."
      },
      {
        instrument: "OCBC Emerging Markets Fund",
        allocation: "20%",
        risk: "High",
        factsheet: "Emerging market equities capturing growth and diversification."
      }
    ]
  }
];

const wizardEl = document.querySelector(".wizard");
const progressRail = document.querySelectorAll(".progress-rail li");
const platformButtons = document.querySelectorAll(".toggle-option");
const modalBackdrop = document.querySelector(".modal-backdrop");
const modalContainer = document.querySelector(".modal");

platformButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.platform = button.dataset.platform;
    platformButtons.forEach((b) => b.classList.remove("active"));
    button.classList.add("active");
    document.body.dataset.platform = state.platform;
  });
});

function updateProgress() {
  progressRail.forEach((item, index) => {
    item.classList.toggle("active", index === state.currentStep);
  });
}

function renderStep() {
  updateProgress();
  wizardEl.innerHTML = "";
  const stepRenderers = [
    renderDashboardStep,
    renderRiskStep,
    renderGoalStep,
    renderPortfolioStep,
    renderConfirmationStep,
    renderPasswordStep,
    renderSuccessStep
  ];
  const renderer = stepRenderers[state.currentStep];
  if (renderer) {
    renderer();
  }
}

function renderDashboardStep() {
  const template = document.getElementById("portfolio-dashboard-template");
  const view = template.content.cloneNode(true);
  const card = view.querySelector(".dashboard-card");
  if (state.autosave) {
    const banner = document.createElement("div");
    banner.className = "resume-banner";
    banner.innerHTML = `
      <div>
        <strong>You've saved progress</strong>
        <p>Resume your investment onboarding from where you left off.</p>
      </div>
      <button type="button" class="primary" data-resume>Resume onboarding</button>
    `;
    banner.querySelector("[data-resume]").addEventListener("click", () => {
      state.autosave = false;
      state.currentStep = state.resumeStep ?? 1;
      state.resumeStep = null;
      renderStep();
    });
    card.prepend(banner);
  }
  view.querySelector("[data-add-portfolio]").addEventListener("click", () => {
    state.currentStep = 1;
    renderStep();
  });
  wizardEl.appendChild(view);
}

function renderRiskStep() {
  const index = state.riskAnswers.length;
  const question = questions[index];
  if (!question) {
    state.currentStep = 2;
    renderStep();
    return;
  }
  const template = document.getElementById("risk-question-template");
  const view = template.content.cloneNode(true);
  view.querySelector("[data-current-step]").textContent = index + 1;
  view.querySelector("[data-question-text]").textContent = question.text;
  const form = view.querySelector("[data-options]");
  question.options.forEach((option) => {
    const label = document.createElement("label");
    label.innerHTML = `<span>${option.label}</span>`;
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "option";
    input.value = option.value;
    label.prepend(input);
    form.appendChild(label);
  });
  const continueBtn = view.querySelector("[data-continue]");
  form.addEventListener("change", (event) => {
    if (event.target.matches("input[type='radio']")) {
      continueBtn.disabled = false;
    }
  });
  view.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    const selected = form.querySelector("input:checked");
    if (!selected) return;
    state.riskAnswers.push(selected.value);
    if (state.riskAnswers.length === questions.length) {
      state.currentStep = 2;
    }
    renderStep();
  });
  view.querySelector("[data-back]").addEventListener("click", () => {
    if (state.riskAnswers.length > 0) {
      state.riskAnswers.pop();
      renderStep();
    } else {
      state.currentStep = 0;
      renderStep();
    }
  });
  view.querySelector("[data-save-exit]").addEventListener("click", () => {
    state.autosave = true;
    state.resumeStep = 1;
    alert("Progress saved. You can resume anytime.");
    state.currentStep = 0;
    renderStep();
  });
  wizardEl.appendChild(view);
}

function renderGoalStep() {
  const template = document.getElementById("goal-setup-template");
  const view = template.content.cloneNode(true);
  const form = view.querySelector(".goal-form");
  form.goal.value = state.goal.goal;
  form.target.value = state.goal.target;
  form.tenor.value = state.goal.tenor;
  form.initial.value = state.goal.initial;
  form.recurring.value = state.goal.recurring;
  const frequencyButtons = view.querySelectorAll("[data-frequency]");
  frequencyButtons.forEach((button) => {
    if (button.dataset.frequency === state.goal.frequency) {
      button.classList.add("active");
    }
    button.addEventListener("click", () => {
      state.goal.frequency = button.dataset.frequency;
      frequencyButtons.forEach((b) => b.classList.toggle("active", b === button));
      validateGoal(view);
    });
  });
  const continueBtn = view.querySelector("[data-continue]");
  form.addEventListener("input", () => {
    updateGoalFromForm(form);
    validateGoal(view);
  });
  view.querySelector("[data-back]").addEventListener("click", () => {
    state.currentStep = 1;
    renderStep();
  });
  view.querySelector("[data-save-draft]").addEventListener("click", () => {
    state.autosave = true;
    state.resumeStep = 2;
    alert("Draft saved with your goal inputs.");
    state.currentStep = 0;
    renderStep();
  });
  continueBtn.addEventListener("click", () => {
    if (!continueBtn.disabled) {
      state.currentStep = 3;
      renderStep();
    }
  });
  validateGoal(view);
  wizardEl.appendChild(view);
}

function updateGoalFromForm(form) {
  state.goal.goal = form.goal.value;
  state.goal.target = form.target.value;
  state.goal.tenor = form.tenor.value;
  state.goal.initial = form.initial.value;
  state.goal.recurring = form.recurring.value;
}

function validateGoal(view) {
  const continueBtn = view.querySelector("[data-continue]");
  const errors = view.querySelectorAll("[data-error]");
  errors.forEach((field) => {
    const input = field.querySelector("input");
    const errorText = field.querySelector(".error-text");
    if (!input) return;
    const value = input.value.trim();
    const required = input.hasAttribute("required");
    const hasError = required && !value;
    if (errorText) {
      errorText.hidden = !hasError;
    }
    field.classList.toggle("has-error", hasError);
  });
  const frequencyError = view.querySelector(".frequency-field");
  const freqErrorText = frequencyError.querySelector(".error-text");
  const hasFrequency = Boolean(state.goal.frequency);
  freqErrorText.hidden = hasFrequency;
  frequencyError.classList.toggle("has-error", !hasFrequency);
  continueBtn.disabled = !(
    state.goal.initial &&
    state.goal.recurring &&
    state.goal.frequency
  );
}

function renderPortfolioStep() {
  const template = document.getElementById("portfolio-selection-template");
  const view = template.content.cloneNode(true);
  const grid = view.querySelector("[data-portfolio-grid]");
  portfolios.forEach((portfolio) => {
    const card = document.createElement("button");
    card.className = "portfolio-card-option";
    card.innerHTML = `
      <div class="portfolio-title">
        <h3>${portfolio.name}</h3>
        <span class="risk-badge">${portfolio.risk}</span>
      </div>
      <p class="expected">Expected annual return ${portfolio.expectedReturn[0]}–${portfolio.expectedReturn[1]}%</p>
      <p class="volatility">Historical volatility: ${portfolio.volatility}</p>
    `;
    card.addEventListener("click", () => {
      state.selectedPortfolio = portfolio;
      state.optimized = false;
      Array.from(grid.children).forEach((child) => child.classList.remove("active"));
      card.classList.add("active");
      view.querySelector("[data-continue]").disabled = false;
      drawProjection();
      renderAllocation(view);
    });
    if (state.selectedPortfolio && state.selectedPortfolio.id === portfolio.id) {
      card.classList.add("active");
    }
    grid.appendChild(card);
  });
  const continueBtn = view.querySelector("[data-continue]");
  continueBtn.disabled = !state.selectedPortfolio;
  continueBtn.addEventListener("click", () => {
    state.currentStep = 4;
    renderStep();
  });
  view.querySelector("[data-back]").addEventListener("click", () => {
    state.currentStep = 2;
    renderStep();
  });
  view.querySelector("[data-change-inputs]").addEventListener("click", () => {
    state.currentStep = 2;
    renderStep();
  });
  view.querySelector("[data-historical]").addEventListener("click", (event) => {
    event.preventDefault();
    openModal(renderHistoricalModal());
  });
  wizardEl.appendChild(view);
  if (state.selectedPortfolio) {
    drawProjection();
    renderAllocation(view);
  }
}

function renderAllocation(view) {
  const allocationContainer = view.querySelector("[data-allocation]");
  const projectionInsight = view.querySelector("[data-projection-insight]");
  const portfolio = state.selectedPortfolio;
  if (!portfolio) return;
  allocationContainer.innerHTML = `
    <h3>Instrument allocation</h3>
    <table>
      <thead>
        <tr><th>Instrument</th><th>Allocation</th><th>Risk</th><th></th></tr>
      </thead>
      <tbody>
        ${portfolio.allocations
          .map(
            (item) => `
              <tr>
                <td>${item.instrument}</td>
                <td>${item.allocation}</td>
                <td>${item.risk}</td>
                <td><button type="button" data-factsheet="${item.instrument}">Fund factsheet</button></td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;
  allocationContainer.querySelectorAll("[data-factsheet]").forEach((button) => {
    const instrument = button.dataset.factsheet;
    button.addEventListener("click", () => {
      const data = portfolio.allocations.find((item) => item.instrument === instrument);
      openModal(renderFactsheetModal(portfolio, data));
    });
  });
  const projectionResult = calculateProjection();
  const goalProvided = state.goal.goal || state.goal.target || state.goal.tenor;
  const targetValue = Number(state.goal.target || 0);
  projectionInsight.innerHTML = "";
  projectionInsight.classList.remove("under-target");
  const insightLines = [];
  insightLines.push(`Projected value after ${projectionResult.duration} years: <strong>SGD ${projectionResult.projectedValue.toLocaleString()}</strong>`);
  if (goalProvided && targetValue) {
    if (projectionResult.projectedValue >= targetValue) {
      insightLines.push("Great news! You're on track to hit your target.");
    } else {
      projectionInsight.classList.add("under-target");
      insightLines.push(
        `Your target is SGD ${(targetValue - projectionResult.projectedValue).toLocaleString()} away. Consider optimising your inputs.`
      );
      const optimizeBtn = document.createElement("button");
      optimizeBtn.className = "primary";
      optimizeBtn.textContent = "Optimize Target";
      optimizeBtn.addEventListener("click", () => {
        openModal(renderOptimizationModal(projectionResult));
      });
      projectionInsight.appendChild(optimizeBtn);
    }
    insightLines.push(`Target amount: <strong>SGD ${targetValue.toLocaleString()}</strong>`);
  } else {
    insightLines.push("View projected performance based on your contributions and selected model.");
  }
  projectionInsight.insertAdjacentHTML(
    "afterbegin",
    `<p>${insightLines.join("<br>")}</p>`
  );
}

function calculateProjection() {
  const initial = Number(state.goal.initial || 0);
  const recurring = Number(state.goal.recurring || 0);
  const frequency = state.goal.frequency || "monthly";
  const years = Number(state.goal.tenor || 5) || 5;
  const periodsPerYear = frequency === "monthly" ? 12 : frequency === "quarterly" ? 4 : 2;
  const portfolio = state.selectedPortfolio || portfolios[0];
  const expectedRate = ((portfolio.expectedReturn[0] + portfolio.expectedReturn[1]) / 2) / 100;
  const totalPeriods = years * periodsPerYear;
  const periodRate = expectedRate / periodsPerYear;
  const futureValueRecurring = recurring * ((Math.pow(1 + periodRate, totalPeriods) - 1) / periodRate);
  const futureValueInitial = initial * Math.pow(1 + periodRate, totalPeriods);
  const projectedValue = Math.round(futureValueInitial + futureValueRecurring);
  return {
    projectedValue,
    duration: years,
    expectedRate: expectedRate * 100
  };
}

function drawProjection() {
  const ctx = document.getElementById("projectionChart");
  if (!ctx) return;
  const portfolio = state.selectedPortfolio || portfolios[0];
  const goalProvided = state.goal.goal || state.goal.target || state.goal.tenor;
  const targetValue = Number(state.goal.target || 0);
  const years = Number(state.goal.tenor || 5) || 5;
  const points = [];
  const periods = years;
  for (let year = 1; year <= periods; year += 1) {
    const interimState = { ...state, goal: { ...state.goal, tenor: year } };
    const projected = calculateProjectionForState(interimState);
    points.push(projected.projectedValue);
  }
  const datasets = [
    {
      label: `${portfolio.name} projection`,
      data: points,
      borderColor: portfolio.color,
      backgroundColor: "rgba(214, 0, 28, 0.08)",
      tension: 0.3,
      fill: true
    }
  ];
  if (goalProvided && targetValue) {
    const targetLine = Array.from({ length: periods }, () => targetValue);
    datasets.push({
      label: "Target",
      data: targetLine,
      borderColor: "#0f9d58",
      borderDash: [8, 6],
      pointRadius: 0,
      fill: false
    });
  }
  if (state.chart) {
    state.chart.destroy();
  }
  state.chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: Array.from({ length: periods }, (_, i) => `Year ${i + 1}`),
      datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          ticks: {
            callback: (value) => `SGD ${Number(value).toLocaleString()}`
          }
        }
      }
    }
  });
}

function calculateProjectionForState(customState) {
  const initial = Number(customState.goal.initial || 0);
  const recurring = Number(customState.goal.recurring || 0);
  const frequency = customState.goal.frequency || "monthly";
  const years = Number(customState.goal.tenor || 5) || 5;
  const periodsPerYear = frequency === "monthly" ? 12 : frequency === "quarterly" ? 4 : 2;
  const portfolio = customState.selectedPortfolio || portfolios[0];
  const expectedRate = ((portfolio.expectedReturn[0] + portfolio.expectedReturn[1]) / 2) / 100;
  const totalPeriods = years * periodsPerYear;
  const periodRate = expectedRate / periodsPerYear;
  const futureValueRecurring = recurring * ((Math.pow(1 + periodRate, totalPeriods) - 1) / periodRate);
  const futureValueInitial = initial * Math.pow(1 + periodRate, totalPeriods);
  const projectedValue = Math.round(futureValueInitial + futureValueRecurring);
  return {
    projectedValue,
    duration: years,
    expectedRate: expectedRate * 100
  };
}

function renderConfirmationStep() {
  const template = document.getElementById("confirmation-template");
  const view = template.content.cloneNode(true);
  const summary = view.querySelector("[data-summary]");
  const portfolio = state.selectedPortfolio;
  const projection = calculateProjection();
  const frequencyLabel = state.goal.frequency ? state.goal.frequency.replace("-", " ") : "";
  summary.innerHTML = `
    ${summaryItem("Model portfolio", portfolio.name)}
    ${summaryItem("Risk category", portfolio.risk)}
    ${summaryItem("Initial investment", `SGD ${Number(state.goal.initial).toLocaleString()}`)}
    ${summaryItem(
      "Recurring contribution",
      `SGD ${Number(state.goal.recurring).toLocaleString()}${
        frequencyLabel ? ` (${frequencyLabel})` : ""
      }`
    )}
    ${state.goal.goal ? summaryItem("Goal", state.goal.goal) : ""}
    ${state.goal.target ? summaryItem("Target", `SGD ${Number(state.goal.target).toLocaleString()}`) : ""}
    ${state.goal.tenor ? summaryItem("Tenor", `${state.goal.tenor} years`) : ""}
    ${summaryItem("Projected value", `SGD ${projection.projectedValue.toLocaleString()}`)}
  `;
  const consentForm = view.querySelector(".consents");
  const continueBtn = view.querySelector("[data-continue]");
  consentForm.addEventListener("change", () => {
    const allChecked = Array.from(consentForm.querySelectorAll("input")).every((input) => input.checked);
    continueBtn.disabled = !allChecked;
  });
  view.querySelector("[data-back]").addEventListener("click", () => {
    state.currentStep = 3;
    renderStep();
  });
  continueBtn.addEventListener("click", () => {
    if (!continueBtn.disabled) {
      state.currentStep = 5;
      renderStep();
    }
  });
  wizardEl.appendChild(view);
}

function summaryItem(label, value) {
  return `
    <div class="summary-item">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `;
}

function renderPasswordStep() {
  const template = document.getElementById("password-template");
  const view = template.content.cloneNode(true);
  const passwordInput = view.querySelector("#auth-password");
  const toggle = view.querySelector("[data-toggle-password]");
  const continueBtn = view.querySelector("[data-continue]");
  passwordInput.value = state.password;
  continueBtn.disabled = passwordInput.value.trim().length === 0;
  passwordInput.addEventListener("input", () => {
    state.password = passwordInput.value;
    continueBtn.disabled = passwordInput.value.trim().length === 0;
  });
  toggle.addEventListener("click", () => {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    toggle.textContent = type === "password" ? "Show" : "Hide";
  });
  view.querySelector("[data-back]").addEventListener("click", () => {
    state.currentStep = 4;
    renderStep();
  });
  continueBtn.addEventListener("click", () => {
    if (!continueBtn.disabled) {
      state.currentStep = 6;
      renderStep();
    }
  });
  wizardEl.appendChild(view);
}

function renderSuccessStep() {
  const template = document.getElementById("success-template");
  const view = template.content.cloneNode(true);
  const summary = view.querySelector("[data-summary]");
  const projection = calculateProjection();
  const frequencyLabel = state.goal.frequency ? state.goal.frequency.replace("-", " ") : "";
  summary.innerHTML = `
    ${summaryItem("Model portfolio", state.selectedPortfolio.name)}
    ${summaryItem("Risk category", state.selectedPortfolio.risk)}
    ${summaryItem("Initial investment", `SGD ${Number(state.goal.initial).toLocaleString()}`)}
    ${summaryItem(
      "Recurring contribution",
      `SGD ${Number(state.goal.recurring).toLocaleString()}${
        frequencyLabel ? ` (${frequencyLabel})` : ""
      }`
    )}
    ${state.goal.goal ? summaryItem("Goal", state.goal.goal) : ""}
    ${state.goal.target ? summaryItem("Target", `SGD ${Number(state.goal.target).toLocaleString()}`) : ""}
    ${state.goal.tenor ? summaryItem("Tenor", `${state.goal.tenor} years`) : ""}
    ${summaryItem("Projected value", `SGD ${projection.projectedValue.toLocaleString()}`)}
  `;
  view.querySelector("[data-finish]").addEventListener("click", () => {
    resetFlow();
    renderStep();
  });
  view.querySelector("[data-download]").addEventListener("click", () => {
    alert("Receipt downloaded.");
  });
  view.querySelector("[data-share]").addEventListener("click", () => {
    alert("Share link copied.");
  });
  wizardEl.appendChild(view);
}

function renderFactsheetModal(portfolio, allocation) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <header>
      <h2>${allocation.instrument}</h2>
      <p>${portfolio.name} • ${allocation.allocation} allocation • Risk ${allocation.risk}</p>
    </header>
    <p>${allocation.factsheet}</p>
    <footer><button class="primary" data-close>Close</button></footer>
  `;
  wrapper.querySelector("[data-close]").addEventListener("click", closeModal);
  return wrapper;
}

function renderHistoricalModal() {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <header>
      <h2>Historical performance</h2>
      <p>Rolling 5-year performance showing defensive behaviour during volatility.</p>
    </header>
    <p>The model portfolios are back-tested against market benchmarks with annual rebalancing. Past performance is not indicative of future results.</p>
    <footer><button class="primary" data-close>Close</button></footer>
  `;
  wrapper.querySelector("[data-close]").addEventListener("click", closeModal);
  return wrapper;
}

function renderOptimizationModal(projectionResult) {
  const wrapper = document.createElement("div");
  const suggestions = suggestOptimizations(projectionResult);
  wrapper.innerHTML = `
    <header>
      <h2>Optimise your plan</h2>
      <p>We recommend these adjustments to help you reach your target.</p>
    </header>
    <ul class="suggestions">
      ${suggestions
        .map((item) => `<li>${item}</li>`)
        .join("")}
    </ul>
    <footer>
      <button class="secondary" data-close>Cancel</button>
      <button class="primary" data-apply>Apply suggestion</button>
    </footer>
  `;
  wrapper.querySelector("[data-close]").addEventListener("click", closeModal);
  wrapper.querySelector("[data-apply]").addEventListener("click", () => {
    applyOptimizations();
    closeModal();
    drawProjection();
    renderStep();
  });
  return wrapper;
}

function suggestOptimizations(projectionResult) {
  const suggestions = [];
  const targetValue = Number(state.goal.target || 0);
  const gap = targetValue - projectionResult.projectedValue;
  if (gap <= 0) {
    return ["You're already on track—no changes required."];
  }
  const newRecurring = Math.ceil((Number(state.goal.recurring || 0) * 1.2) / 10) * 10;
  const newTenor = Number(state.goal.tenor || 5) + 1;
  suggestions.push(`Increase recurring contribution to SGD ${newRecurring.toLocaleString()} per ${state.goal.frequency.replace("-", " ")}.`);
  suggestions.push(`Extend tenor to ${newTenor} years to give your investment more time to grow.`);
  return suggestions;
}

function applyOptimizations() {
  state.goal.recurring = Math.ceil((Number(state.goal.recurring || 0) * 1.2) / 10) * 10;
  state.goal.tenor = (Number(state.goal.tenor || 5) + 1).toString();
  state.optimized = true;
}

function resetFlow() {
  state.currentStep = 0;
  state.riskAnswers = [];
  state.goal = createEmptyGoal();
  state.selectedPortfolio = null;
  state.optimized = false;
  state.autosave = false;
  state.resumeStep = null;
  state.password = "";
  if (state.chart) {
    state.chart.destroy();
    state.chart = null;
  }
}

function openModal(content) {
  modalContainer.innerHTML = "";
  modalContainer.appendChild(content);
  modalBackdrop.classList.remove("hidden");
}

function closeModal() {
  modalBackdrop.classList.add("hidden");
}

modalBackdrop.addEventListener("click", (event) => {
  if (event.target === modalBackdrop) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

renderStep();
