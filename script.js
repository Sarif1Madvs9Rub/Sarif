// وظائف عامة
function copyToClipboard(text) {
    // إنشاء عنصر نصي مؤقت
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    
    // تحديد النص
    tempInput.select();
    tempInput.setSelectionRange(0, 99999); // للأجهزة المحمولة
    
    try {
        // نسخ النص
        document.execCommand('copy');
        // إظهار رسالة نجاح
        showToast('تم النسخ بنجاح!', 'success');
    } catch (err) {
        // إظهار رسالة خطأ
        showToast('فشل النسخ. حاول مرة أخرى.', 'error');
    }
    
    // إزالة العنصر المؤقت
    document.body.removeChild(tempInput);
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // إخفاء الرسالة بعد 3 ثواني
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// التحقق من حالة تسجيل الدخول وإظهار/إخفاء العناصر المناسبة
function checkAuthState() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; // التحقق من حالة تسجيل الدخول من localStorage
    const authContainer = document.querySelector('.auth-container');
    const mainContainer = document.querySelector('.main-container');
    const topNav = document.querySelector('.top-nav');

    if (isLoggedIn) {
        // إخفاء قسم المصادقة وإظهار المحتوى الرئيسي
        if (authContainer) authContainer.style.display = 'none';
        if (mainContainer) mainContainer.style.display = 'block';
        if (topNav) topNav.style.display = 'flex';
        showConverterSection();
        updateProfileInfo();
        // تحديث الترجمات بعد عرض المحتوى
        updateTranslations();
    } else {
        // إظهار قسم المصادقة وإخفاء المحتوى الرئيسي
        if (authContainer) authContainer.style.display = 'block';
        if (mainContainer) mainContainer.style.display = 'none';
        if (topNav) topNav.style.display = 'none';
        showLogin(); // إظهار نموذج تسجيل الدخول
    }
}

// وظائف التنقل بين الأقسام
let navigationHistory = ['converter-section'];

function showSection(sectionId) {
    // إخفاء جميع الأقسام
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.style.display = 'none');

    // عرض القسم المطلوب
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
        
        // إضافة القسم الجديد إلى التاريخ إذا كان مختلفاً عن القسم الحالي
        if (sectionId !== navigationHistory[navigationHistory.length - 1]) {
            navigationHistory.push(sectionId);
        }

        // تحديث زر الرجوع
        const backBtn = document.querySelector('.back-btn');
        if (backBtn) {
            // إظهار زر الرجوع في جميع الأقسام ما عدا قسم المحول
            backBtn.style.display = sectionId === 'converter-section' ? 'none' : 'flex';
        }
        
        // إذا كان القسم هو المحول، نعرض معلومات الدفع والحساب البنكي
        if (sectionId === 'converter-section') {
            const paymentInfo = document.getElementById('payment-info');
            const russianBankInfo = document.getElementById('russian-bank-info');
            if (paymentInfo && localStorage.getItem('isLoggedIn') === 'true') {
                paymentInfo.style.display = 'block';
                updatePaymentInfo();
            }
            if (russianBankInfo && localStorage.getItem('isLoggedIn') === 'true') {
                russianBankInfo.style.display = 'block';
            }
        }

        // تحديث معلومات الملف الشخصي إذا كان القسم المطلوب هو الملف الشخصي
        if (sectionId === 'profile-section') {
            updateProfileInfo();
        }
    }

    // تحديث زر الرجوع
    updateBackButton();
}

function updateBackButton() {
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        // إظهار زر الرجوع فقط إذا كان هناك صفحات سابقة
        backBtn.style.display = navigationHistory.length > 1 ? 'flex' : 'none';
    }
}

function goBack() {
    if (navigationHistory.length > 1) {
        // إزالة الصفحة الحالية من التاريخ
        navigationHistory.pop();
        // الانتقال إلى الصفحة السابقة
        const previousSection = navigationHistory[navigationHistory.length - 1];
        showSection(previousSection);
    }
}

function showSignup() {
    document.getElementById('signup-section').style.display = 'block';
    document.getElementById('login-section').style.display = 'none';
}

function showLogin() {
    document.getElementById('signup-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'block';
}

function showConverterSection() {
    showSection('converter-section');
}

function showStepsSection() {
    showSection('steps-section');
}

function showProfileSection() {
    showSection('profile-section');
}

// تحديث معلومات الملف الشخصي
function updateProfileInfo() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.fullName === currentUser);

    if (user) {
        // تحديث معلومات العرض
        const nameDisplay = document.getElementById('profile-name');
        const emailDisplay = document.getElementById('profile-email');
        const phoneDisplay = document.getElementById('profile-phone');
        const accountDisplay = document.getElementById('profile-account');

        if (nameDisplay) nameDisplay.textContent = user.fullName || '';
        if (emailDisplay) emailDisplay.textContent = user.email || '';
        if (phoneDisplay) phoneDisplay.textContent = user.phone || '';
        if (accountDisplay) accountDisplay.textContent = user.accountNumber || '';

        // تحديث الحقول القابلة للتعديل
        const nameInput = document.getElementById('edit-name');
        const emailInput = document.getElementById('edit-email');
        const phoneInput = document.getElementById('edit-phone');

        if (nameInput) nameInput.value = user.fullName || '';
        if (emailInput) emailInput.value = user.email || '';
        if (phoneInput) phoneInput.value = user.phone || '';
    }
}

