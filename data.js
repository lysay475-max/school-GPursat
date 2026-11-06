/**
 * COMPLETE ENTERPRISE SEED DATA FOR CAMBODIAN JUNIOR HIGH SCHOOL (អនុវិទ្យាល័យ)
 * Class 8A (ថ្នាក់ទី ៨ A) - Expanded with Seating, Exams, Textbooks, Council & Clubs
 */

const SEED_SCHOOL_INFO = {
  schoolName: "អនុវិទ្យាល័យ ហ៊ុន សែន",
  schoolNameEn: "Hun Sen Junior High School",
  academicYear: "២០២៥-២០២៦",
  principalName: "លោក អ៊ុំ សុវណ្ណារិទ្ធ",
  teacherName: "លោកគ្រូ សុខ ចាន់ថា",
  teacherPhone: "០១២ ៣៤៥ ៦៧៨",
  schoolAddress: "រាជធានីភ្នំពេញ ព្រះរាជាណាចក្រកម្ពុជា",
  currentClass: "8A",
  telegramBotToken: "",
  telegramChatId: ""
};

const SEED_SUBJECTS = [
  { id: "khmer", name: "ភាសាខ្មែរ", nameEn: "Khmer", maxScore: 100, coef: 2, teacher: "អ្នកគ្រូ កែវ មុនី", color: "#4f46e5" },
  { id: "math", name: "គណិតវិទ្យា", nameEn: "Mathematics", maxScore: 100, coef: 2, teacher: "លោកគ្រូ សុខ ចាន់ថា", color: "#06b6d4" },
  { id: "phys", name: "រូបវិទ្យា", nameEn: "Physics", maxScore: 50, coef: 1, teacher: "លោកគ្រូ ហេង ពិសិដ្ឋ", color: "#10b981" },
  { id: "chem", name: "គីមីវិទ្យា", nameEn: "Chemistry", maxScore: 50, coef: 1, teacher: "អ្នកគ្រូ ចាន់ ស្រីមុំ", color: "#f59e0b" },
  { id: "bio", name: "ជីវវិទ្យា", nameEn: "Biology", maxScore: 50, coef: 1, teacher: "អ្នកគ្រូ អ៊ឹង សុផល", color: "#8b5cf6" },
  { id: "earth", name: "ផែនដីវិទ្យា", nameEn: "Earth Science", maxScore: 50, coef: 1, teacher: "លោកគ្រូ លី គឹមសាន", color: "#ec4899" },
  { id: "hist", name: "ប្រវត្តិវិទ្យា", nameEn: "History", maxScore: 50, coef: 1, teacher: "លោកគ្រូ វ៉ាន់ សុធា", color: "#14b8a6" },
  { id: "geo", name: "ភូមិវិទ្យា", nameEn: "Geography", maxScore: 50, coef: 1, teacher: "អ្នកគ្រូ ម៉ៅ រតនា", color: "#f97316" },
  { id: "moral", name: "សីលធម៌-ពលរដ្ឋ", nameEn: "Civics & Morals", maxScore: 50, coef: 1, teacher: "អ្នកគ្រូ ជា វណ្ណា", color: "#6366f1" },
  { id: "english", name: "ភាសាអង់គ្លេស", nameEn: "English", maxScore: 50, coef: 1, teacher: "លោកគ្រូ រ័ត្ន ដារ៉ូ", color: "#0ea5e9" },
  { id: "home_eco", name: "គេហវិទ្យា", nameKh: "គេហវិទ្យា", nameEn: "Home Economics", maxScore: 50, coef: 1, teacher: "អ្នកគ្រូ ឡុង ស្រីពៅ", color: "#ec4899", phone: "០១២ ៣៤៥ ៦៨០" },
  { id: "ict_sport", name: "ICT & កីឡា", nameEn: "ICT & Sport", maxScore: 50, coef: 1, teacher: "លោកគ្រូ គង់ វិចិត្រ", color: "#84cc16" }
];

