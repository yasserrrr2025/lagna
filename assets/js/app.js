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
  return `
    <div class="result">
      الاسم: ${s.name}<br>
      الصف: ${s.grade} / ${s.class}<br>
      اللجنة: ${s.committee}<br>
      رقم الجلوس: ${s.seat}
    </div>
  `;
}