// تعديل معلومات الملف الشخصي
function editProfileField(field) {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.fullName === currentUser);

    if (userIndex === -1) return;

    const fieldElement = document.getElementById(`profile-${field}`);
    if (!fieldElement) return;

    // تفعيل التعديل
    fieldElement.contentEditable = true;
    fieldElement.focus();

    // حفظ عند الضغط على Enter
    fieldElement.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveProfileField(field, this.textContent);
        }
    });

    // حفظ عند فقدان التركيز
    fieldElement.addEventListener('blur', function() {
        saveProfileField(field, this.textContent);
    });
}

// حفظ التعديلات في حقل معين
function saveProfileField(field, value) {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.fullName === currentUser);

    if (userIndex === -1) return;

    // تحديث قيمة الحقل
    users[userIndex][field] = value;
    localStorage.setItem('users', JSON.stringify(users));

    // إعادة الحقل إلى حالة العرض فقط
    const fieldElement = document.getElementById(`profile-${field}`);
    if (fieldElement) {
        fieldElement.contentEditable = false;
    }

    showToast('تم حفظ التعديلات بنجاح', 'success');
    updateProfileInfo();
}

// إنشاء رقم حساب عشوائي
function generateAccountNumber() {
    const prefix = "SARIF";
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
}

// قاموس الترجمة
const translations = {
    ar: {
        signup: "إنشاء حساب جديد",
        login: "تسجيل الدخول",
        createAccount: "إنشاء حساب",
        fullName: "الاسم الكامل:",
        email: "البريد الإلكتروني:",
        phone: "رقم الهاتف:",
        password: "كلمة المرور:",
        confirmPassword: "تأكيد كلمة المرور",
        enterFullName: "أدخل اسمك بالكامل",
        enterEmail: "أدخل البريد الإلكتروني",
        enterPhone: "أدخل رقم هاتفك",
        enterPassword: "أدخل كلمة المرور",
        enterConfirmPassword: "تأكيد كلمة المرور",
        submit: "تسجيل الاشتراك",
        login: "تسجيل الدخول",
        haveAccount: "لديك حساب؟",
        noAccount: "ليس لديك حساب؟",
        converter: "محول العملات",
        moroccanDirham: "درهم مغربي (MAD)",
        russianRuble: "روبل روسي (RUB)",
        convert: "تحويل",
        contact: "اتصل بنا",
        steps: "الخطوات",
        profile: "الملف الشخصي",
        logout: "تسجيل الخروج",
        name: "الاسم :",
        phone: "رقم الهاتف :",
        message: "الرسالة :",
        send: "إرسال",
        step1: "الخطوة الأولى: إرسال المبلغ بالدرهم المغربي",
        step2: "الخطوة الثانية: تسجيل معلومات الحساب البنكي في روسيا",
        step3: "الخطوة الثالثة: استلام عملة الروبل الروسي",
        step1_1: "1. اختيار وسيلة الدفع المناسبة:",
        step1_1_1: "انتقل إلى قسم معلومات الدفع في التطبيق.",
        step1_1_2: "اعتمد وسيلة الدفع المتاحة (مثل CIHBANK).",
        step1_1_3: "استخدم المعلومات البنكية الخاصة بالتطبيق (الاسم، رقم الحساب، اسم البنك) لإجراء التحويل.",
        step1_2: "2. تنفيذ عملية الدفع:",
        step1_2_1: "قم بإرسال المبلغ المطلوب بالدرهم المغربي من حسابك البنكي إلى الحساب المخصص في التطبيق.",
        step1_2_2: "تأكد من نجاح العملية من خلال تطبيق البنك الخاص بك.",
        step1_3: "3. التقاط لقطة شاشة:",
        step1_3_1: "بعد تأكيد العملية، التقط لقطة شاشة تثبت نجاح الدفع، حيث ستكون ضرورية في الخطوة التالية.",
        
        step2_1: "1. انتقل إلى قسم معلومات الحساب البنكي:",
        step2_1_1: "أدخل الاسم الكامل لصاحب الحساب في روسيا.",
        step2_1_2: "أدخل رقم هاتف صاحب الحساب.",
        step2_1_3: "أدخل اسم البنك المتواجد في روسيا.",
        step2_1_4: "أدخل رقم الحساب في روسيا.",
        step2_2: "2. إرفاق إثبات الدفع:",
        step2_2_1: "ارفع لقطة الشاشة التي التقطتها في الخطوة السابقة لتأكيد عملية الدفع.",
        step2_3: "3. تأكيد المعلومات:",
        step2_3_1: "تحقق من أن جميع البيانات المدخلة صحيحة لتجنب أي تأخير في عملية تحويل الروبل.",
        
        step3_text: "بعد مراجعة المعلومات من طرف التطبيق والتأكد من صحة العملية، سيتم تحويل المبلغ المتفق عليه إلى الحساب البنكي الروسي المدخل.",
        step3_support: "يمكنك متابعة حالة العملية عبر قسم المراسلة للتواصل مع الدعم عند الحاجة.",
        
        important_tips: "نصائح مهمة:",
        tip1: "تأكد من إدخال معلومات دقيقة لتجنب أي تأخير.",
        tip2: "احتفظ بسجل معاملاتك بما في ذلك الإيصالات ولقطات الشاشة.",
        tip3: "عند مواجهة أي مشكلة، تواصل مع دعم التطبيق مباشرة عبر الواتساب.",
        final_note: "هذه الخطوات تضمن لك عملية صرف مريحة وآمنة.",
        accountInfo: "معلومات الحساب",
        bankName: "اسم البنك :",
        accountNumber: "رقم الحساب :",
        copy: "نسخ",
        language: "العربية",
        paymentInfo: "معلومات الدفع",
        recipientName: "الاسم الكامل لصاحب الحساب :",
        recipientPhone: "رقم الهاتف :",
        recipientBank: "اسم البنك :",
        recipientAccount: "رقم الحساب :",
        transferImage: "صورة الحوالة المصرفية :",
        uploadText: "الرجاء تحميل لقطة شاشة للحوالة المصرفية الناجحة",
        imageFormat: "(jpg, jpeg, png, pdf - الحجم الأقصى للملف هو 20 ميغا بايت)",
        russianBankInfo: "معلومات الحساب البنكي في روسيا",
        enterRecipientName: "أدخل الاسم الكامل للمستلم",
        enterRecipientPhone: "أدخل رقم هاتف المستلم",
        enterRecipientBank: "أدخل اسم البنك في روسيا",
        enterRecipientAccount: "أدخل رقم الحساب",
        saveInfo: "تسجيل المعلومات",
        bankNameValue: "CIHBANK",
        accountNumberValue: "230010860054121102140096",
        ownerName: "Abdellah Arif",
        back: "رجوع",
        email: "البريد الإلكتروني",
        edit: "تعديل",
        changePassword: "تغيير كلمة المرور",
        personalInfo: "المعلومات الشخصية",
        accountSettings: "إعدادات الحساب",
        emailPlaceholder: "أدخل بريدك الإلكتروني",
        phonePlaceholder: "أدخل رقم هاتفك",
        save: "حفظ",
        cancel: "إلغاء",
        enterAmount: "أدخل المبلغ",
        resultAmount: "المبلغ المحول",
        enterName: "أدخل اسمك",
        enterPhone: "أدخل رقم هاتفك",
        enterMessage: "اكتب رسالتك هنا",
        contactUs: "تواصل معنا",
        whatsApp: "واتساب",
        madPlaceholder: "أدخل المبلغ بالدرهم المغربي",
        rubPlaceholder: "المبلغ بالروبل الروسي",
        bankInfoTitle: "معلومات الحساب البنكي في روسيا",
        fullName: "الاسم الكامل لصاحب الحساب:",
        fullNamePlaceholder: "أدخل الاسم الكامل للمستلم",
        phoneNumber: "رقم الهاتف:",
        phonePlaceholder: "أدخل رقم هاتف المستلم",
        bankName: "اسم البنك:",
        bankNamePlaceholder: "أدخل اسم البنك في روسيا",
        accountNumber: "رقم الحساب:",
        accountNumberPlaceholder: "أدخل رقم الحساب",
        bankTransferScreenshot: "صورة الحوالة المصرفية:",
        uploadScreenshotText: "الرجاء تحميل لقطة شاشة للحوالة المصرفية الناجحة",
        fileTypes: "(jpg, jpeg, png, pdf - الحجم الأقصى للملف هو 20 ميغابايت)",
        saveInfo: "تسجيل المعلومات",
        madInputPlaceholder: "أدخل المبلغ بالدرهم المغربي",
        rubInputPlaceholder: "المبلغ بالروبل الروسي",
        stepsButton: "الخطوات",
        signup: "إنشاء حساب جديد",
        login: "تسجيل الدخول",
        fullName: "الاسم الكامل:",
        email: "البريد الإلكتروني:",
        phone: "رقم الهاتف:",
        password: "كلمة المرور:",
        createAccount: "إنشاء حساب",
        haveAccount: "لديك حساب؟",
        dontHaveAccount: "ليس لديك حساب؟",
        loginNow: "تسجيل الدخول",
        signupNow: "إنشاء حساب جديد",
        enterFullName: "أدخل اسمك بالكامل",
        enterEmail: "أدخل البريد الإلكتروني",
        enterPhone: "أدخل رقم هاتفك",
        enterPassword: "أدخل كلمة المرور",
        en: {
            signup: "Sign Up",
            login: "Login",
            createAccount: "Create Account",
            fullName: "Full Name:",
            email: "Email:",
            phone: "Phone Number:",
            password: "Password:",
            confirmPassword: "Confirm Password",
            confirmPasswordPlaceholder: "Re-enter Password",
            enterFullName: "Enter your full name",
            enterEmail: "Enter your email address",
            enterPhone: "Enter your phone number",
            enterPassword: "Enter your password",
            signUp: "Sign Up",
            submit: "Sign Up",
            login: "Login",
            haveAccount: "Have an account?",
            dontHaveAccount: "Don't have an account?",
            loginNow: "Login",
            signupNow: "Sign Up",
            converter: "Currency Converter",
            moroccanDirham: "Moroccan Dirham (MAD)",
            russianRuble: "Russian Ruble (RUB)",
            convert: "Convert",
            contact: "Contact Us",
            steps: "Steps",
            profile: "Profile",
            logout: "Logout",
            name: "Name:",
            phone: "Phone:",
            message: "Message:",
            send: "Send",
            step1: "Step 1: Send Amount in Moroccan Dirham",
            step2: "Step 2: Register Russian Bank Account Information",
            step3: "Step 3: Receive Russian Rubles",
            step1_1: "1. Choose Payment Method:",
            step1_1_1: "Navigate to the payment information section in the app.",
            step1_1_2: "Select the available payment method (e.g., CIHBANK).",
            step1_1_3: "Use the app's banking information (name, account number, bank name) for the transfer.",
            step1_2: "2. Execute Payment:",
            step1_2_1: "Send the required amount in Moroccan Dirham from your bank account to the designated app account.",
            step1_2_2: "Verify the transaction success through your banking app.",
            step1_3: "3. Take a Screenshot:",
            step1_3_1: "After confirming the transaction, take a screenshot as proof of payment, which will be needed in the next step.",
            
            step2_1: "1. Go to Bank Account Information Section:",
            step2_1_1: "Enter the full name of the account holder in Russia.",
            step2_1_2: "Enter the account holder's phone number.",
            step2_1_3: "Enter the name of the bank in Russia.",
            step2_1_4: "Enter the account number in Russia.",
            step2_2: "2. Attach Payment Proof:",
            step2_2_1: "Upload the screenshot you took in the previous step to confirm the payment.",
            step2_3: "3. Confirm Information:",
            step2_3_1: "Verify that all entered data is correct to avoid any delays in the ruble transfer process.",
            
            step3_text: "After reviewing the information and verifying the transaction, the agreed amount will be transferred to the provided Russian bank account.",
            step3_support: "You can track the transaction status through the messaging section to contact support if needed.",
            
            important_tips: "Important Tips:",
            tip1: "Make sure to enter accurate information to avoid any delays.",
            tip2: "Keep a record of your transactions including receipts and screenshots.",
            tip3: "If you encounter any issues, contact app support directly via WhatsApp.",
            final_note: "These steps ensure a smooth and secure exchange process.",
            accountInfo: "Account Information",
            bankName: "Bank Name:",
            accountNumber: "Account Number:",
            copy: "Copy",
            language: "English",
            paymentInfo: "Payment Information",
            recipientName: "Account Holder Full Name:",
            recipientPhone: "Phone Number:",
            recipientBank: "Bank Name:",
            recipientAccount: "Account Number:",
            transferImage: "Bank Transfer Screenshot:",
            uploadText: "Please upload a screenshot of the successful bank transfer",
            imageFormat: "(jpg, jpeg, png, pdf - Maximum file size is 20MB)",
            russianBankInfo: "Russian Bank Account Information",
            enterRecipientName: "Enter recipient's full name",
            enterRecipientPhone: "Enter recipient's phone number",
            enterRecipientBank: "Enter bank name in Russia",
            enterRecipientAccount: "Enter account number",
            saveInfo: "Save Information",
            bankNameValue: "CIHBANK",
            accountNumberValue: "230010860054121102140096",
            ownerName: "Abdellah Arif",
            back: "Back",
            email: "Email",
            edit: "Edit",
            changePassword: "Change Password",
            personalInfo: "Personal Information",
            accountSettings: "Account Settings",
            emailPlaceholder: "Enter your email",
            phonePlaceholder: "Enter your phone number",
            save: "Save",
            cancel: "Cancel",
            enterAmount: "Enter amount",
            resultAmount: "Converted amount",
            enterName: "Enter your name",
            enterPhone: "Enter your phone number",
            enterMessage: "Write your message here",
            contactUs: "Contact Us",
            whatsApp: "WhatsApp",
            madPlaceholder: "Enter amount in Moroccan Dirham",
            rubPlaceholder: "Amount in Russian Ruble",
            bankInfoTitle: "Bank Account Information in Russia",
            fullName: "Full Name:",
            fullNamePlaceholder: "Enter recipient's full name",
            phoneNumber: "Phone Number:",
            phonePlaceholder: "Enter recipient's phone number",
            bankName: "Bank Name:",
            bankNamePlaceholder: "Enter bank name in Russia",
            accountNumber: "Account Number:",
            accountNumberPlaceholder: "Enter account number",
            bankTransferScreenshot: "Bank Transfer Screenshot:",
            uploadScreenshotText: "Please upload a screenshot of the successful bank transfer",
            fileTypes: "(jpg, jpeg, png, pdf - Maximum file size is 20MB)",
            saveInfo: "Save Information",
            madInputPlaceholder: "Enter amount in MAD",
            rubInputPlaceholder: "Amount in RUB",
            stepsButton: "Steps",
        }
    },
    en: {
        signup: "Sign Up",
        login: "Login",
        createAccount: "Create Account",
        fullName: "Full Name:",
        email: "Email:",
        phone: "Phone Number:",
        password: "Password:",
        confirmPassword: "Confirm Password",
        confirmPasswordPlaceholder: "Re-enter Password",
        enterFullName: "Enter your full name",
        enterEmail: "Enter your email address",
        enterPhone: "Enter your phone number",
        enterPassword: "Enter your password",
        signUp: "Sign Up",
        submit: "Sign Up",
        login: "Login",
        haveAccount: "Have an account?",
        dontHaveAccount: "Don't have an account?",
        loginNow: "Login",
        signupNow: "Sign Up",
        converter: "Currency Converter",
        moroccanDirham: "Moroccan Dirham (MAD)",
        russianRuble: "Russian Ruble (RUB)",
        convert: "Convert",
        contact: "Contact Us",
        steps: "Steps",
        profile: "Profile",
        logout: "Logout",
        name: "Name:",
        phone: "Phone:",
        message: "Message:",
        send: "Send",
        step1: "Step 1: Send Amount in Moroccan Dirham",
        step2: "Step 2: Register Russian Bank Account Information",
        step3: "Step 3: Receive Russian Rubles",
        step1_1: "1. Choose Payment Method:",
        step1_1_1: "Navigate to the payment information section in the app.",
        step1_1_2: "Select the available payment method (e.g., CIHBANK).",
        step1_1_3: "Use the app's banking information (name, account number, bank name) for the transfer.",
        step1_2: "2. Execute Payment:",
        step1_2_1: "Send the required amount in Moroccan Dirham from your bank account to the designated app account.",
        step1_2_2: "Verify the transaction success through your banking app.",
        step1_3: "3. Take a Screenshot:",
        step1_3_1: "After confirming the transaction, take a screenshot as proof of payment, which will be needed in the next step.",
        
        step2_1: "1. Go to Bank Account Information Section:",
        step2_1_1: "Enter the full name of the account holder in Russia.",
        step2_1_2: "Enter the account holder's phone number.",
        step2_1_3: "Enter the name of the bank in Russia.",
        step2_1_4: "Enter the account number in Russia.",
        step2_2: "2. Attach Payment Proof:",
        step2_2_1: "Upload the screenshot you took in the previous step to confirm the payment.",
        step2_3: "3. Confirm Information:",
        step2_3_1: "Verify that all entered data is correct to avoid any delays in the ruble transfer process.",
        
        step3_text: "After reviewing the information and verifying the transaction, the agreed amount will be transferred to the provided Russian bank account.",
        step3_support: "You can track the transaction status through the messaging section to contact support if needed.",
        
        important_tips: "Important Tips:",
        tip1: "Make sure to enter accurate information to avoid any delays.",
        tip2: "Keep a record of your transactions including receipts and screenshots.",
        tip3: "If you encounter any issues, contact app support directly via WhatsApp.",
        final_note: "These steps ensure a smooth and secure exchange process.",
        accountInfo: "Account Information",
        bankName: "Bank Name:",
        accountNumber: "Account Number:",
        copy: "Copy",
        language: "English",
        paymentInfo: "Payment Information",
        recipientName: "Account Holder Full Name:",
        recipientPhone: "Phone Number:",
        recipientBank: "Bank Name:",
        recipientAccount: "Account Number:",
        transferImage: "Bank Transfer Screenshot:",
        uploadText: "Please upload a screenshot of the successful bank transfer",
        imageFormat: "(jpg, jpeg, png, pdf - Maximum file size is 20MB)",
        russianBankInfo: "Russian Bank Account Information",
        enterRecipientName: "Enter recipient's full name",
        enterRecipientPhone: "Enter recipient's phone number",
        enterRecipientBank: "Enter bank name in Russia",
        enterRecipientAccount: "Enter account number",
        saveInfo: "Save Information",
        bankNameValue: "CIHBANK",
        accountNumberValue: "230010860054121102140096",
        ownerName: "Abdellah Arif",
        back: "Back",
        email: "Email",
        edit: "Edit",
        changePassword: "Change Password",
        personalInfo: "Personal Information",
        accountSettings: "Account Settings",
        emailPlaceholder: "Enter your email",
        phonePlaceholder: "Enter your phone number",
        save: "Save",
        cancel: "Cancel",
        enterAmount: "Enter amount",
        resultAmount: "Converted amount",
        enterName: "Enter your name",
        enterPhone: "Enter your phone number",
        enterMessage: "Write your message here",
        contactUs: "Contact Us",
        whatsApp: "WhatsApp",
        madPlaceholder: "Enter amount in Moroccan Dirham",
        rubPlaceholder: "Amount in Russian Ruble",
        bankInfoTitle: "Bank Account Information in Russia",
        fullName: "Full Name:",
        fullNamePlaceholder: "Enter recipient's full name",
        phoneNumber: "Phone Number:",
        phonePlaceholder: "Enter recipient's phone number",
        bankName: "Bank Name:",
        bankNamePlaceholder: "Enter bank name in Russia",
        accountNumber: "Account Number:",
        accountNumberPlaceholder: "Enter account number",
        bankTransferScreenshot: "Bank Transfer Screenshot:",
        uploadScreenshotText: "Please upload a screenshot of the successful bank transfer",
        fileTypes: "(jpg, jpeg, png, pdf - Maximum file size is 20MB)",
        saveInfo: "Save Information",
        madInputPlaceholder: "Enter amount in MAD",
        rubInputPlaceholder: "Amount in RUB",
        stepsButton: "Steps",
    }
};