// 42 Authentic Cambodian Junior High School Students (Class 8A)
const SEED_STUDENTS = [
  {
    id: "STU-8A-001",
    nameKh: "សុខា មុនីរត្ន",
    nameEn: "SOKHA MONYROTH",
    gender: "ស្រី",
    dob: "2012-05-15",
    class: "8A",
    parentName: "សុខា វិចិត្រ",
    parentPhone: "012 888 991",
    address: "សង្កាត់ទឹកល្អក់១ ខណ្ឌទួលគោក ភ្នំពេញ",
    status: "កំពុងរៀន",
    photo: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-8A-002",
    nameKh: "ចាន់ សុភ័ក្ត្រ",
    nameEn: "CHAN SOPHEAK",
    gender: "ប្រុស",
    dob: "2012-03-20",
    class: "8A",
    parentName: "ចាន់ ប៊ុនថន",
    parentPhone: "012 777 882",
    address: "សង្កាត់បឹងកក់២ ខណ្ឌទួលគោក ភ្នំពេញ",
    status: "កំពុងរៀន",
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-8A-003",
    nameKh: "ហេង ស្រីនិក",
    nameEn: "HENG SREYNIK",
    gender: "ស្រី",
    dob: "2012-08-11",
    class: "8A",
    parentName: "ហេង សុផល",
    parentPhone: "017 445 566",
    address: "សង្កាត់ផ្សារដេប៉ូ៣ ខណ្ឌទួលគោក ភ្នំពេញ",
    status: "កំពុងរៀន",
    photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-8A-004",
    nameKh: "គង់ រតនៈ",
    nameEn: "KONG RATTANAK",
    gender: "ប្រុស",
    dob: "2012-01-25",
    class: "8A",
    parentName: "គង់ វណ្ណា",
    parentPhone: "098 332 211",
    address: "សង្កាត់អូរបែកក្អម ខណ្ឌសែនសុខ ភ្នំពេញ",
    status: "កំពុងរៀន",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-8A-005",
    nameKh: "ម៉ៅ គឹមលាង",
    nameEn: "MAO KIMLEANG",
    gender: "ស្រី",
    dob: "2012-11-04",
    class: "8A",
    parentName: "ម៉ៅ សុខុម",
    parentPhone: "089 554 433",
    address: "សង្កាត់ភ្នំពេញថ្មី ខណ្ឌសែនសុខ ភ្នំពេញ",
    status: "កំពុងរៀន",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-8A-006",
    nameKh: "វ៉ាន់ ដារ៉ា",
    nameEn: "VAN DARA",
    gender: "ប្រុស",
    dob: "2012-06-18",
    class: "8A",
    parentName: "វ៉ាន់ សុវណ្ណ",
    parentPhone: "010 667 788",
    address: "សង្កាត់ទឹកថ្លា ខណ្ឌសែនសុខ ភ្នំពេញ",
    status: "កំពុងរៀន",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-8A-007",
    nameKh: "ជា ស្រីពៅ",
    nameEn: "CHEA SREYPOV",
    gender: "ស្រី",
    dob: "2012-09-30",
    class: "8A",
    parentName: "ជា វុទ្ធី",
    parentPhone: "077 123 456",
    address: "សង្កាត់បឹងកក់១ ខណ្ឌទួលគោក ភ្នំពេញ",
    status: "កំពុងរៀន",
    photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-8A-008",
    nameKh: "ស៊ន វិសាល",
    nameEn: "SORN VISAL",
    gender: "ប្រុស",
    dob: "2012-04-12",
    class: "8A",
    parentName: "ស៊ន សារ៉េត",
    parentPhone: "016 998 877",
    address: "សង្កាត់ស្រះចក ខណ្ឌដូនពេញ ភ្នំពេញ",
    status: "កំពុងរៀន",
    photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-8A-009",
    nameKh: "អ៊ឹម សុជាតា",
    nameEn: "IM SOCHEATA",
    gender: "ស្រី",
    dob: "2012-07-22",
    class: "8A",
    parentName: "អ៊ឹម សម្បត្តិ",
    parentPhone: "015 223 344",
    address: "សង្កាត់ផ្សារថ្មី១ ខណ្ឌដូនពេញ ភ្នំពេញ",
    status: "កំពុងរៀន",
    photo: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-8A-010",
    nameKh: "ព្រំ ភារម្យ",
    nameEn: "PROM PHEAROM",
    gender: "ប្រុស",
    dob: "2012-10-08",
    class: "8A",
    parentName: "ព្រំ សុខា",
    parentPhone: "092 881 122",
    address: "សង្កាត់វាលវង់ ខណ្ឌ៧មករា ភ្នំពេញ",
    status: "កំពុងរៀន",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-8A-011",
    nameKh: "លី ស្រីឡែន",
    nameEn: "LY SREYLEN",
    gender: "ស្រី",
    dob: "2012-02-14",
    class: "8A",
    parentName: "លី ហុក",
    parentPhone: "012 334 455",
    address: "សង្កាត់អូរឫស្សី២ ខណ្ឌ៧មករា ភ្នំពេញ",
    status: "កំពុងរៀន",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-8A-012",
    nameKh: "ទិត្យ បញ្ញា",
    nameEn: "TITH PANHA",
    gender: "ប្រុស",
    dob: "2012-12-01",
    class: "8A",
    parentName: "ទិត្យ គង់",
    parentPhone: "069 445 577",
    address: "សង្កាត់បឹងព្រលឹត ខណ្ឌ៧មករា ភ្នំពេញ",
    status: "កំពុងរៀន",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-8A-013",
    nameKh: "កែវ ធីតា",
    nameEn: "KEO THIDA",
    gender: "ស្រី",
    dob: "2012-05-28",
    class: "8A",
    parentName: "កែវ រ៉ា",
    parentPhone: "097 556 677",
    address: "សង្កាត់ទួលស្វាយព្រៃ១ ខណ្ឌបឹងកេងកង ភ្នំពេញ",
    status: "កំពុងរៀន",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-8A-014",
    nameKh: "នុត វិបុល",
    nameEn: "NUT VIBOL",
    gender: "ប្រុស",
    dob: "2012-03-09",
    class: "8A",
    parentName: "នុត សុភាព",
    parentPhone: "011 223 399",
    address: "សង្កាត់បឹងកេងកង៣ ខណ្ឌបឹងកេងកង ភ្នំពេញ",
    status: "កំពុងរៀន",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-8A-015",
    nameKh: "សេង រចនា",
    nameEn: "SENG RACHANA",
    gender: "ស្រី",
    dob: "2012-08-19",
    class: "8A",
    parentName: "សេង ចាន់ឌី",
    parentPhone: "088 776 655",
    address: "សង្កាត់ទំនប់ទឹក ខណ្ឌបឹងកេងកង ភ្នំពេញ",
    status: "កំពុងរៀន",
    photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-8A-016",
    nameKh: "ប៉ែន សម្បត្តិ",
    nameEn: "PEN SAMBATH",
    gender: "ប្រុស",
    dob: "2012-07-04",
    class: "8A",
    parentName: "ប៉ែន រិទ្ធី",
    parentPhone: "078 889 900",
    address: "សង្កាត់ផ្សារដើមថ្កូវ ខណ្ឌចំការមន ភ្នំពេញ",
    status: "កំពុងរៀន",
    photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-8A-017",
    nameKh: "រស់ គន្ធា",
    nameEn: "ROS KUNTHEA",
    gender: "ស្រី",
    dob: "2012-04-26",
    class: "8A",
    parentName: "រស់ សារ៉ន",
    parentPhone: "096 443 322",
    address: "សង្កាត់ទួលទំពូង១ ខណ្ឌចំការមន ភ្នំពេញ",
    status: "កំពុងរៀន",
    photo: "https://images.unsplash.com/photo-1558898479-33c0057a5d12?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-8A-018",
    nameKh: "ឡុង វឌ្ឍនា",
    nameEn: "LONG VATTANA",
    gender: "ប្រុស",
    dob: "2012-10-15",
    class: "8A",
    parentName: "ឡុង សំបូរ",
    parentPhone: "012 990 011",
    address: "សង្កាត់ច្បារអំពៅ១ ខណ្ឌច្បារអំពៅ ភ្នំពេញ",
    status: "កំពុងរៀន",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-8A-019",
    nameKh: "អ៊ុក ទេពី",
    nameEn: "OUK TEPI",
    gender: "ស្រី",
    dob: "2012-01-10",
    class: "8A",
    parentName: "អ៊ុក ថៃ",
    parentPhone: "087 112 233",
    address: "សង្កាត់ព្រែកប្រា ខណ្ឌច្បារអំពៅ ភ្នំពេញ",
    status: "កំពុងរៀន",
    photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-8A-020",
    nameKh: "ម៉ី ពិសាល",
    nameEn: "MEY PISAL",
    gender: "ប្រុស",
    dob: "2012-09-17",
    class: "8A",
    parentName: "ម៉ី វិបុល",
    parentPhone: "010 334 477",
    address: "សង្កាត់ចោមចៅ១ ខណ្ឌពោធិ៍សែនជ័យ ភ្នំពេញ",
    status: "កំពុងរៀន",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-8A-021",
    nameKh: "សោម លក្ខិណា",
    nameEn: "SOM LEAKHENA",
    gender: "ស្រី",
    dob: "2012-06-05",
    class: "8A",
    parentName: "សោម ហេង",
    parentPhone: "093 665 544",
    address: "សង្កាត់កាកាប២ ខណ្ឌពោធិ៍សែនជ័យ ភ្នំពេញ",
    status: "កំពុងរៀន",
    photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-8A-022",
    nameKh: "ថោង សុវណ្ណារ៉ា",
    nameEn: "THONG SOVANNARA",
    gender: "ប្រុស",
    dob: "2012-11-23",
    class: "8A",
    parentName: "ថោង សុខេង",
    parentPhone: "012 447 788",
    address: "សង្កាត់ស្ទឹងមានជ័យ១ ខណ្ឌមានជ័យ ភ្នំពេញ",
    status: "កំពុងរៀន",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-8A-023",
    nameKh: "ជួប សុម៉ាលី",
    nameEn: "CHUOB SOMALY",
    gender: "ស្រី",
    dob: "2012-03-14",
    class: "8A",
    parentName: "ជួប វណ្ណារ៉ា",
    parentPhone: "017 990 022",
    address: "សង្កាត់បឹងទំពុន១ ខណ្ឌមានជ័យ ភ្នំពេញ",
    status: "កំពុងរៀន",
    photo: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-8A-024",
    nameKh: "ស៊ុយ រតនៈបញ្ញា",
    nameEn: "SUY RATTANAKPANHA",
    gender: "ប្រុស",
    dob: "2012-08-02",
    class: "8A",
    parentName: "ស៊ុយ សុខលី",
    parentPhone: "089 113 355",
    address: "សង្កាត់ដង្កោ ខណ្ឌដង្កោ ភ្នំពេញ",
    status: "កំពុងរៀន",
    photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-8A-025",
    nameKh: "ខៀវ ស្រីណែត",
    nameEn: "KHIEV SREYNET",
    gender: "ស្រី",
    dob: "2012-12-19",
    class: "8A",
    parentName: "ខៀវ បូរ៉ា",
    parentPhone: "015 889 911",
    address: "សង្កាត់ព្រៃស ខណ្ឌដង្កោ ភ្នំពេញ",
    status: "កំពុងរៀន",
    photo: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-8A-026",
    nameKh: "ផាត់ សុជាតិ",
    nameEn: "PHAT SOCHEAT",
    gender: "ប្រុស",
    dob: "2012-05-07",
    class: "8A",
    parentName: "ផាត់ វិចិត្រ",
    parentPhone: "098 776 611",
    address: "សង្កាត់គីឡូម៉ែត្រលេខ៦ ខណ្ឌឫស្សីកែវ ភ្នំពេញ",
    status: "កំពុងរៀន",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-8A-027",
    nameKh: "សួន សុវណ្ណារី",
    nameEn: "SUON SOVANNARY",
    gender: "ស្រី",
    dob: "2012-10-28",
    class: "8A",
    parentName: "សួន ធឿន",
    parentPhone: "012 225 566",
    address: "សង្កាត់ទួលសង្កែ១ ខណ្ឌឫស្សីកែវ ភ្នំពេញ",
    status: "កំពុងរៀន",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-8A-028",
    nameKh: "ឌួង វីរៈ",
    nameEn: "DUONG VIRAK",
    gender: "ប្រុស",
    dob: "2012-02-18",
    class: "8A",
    parentName: "ឌួង សុភាព",
    parentPhone: "070 334 488",
    address: "សង្កាត់ច្រាំងចំរេះ១ ខណ្ឌឫស្សីកែវ ភ្នំពេញ",
    status: "កំពុងរៀន",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-8A-029",
    nameKh: "ហេង ចរិយា",
    nameEn: "HENG CHORIYA",
    gender: "ស្រី",
    dob: "2012-07-16",
    class: "8A",
    parentName: "ហេង គង់",
    parentPhone: "085 667 799",
    address: "សង្កាត់ស្វាយប៉ាក ខណ្ឌឫស្សីកែវ ភ្នំពេញ",
    status: "កំពុងរៀន",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-8A-030",
    nameKh: "តាំង សុគន្ធា",
    nameEn: "TANG SOKUNTHEA",
    gender: "ប្រុស",
    dob: "2012-09-03",
    class: "8A",
    parentName: "តាំង គឹមស៊្រុន",
    parentPhone: "016 445 522",
    address: "សង្កាត់ជ្រោយចង្វារ ខណ្ឌជ្រោយចង្វារ ភ្នំពេញ",
    status: "កំពុងរៀន",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-8A-031",
    nameKh: "លឹម ស្រីមុំ",
    nameEn: "LIM SREYMOM",
    gender: "ស្រី",
    dob: "2012-04-09",
    class: "8A",
    parentName: "លឹម ហុង",
    parentPhone: "092 331 144",
    address: "សង្កាត់ព្រែកលៀប ខណ្ឌជ្រោយចង្វារ ភ្នំពេញ",
    status: "កំពុងរៀន",
    photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-8A-032",
    nameKh: "ញ៉ែម ពិសិដ្ឋ",
    nameEn: "NHEM PISETH",
    gender: "ប្រុស",
    dob: "2012-06-27",
    class: "8A",
    parentName: "ញ៉ែម សុខុម",
    parentPhone: "088 998 822",
    address: "សង្កាត់ព្រែកតាសេក ខណ្ឌជ្រោយចង្វារ ភ្នំពេញ",
    status: "កំពុងរៀន",
    photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-8A-033",
    nameKh: "អ៊ូច សុធីតា",
    nameEn: "OUCH SOTHIDA",
    gender: "ស្រី",
    dob: "2012-11-12",
    class: "8A",
    parentName: "អ៊ូច សារ៉ាត់",
    parentPhone: "010 774 411",
    address: "សង្កាត់កោះដាច់ ខណ្ឌជ្រោយចង្វារ ភ្នំពេញ",
    status: "កំពុងរៀន",
    photo: "https://images.unsplash.com/photo-1558898479-33c0057a5d12?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-8A-034",
    nameKh: "ផន រិទ្ធីស័ក្តិ",
    nameEn: "PHORN RITHISAK",
    gender: "ប្រុស",
    dob: "2012-01-31",
    class: "8A",
    parentName: "ផន ធារិទ្ធ",
    parentPhone: "077 889 933",
    address: "សង្កាត់ព្រែកថ្មី ខណ្ឌច្បារអំពៅ ភ្នំពេញ",
    status: "កំពុងរៀន",
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-8A-035",
    nameKh: "រិន កល្យាណ",
    nameEn: "RIN KALYAN",
    gender: "ស្រី",
    dob: "2012-08-24",
    class: "8A",
    parentName: "រិន សុខន",
    parentPhone: "012 665 599",
    address: "សង្កាត់វាលស្បូវ ខណ្ឌច្បារអំពៅ ភ្នំពេញ",
    status: "កំពុងរៀន",
    photo: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-8A-036",
    nameKh: "ពេជ្រ ចាន់ដារ៉ា",
    nameEn: "PICH CHANDARA",
    gender: "ប្រុស",
    dob: "2012-05-03",
    class: "8A",
    parentName: "ពេជ្រ សុខលីម",
    parentPhone: "096 778 899",
    address: "សង្កាត់ក្បាលកោះ ខណ្ឌច្បារអំពៅ ភ្នំពេញ",
    status: "កំពុងរៀន",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-8A-037",
    nameKh: "ជា សុភានី",
    nameEn: "CHEA SOPHEANY",
    gender: "ស្រី",
    dob: "2012-10-19",
    class: "8A",
    parentName: "ជា វិចិត្រ",
    parentPhone: "017 332 288",
    address: "សង្កាត់ចោមចៅ២ ខណ្ឌពោធិ៍សែនជ័យ ភ្នំពេញ",
    status: "កំពុងរៀន",
    photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-8A-038",
    nameKh: "ម៉េង ធារ៉ា",
    nameEn: "MENG THEARA",
    gender: "ប្រុស",
    dob: "2012-03-11",
    class: "8A",
    parentName: "ម៉េង ហុង",
    parentPhone: "089 665 522",
    address: "សង្កាត់ត្រពាំងក្រសាំង ខណ្ឌពោធិ៍សែនជ័យ ភ្នំពេញ",
    status: "កំពុងរៀន",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-8A-039",
    nameKh: "យ៉ង ស្រីខួច",
    nameEn: "YONG SREYKHOUCH",
    gender: "ស្រី",
    dob: "2012-07-08",
    class: "8A",
    parentName: "យ៉ង ផាត",
    parentPhone: "015 443 311",
    address: "សង្កាត់សំរោងក្រោម ខណ្ឌពោធិ៍សែនជ័យ ភ្នំពេញ",
    status: "កំពុងរៀន",
    photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-8A-040",
    nameKh: "វ៉ា គឹមហេង",
    nameEn: "VA KIMHENG",
    gender: "ប្រុស",
    dob: "2012-12-25",
    class: "8A",
    parentName: "វ៉ា សុវណ្ណ",
    parentPhone: "098 112 288",
    address: "សង្កាត់ចោមចៅ៣ ខណ្ឌពោធិ៍សែនជ័យ ភ្នំពេញ",
    status: "កំពុងរៀន",
    photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-8A-041",
    nameKh: "ឡាច ស្រីណុច",
    nameEn: "LACH SREYNOCH",
    gender: "ស្រី",
    dob: "2012-02-06",
    class: "8A",
    parentName: "ឡាច សំអុល",
    parentPhone: "012 559 933",
    address: "សង្កាត់ចោមចៅ១ ខណ្ឌពោធិ៍សែនជ័យ ភ្នំពេញ",
    status: "កំពុងរៀន",
    photo: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "STU-8A-042",
    nameKh: "អ៊ុច ពិសី",
    nameEn: "UCH PISEY",
    gender: "ស្រី",
    dob: "2012-09-14",
    class: "8A",
    parentName: "អ៊ុច វុទ្ធី",
    parentPhone: "087 448 811",
    address: "សង្កាត់ទឹកថ្លា ខណ្ឌសែនសុខ ភ្នំពេញ",
    status: "កំពុងរៀន",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
  }
];

