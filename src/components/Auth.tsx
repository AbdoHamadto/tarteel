import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { db } from '../data/db';
import teacher from '/teacher.png'
import student from '/student.png'
import { toast } from "react-toastify";

interface FormValues {
  name: string;
  email: string;
  password: string;
  isLogin: boolean;
}


export default function AuthPage() {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [switchRole, setSwitchRole] = useState<boolean>(true);
  const navigate = useNavigate();

  const initialValues:FormValues = {
    name: '',
    email: '',
    password: '',
    isLogin: isLogin,
  }

  const validationSchema = Yup.object({
    name: Yup.string().when("isLogin", {
      is: true,
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.required("الاسم مطلوب").min(3, "يجب أن يكون الاسم على الأقل 3 أحرف"),
    }),
    email: Yup.string()
      .email('البريد الإلكتروني غير صحيح')
      .test(
        'domain-check',
        `يجب أن يكون البريد الإلكتروني تابعًا لـ ${switchRole ? '@teacher.com' : '@student.com'} فقط`,
        (value) => {
          if (!value) return false;
          const domainRegex = !isLogin 
            ? (switchRole ? /^[a-zA-Z0-9._%+-]+@teacher\.com$/ : /^[a-zA-Z0-9._%+-]+@student\.com$/)
            : /^[a-zA-Z0-9._%+-]+@(teacher|student)\.com$/;
          return domainRegex.test(value);
        }
      )
      .required('البريد الإلكتروني مطلوب'),
    password: Yup.string()
      .required('كلمة المرور مطلوبة')
      .min(6, 'يجب أن تكون كلمة المرور على الأقل 6 أحرف'),
  })

  const loginMutation = useMutation({
    mutationFn: ({ email , password} : { email: string, password: string}) => 
      db.collection(`${email.endsWith("@teacher.com") ? "teachers" : "students"}`).authWithPassword(email, password),
    onSuccess: () => {
      if (db.authStore.isValid) {
        toast.success("تم تسجيل الدخول بنجاح! 🎉");
        navigate('/');
      }
    },
    onError: (error: any) => {
      alert(`حدث خطأ أثناء تسجيل الدخول: ${error.message}`);
    },
  });

  const signupMutation = useMutation({
    mutationFn: ({name, email , password} : {name: string, email: string, password: string}) =>
      db.collection(`${switchRole ? "teachers" : "students"}`).create({
        email,
        password,
        passwordConfirm: password,
        name,
      }),
    onSuccess: () => {
      toast.success("تم تسجيل الحساب بنجاح! 🎉");
      setIsLogin(true);
    },
    onError: (error: any) => {
      alert(`حدث خطأ أثناء التسجيل: ${error.message}`);
    },
  });

  const handleAuth = async (values: FormValues) => {
    if (isLogin) {
      loginMutation.mutate({
        email: values.email,
        password: values.password
      });
    } else {
      signupMutation.mutate({ 
        name: values.name, 
        email: values.email, 
        password: values.password 
      });
    }
  };

  return (
    <div className='w-full min-h-screen flex justify-center items-center bg-gradient-to-b from-[#faf5ff] to-[#e9d5ff]'>

      <div className="max-w-md w-11/12 mx-auto my-auto p-6 bg-white shadow-lg rounded">
        <div className="flex justify-around mb-4">
          <p className='text-lg font-bold'>{isLogin ? "تسجيل الدخول" : "إنشاء حساب"}</p>
        </div>

        <Formik<FormValues>
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            handleAuth(values);
            resetForm();
          }} 
          enableReinitialize
        >
          <Form>
            {!isLogin && (
              <div className='mb-4'>
                <label htmlFor="name">الاسم</label>
                <Field 
                  type="text" 
                  id="name" 
                  name="name" 
                  className="w-full p-2 border rounded mt-1 outline-none"
                  placeholder="الاسم"
                />
                <ErrorMessage name="name" component="div" className="text-sm text-red-500"/>
              </div>
            )}
            <div className='mb-4'>
              <label htmlFor="email">البريد الإلكتروني</label>
              <Field 
                type="email" 
                id="email" 
                name="email" 
                className="w-full p-2 border rounded mt-1 outline-none"
                placeholder="البريد الالكتروني"
              />
              <ErrorMessage name="email" component="div" className="text-sm text-red-500" />
            </div>
            <div className='mb-4'>
              <label htmlFor="password">كلمة المرور</label>
              <Field 
                type="password" 
                id="password" 
                name="password" 
                className="w-full p-2 border rounded mt-1 outline-none"
                placeholder="كلمه السر"
              />
              <ErrorMessage name="password" component="div" className="text-sm text-red-500" />
            </div>
            
            {!isLogin && (
              <div className='w-full p-2 bg-accent  rounded flex justify-center items-center mb-4'>
                <p>معلم</p>
                <div 
                  onClick={() => setSwitchRole(!switchRole)}
                  className={`w-1/4 mx-4 h-10 p-1 bg-amber-300 rounded-full cursor-pointer`}
                >
                  <div className={`w-2/4 h-full p-1 rounded-full bg-blue-500 transition-transform duration-300 flex justify-center items-center ${switchRole ? 'translate-x-0' : '-translate-x-full' }`}>
                    <img src={switchRole ? teacher : student} alt="img" className='h-full' />
                  </div>
                </div>
                <p>طالب</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary text-white p-2 rounded cursor-pointer"
              disabled={loginMutation.isPending || signupMutation.isPending}
            >
              {isLogin
                ? loginMutation.isPending
                  ? 'جاري تسجيل الدخول...'
                  : 'تسجيل الدخول'
                : signupMutation.isPending
                ? 'جاري التسجيل...'
                : 'التسجيل'}
            </button>
          </Form>
        </Formik>

        <p className="mt-4 text-center">
          {isLogin ? (
            <>
              ليس لديك حساب؟{' '}
              <button onClick={() => setIsLogin(false)} className="text-blue-500 cursor-pointer">
                سجل هنا
              </button>
            </>
          ) : (
            <>
              لديك حساب بالفعل؟{' '}
              <button onClick={() => setIsLogin(true)} className="text-blue-500 cursor-pointer">
                سجل الدخول هنا
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};