// تعيين اللغة الافتراضية
let currentLang = localStorage.getItem('lang') || 'ar';
document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = currentLang;

// تحديث النصوص عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // تعيين اللغة العربية كلغة افتراضية إذا لم يتم تحديد لغة من قبل
    if (!localStorage.getItem('lang')) {
        localStorage.setItem('lang', 'ar');
        currentLang = 'ar';
        document.documentElement.dir = 'rtl';
        document.documentElement.lang = 'ar';
    }
    
    updateContent();
    checkAuthState();
    
    // تحديث حالة زر تبديل اللغة
    const languageToggle = document.getElementById('language-toggle');
    if (languageToggle) {
        languageToggle.checked = currentLang === 'en';
    }
});

// الحصول على اللغة الحالية
function getCurrentLanguage() {
    return document.documentElement.lang;
}

// وظيفة إظهار/إخفاء القائمة المنسدلة
function toggleLanguageDropdown() {
    const dropdown = document.getElementById('languageDropdown');
    dropdown.classList.toggle('show');
}

// وظيفة اختيار اللغة
function selectLanguage(lang) {
    // تحديث اللغة الحالية
    currentLang = lang;
    localStorage.setItem('lang', lang);
    
    // تحديث نص الزر
    const langBtn = document.querySelector('.lang-text');
    if (langBtn) {
        langBtn.textContent = lang === 'ar' ? 'العربية' : 'English';
    }
    
    // تحديث اتجاه الصفحة
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    // تحديث المحتوى
    updateContent();
    
    // إغلاق القائمة المنسدلة
    const dropdown = document.getElementById('languageDropdown');
    if (dropdown) {
        dropdown.classList.remove('show');
    }

    // إعادة تحميل الصفحة
    location.reload();
}