// Baseline Grades for October (Month 10)
const SEED_MONTH_10_GRADES = {
  "STU-8A-001": { khmer: 94, math: 98, phys: 48, chem: 49, bio: 48, earth: 47, hist: 46, geo: 48, moral: 49, home_eco: 49, english: 49, ict_sport: 48 },
  "STU-8A-002": { khmer: 92, math: 96, phys: 47, chem: 48, bio: 47, earth: 46, hist: 45, geo: 47, moral: 48, home_eco: 48, english: 47, ict_sport: 49 },
  "STU-8A-003": { khmer: 95, math: 90, phys: 46, chem: 47, bio: 48, earth: 45, hist: 48, geo: 46, moral: 49, home_eco: 49, english: 48, ict_sport: 46 },
  "STU-8A-004": { khmer: 88, math: 95, phys: 48, chem: 46, bio: 45, earth: 44, hist: 44, geo: 45, moral: 46, home_eco: 47, english: 46, ict_sport: 48 },
  "STU-8A-005": { khmer: 90, math: 91, phys: 45, chem: 46, bio: 46, earth: 45, hist: 46, geo: 45, moral: 47, home_eco: 46, english: 45, ict_sport: 46 },
  "STU-8A-006": { khmer: 84, math: 89, phys: 44, chem: 43, bio: 44, earth: 42, hist: 43, geo: 44, moral: 45, home_eco: 45, english: 44, ict_sport: 47 },
  "STU-8A-007": { khmer: 89, math: 84, phys: 42, chem: 44, bio: 45, earth: 43, hist: 45, geo: 43, moral: 46, home_eco: 46, english: 45, ict_sport: 44 },
  "STU-8A-008": { khmer: 82, math: 86, phys: 43, chem: 42, bio: 42, earth: 41, hist: 42, geo: 43, moral: 44, home_eco: 44, english: 43, ict_sport: 46 },
  "STU-8A-009": { khmer: 86, math: 80, phys: 41, chem: 43, bio: 44, earth: 42, hist: 44, geo: 42, moral: 45, home_eco: 45, english: 44, ict_sport: 43 },
  "STU-8A-010": { khmer: 79, math: 85, phys: 42, chem: 41, bio: 41, earth: 40, hist: 41, geo: 42, moral: 43, home_eco: 42, english: 41, ict_sport: 45 },
  "STU-8A-011": { khmer: 85, math: 78, phys: 40, chem: 42, bio: 43, earth: 41, hist: 43, geo: 41, moral: 44, home_eco: 44, english: 42, ict_sport: 42 },
  "STU-8A-012": { khmer: 76, math: 83, phys: 41, chem: 40, bio: 40, earth: 39, hist: 40, geo: 41, moral: 42, home_eco: 41, english: 40, ict_sport: 44 },
  "STU-8A-013": { khmer: 83, math: 75, phys: 39, chem: 41, bio: 42, earth: 40, hist: 42, geo: 40, moral: 43, home_eco: 43, english: 41, ict_sport: 41 },
  "STU-8A-014": { khmer: 74, math: 81, phys: 40, chem: 39, bio: 39, earth: 38, hist: 39, geo: 40, moral: 41, home_eco: 40, english: 39, ict_sport: 43 },
  "STU-8A-015": { khmer: 81, math: 73, phys: 38, chem: 40, bio: 41, earth: 39, hist: 41, geo: 39, moral: 42, home_eco: 42, english: 40, ict_sport: 40 },
  "STU-8A-016": { khmer: 72, math: 79, phys: 39, chem: 38, bio: 38, earth: 37, hist: 38, geo: 39, moral: 40, home_eco: 39, english: 38, ict_sport: 42 },
  "STU-8A-017": { khmer: 79, math: 71, phys: 37, chem: 39, bio: 40, earth: 38, hist: 40, geo: 38, moral: 41, home_eco: 41, english: 39, ict_sport: 39 },
  "STU-8A-018": { khmer: 70, math: 77, phys: 38, chem: 37, bio: 37, earth: 36, hist: 37, geo: 38, moral: 39, home_eco: 38, english: 37, ict_sport: 41 },
  "STU-8A-019": { khmer: 78, math: 69, phys: 36, chem: 38, bio: 39, earth: 37, hist: 39, geo: 37, moral: 40, home_eco: 40, english: 38, ict_sport: 38 },
  "STU-8A-020": { khmer: 68, math: 75, phys: 37, chem: 36, bio: 36, earth: 35, hist: 36, geo: 37, moral: 38, home_eco: 37, english: 36, ict_sport: 40 },
  "STU-8A-021": { khmer: 76, math: 67, phys: 35, chem: 37, bio: 38, earth: 36, hist: 38, geo: 36, moral: 39, home_eco: 39, english: 37, ict_sport: 37 },
  "STU-8A-022": { khmer: 66, math: 73, phys: 36, chem: 35, bio: 35, earth: 34, hist: 35, geo: 36, moral: 37, home_eco: 36, english: 35, ict_sport: 39 },
  "STU-8A-023": { khmer: 74, math: 65, phys: 34, chem: 36, bio: 37, earth: 35, hist: 37, geo: 35, moral: 38, home_eco: 38, english: 36, ict_sport: 36 },
  "STU-8A-024": { khmer: 64, math: 71, phys: 35, chem: 34, bio: 34, earth: 33, hist: 34, geo: 35, moral: 36, home_eco: 35, english: 34, ict_sport: 38 },
  "STU-8A-025": { khmer: 72, math: 63, phys: 33, chem: 35, bio: 36, earth: 34, hist: 36, geo: 34, moral: 37, home_eco: 37, english: 35, ict_sport: 35 },
  "STU-8A-026": { khmer: 62, math: 69, phys: 34, chem: 33, bio: 33, earth: 32, hist: 33, geo: 34, moral: 35, home_eco: 34, english: 33, ict_sport: 37 },
  "STU-8A-027": { khmer: 70, math: 61, phys: 32, chem: 34, bio: 35, earth: 33, hist: 35, geo: 33, moral: 36, home_eco: 36, english: 34, ict_sport: 34 },
  "STU-8A-028": { khmer: 60, math: 67, phys: 33, chem: 32, bio: 32, earth: 31, hist: 32, geo: 33, moral: 34, home_eco: 33, english: 32, ict_sport: 36 },
  "STU-8A-029": { khmer: 68, math: 59, phys: 31, chem: 33, bio: 34, earth: 32, hist: 34, geo: 32, moral: 35, home_eco: 35, english: 33, ict_sport: 33 },
  "STU-8A-030": { khmer: 58, math: 65, phys: 32, chem: 31, bio: 31, earth: 30, hist: 31, geo: 32, moral: 33, home_eco: 32, english: 31, ict_sport: 35 },
  "STU-8A-031": { khmer: 66, math: 57, phys: 30, chem: 32, bio: 33, earth: 31, hist: 33, geo: 31, moral: 34, home_eco: 34, english: 32, ict_sport: 32 },
  "STU-8A-032": { khmer: 56, math: 63, phys: 31, chem: 30, bio: 30, earth: 29, hist: 30, geo: 31, moral: 32, home_eco: 31, english: 30, ict_sport: 34 },
  "STU-8A-033": { khmer: 64, math: 55, phys: 29, chem: 31, bio: 32, earth: 30, hist: 32, geo: 30, moral: 33, home_eco: 33, english: 31, ict_sport: 31 },
  "STU-8A-034": { khmer: 54, math: 61, phys: 30, chem: 29, bio: 29, earth: 28, hist: 29, geo: 30, moral: 31, home_eco: 30, english: 29, ict_sport: 33 },
  "STU-8A-035": { khmer: 62, math: 53, phys: 28, chem: 30, bio: 31, earth: 29, hist: 31, geo: 29, moral: 32, home_eco: 32, english: 30, ict_sport: 30 },
  "STU-8A-036": { khmer: 52, math: 59, phys: 29, chem: 28, bio: 28, earth: 27, hist: 28, geo: 29, moral: 30, home_eco: 29, english: 28, ict_sport: 32 },
  "STU-8A-037": { khmer: 60, math: 51, phys: 27, chem: 29, bio: 30, earth: 28, hist: 30, geo: 28, moral: 31, home_eco: 31, english: 29, ict_sport: 29 },
  "STU-8A-038": { khmer: 50, math: 57, phys: 28, chem: 27, bio: 27, earth: 26, hist: 27, geo: 28, moral: 29, home_eco: 28, english: 27, ict_sport: 31 },
  "STU-8A-039": { khmer: 58, math: 49, phys: 26, chem: 28, bio: 29, earth: 27, hist: 29, geo: 27, moral: 30, home_eco: 30, english: 28, ict_sport: 28 },
  "STU-8A-040": { khmer: 48, math: 55, phys: 27, chem: 26, bio: 26, earth: 25, hist: 26, geo: 27, moral: 28, home_eco: 27, english: 26, ict_sport: 30 },
  "STU-8A-041": { khmer: 56, math: 47, phys: 25, chem: 27, bio: 28, earth: 26, hist: 28, geo: 26, moral: 29, home_eco: 29, english: 27, ict_sport: 27 },
  "STU-8A-042": { khmer: 46, math: 53, phys: 26, chem: 25, bio: 25, earth: 24, hist: 25, geo: 26, moral: 27, home_eco: 26, english: 25, ict_sport: 29 }
};

