let currentStage = 1;
const totalStages = 4;
const userData = {}; // Temporary storage for input data

const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const submitBtn = document.getElementById('submitBtn');
const progressBar = document.getElementById('progressBar');
function isStageValid() {
    if (currentStage === 1) {
        const email = document.getElementById('email').value;
        const pass = document.getElementById('pass').value;
        return email.includes('@') && pass.length >= 6;}
    if (currentStage === 2) {
        return document.getElementById('fname').value !== "" && 
               document.getElementById('lname').value !== "";}
    if (currentStage === 3) {
        return document.getElementById('bio').value.length > 10;}
    if (currentStage === 4) {
        return document.getElementById('terms').checked;}
    return false;}
function updateUI() {
    document.querySelectorAll('.form-stage').forEach((s, idx) => {
        s.classList.toggle('active', idx + 1 === currentStage);});
    progressBar.style.width = (currentStage / totalStages) * 100 + "%";
    prevBtn.classList.toggle('hidden', currentStage === 1);
    if (currentStage === totalStages) {
        nextBtn.classList.add('hidden');
        submitBtn.classList.remove('hidden');
        renderReview();
    } else {
        nextBtn.classList.remove('hidden');
        submitBtn.classList.add('hidden');}}
function saveData() {
    if (currentStage === 1) {
        userData.email = document.getElementById('email').value;
    } else if (currentStage === 2) {
        userData.name = `${document.getElementById('fname').value} ${document.getElementById('lname').value}`;
    } else if (currentStage === 3) {
        userData.bio = document.getElementById('bio').value;}}
function renderReview() {
    const reviewBox = document.getElementById('reviewData');
    reviewBox.innerHTML = `
        <p><strong>Email:</strong> ${userData.email}</p>
        <p><strong>Name:</strong> ${userData.name}</p>
        <p><strong>Bio:</strong> ${userData.bio.substring(0, 50)}...</p>
    `;}
nextBtn.addEventListener('click', () => {
    if (isStageValid()) {
        saveData();
        currentStage++;
        updateUI();
    } else {
        alert("Please complete all fields correctly before proceeding.");}});
prevBtn.addEventListener('click', () => {
    currentStage--;
    updateUI();});
document.getElementById('workflowForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (isStageValid()) {
        alert("Success! Final Data: " + JSON.stringify(userData));
    } else {
        alert("Please accept the terms.");}});