// إغلاق القائمة المنسدلة عند النقر خارجها
document.addEventListener('click', function(event) {
    const langSelector = document.querySelector('.language-selector');
    const dropdown = document.getElementById('languageDropdown');
    
    if (!langSelector.contains(event.target) && dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
    }
});

// تحديث نص زر اللغة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    const langBtn = document.querySelector('.lang-text');
    if (langBtn) {
        langBtn.textContent = currentLang === 'ar' ? 'العربية' : 'English';
    }
    updateContent();
});

// تحديث الترجمات
function updateTranslations() {
    const currentLang = getCurrentLanguage();
    
    // ترجمة العناصر باستخدام data-translate
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[currentLang] && translations[currentLang][key]) {
            element.textContent = translations[currentLang][key];
        }
    });

    // ترجمة العناصر باستخدام data-en و data-ar
    document.querySelectorAll('[data-en], [data-ar]').forEach(element => {
        const translatedText = element.getAttribute(`data-${currentLang}`);
        if (translatedText) {
            element.textContent = translatedText;
        }
    });

    // ترجمة العناصر باستخدام data-translate-placeholder
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        if (translations[currentLang] && translations[currentLang][key]) {
            element.placeholder = translations[currentLang][key];
        }
    });
}

// تحديث معلومات الدفع
function updatePaymentInfo() {
    const currentLang = getCurrentLanguage();
    
    // تحديث النصوص باستخدام نظام الترجمة
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[currentLang] && translations[currentLang][key]) {
            element.textContent = translations[currentLang][key];
        }
    });

    // تحديث أزرار النسخ
    document.querySelectorAll('.copy-btn').forEach(button => {
        if (translations[currentLang] && translations[currentLang]['copy']) {
            button.textContent = translations[currentLang]['copy'];
        }
    });
}