// Seed Question Bank for Exams & Quizzes
const SEED_QUESTIONS = [
  {
    id: "Q-MATH-01",
    subjectId: "math",
    subjectName: "គណិតវិទ្យា",
    type: "mcq",
    question: "តើសមីការ 2x + 6 = 14 មានឬស x ស្មើនឹងប៉ុន្មាន?",
    options: ["x = 2", "x = 4", "x = 6", "x = 8"],
    correctAnswer: 1,
    points: 2
  },
  {
    id: "Q-MATH-02",
    subjectId: "math",
    subjectName: "គណិតវិទ្យា",
    type: "problem",
    question: "ចូរដោះស្រាយសមីការដឺក្រេទី១៖ 3(x - 2) + 4 = 2x + 8។",
    correctAnswer: "3x - 6 + 4 = 2x + 8 => 3x - 2 = 2x + 8 => x = 10",
    points: 5
  },
  {
    id: "Q-KHM-01",
    subjectId: "khmer",
    subjectName: "ភាសាខ្មែរ",
    type: "mcq",
    question: "តើរឿង «ទុំទាវ» និពន្ធដោយកវីរូបណា?",
    options: ["ព្រះបាទអង្គឌួង", "ភិក្ខុសោម", "កវីក្រមង៉ុយ", "លោក នូ ហាច"],
    correctAnswer: 1,
    points: 2
  },
  {
    id: "Q-PHYS-01",
    subjectId: "phys",
    subjectName: "រូបវិទ្យា",
    type: "mcq",
    question: "តើខ្នាតអន្តរជាតិ (SI) នៃកម្លាំងគឺជាអ្វី?",
    options: ["ស៊ូល (J)", "ញូតុន (N)", "វ៉ាត់ (W)", "ប៉ាស្កាល់ (Pa)"],
    correctAnswer: 1,
    points: 2
  },
  {
    id: "Q-ENG-01",
    subjectId: "english",
    subjectName: "ភាសាអង់គ្លេស",
    type: "mcq",
    question: "Choose the correct past tense form: 'Yesterday, she ______ to school.'",
    options: ["go", "goes", "went", "going"],
    correctAnswer: 2,
    points: 2
  },
  {
    id: "Q-HE-01",
    subjectId: "home_eco",
    subjectName: "គេហវិទ្យា",
    type: "mcq",
    question: "តើរបបអាហារដែលមានតុល្យភាព (Balanced Diet) ត្រូវមានសារធាតុចិញ្ចឹមប៉ុន្មានក្រុមធំៗ?",
    options: ["៣ ក្រុម", "៤ ក្រុម", "៥ ក្រុម", "៦ ក្រុម"],
    correctAnswer: 2,
    points: 2
  }
];

