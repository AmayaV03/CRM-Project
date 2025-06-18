export default {
  // Navigation
  nav: {
    dashboard: 'لوحة التحكم',
    leads: 'العملاء المحتملين',
    kanban: 'لوحة كانبان',
    reports: 'التقارير',
    settings: 'الإعدادات',
    admin: 'لوحة الإدارة',
    profile: 'الملف الشخصي',
    logout: 'تسجيل خروج',
  },

  // Common terms
  common: {
    name: 'الاسم',
    email: 'البريد الإلكتروني',
    phone: 'الهاتف',
    source: 'المصدر',
    status: 'الحالة',
    owner: 'المسؤول',
    actions: 'الإجراءات',
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    add: 'إضافة',
    create: 'إنشاء',
    update: 'تحديث',
    search: 'بحث',
    filter: 'تصفية',
    sort: 'ترتيب',
    reset: 'إعادة تعيين',
    confirm: 'تأكيد',
    loading: 'جاري التحميل...',
    error: 'خطأ',
    success: 'نجح',
    warning: 'تحذير',
    info: 'معلومة',
    yes: 'نعم',
    no: 'لا',
    submit: 'إرسال',
    close: 'إغلاق',
    open: 'فتح',
    view: 'عرض',
    export: 'تصدير',
    import: 'استيراد',
    backup: 'نسخ احتياطي',
    restore: 'استعادة',
    unknown: 'غير معروف',
    noCompany: 'لا توجد شركة',
    notSet: 'غير محدد',
    unassigned: 'غير معين',
  },

  // Dashboard
  dashboard: {
    title: 'لوحة التحكم',
    welcome: {
      title: 'مرحباً بك في لوحة تحكم CRM',
      subtitle: 'إدارة العملاء المحتملين وتتبع تقدمك',
      description: 'نظام إدارة العملاء المحتملين الذكي جاهز لتحويل رحلة مبيعاتك. ابدأ بإضافة العملاء المحتملين واستكشاف الميزات وتسريع نمو أعمالك.',
      getStarted: '🚀 ابدأ الآن',
      viewAnalytics: '📊 عرض التحليلات'
    },
    newLeads: 'العملاء المحتملين الجدد',
    coldLeads: 'عملاء محتملين باردين',
    conversionRate: 'معدل التحويل',
    lostLeads: 'عملاء محتملين مفقودين',
    thisWeek: 'هذا الأسبوع',
    leadSourceDistribution: 'توزيع مصادر العملاء المحتملين',
    leadStatusDistribution: 'توزيع حالات العملاء المحتملين',
    noData: 'لا توجد بيانات متاحة',
    metrics: {
      totalLeads: 'إجمالي العملاء المحتملين',
      newThisWeek: 'جديد هذا الأسبوع',
      converted: 'تم التحويل',
      lost: 'مفقود',
      cold: 'بارد',
    },
  },

  // Leads
  leads: {
    title: 'إدارة العملاء المحتملين',
    addNew: 'إضافة عميل محتمل جديد',
    editLead: 'تعديل عميل محتمل',
    leadDetails: 'تفاصيل العميل المحتمل',
    allLeads: 'جميع العملاء المحتملين',
    myLeads: 'عملائي المحتملين',
    fields: {
      name: 'الاسم الكامل',
      email: 'عنوان البريد الإلكتروني',
      phone: 'رقم الهاتف',
      source: 'مصدر العميل المحتمل',
      status: 'الحالة',
      owner: 'المسؤول المعين',
      notes: 'الملاحظات',
      createdAt: 'تاريخ الإنشاء',
      updatedAt: 'آخر تحديث',
      lastActivity: 'آخر نشاط',
    },
    placeholders: {
      name: 'أدخل الاسم الكامل',
      email: 'أدخل عنوان البريد الإلكتروني',
      phone: 'أدخل رقم الهاتف',
      notes: 'أضف ملاحظات أو تعليقات',
      search: 'البحث عن العملاء المحتملين بالاسم أو البريد الإلكتروني أو الهاتف',
    },
    validation: {
      nameRequired: 'الاسم مطلوب',
      emailRequired: 'البريد الإلكتروني مطلوب',
      emailInvalid: 'يرجى إدخال عنوان بريد إلكتروني صحيح',
      phoneRequired: 'رقم الهاتف مطلوب',
      phoneInvalid: 'يرجى إدخال رقم هاتف صحيح',
      sourceRequired: 'مصدر العميل المحتمل مطلوب',
      ownerRequired: 'مسؤول العميل المحتمل مطلوب',
    },
    messages: {
      created: 'تم إنشاء العميل المحتمل بنجاح',
      updated: 'تم تحديث العميل المحتمل بنجاح',
      deleted: 'تم حذف العميل المحتمل بنجاح',
      duplicateWarning: 'يوجد عميل محتمل بهذا البريد الإلكتروني أو الهاتف',
      deleteConfirm: 'هل أنت متأكد من رغبتك في حذف هذا العميل المحتمل؟',
      assignConfirm: 'هل أنت متأكد من رغبتك في إعادة تعيين هذا العميل المحتمل؟',
    },
    statuses: {
      'New': 'جديد',
      'Contacted': 'تم الاتصال',
      'Follow-up': 'متابعة',
      'Won': 'فوز',
      'Lost': 'خسارة',
      'Cold': 'بارد'
    },
    sources: {
      'Website': 'موقع ويب',
      'Referral': 'إحالة',
      'Email Campaign': 'حملة بريد إلكتروني',
      'Social Media': 'وسائل التواصل الاجتماعي',
      'Phone Call': 'مكالمة هاتفية',
      'Trade Show': 'معرض تجاري',
      'LinkedIn': 'لينكد إن',
      'Advertisement': 'إعلان',
      'Other': 'أخرى'
    },
    table: {
      name: 'الاسم',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      source: 'المصدر',
      status: 'الحالة',
      owner: 'المالك',
      actions: 'الإجراءات'
    },
  },

  // Kanban Board
  kanban: {
    title: 'لوحة كانبان',
    subtitle: 'تصور وإدارة عملائك المحتملين ببساطة السحب والإفلات',
    dragToMove: 'اسحب العملاء المحتملين لتغيير الحالة',
    noLeads: 'لا توجد عملاء محتملين في هذا العمود',
    leadCount: '{count} عملاء محتملين',
    addToColumn: 'إضافة عميل محتمل إلى {status}',
    moveConfirm: 'نقل {leadName} إلى {status}؟',
    columnActions: {
      addLead: 'إضافة عميل محتمل',
      settings: 'إعدادات العمود',
      hide: 'إخفاء العمود',
    },
    columns: {
      new: 'جديد',
      contacted: 'تم الاتصال',
      inProgress: 'قيد التقدم',
      converted: 'فوز',
      lost: 'خسارة',
    },
    statuses: {
      new: 'جديد',
      contacted: 'تم الاتصال',
      inProgress: 'قيد التقدم',
      converted: 'تم التحويل',
      won: 'فوز',
      lost: 'خسارة',
    },
    messages: {
      noLeadsInColumn: 'لا توجد عملاء محتملين {status}',
      lead: 'عميل محتمل',
      leads: 'عملاء محتملين',
    },
    dealSize: 'حجم الصفقة',
    winProbability: 'احتمالية الفوز',
    expectedClose: 'التاريخ المتوقع للإغلاق',
    followUp: 'متابعة',
  },

  // Reports
  reports: {
    title: 'التقارير والتحليلات',
    overview: 'نظرة عامة',
    performance: 'الأداء',
    sources: 'مصادر العملاء المحتملين',
    conversion: 'قمع التحويل',
    noData: 'لا توجد بيانات متاحة',
    filters: {
      dateRange: 'نطاق التاريخ',
      owner: 'مسؤول العميل المحتمل',
      source: 'مصدر العميل المحتمل',
      status: 'الحالة',
      apply: 'تطبيق المرشحات',
      clear: 'مسح المرشحات',
    },
    charts: {
      leadsOverTime: 'العملاء المحتملين عبر الزمن',
      conversionRate: 'معدل التحويل',
      sourcePerformance: 'أداء المصدر',
      ownerPerformance: 'أداء المسؤول',
    },
    export: {
      pdf: 'تصدير كـ PDF',
      excel: 'تصدير كـ Excel',
      csv: 'تصدير كـ CSV',
    },
  },

  // Authentication
  auth: {
    login: 'تسجيل دخول',
    logout: 'تسجيل خروج',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    forgotPassword: 'نسيت كلمة المرور؟',
    rememberMe: 'تذكرني',
    loginButton: 'تسجيل الدخول',
    loginSuccess: 'تم تسجيل الدخول بنجاح',
    loginError: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
    logoutSuccess: 'تم تسجيل الخروج بنجاح',
    sessionExpired: 'انتهت صلاحية جلستك. يرجى تسجيل الدخول مرة أخرى.',
  },

  // Errors
  errors: {
    generic: 'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
    network: 'خطأ في الشبكة. يرجى التحقق من اتصالك.',
    validation: 'يرجى التحقق من إدخالك والمحاولة مرة أخرى.',
    unauthorized: 'غير مخول لك تنفيذ هذا الإجراء.',
    notFound: 'المورد المطلوب غير موجود.',
    conflict: 'هذه العملية تتعارض مع البيانات الموجودة.',
    storage: 'خطأ في التخزين المحلي. يرجى التحقق من إعدادات متصفحك.',
    export: 'فشل التصدير. يرجى المحاولة مرة أخرى.',
    import: 'فشل الاستيراد. يرجى التحقق من صيغة ملفك.',
  },

  // Date/Time
  datetime: {
    today: 'اليوم',
    yesterday: 'أمس',
    tomorrow: 'غداً',
    thisWeek: 'هذا الأسبوع',
    lastWeek: 'الأسبوع الماضي',
    thisMonth: 'هذا الشهر',
    lastMonth: 'الشهر الماضي',
    thisYear: 'هذا العام',
    ago: 'منذ {time}',
    minutes: 'دقائق',
    hours: 'ساعات',
    days: 'أيام',
    weeks: 'أسابيع',
    months: 'أشهر',
    years: 'سنوات',
  },

  // Validation messages
  validation: {
    required: 'هذا الحقل مطلوب',
    email: 'يرجى إدخال عنوان بريد إلكتروني صحيح',
    phone: 'يرجى إدخال رقم هاتف صحيح',
    url: 'يرجى إدخال رابط صحيح',
    minLength: 'يجب أن يكون على الأقل {min} أحرف',
    maxLength: 'يجب ألا يزيد عن {max} أحرف',
    min: 'يجب أن يكون على الأقل {min}',
    max: 'يجب ألا يزيد عن {max}',
    pattern: 'صيغة غير صحيحة',
  },

  // Profile
  profile: {
    title: 'الملف الشخصي',
    subtitle: 'إدارة معلومات حسابك',
    information: 'معلومات الملف الشخصي',
    security: 'الأمان',
    department: 'القسم',
    changePassword: 'تغيير كلمة المرور',
    currentPassword: 'كلمة المرور الحالية',
    newPassword: 'كلمة المرور الجديدة',
    confirmPassword: 'تأكيد كلمة المرور',
    passwordChanged: 'تم تغيير كلمة المرور بنجاح',
    passwordError: 'فشل تغيير كلمة المرور',
    passwordMismatch: 'كلمات المرور الجديدة غير متطابقة',
    passwordLength: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل',
  },

  // Settings
  settings: {
    title: 'الإعدادات',
    language: 'اللغة',
    theme: 'المظهر',
    regional: 'الإعدادات الإقليمية',
    lightMode: 'الوضع الفاتح',
    darkMode: 'الوضع الداكن',
    tabs: {
      general: 'عام',
      leadStatuses: 'حالات العملاء المحتملين',
      leadSources: 'مصادر العملاء المحتملين',
      users: 'المستخدمين',
      preferences: 'التفضيلات',
    },
    general: {
      companyName: 'اسم الشركة',
      dateFormat: 'تنسيق التاريخ',
      timeFormat: 'تنسيق الوقت',
      timezone: 'المنطقة الزمنية',
      language: 'اللغة',
      currency: 'العملة',
    },
    leadStatuses: {
      add: 'إضافة حالة',
      edit: 'تعديل الحالة',
      name: 'اسم الحالة',
      color: 'اللون',
      order: 'ترتيب العرض',
      active: 'نشط',
      deleteConfirm: 'هل أنت متأكد من رغبتك في حذف هذه الحالة؟',
    },
    leadSources: {
      add: 'إضافة مصدر',
      edit: 'تعديل المصدر',
      name: 'اسم المصدر',
      active: 'نشط',
      deleteConfirm: 'هل أنت متأكد من رغبتك في حذف هذا المصدر؟',
    },
    users: {
      add: 'إضافة مستخدم',
      edit: 'تعديل المستخدم',
      name: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      role: 'الدور',
      active: 'نشط',
      deactivate: 'إلغاء التفعيل',
      activate: 'تفعيل',
      roles: {
        admin: 'مدير النظام',
        sales_manager: 'مدير المبيعات',
        salesperson: 'مندوب مبيعات',
      },
    },
    preferences: {
      title: 'التفضيلات',
      notifications: {
        title: 'الإشعارات',
        email: 'إشعارات البريد الإلكتروني',
        browser: 'إشعارات المتصفح',
        desktop: 'إشعارات سطح المكتب',
        sound: 'تنبيهات صوتية'
      },
      display: {
        title: 'إعدادات العرض',
        density: 'كثافة العرض',
        fontSize: 'حجم الخط',
        showAvatars: 'إظهار صور المستخدمين',
        showStatus: 'إظهار مؤشرات الحالة',
        densities: {
          compact: 'مضغوط',
          comfortable: 'مريح',
          spacious: 'واسع'
        },
        fontSizes: {
          small: 'صغير',
          medium: 'متوسط',
          large: 'كبير'
        }
      },
      data: {
        title: 'إعدادات البيانات',
        itemsPerPage: 'العناصر في الصفحة',
        defaultView: 'العرض الافتراضي',
        autoRefresh: 'تحديث تلقائي',
        refreshInterval: 'فاصل التحديث (دقائق)',
        views: {
          list: 'عرض القائمة',
          grid: 'عرض الشبكة',
          kanban: 'عرض كانبان'
        }
      },
      security: {
        title: 'إعدادات الأمان',
        twoFactor: 'المصادقة الثنائية',
        sessionTimeout: 'مهلة الجلسة (دقائق)',
        passwordExpiry: 'انتهاء صلاحية كلمة المرور (أيام)'
      }
    },
  },

  masterData: {
    title: 'إدارة البيانات الرئيسية',
    tabs: {
      statuses: 'حالات العملاء المحتملين',
      sources: 'مصادر العملاء المحتملين',
      categories: 'فئات العملاء المحتملين'
    },
    titles: {
      statuses: 'حالات العملاء المحتملين',
      sources: 'مصادر العملاء المحتملين',
      categories: 'فئات العملاء المحتملين'
    },
    status: {
      new: 'جديد',
      contacted: 'تم التواصل',
      qualified: 'مؤهل',
      proposal: 'عرض',
      negotiation: 'تفاوض',
      closed: 'مكتمل',
      lost: 'مفقود'
    },
    source: {
      website: 'الموقع الإلكتروني',
      referral: 'إحالة',
      social: 'وسائل التواصل الاجتماعي',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      other: 'أخرى'
    },
    category: {
      hot: 'ساخن',
      warm: 'دافئ',
      cold: 'بارد'
    },
    actions: {
      add: 'إضافة جديد'
    },
    dialog: {
      add: 'إضافة عنصر جديد',
      edit: 'تعديل العنصر',
      name: 'الاسم'
    }
  },

  admin: {
    title: 'لوحة الإدارة',
    dashboard: 'لوحة تحكم المسؤول',
    subtitle: 'إدارة المستخدمين وإعدادات النظام ومراقبة نشاطات المنصة',
    userStatisticsOverview: 'نظرة عامة على إحصائيات المستخدمين',
    quickActions: 'إجراءات سريعة',
    userRoles: {
      adminUsers: 'المستخدمون المسؤولون',
      salesManagers: 'مديرو المبيعات',
      salesReps: 'مندوبو المبيعات'
    },
    totalUsers: 'إجمالي المستخدمين',
    quickActionCards: {
      userManagement: 'إدارة المستخدمين',
      systemSettings: 'إعدادات النظام',
      securitySettings: 'إعدادات الأمان'
    },
    buttons: {
      manageUsers: 'إدارة المستخدمين',
      configure: 'تكوين',
      security: 'الأمان'
    },
    tabs: {
      overview: 'نظرة عامة',
      users: 'إدارة المستخدمين',
      system: 'إعدادات النظام',
      security: 'الأمان'
    },
    metrics: {
      totalUsers: 'إجمالي المستخدمين',
      adminAccounts: 'حسابات المسؤولين',
      salesManagement: 'أدوار إدارة المبيعات',
      salesRepresentatives: 'مندوبو المبيعات'
    },
    accessDenied: 'تم رفض الوصول: ليس لديك صلاحية للوصول إلى لوحة تحكم المسؤول.'
  },

  // Data translations (for company names, lead names, etc.)
  data: {
    companies: {
      'Tech Innovations': 'Tech Innovations',
      'TechCorp Solutions': 'TechCorp Solutions',
      'Digital Dynamics': 'Digital Dynamics',
      'Innovation Labs': 'Innovation Labs',
      'Future Systems': 'Future Systems',
      'StartupCorp': 'StartupCorp',
      'شركة المثال': 'Example Company',
      'حلول التقنية': 'Technology Solutions',
      'حلول رقمية': 'Digital Solutions',
      'تقنيات الابتكار': 'Innovation Technologies',
      'الابتكارات التقنية': 'Technical Innovations',
      'مشاريع التقنية': 'Technology Projects',
      'Innovate Tech': 'Innovate Tech',
      'Digital Solutions': 'Digital Solutions',
      'Tech Solutions': 'Tech Solutions',
      'Tech Ventures': 'Tech Ventures',
      'Example Corp': 'Example Corp',
      'Example Company': 'Example Company',
      'Technology Solutions': 'Technology Solutions',
      'Digital Solutions': 'Digital Solutions',
      'Innovation Technologies': 'Innovation Technologies',
      'Technical Innovations': 'Technical Innovations',
      'Technology Projects': 'Technology Projects',
    },
    leadNames: {
      'John Smith': 'John Smith',
      'Sarah Johnson': 'Sarah Johnson',
      'Michael Brown': 'Michael Brown',
      'Emily Davis': 'Emily Davis',
      'David Wilson': 'David Wilson',
      'Lisa Anderson': 'Lisa Anderson',
      'Robert Taylor': 'Robert Taylor',
      'Jennifer Martinez': 'Jennifer Martinez',
      'Olivia Das': 'أوليفيا داس',
      'Michael Chen': 'محمد علي',
      'Robert William': 'أحمد علي',
      'أحمد محمد': 'Ahmed Mohammed',
      'سارة أحمد': 'Sarah Ahmed',
      'محمد علي': 'Mohammed Ali',
      'نورا محمد': 'Noura Mohammed',
      'عمر خالد': 'Omar Khalid',
      'كريم أحمد': 'Kareem Ahmed',
      'ليلى محمد': 'Layla Mohammed',
      'حسين وليام': 'Hussein William',
      'مايكل تشين': 'Michael Chen',
      'علي أحمد': 'Ali Ahmed',
      'فاطمة محمد': 'Fatima Mohammed',
      'روبرت وليام': 'Robert William',
      'Ahmed Ali': 'Ahmed Ali',
    },
  },
}; 