// تحديث المحتوى حسب اللغة المحددة
function updateContent() {
    // تحديث النصوص العادية
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[currentLang] && translations[currentLang][key]) {
            element.textContent = translations[currentLang][key];
        }
    });

    // تحديث نصوص placeholder
    const placeholderElements = document.querySelectorAll('[data-translate-placeholder]');
    placeholderElements.forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        if (translations[currentLang] && translations[currentLang][key]) {
            element.placeholder = translations[currentLang][key];
        }
    });

    // تحديث اتجاه الصفحة
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;

    // تحديث النصوص الثابتة الإضافية
    updateFixedTexts();
}

// تحديث النصوص الثابتة
function updateFixedTexts() {
    // تحديث عنوان الصفحة
    document.title = currentLang === 'ar' ? 'محول العملات - SARIF' : 'SARIF - Currency Converter';

    // تحديث أي نصوص ثابتة أخرى
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.textContent = currentLang === 'ar' ? 'تسجيل الدخول' : 'Login';
    }

    const signupBtn = document.querySelector('.signup-btn');
    if (signupBtn) {
        signupBtn.textContent = currentLang === 'ar' ? 'إنشاء حساب' : 'Sign Up';
    }

    // تحديث placeholder للحقول
    const amountInput = document.getElementById('amount');
    if (amountInput) {
        amountInput.placeholder = currentLang === 'ar' ? 'أدخل المبلغ' : 'Enter amount';
    }

    // تحديث نص زر التحويل
    const convertBtn = document.querySelector('.convert-btn');
    if (convertBtn) {
        convertBtn.textContent = currentLang === 'ar' ? 'تحويل' : 'Convert';
    }

    // تحديث نصوص النتيجة
    const resultText = document.getElementById('result-text');
    if (resultText) {
        resultText.textContent = currentLang === 'ar' ? 'النتيجة:' : 'Result:';
    }
}

