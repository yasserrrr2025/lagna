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
  let gradeKey = "";
  if (s.grade.includes("الأول")) {
    gradeKey = "الأول الثانوي";
  } else if (s.grade.includes("الثاني")) {
    gradeKey = "الثاني الثانوي";
  } else if (s.grade.includes("الثالث")) {
    gradeKey = "الثالث الثانوي";
  }

  return `
    <div class="result">
      <strong>الاسم:</strong> ${s.name}<br>
      <strong>الصف:</strong> ${s.grade} / ${s.class}<br>
      <strong>اللجنة:</strong> ${s.committee}<br>
      <strong>مقر اللجنة:</strong> ${s.committee_location}<br>
      <strong>رقم الجلوس:</strong> ${s.seat}<br>
      <button class="view-my-schedule-btn" onclick="viewGradeSchedule('${gradeKey}')" style="margin-top: 12px; width: 100%; padding: 8px 12px; font-weight: bold; border-radius: 8px; border: 1px solid var(--primary-color); background: rgba(13, 92, 99, 0.1); color: var(--primary-color); cursor: pointer; transition: all 0.2s;">
        📅 عرض جدول اختبارات صفك
      </button>
    </div>
  `;
}

// التبديل بين إظهار وإخفاء قسم الجدول
function toggleSchedule() {
  const sec = document.getElementById('schedule-section');
  const btn = document.getElementById('toggle-schedule-btn');
  if (sec.style.display === 'none') {
    sec.style.display = 'block';
    btn.innerHTML = '<span>📅</span> إخفاء جدول الاختبارات والتعليمات';
    sec.scrollIntoView({ behavior: 'smooth' });
  } else {
    sec.style.display = 'none';
    btn.innerHTML = '<span>📅</span> مشاهدة جدول الاختبارات والتعليمات';
  }
}

// التبديل بين تبويبات الجدول (الأول، الثاني، الثالث ثانوي)
function switchScheduleTab(tab) {
  // إخفاء جميع الجداول
  document.getElementById('table-first').style.display = 'none';
  document.getElementById('table-second').style.display = 'none';
  document.getElementById('table-third').style.display = 'none';

  // إزالة الكلاس النشط من جميع الأزرار
  document.getElementById('tab-first').classList.remove('active');
  document.getElementById('tab-second').classList.remove('active');
  document.getElementById('tab-third').classList.remove('active');

  // إظهار الجدول المختار وتفعيل الزر الخاص به
  if (tab === 'first') {
    document.getElementById('table-first').style.display = 'block';
    document.getElementById('tab-first').classList.add('active');
  } else if (tab === 'second') {
    document.getElementById('table-second').style.display = 'block';
    document.getElementById('tab-second').classList.add('active');
  } else if (tab === 'third') {
    document.getElementById('table-third').style.display = 'block';
    document.getElementById('tab-third').classList.add('active');
  }
}

// عرض جدول الصف المختار تلقائياً للتحويل عند الضغط على كرت الطالب
function viewGradeSchedule(gradeKey) {
  // فتح قسم الجدول إن كان مغلقاً
  const sec = document.getElementById('schedule-section');
  const btn = document.getElementById('toggle-schedule-btn');
  if (sec.style.display === 'none') {
    sec.style.display = 'block';
    btn.innerHTML = '<span>📅</span> إخفاء جدول الاختبارات والتعليمات';
  }
  
  // تفعيل التبويب المناسب
  if (gradeKey.includes("الأول")) {
    switchScheduleTab('first');
  } else if (gradeKey.includes("الثاني")) {
    switchScheduleTab('second');
  } else if (gradeKey.includes("الثالث")) {
    switchScheduleTab('third');
  }
  
  // التمرير إلى قسم الجدول
  sec.scrollIntoView({ behavior: 'smooth' });
}