// Seed Ministry Textbooks Tracking
const SEED_TEXTBOOKS = [
  { id: "TB-01", title: "ភាសាខ្មែរ ថ្នាក់ទី ៨", subject: "ភាសាខ្មែរ", totalQty: 45, issuedQty: 42, damagedQty: 1 },
  { id: "TB-02", title: "គណិតវិទ្យា ថ្នាក់ទី ៨", subject: "គណិតវិទ្យា", totalQty: 45, issuedQty: 42, damagedQty: 0 },
  { id: "TB-03", title: "រូបវិទ្យា ថ្នាក់ទី ៨", subject: "រូបវិទ្យា", totalQty: 45, issuedQty: 42, damagedQty: 2 },
  { id: "TB-04", title: "គីមីវិទ្យា ថ្នាក់ទី ៨", subject: "គីមីវិទ្យា", totalQty: 45, issuedQty: 42, damagedQty: 0 },
  { id: "TB-05", title: "ជីវវិទ្យា ថ្នាក់ទី ៨", subject: "ជីវវិទ្យា", totalQty: 45, issuedQty: 42, damagedQty: 1 },
  { id: "TB-06", title: "ភាសាអង់គ្លេស English Grade 8", subject: "ភាសាអង់គ្លេស", totalQty: 45, issuedQty: 42, damagedQty: 0 },
  { id: "TB-07", title: "គេហវិទ្យា ថ្នាក់ទី ៨", subject: "គេហវិទ្យា", totalQty: 45, issuedQty: 42, damagedQty: 0 }
];

// Seed Student Council & Study Clubs
const SEED_COUNCIL = {
  president: { studentId: "STU-8A-001", name: "សុខា មុនីរត្ន", role: "ប្រធានថ្នាក់ (Class President)" },
  vicePresident: { studentId: "STU-8A-002", name: "ចាន់ សុភ័ក្ត្រ", role: "អនុប្រធានថ្នាក់ (Vice President)" },
  sanitationLead: { studentId: "STU-8A-004", name: "គង់ រតនៈ", role: "ប្រធានក្រុមអនាម័យ (Sanitation Lead)" },
  disciplineLead: { studentId: "STU-8A-003", name: "ហេង ស្រីនិក", role: "ប្រធានក្រុមវិន័យ (Discipline Lead)" },
  sportsLead: { studentId: "STU-8A-008", name: "ស៊ន វិសាល", role: "ប្រធានក្រុមកីឡា & សិល្បៈ (Sports Lead)" }
};

const SEED_CLUBS = [
  {
    id: "CLUB-01",
    name: "ក្លឹបគណិតវិទ្យាឆ្នើម",
    nameEn: "Math Champions Club",
    leadStudent: "សុខា មុនីរត្ន",
    meetingDay: "រៀងរាល់រសៀលថ្ងៃព្រហស្បតិ៍",
    membersCount: 14,
    description: "ដោះស្រាយលំហាត់គណិតវិទ្យាកម្រិតខ្ពស់ និងត្រៀមប្រឡងសិស្សពូកែទូទាំងរាជធានី។"
  },
  {
    id: "CLUB-02",
    name: "ក្លឹបយុវជនកាកបាទក្រហមកម្ពុជា",
    nameEn: "Red Cross Youth Club",
    leadStudent: "គង់ រតនៈ",
    meetingDay: "រៀងរាល់ព្រឹកថ្ងៃសៅរ៍",
    membersCount: 18,
    description: "សកម្មភាពមនុស្សធម៌ ការសង្គ្រោះបឋម និងការថែរក្សាអនាម័យបរិស្ថានសាលារៀន។"
  },
  {
    id: "CLUB-03",
    name: "ក្លឹបភាសាអង់គ្លេសសន្ទនា",
    nameEn: "English Speaking Club",
    leadStudent: "ហេង ស្រីនិក",
    meetingDay: "រៀងរាល់រសៀលថ្ងៃអង្គារ",
    membersCount: 12,
    description: "អនុវត្តការសន្ទនាភាសាអង់គ្លេស ការអានសៀវភៅរឿង និងការធ្វើបទបង្ហាញ។"
  }
];

// Seed Homework & Assignments
const SEED_HOMEWORK = [
  {
    id: "HW-001",
    subjectId: "math",
    subjectName: "គណិតវិទ្យា",
    title: "លំហាត់សមីការដឺក្រេទី១ មានមួយអញ្ញាត",
    description: "ធ្វើលំហាត់ទំព័រទី ៤៥ លេខ 1 ដល់ 10 ក្នុងសៀវភៅពុម្ពគណិតវិទ្យាថ្នាក់ទី ៨។",
    dueDate: "2025-10-14",
    assignedDate: "2025-10-09",
    submissions: {
      "STU-8A-001": { status: "submitted", score: 10, note: "ធ្វើបានល្អឥតខ្ចោះ" },
      "STU-8A-002": { status: "submitted", score: 9.5, note: "ល្អណាស់" },
      "STU-8A-003": { status: "submitted", score: 9, note: "ល្អ" },
      "STU-8A-004": { status: "submitted", score: 8.5, note: "" },
      "STU-8A-020": { status: "pending", score: 0, note: "" },
      "STU-8A-040": { status: "pending", score: 0, note: "" }
    }
  },
  {
    id: "HW-002",
    subjectId: "khmer",
    subjectName: "ភាសាខ្មែរ",
    title: "តែងសេចក្តីពិពណ៌នាអំពីទិដ្ឋភាពភូមិឋានខ្មែរ",
    description: "សរសេរតែងសេចក្តីប្រវែងយ៉ាងតិច ២០ បន្ទាត់ តាមកម្រងសំណួរណែនាំ។",
    dueDate: "2025-10-16",
    assignedDate: "2025-10-09",
    submissions: {
      "STU-8A-001": { status: "submitted", score: 9.5, note: "អក្សរស្អាត គំនិតក្បោះក្បាយ" },
      "STU-8A-003": { status: "submitted", score: 10, note: "អស្ចារ្យ" }
    }
  }
];