// وظائف تغيير كلمة المرور
function showChangePasswordForm() {
    document.getElementById('change-password-modal').style.display = 'block';
}

function closeChangePasswordModal() {
    document.getElementById('change-password-modal').style.display = 'none';
    document.getElementById('change-password-form').reset();
}

function handleChangePassword(event) {
    event.preventDefault();
    
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-new-password').value;
    
    // التحقق من كلمة المرور الحالية
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.password !== currentPassword) {
        showToast('كلمة المرور الحالية غير صحيحة', 'error');
        return;
    }
    
    // التحقق من تطابق كلمة المرور الجديدة
    if (newPassword !== confirmPassword) {
        showToast('كلمة المرور الجديدة غير متطابقة', 'error');
        return;
    }
    
    // تحديث كلمة المرور
    currentUser.password = newPassword;
    updateUser(currentUser);
    
    showToast('تم تغيير كلمة المرور بنجاح', 'success');
    closeChangePasswordModal();
}

// معالجة نموذج التسجيل
function handleSignup(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const phone = document.getElementById('signup-phone').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // التحقق من تطابق كلمتي المرور
    if (password !== confirmPassword) {
        showToast('كلمتا المرور غير متطابقتين', 'error');
        return;
    }

    // التحقق من أن البريد الإلكتروني غير مستخدم مسبقاً
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(user => user.email === email)) {
        showToast('البريد الإلكتروني مستخدم مسبقاً', 'error');
        return;
    }

    // إضافة المستخدم الجديد
    const newUser = {
        fullName,
        email,
        phone,
        password
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // تسجيل الدخول تلقائياً
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    // إظهار رسالة نجاح وتحديث الواجهة
    showToast('تم إنشاء الحساب بنجاح!', 'success');
    checkAuthState();
}

