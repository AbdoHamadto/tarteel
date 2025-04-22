import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { SquarePlus, BookOpenText } from "lucide-react"
import { useGetHalaqat, db } from "../data/db"
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Educational() {
  const queryClient = useQueryClient();
  const navigate = useNavigate()
  const validationSchema = Yup.object({
    name: Yup.string()
      .required("هذا الحقل مطلوب")
      .min(3, "الاسم لا يقل عن 3 حروف"),
  })

  const addHalaqa = useMutation({
    mutationFn: ({name} : {name: string}) => 
      db.collection('halaqa').create({name, student: [], waiting: [], user: db.authStore.model?.id, halaqa_id: Math.floor(Math.random() * 1000001).toString()})
    ,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["halaqa"] });
    },
  })

  const handelGotoHalaqa = (name: string, id: string) => {
    navigate(`/halaqa/${name}`, {
      state: {
        id: id,
        name: name,
      }
    })
  }

  const { data: ElHalaqat, isLoading, isError, error } = useGetHalaqat()
  const filterData = ElHalaqat?.filter((item) => item.user === db.authStore.model?.id)

  if (isLoading) return <p className="text-blue-500">Loading...</p>;
  if (isError) return <p className="text-red-500">Error: {error?.message}</p>;

  return (
    <div className="w-full h-[var(--height-screen)] bg-background grid grid-cols-5 gap-6 p-6">
      {filterData?.map((item) => (
        <div onClick={() => handelGotoHalaqa(item.name, item.id)} key={item.id} className="card-hover-effect relative overflow-hidden h-50 rounded-lg bg-secondary hover:bg-hoverbg cursor-pointer flex justify-center items-center flex-col transition ease-in-out hover:scale-110">
          <BookOpenText size={100} strokeWidth={1.5} />
          <p><span className="font-bold">إسم الحلقة :</span> {item.name}</p>
          <p><span className="font-bold">رقم السجل :</span> {item.halaqa_id}</p>
        </div>
      ))}
      <div className="h-50 rounded-lg bg-secondary">
        <Formik
          initialValues={{ name: "" }}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            toast("تم إنشاء الحلقة 🎉")
            addHalaqa.mutate({
              name: values.name
            });
            resetForm();
          }}
        >
            <Form className="max-w-sm mx-auto p-4 rounded-md">
              <label htmlFor="name" className="block font-semibold mb-1">
                اسم الحلقة :
              </label>
              <Field
                type="text"
                name="name"
                className="w-full p-2 border rounded-md outline-none border-gray-300"
              />
              <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1 absolute " />

              <button
                type="submit"
                className="w-full mt-8 flex justify-center items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md cursor-pointer"
              >
                <span className="ml-2">
                  إنشاء حلقة جديده  
                </span>
                <SquarePlus />
              </button>
            </Form>
        </Formik>
      </div>
    </div>
  )
}