// Weekly Timetable (វេនព្រឹក & វេនរសៀល/ល្ងាច - គ្មានម៉ោងសម្រាក)
const SEED_TIMETABLE = [
  // --- វេនព្រឹក (Morning Shift: 07:00 - 11:15) ---
  {
    shift: "morning",
    period: 1,
    time: "07:00 - 07:45",
    mon: { subject: "ភាសាខ្មែរ", teacher: "អ្នកគ្រូ កែវ មុនី" },
    tue: { subject: "គណិតវិទ្យា", teacher: "លោកគ្រូ សុខ ចាន់ថា" },
    wed: { subject: "រូបវិទ្យា", teacher: "លោកគ្រូ ហេង ពិសិដ្ឋ" },
    thu: { subject: "ភាសាខ្មែរ", teacher: "អ្នកគ្រូ កែវ មុនី" },
    fri: { subject: "គណិតវិទ្យា", teacher: "លោកគ្រូ សុខ ចាន់ថា" },
    sat: { subject: "សីលធម៌", teacher: "អ្នកគ្រូ ជា វណ្ណា" }
  },
  {
    shift: "morning",
    period: 2,
    time: "07:45 - 08:30",
    mon: { subject: "ភាសាខ្មែរ", teacher: "អ្នកគ្រូ កែវ មុនី" },
    tue: { subject: "គណិតវិទ្យា", teacher: "លោកគ្រូ សុខ ចាន់ថា" },
    wed: { subject: "គីមីវិទ្យា", teacher: "អ្នកគ្រូ ចាន់ ស្រីមុំ" },
    thu: { subject: "ប្រវត្តិវិទ្យា", teacher: "លោកគ្រូ វ៉ាន់ សុធា" },
    fri: { subject: "ភាសាអង់គ្លេស", teacher: "លោកគ្រូ រ័ត្ន ដារ៉ូ" },
    sat: { subject: "កីឡា", teacher: "លោកគ្រូ គង់ វិចិត្រ" }
  },
  {
    shift: "morning",
    period: 3,
    time: "08:30 - 09:15",
    mon: { subject: "គណិតវិទ្យា", teacher: "លោកគ្រូ សុខ ចាន់ថា" },
    tue: { subject: "ជីវវិទ្យា", teacher: "អ្នកគ្រូ អ៊ឹង សុផល" },
    wed: { subject: "ភាសាអង់គ្លេស", teacher: "លោកគ្រូ រ័ត្ន ដារ៉ូ" },
    thu: { subject: "ភូមិវិទ្យា", teacher: "អ្នកគ្រូ ម៉ៅ រតនា" },
    fri: { subject: "រូបវិទ្យា", teacher: "លោកគ្រូ ហេង ពិសិដ្ឋ" },
    sat: { subject: "ICT កុំព្យូទ័រ", teacher: "លោកគ្រូ គង់ វិចិត្រ" }
  },
  {
    shift: "morning",
    period: 4,
    time: "09:30 - 10:15",
    mon: { subject: "ផែនដីវិទ្យា", teacher: "លោកគ្រូ លី គឹមសាន" },
    tue: { subject: "ប្រវត្តិវិទ្យា", teacher: "លោកគ្រូ វ៉ាន់ សុធា" },
    wed: { subject: "ភាសាខ្មែរ", teacher: "អ្នកគ្រូ កែវ មុនី" },
    thu: { subject: "ជីវវិទ្យា", teacher: "អ្នកគ្រូ អ៊ឹង សុផល" },
    fri: { subject: "គីមីវិទ្យា", teacher: "អ្នកគ្រូ ចាន់ ស្រីមុំ" },
    sat: { subject: "ស្វ័យសិក្សា/សិល្បៈ", teacher: "លោកគ្រូ សុខ ចាន់ថា" }
  },
  {
    shift: "morning",
    period: 5,
    time: "10:15 - 11:00",
    mon: { subject: "ភាសាអង់គ្លេស", teacher: "លោកគ្រូ រ័ត្ន ដារ៉ូ" },
    tue: { subject: "សីលធម៌", teacher: "អ្នកគ្រូ ជា វណ្ណា" },
    wed: { subject: "គណិតវិទ្យា", teacher: "លោកគ្រូ សុខ ចាន់ថា" },
    thu: { subject: "រូបវិទ្យា", teacher: "លោកគ្រូ ហេង ពិសិដ្ឋ" },
    fri: { subject: "ភាសាខ្មែរ", teacher: "អ្នកគ្រូ កែវ មុនី" },
    sat: { subject: "គេហវិទ្យា", teacher: "អ្នកគ្រូ ឡុង ស្រីពៅ" }
  },

  // --- វេនរសៀល/ល្ងាច (Afternoon Shift: 13:00 - 17:15) ---
  {
    shift: "afternoon",
    period: 1,
    time: "13:00 - 13:45",
    mon: { subject: "គណិតវិទ្យា", teacher: "លោកគ្រូ សុខ ចាន់ថា" },
    tue: { subject: "ភាសាខ្មែរ", teacher: "អ្នកគ្រូ កែវ មុនី" },
    wed: { subject: "គណិតវិទ្យា", teacher: "លោកគ្រូ សុខ ចាន់ថា" },
    thu: { subject: "ភាសាខ្មែរ", teacher: "អ្នកគ្រូ កែវ មុនី" },
    fri: { subject: "គីមីវិទ្យា", teacher: "អ្នកគ្រូ ចាន់ ស្រីមុំ" },
    sat: { subject: "ភូមិវិទ្យា", teacher: "អ្នកគ្រូ ម៉ៅ រតនា" }
  },
  {
    shift: "afternoon",
    period: 2,
    time: "13:45 - 14:30",
    mon: { subject: "រូបវិទ្យា", teacher: "លោកគ្រូ ហេង ពិសិដ្ឋ" },
    tue: { subject: "គីមីវិទ្យា", teacher: "អ្នកគ្រូ ចាន់ ស្រីមុំ" },
    wed: { subject: "ភាសាអង់គ្លេស", teacher: "លោកគ្រូ រ័ត្ន ដារ៉ូ" },
    thu: { subject: "រូបវិទ្យា", teacher: "លោកគ្រូ ហេង ពិសិដ្ឋ" },
    fri: { subject: "ជីវវិទ្យា", teacher: "អ្នកគ្រូ អ៊ឹង សុផល" },
    sat: { subject: "សីលធម៌", teacher: "អ្នកគ្រូ ជា វណ្ណា" }
  },
  {
    shift: "afternoon",
    period: 3,
    time: "14:45 - 15:30",
    mon: { subject: "ភាសាខ្មែរ", teacher: "អ្នកគ្រូ កែវ មុនី" },
    tue: { subject: "ប្រវត្តិវិទ្យា", teacher: "លោកគ្រូ វ៉ាន់ សុធា" },
    wed: { subject: "ភូមិវិទ្យា", teacher: "អ្នកគ្រូ ម៉ៅ រតនា" },
    thu: { subject: "គណិតវិទ្យា", teacher: "លោកគ្រូ សុខ ចាន់ថា" },
    fri: { subject: "ភាសាខ្មែរ", teacher: "អ្នកគ្រូ កែវ មុនី" },
    sat: { subject: "ភាសាអង់គ្លេស", teacher: "លោកគ្រូ រ័ត្ន ដារ៉ូ" }
  },
  {
    shift: "afternoon",
    period: 4,
    time: "15:30 - 16:15",
    mon: { subject: "ភាសាអង់គ្លេស", teacher: "លោកគ្រូ រ័ត្ន ដារ៉ូ" },
    tue: { subject: "ជីវវិទ្យា", teacher: "អ្នកគ្រូ អ៊ឹង សុផល" },
    wed: { subject: "ផែនដីវិទ្យា", teacher: "លោកគ្រូ លី គឹមសាន" },
    thu: { subject: "ICT កុំព្យូទ័រ", teacher: "លោកគ្រូ គង់ វិចិត្រ" },
    fri: { subject: "ប្រវត្តិវិទ្យា", teacher: "លោកគ្រូ វ៉ាន់ សុធា" },
    sat: { subject: "គណិតវិទ្យា", teacher: "លោកគ្រូ សុខ ចាន់ថា" }
  },
  {
    shift: "afternoon",
    period: 5,
    time: "16:15 - 17:00",
    mon: { subject: "កីឡា", teacher: "លោកគ្រូ គង់ វិចិត្រ" },
    tue: { subject: "ស្វ័យសិក្សា/ស្រាវជ្រាវ", teacher: "លោកគ្រូ សុខ ចាន់ថា" },
    wed: { subject: "គេហវិទ្យា", teacher: "អ្នកគ្រូ ឡុង ស្រីពៅ" },
    thu: { subject: "កីឡា", teacher: "លោកគ្រូ គង់ វិចិត្រ" },
    fri: { subject: "ស្វ័យសិក្សា/ក្លឹប", teacher: "លោកគ្រូ សុខ ចាន់ថា" },
    sat: { subject: "សិល្បៈ/តន្ត្រី", teacher: "អ្នកគ្រូ កែវ មុនី" }
  }
];