// معالجة نموذج تسجيل الدخول
function handleLogin(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('login-name').value;
    const password = document.getElementById('login-password').value;
    
    // التحقق من بيانات المستخدم
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.fullName === fullName && u.password === password);

    if (user) {
        // تسجيل الدخول
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // تحديث حالة المصادقة وإظهار المحتوى الرئيسي
        checkAuthState();
        showToast('تم تسجيل الدخول بنجاح!', 'success');
    } else {
        showToast('اسم المستخدم أو كلمة المرور غير صحيحة', 'error');
    }
}

// تسجيل الخروج
function logout() {
    // إزالة بيانات المستخدم من localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    
    // تحديث حالة المصادقة
    checkAuthState();
    
    // إظهار رسالة نجاح
    showToast('تم تسجيل الخروج بنجاح', 'success');
}

// معالجة تحميل الصورة
function handleImageUpload(file, previewImage, uploadPlaceholder) {
    if (!file) return;

    // التحقق من نوع الملف
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
        alert('الرجاء تحميل ملف بصيغة jpg، jpeg، png، أو pdf فقط');
        return false;
    }

    // التحقق من حجم الملف (20 ميغابايت)
    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
        alert('حجم الملف يتجاوز 20 ميغا بايت. الرجاء اختيار ملف أصغر');
        return false;
    }

    // عرض معاينة الصورة
    if (file.type !== 'application/pdf') {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.src = e.target.result;
            previewImage.style.display = 'block';
            uploadPlaceholder.style.display = 'none';
        };
        reader.readAsDataURL(file);
    } else {
        previewImage.style.display = 'none';
        uploadPlaceholder.style.display = 'block';
        uploadPlaceholder.innerHTML = `
            <span class="plus-icon">📄</span>
            <p>تم اختيار ملف PDF</p>
            <small>${file.name}</small>
        `;
    }
    return true;
}

// معالجة تحميل صورة التحويل
function handleTransferImageUpload(input) {
    const file = input.files[0];
    const previewImage = document.getElementById('preview-image');
    const uploadPlaceholder = document.getElementById('upload-placeholder');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            previewImage.style.display = 'block';
            uploadPlaceholder.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
}

// معالجة نموذج معلومات الحساب البنكي في روسيا
document.getElementById('russian-bank-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // إظهار رسالة النجاح
    document.getElementById('success-message').style.display = 'flex';
    
    // إخفاء الرسالة بعد 3 ثواني
    setTimeout(() => {
        document.getElementById('success-message').style.display = 'none';
    }, 3000);
});

// معدل التحويل الثابت
const EXCHANGE_RATE = 10.85;

