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
  const s = students.find(x => x.national_id === id);
  document.getElementById('resultId').innerHTML = s ? render(s) : '<div class="result">لم يتم العثور على بيانات</div>';
}

// تعبئة قائمة الصفوف (مرتبة)
function initGrades() {
  // استخراج الصفوف وترتيبها (numeric: true لترتيب الأرقام بشكل منطقي)
  const g = [...new Set(students.map(s => s.grade))]
    .sort((a, b) => a.localeCompare(b, 'ar', { numeric: true }));

  const sel = document.getElementById('grade');
  sel.innerHTML = '<option value="">اختر الصف</option>';
  g.forEach(x => sel.innerHTML += `<option>${x}</option>`);
}

// تعبئة قائمة الفصول عند اختيار الصف (مرتبة)
function loadClasses() {
  const grade = document.getElementById('grade').value;
  
  const c = [...new Set(students.filter(s => s.grade === grade).map(s => s.class))]
    .sort((a, b) => a.localeCompare(b, 'ar', { numeric: true }));

  const sel = document.getElementById('class');
  sel.innerHTML = '<option value="">اختر الفصل</option>';
  c.forEach(x => sel.innerHTML += `<option>${x}</option>`);
  
  // تصفير قائمة الطلاب عند تغيير الفصل
  document.getElementById('student').innerHTML = '<option value="">اختر الطالب</option>';
}

// تعبئة قائمة الطلاب عند اختيار الفصل (مرتبة أبجدياً حسب الاسم)
function loadStudents() {
  const grade = document.getElementById('grade').value;
  const cls = document.getElementById('class').value;
  
  const list = students.filter(s => s.grade === grade && s.class === cls)
    .sort((a, b) => a.name.localeCompare(b.name, 'ar'));

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
  const s = students.find(x => x.national_id === id);
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
