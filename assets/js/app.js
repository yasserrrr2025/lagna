let students = [];

// جلب البيانات
fetch('data/students.json')
  .then(r => r.json())
  .then(d => {
    students = d;
    initGrades();
  });

// التبديل بين طرق البحث
function switchMode(m) {
  document.getElementById('mode-id').style.display = m === 'id' ? 'block' : 'none';
  document.getElementById('mode-list').style.display = m === 'list' ? 'block' : 'none';
  document.getElementById('btn-id').classList.toggle('active', m === 'id');
  document.getElementById('btn-list').classList.toggle('active', m === 'list');
}

// البحث برقم الهوية
function searchById() {
  const id = document.getElementById('nationalId').value.trim();
  // تحويل الأرقام لنصوص للمقارنة الآمنة
  const s = students.find(x => String(x.national_id).trim() === id);
  document.getElementById('resultId').innerHTML = s ? render(s) : '<div class="result">لم يتم العثور على بيانات</div>';
}

// تعبئة قائمة الصفوف (مرتبة أبجدياً ورقمياً)
function initGrades() {
  const grades = [...new Set(students.map(s => s.grade))];
  
  // دالة الترتيب المحسنة
  grades.sort((a, b) => {
    return String(a).localeCompare(String(b), 'ar', { numeric: true });
  });

  const sel = document.getElementById('grade');
  sel.innerHTML = '<option value="">اختر الصف</option>';
  grades.forEach(x => sel.innerHTML += `<option value="${x}">${x}</option>`);
}

// تعبئة قائمة الفصول (مرتبة)
function loadClasses() {
  const grade = document.getElementById('grade').value;
  
  // فلترة الفصول الخاصة بالصف المختار فقط
  const classes = [...new Set(students
    .filter(s => String(s.grade) === grade)
    .map(s => s.class)
  )];

  // الترتيب
  classes.sort((a, b) => {
    return String(a).localeCompare(String(b), 'ar', { numeric: true });
  });

  const sel = document.getElementById('class');
  sel.innerHTML = '<option value="">اختر الفصل</option>';
  classes.forEach(x => sel.innerHTML += `<option value="${x}">${x}</option>`);
  
  // تصفير قائمة الطلاب
  document.getElementById('student').innerHTML = '<option value="">اختر الطالب</option>';
  document.getElementById('resultList').innerHTML = '';
}

// تعبئة قائمة الطلاب (مرتبة أبجدياً)
function loadStudents() {
  const grade = document.getElementById('grade').value;
  const cls = document.getElementById('class').value;
  
  const list = students.filter(s => String(s.grade) === grade && String(s.class) === cls);

  // ترتيب الطلاب أبجدياً حسب الاسم
  list.sort((a, b) => {
    return String(a.name).localeCompare(String(b.name), 'ar');
  });

  const sel = document.getElementById('student');
  sel.innerHTML = '<option value="">اختر الطالب</option>';
  list.forEach(s => sel.innerHTML += `<option value="${s.national_id}">${s.name}</option>`);
}

// عرض نتيجة الطالب المختار من القائمة
function showStudent() {
  const id = document.getElementById('student').value;
  if (!id) {
    document.getElementById('resultList').innerHTML = '';
    return;
  }
  const s = students.find(x => String(x.national_id) === id);
  document.getElementById('resultList').innerHTML = s ? render(s) : '';
}

// دالة عرض كارت الطالب
function render(s) {
  let gradeParam = "first";
  if (s.grade.includes("الثاني")) {
    gradeParam = "second";
  } else if (s.grade.includes("الثالث")) {
    gradeParam = "third";
  }

  return `
    <div class="result">
      <strong>الاسم:</strong> ${s.name}<br>
      <strong>الصف:</strong> ${s.grade} / ${s.class}<br>
      <strong>اللجنة:</strong> ${s.committee}<br>
      <strong>مقر اللجنة:</strong> ${s.committee_location}<br>
      <strong>رقم الجلوس:</strong> ${s.seat}<br>
      <strong>رقم الجلوس كاملاً:</strong> ${s.seat_full}<br>
      <button class="view-my-schedule-btn" onclick="viewGradeSchedule('${s.grade}')" style="margin-top: 15px; width: 100%; padding: 12px; font-weight: bold; border-radius: 10px; border: 1.5px solid var(--accent-color); background: rgba(242, 140, 40, 0.1); color: var(--accent-hover); cursor: pointer; transition: all 0.25s; font-size: 14px;">
        📅 عرض جدول اختبارات صفك
      </button>
    </div>
  `;
}

// دالة أمان إضافية للتوجيه المباشر في حال الكاش في المتصفح
function viewGradeSchedule(gradeKey) {
  let gradeParam = "first";
  if (gradeKey.includes("الثاني")) {
    gradeParam = "second";
  } else if (gradeKey.includes("الثالث")) {
    gradeParam = "third";
  }
  window.location.href = "schedule.html?grade=" + gradeParam;
}