// Discipline Log
const SEED_DISCIPLINE_RECORDS = [
  {
    id: "DISC-001",
    studentId: "STU-8A-001",
    studentName: "សុខា មុនីរត្ន",
    type: "praise",
    date: "2025-10-06",
    title: "ជួយបង្រៀនមិត្តភក្តិលើមុខវិជ្ជាគណិតវិទ្យា",
    notes: "មានស្មារតីសាមគ្គីភាព និងជួយពន្យល់លំហាត់មិត្តរួមថ្នាក់បានយ៉ាងក្បោះក្បាយ។"
  },
  {
    id: "DISC-002",
    studentId: "STU-8A-004",
    studentName: "គង់ រតនៈ",
    type: "praise",
    date: "2025-10-04",
    title: "សកម្មភាពស្ម័គ្រចិត្តសម្អាតថ្នាក់រៀន",
    notes: "បានចូលរួមដឹកនាំក្រុមអនាម័យថ្នាក់រៀន ទទួលបានការកោតសរសើរពីគណៈគ្រប់គ្រង។"
  },
  {
    id: "DISC-003",
    studentId: "STU-8A-020",
    studentName: "ម៉ី ពិសាល",
    type: "warning",
    date: "2025-10-03",
    title: "មកយឺតម៉ោងគោរពទង់ជាតិ ២ ដង",
    notes: "បានណែនាំ និងធ្វើកិច្ចសន្យាកែប្រែកុំឱ្យមកយឺតបន្តទៀត។"
  },
  {
    id: "DISC-004",
    studentId: "STU-8A-040",
    studentName: "វ៉ា គឹមហេង",
    type: "parent_contact",
    date: "2025-10-02",
    title: "ទូរស័ព្ទពិភាក្សាជាមួយអាណាព្យាបាលរឿងកិច្ចការផ្ទះ",
    notes: "បានទាក់ទងលោកឪពុកដើម្បីជួយតាមដានការធ្វើស្វ័យសិក្សា និងកិច្ចការផ្ទះពេលយប់។"
  }
];

// Seed Student Health & BMI Records (សុខភាព និងការលូតលាស់)
const SEED_HEALTH_RECORDS = {
  "STU-8A-001": { height: 152, weight: 42, bloodType: "O+", allergies: "គ្មាន", vision: "ធម្មតា (10/10)", lastCheckup: "2025-09-15" },
  "STU-8A-002": { height: 158, weight: 46, bloodType: "A+", allergies: "គ្មាន", vision: "ធម្មតា (10/10)", lastCheckup: "2025-09-15" },
  "STU-8A-003": { height: 150, weight: 39, bloodType: "B+", allergies: "អាឡែហ្ស៊ីគ្រឿងសមុទ្រ", vision: "ពាក់វ៉ែនតា (8/10)", lastCheckup: "2025-09-15" },
  "STU-8A-004": { height: 160, weight: 48, bloodType: "O+", allergies: "គ្មាន", vision: "ធម្មតា (10/10)", lastCheckup: "2025-09-15" },
  "STU-8A-005": { height: 154, weight: 43, bloodType: "AB+", allergies: "គ្មាន", vision: "ធម្មតា (10/10)", lastCheckup: "2025-09-15" },
  "STU-8A-006": { height: 156, weight: 45, bloodType: "O+", allergies: "គ្មាន", vision: "ធម្មតា (10/10)", lastCheckup: "2025-09-15" },
  "STU-8A-007": { height: 149, weight: 38, bloodType: "A+", allergies: "គ្មាន", vision: "ធម្មតា (10/10)", lastCheckup: "2025-09-15" },
  "STU-8A-008": { height: 162, weight: 51, bloodType: "B+", allergies: "គ្មាន", vision: "ធម្មតា (10/10)", lastCheckup: "2025-09-15" }
};

// Seed Classroom Election (ការបោះឆ្នោតប្រធានថ្នាក់)
const SEED_ELECTIONS = [
  {
    id: "ELEC-2025-01",
    title: "ការបោះឆ្នោតជ្រើសរើសប្រធានថ្នាក់ទី ៨ A ដើមឆ្នាំសិក្សា",
    date: "2025-10-02",
    status: "completed",
    totalVoters: 42,
    candidates: [
      { studentId: "STU-8A-001", name: "សុខា មុនីរត្ន", votes: 24, percentage: 57.1, elected: true },
      { studentId: "STU-8A-002", name: "ចាន់ សុភ័ក្ត្រ", votes: 12, percentage: 28.6, elected: false },
      { studentId: "STU-8A-004", name: "គង់ រតនៈ", votes: 6, percentage: 14.3, elected: false }
    ]
  }
];

// Feature 1: SEED_GAMIFICATION (ប្រព័ន្ធផ្កាយលើកទឹកចិត្ត & Badges)
const SEED_GAMIFICATION = {
  badges: [
    { id: "quick_answer", name: "ឆ្លើយសំនួររហ័ស", icon: "🚀", points: 2, color: "#3b82f6", desc: "ស្ម័គ្រចិត្ត និងឆ្លើយសំនួរបានត្រឹមត្រូវរហ័ស" },
    { id: "discipline", name: "វិន័យ & ស្អាតបាត", icon: "🌟", points: 3, color: "#eab308", desc: "គោរពវិន័យថ្នាក់ និងតុអង្គុយស្អាតបាត" },
    { id: "teamwork", name: "ជួយមិត្តភក្តិ", icon: "🤝", points: 3, color: "#10b981", desc: "ជួយពន្យល់មេរៀន និងសហការជាក្រុមល្អ" },
    { id: "leadership", name: "ភាពជាអ្នកដឹកនាំ", icon: "👑", points: 5, color: "#f59e0b", desc: "ដឹកនាំក្រុមការងារ និងសម្របសម្រួលសកម្មភាព" },
    { id: "creative", name: "គំនិតច្នៃប្រឌិត", icon: "🎨", points: 3, color: "#8b5cf6", desc: "មានដំណោះស្រាយច្នៃប្រឌិត និងគំនិតថ្មី" },
    { id: "hardworking", name: "ឧស្សាហ៍ព្យាយាម", icon: "📚", points: 4, color: "#06b6d4", desc: "ខិតខំស្រាវជ្រាវ និងស្វ័យសិក្សាជាប់លាប់" },
    { id: "on_time", name: "មកទាន់ពេលវេលា", icon: "⚡", points: 2, color: "#ec4899", desc: "មកដល់សាលា និងចូលថ្នាក់មុនម៉ោង" },
    { id: "homework_star", name: "កិច្ចការផ្ទះឥតខ្ចោះ", icon: "🏆", points: 5, color: "#f43f5e", desc: "ធ្វើកិច្ចការផ្ទះបានពិន្ទុពេញ និងទាន់ពេល" }
  ],
  studentStars: {
    "STU-8A-001": { totalStars: 48, streak: 7, badges: { "quick_answer": 6, "discipline": 4, "teamwork": 3, "leadership": 2, "homework_star": 3 } },
    "STU-8A-002": { totalStars: 39, streak: 5, badges: { "quick_answer": 5, "teamwork": 4, "hardworking": 3, "on_time": 4 } },
    "STU-8A-003": { totalStars: 42, streak: 6, badges: { "discipline": 5, "creative": 4, "homework_star": 3, "teamwork": 2 } },
    "STU-8A-004": { totalStars: 35, streak: 4, badges: { "leadership": 3, "discipline": 3, "on_time": 5 } },
    "STU-8A-005": { totalStars: 31, streak: 3, badges: { "hardworking": 4, "teamwork": 3, "quick_answer": 3 } },
    "STU-8A-006": { totalStars: 28, streak: 3, badges: { "creative": 3, "discipline": 3, "on_time": 4 } },
    "STU-8A-007": { totalStars: 33, streak: 4, badges: { "homework_star": 3, "hardworking": 3, "teamwork": 3 } },
    "STU-8A-008": { totalStars: 25, streak: 2, badges: { "quick_answer": 4, "on_time": 3 } }
  },
  history: [
    { id: "STAR-001", studentId: "STU-8A-001", studentName: "សុខា មុនីរត្ន", badgeId: "quick_answer", badgeName: "ឆ្លើយសំនួររហ័ស", icon: "🚀", points: 2, date: "2025-10-09 08:30" },
    { id: "STAR-002", studentId: "STU-8A-004", studentName: "គង់ រតនៈ", badgeId: "discipline", badgeName: "វិន័យ & ស្អាតបាត", icon: "🌟", points: 3, date: "2025-10-09 09:15" },
    { id: "STAR-003", studentId: "STU-8A-002", studentName: "ចាន់ សុភ័ក្ត្រ", badgeId: "teamwork", badgeName: "ជួយមិត្តភក្តិ", icon: "🤝", points: 3, date: "2025-10-08 10:20" }
  ]
};

