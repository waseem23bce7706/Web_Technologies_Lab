let activities = [];
let clickCount = 0;
const CLICK_THRESHOLD = 10;
function logActivity(type, target, detail = "") {
    const activity = {
        timestamp: new Date().toLocaleTimeString(),
        type: type,
        target: target,
        detail: detail};
    activities.push(activity);
    updateDisplay();
    checkSuspiciousActivity(type);}
document.addEventListener('click', (e) => {
    logActivity('CLICK', e.target.tagName, `ID: ${e.target.id || 'N/A'}`);
}, false);
document.addEventListener('keydown', (e) => {
    logActivity('KEYPRESS', 'Window', `Key: ${e.key}`);});
document.addEventListener('focus', (e) => {
    logActivity('FOCUS', e.target.tagName, `Focused on: ${e.target.id}`);
}, true);
function checkSuspiciousActivity(type) {
    if (type === 'CLICK') clickCount++;
    if (clickCount > CLICK_THRESHOLD) {
        document.getElementById('warningBox').classList.remove('hidden');}}
function updateDisplay() {
    const display = document.getElementById('activityDisplay');
    const latest = activities[activities.length - 1];
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `[${latest.timestamp}] <strong>${latest.type}</strong> on ${latest.target} - ${latest.detail}`;
    display.prepend(entry);}
function resetLog() {
    activities = [];
    clickCount = 0;
    document.getElementById('activityDisplay').innerHTML = "";
    document.getElementById('warningBox').classList.add('hidden');
    alert("Log Cleared");}
function exportLog() {
    if (activities.length === 0) return alert("Nothing to export!");
    const formattedText = activities.map(a => 
        `[${a.timestamp}] TYPE: ${a.type} | TARGET: ${a.target} | DETAIL: ${a.detail}`
    ).join('\n');
    const blob = new Blob([formattedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'activity_log.txt';
    a.click();}