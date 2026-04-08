const API_BASE_URL = 'http://localhost:3000/api/attendance';

const defaultStudents = [
    "Rahul",
    "Amit",
    "Priya",
    "Neha",
    "Suresh"
];

const saveBtn = document.getElementById('saveBtn');

async function fetchAttendance() {
    const date = document.getElementById('attendanceDate').value;

    if (!date) {
        alert("Please select a date");
        return;
    }

    try {
        console.log(`Fetching attendance records for date: ${date}`);

        // Loading state
        saveBtn.style.display = 'none';
        document.getElementById('studentList').innerHTML =
            '<tr><td colspan="2">Loading...</td></tr>';

        const response = await fetch(`${API_BASE_URL}/fetch?date=${date}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received data:', data);

        const tbody = document.getElementById('studentList');
        tbody.innerHTML = '';

        //  Safe fallback if no data
        const listToRender =
            data.length > 0
                ? data
                : defaultStudents.map(name => ({
                    studentName: name,
                    status: 'Present'
                }));

        //  Use index-based unique keys
        const rows = listToRender
            .map((record, index) => `
            <tr data-name="${record.studentName}">
                <td>${record.studentName}</td>
                <td>
                    <input type="radio" name="student-${index}" value="Present"
                        ${record.status === 'Present' ? 'checked' : ''}> Present
                    <input type="radio" name="student-${index}" value="Absent"
                        ${record.status === 'Absent' ? 'checked' : ''}> Absent
                </td>
            </tr>
        `)
            .join('');

        tbody.innerHTML = rows;

        saveBtn.style.display = 'block';
        saveBtn.disabled = false;

        console.log('Attendance records loaded successfully');
    } catch (error) {
        console.error('Error fetching attendance:', error);
        alert(`Error loading records: ${error.message}`);

        document.getElementById('studentList').innerHTML = '';
        saveBtn.style.display = 'none';
    }
}

async function saveAttendance() {
    const date = document.getElementById('attendanceDate').value;

    if (!date) {
        alert("Please select a date");
        return;
    }

    try {
        const rows = document.querySelectorAll('#studentList tr');
        const records = [];

        // ✅ Prevent spam clicks
        saveBtn.disabled = true;
        saveBtn.innerText = "Saving...";

        rows.forEach((row, index) => {
            const studentName = row.dataset.name;

            const selectedRadio = row.querySelector(
                `input[name="student-${index}"]:checked`
            );

            if (!selectedRadio) {
                throw new Error(`Status not selected for ${studentName}`);
            }

            records.push({
                studentName,
                status: selectedRadio.value
            });
        });

        console.log('Saving attendance records:', { date, records });

        const response = await fetch(`${API_BASE_URL}/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date, records })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Attendance saved successfully:', result);

        alert("Attendance saved successfully!");
    } catch (error) {
        console.error('Error saving attendance:', error);
        alert(`Error saving attendance: ${error.message}`);
    } finally {
        // ✅ Restore button state
        saveBtn.disabled = false;
        saveBtn.innerText = "Mark Attendance";
    }
}

// ✅ Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('Attendance System initialized');

    const dateInput = document.getElementById('attendanceDate');
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
});