// Feature 2: SEED_FUND (មូលនិធិថ្នាក់រៀន & ចំណូល-ចំណាយ)
const SEED_FUND = {
  currency: "KHR",
  transactions: [
    { id: "TRX-001", date: "2025-10-01", type: "income", amount: 210000, category: "វិភាគទានថ្នាក់", description: "វិភាគទានមូលនិធិថ្នាក់រៀនប្រចាំខែតុលា (៤២ នាក់ x ៥០០០ ៛)", recordedBy: "គណនេយ្យករថ្នាក់" },
    { id: "TRX-002", date: "2025-10-03", type: "expense", amount: 45000, category: "សម្ភារៈថ្នាក់", description: "ទិញហ្វឺតសរសេរក្តារខៀន ទឹកអាល់កុល និងក្រដាសជូត", recordedBy: "ប្រធានថ្នាក់" },
    { id: "TRX-003", date: "2025-10-05", type: "expense", amount: 30000, category: "អនាម័យ & បរិស្ថាន", description: "ទិញធុងសំរាមថ្មី និងផ្កាតុលោកគ្រូ", recordedBy: "គណៈកម្មការអនាម័យ" },
    { id: "TRX-004", date: "2025-10-07", type: "income", amount: 100000, category: "សប្បុរសជន", description: "ការឧបត្ថម្ភលើកទឹកចិត្តពីអាណាព្យាបាលសិស្ស", recordedBy: "លោកគ្រូបន្ទុកថ្នាក់" },
    { id: "TRX-005", date: "2025-10-08", type: "expense", amount: 25000, category: "សង្គមកិច្ច & សុខភាព", description: "ទិញប្រេងកូឡា និងថ្នាំសង្គ្រោះបឋមប្រចាំថ្នាក់", recordedBy: "គណៈកម្មការសុខភាព" }
  ]
};

// Feature 3: SEED_LOGBOOK (សៀវភៅកិច្ចតែងការ & កំណត់ត្រាបង្រៀន)
const SEED_LOGBOOK = [
  {
    id: "LOG-001",
    date: "2025-10-09",
    timeSlot: "07:00 - 08:30",
    subjectId: "math",
    subjectName: "គណិតវិទ្យា",
    teacher: "លោកគ្រូ សុខ ចាន់ថា",
    chapter: "ជំពូកទី ២៖ សមីការដឺក្រេទី១ មានមួយអញ្ញាត",
    objective: "សិស្សយល់ច្បាស់ពីទម្រង់ទូទៅ ax + b = 0 និងចេះអនុវត្តដោះស្រាយលើលំហាត់ជាក់ស្តែង",
    activities: "ពន្យល់ទ្រឹស្តី ១៥នាទី, ដាក់លំហាត់ជាក្រុម ២០នាទី, សិស្សឡើងដោះស្រាយលើក្តារខៀន ៣០នាទី",
    homework: "លំហាត់ទំព័រទី ៤៥ លេខ ១, ២, ៣ ក្នុងសៀវភៅពុម្ពក្រសួង",
    absentCount: 2,
    reflection: "សិស្សភាគច្រើនយល់បានល្អ នៅមានសិស្ស ២-៣ នាក់ត្រូវការការពន្យល់បន្ថែមលើការប្តូរសញ្ញាពេលផ្ទេរអង្គ។"
  },
  {
    id: "LOG-002",
    date: "2025-10-08",
    timeSlot: "08:45 - 09:30",
    subjectId: "khmer",
    subjectName: "ភាសាខ្មែរ",
    teacher: "អ្នកគ្រូ កែវ មុនី",
    chapter: "មេរៀនទី ៣៖ វេយ្យាករណ៍ខ្មែរ - ឈ្នាប់ និងកន្សោមនាម",
    objective: "សិស្សចេះបែងចែកឈ្នាប់ចម្លង និងឈ្នាប់ផ្គួបក្នុងប្រយោគ និងចេះប្រើប្រាស់ត្រឹមត្រូវ",
    activities: "អានអត្ថបទគំរូ និងស្រង់កន្សោមឈ្នាប់មកវិភាគជាក្រុម",
    homework: "តែងប្រយោគដោយប្រើឈ្នាប់ចំនួន ៥ ប្រយោគក្នុងសៀវភៅកិច្ចការ",
    absentCount: 1,
    reflection: "ដំណើរការរលូន សិស្សចូលរួមឆ្លើយសំនួរផុសផុល និងចេះតែងប្រយោគបានល្អ។"
  },
  {
    id: "LOG-003",
    date: "2025-10-07",
    timeSlot: "09:45 - 10:30",
    subjectId: "phys",
    subjectName: "រូបវិទ្យា",
    teacher: "លោកគ្រូ ហេង ពិសិដ្ឋ",
    chapter: "ជំពូកទី ១៖ ចលនាត្រង់ស្មើ និងល្បឿនមធ្យម",
    objective: "សិស្សចេះគណនាល្បឿនមធ្យម v = s / t និងបំប្លែងខ្នាត km/h ទៅ m/s",
    activities: "បង្ហាញឧទាហរណ៍ជាក់ស្តែងលើចលនារថយន្ត និងអនុវត្តគណនាលំហាត់",
    homework: "លំហាត់គំរូទំព័រ ២៨ លេខ ៤ និង ៥",
    absentCount: 0,
    reflection: "សិស្សមកគ្រប់ចំនួន និងចាប់អារម្មណ៍ខ្ពស់លើការបំប្លែងខ្នាតល្បឿន។"
  }
];

// Feature 4: SEED_RESOURCES (ឃ្លាំងឯកសារមេរៀន & E-Library)
const SEED_RESOURCES = [
  {
    id: "RES-001",
    title: "រូបមន្តសង្ខេបគណិតវិទ្យា ថ្នាក់ទី ៨ (PDF ផ្លូវការ)",
    subjectId: "math",
    subjectName: "គណិតវិទ្យា",
    type: "pdf",
    size: "2.4 MB",
    date: "2025-10-05",
    author: "លោកគ្រូ សុខ ចាន់ថា",
    url: "#",
    downloads: 38,
    desc: "កម្រងរូបមន្តពិជគណិត និងធរណីមាត្រពេញលេញសម្រាប់ឆមាសទី១"
  },
  {
    id: "RES-002",
    title: "Slide បទបង្ហាញ៖ ច្បាប់ចលនាញូតុន និងកម្លាំង (Physics)",
    subjectId: "phys",
    subjectName: "រូបវិទ្យា",
    type: "slide",
    size: "5.1 MB",
    date: "2025-10-04",
    author: "លោកគ្រូ ហេង ពិសិដ្ឋ",
    url: "#",
    downloads: 29,
    desc: "ស្លាយមេរៀនរូបវិទ្យាជំពូកទី ១ មានរូបភាពចលនាងាយយល់ និងគំនូសបំព្រួញ"
  },
  {
    id: "RES-003",
    title: "វីដេអូពិសោធន៍គីមីវិទ្យា៖ ប្រតិកម្មអាស៊ីត និងបាស",
    subjectId: "chem",
    subjectName: "គីមីវិទ្យា",
    type: "video",
    size: "YouTube HD",
    date: "2025-10-02",
    author: "អ្នកគ្រូ ចាន់ ស្រីមុំ",
    url: "https://www.youtube.com",
    downloads: 41,
    desc: "វីដេអូបង្ហាញពីការប្តូរពណ៌ក្រដាសលីតមុស និងសុវត្ថិភាពក្នុងបន្ទប់ពិសោធន៍"
  },
  {
    id: "RES-004",
    title: "កម្រងលំហាត់អក្សរសិល្ប៍ និងតែងសេចក្តីគំរូ ថ្នាក់ទី ៨",
    subjectId: "khmer",
    subjectName: "ភាសាខ្មែរ",
    type: "worksheet",
    size: "1.8 MB",
    date: "2025-10-01",
    author: "អ្នកគ្រូ កែវ មុនី",
    url: "#",
    downloads: 35,
    desc: "អត្ថបទតែងសេចក្តីពណ៌នាគំរូ និងកម្រងពាក្យគន្លឹះតែងសេចក្តីកម្រិតអនុវិទ្យាល័យ"
  }
];