// وظيفة تحويل العملة
function convertCurrency() {
    const madInput = document.getElementById('mad-amount');
    const rubOutput = document.getElementById('rub-amount');
    
    if (!madInput || !rubOutput) {
        console.error('عناصر الإدخال غير موجودة');
        return;
    }

    const madAmount = parseFloat(madInput.value);
    
    if (isNaN(madAmount)) {
        showToast('الرجاء إدخال مبلغ صحيح', 'error');
        return;
    }

    // سعر التحويل: 1 درهم = 10.36 روبل (يمكن تحديث هذا السعر)
    const exchangeRate = 9.10;
    const rubAmount = madAmount * exchangeRate;
    
    // عرض النتيجة مع تقريب إلى رقمين عشريين
    rubOutput.value = rubAmount.toFixed(2);

    // إظهار رسالة نجاح
    showToast('تم التحويل بنجاح', 'success');
}

// وظائف إدارة معلومات البنوك
function showBankInfo(bankId) {
    // إخفاء جميع معلومات البنوك
    document.querySelectorAll('.bank-info').forEach(info => {
        info.classList.remove('active');
    });
    
    // إزالة التنشيط من جميع الأزرار
    document.querySelectorAll('.bank-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // إظهار معلومات البنك المحدد
    document.getElementById(bankId + '-bank-info').classList.add('active');
    
    // تنشيط الزر المحدد
    event.target.classList.add('active');
}

function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
        // إنشاء إشعار نجاح
        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.textContent = 'تم النسخ بنجاح!';
        document.body.appendChild(notification);

        // إزالة الإشعار بعد ثانيتين
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }).catch(err => {
        console.error('فشل في النسخ:', err);
        alert('حدث خطأ أثناء النسخ');
    });
}

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // التحقق من حالة تسجيل الدخول عند تحميل الصفحة
    checkAuthState();
    
    // إضافة مستمع الأحداث لنماذج تسجيل الدخول والتسجيل
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // إضافة مستمع الأحداث لزر تسجيل الخروج
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // إضافة مستمع الأحداث لزر تحويل العملة
    const convertBtn = document.querySelector('.convert-btn');
    if (convertBtn) {
        convertBtn.addEventListener('click', convertCurrency);
    }
    
    // تحديث معلومات الملف الشخصي
    updateProfileInfo();
    
    // تحديث النصوص حسب اللغة المحددة
    updateContent();
    
    // إضافة معالج الحدث لنموذج الحساب البنكي الروسي
    const russianBankForm = document.getElementById('russian-bank-form');
    if (russianBankForm) {
        russianBankForm.addEventListener('submit', handleRussianBankForm);
    }
});

// عرض رسالة النجاح
function showSuccessMessage() {
    // إزالة أي رسائل نجاح سابقة
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const russianBankSection = document.getElementById('russian-bank-info');
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    
    // تحديد محتوى الرسالة حسب اللغة الحالية
    const currentLang = getCurrentLanguage();
    const messageContent = {
        ar: {
            title: 'تمت العملية بنجاح!',
            message: 'سوف تتوصل بعمولتك في غضون بضع ساعات.'
        },
        en: {
            title: 'Operation Successful!',
            message: 'You will receive your commission within a few hours.'
        }
    };

    const content = messageContent[currentLang];
    
    successMessage.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <h3>${content.title}</h3>
        <p>${content.message}</p>
    `;
    
    russianBankSection.appendChild(successMessage);
    
    // إزالة الرسالة بعد 3 ثواني
    setTimeout(() => {
        if (successMessage && successMessage.parentNode) {
            successMessage.parentNode.removeChild(successMessage);
        }
    }, 3000);
}

// معالجة نموذج معلومات الحساب البنكي في روسيا
function handleRussianBankForm(event) {
    event.preventDefault();
    
    // التحقق من تعبئة جميع الحقول المطلوبة
    const form = document.getElementById('russian-bank-form');
    const formData = new FormData(form);
    let isValid = true;
    
    // التحقق من وجود جميع الحقول المطلوبة
    for (let pair of formData.entries()) {
        if (!pair[1]) {
            isValid = false;
            break;
        }
    }
    
    // التحقق من تحميل الصورة
    const transferImage = document.getElementById('transfer-image');
    if (!transferImage.files.length) {
        isValid = false;
    }
    
    if (isValid) {
        // إظهار رسالة النجاح
        showSuccessMessage();
        
        // إعادة تعيين النموذج
        form.reset();
        
        // إعادة تعيين عناصر الصورة
        const previewImage = document.getElementById('preview-image');
        const uploadPlaceholder = document.getElementById('upload-placeholder');
        
        // إخفاء الصورة المعاينة وإعادة تعيين مصدرها
        if (previewImage) {
            previewImage.style.display = 'none';
            previewImage.src = '';
        }
        
        // إظهار مربع التحميل
        if (uploadPlaceholder) {
            uploadPlaceholder.style.display = 'block';
        }
        
        // إعادة تعيين حقل إدخال الملف
        transferImage.value = '';
    } else {
        showToast('الرجاء تعبئة جميع الحقول المطلوبة وتحميل الصورة', 'error');
    }
}

