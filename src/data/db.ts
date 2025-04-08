import PocketBase from 'pocketbase';
import { RecordModel } from 'pocketbase';
import { useQuery } from '@tanstack/react-query';

export const db = new PocketBase("http://127.0.0.1:8090") //  https://dar.devsmith.duckdns.org
db.autoCancellation(false)

export interface halaqa {
  id: string;
  name: string;
  students: string[];
  waitingStudents: string[];
  user: string;
  halaqa_id: string;
}

const mapRecordToHalaqa = (record: RecordModel): halaqa => ({
  id: record.id,
  name: record.name,
  students: record.students ?? [],
  waitingStudents: record.waiting_students ?? [],
  user: record.user,
  halaqa_id: record.halaqa_id,
});


export const fetchHalaqa = async (): Promise<halaqa[]> => {
  const res = await db.collection("halaqa").getFullList();
  return res.map(mapRecordToHalaqa);
};

export const useGetHalaqat = () => {
  return useQuery({
    queryKey: ["halaqa"],
    queryFn: fetchHalaqa,
  });
};

export const loginHalaqa = async (halaqaId: string, halaqa?: halaqa) => {
  return await db.collection("halaqa").update(halaqaId, {
    ...halaqa,
    waiting_students: [...(halaqa?.waitingStudents || []), db.authStore.model?.id]
  });
}

// fetch Details Halaqa

export interface detailsHalaqa {
  id: string;
  name: string;
  idHalaqa: string;
  idStudent: string;
  score: string;
}

const mapDetailsHalaqa = (record: RecordModel): detailsHalaqa => ({
  id: record.id,
  name: record.name,
  idHalaqa: record.idHalaqa,
  idStudent: record.idStudent,
  score: record.score,
});

const fetchDetailsHalaqa = async (): Promise<detailsHalaqa[]> => {
  const res = await db.collection("detailsHalaqa").getFullList();
  return res.map(mapDetailsHalaqa);
};

export const useGetDetailsHalaqa = () => {
  return useQuery({
    queryKey: ["halaqaDetails"],
    queryFn: fetchDetailsHalaqa,
  });
};

// fetch user student

export interface userStudents {
  id: string;
  name: string;
}

const mapUserStudents = (record: RecordModel): userStudents => ({
  id: record.id,
  name: record.name,
});

const fetchUserStudents = async () : Promise<userStudents[]> => {
  const res = await db.collection("students").getFullList()
  return res.map(mapUserStudents)
}

export const useGetUserStudents = () => {
  return useQuery({
    queryKey: ["userStudents"],
    queryFn: fetchUserStudents,
  });
};

// move studentd from waiting to students arr

export const moveStudentsFromWaiting = async (
  halaqaId: string,
  halaqa?: halaqa,
  deleteStudents?: string[],
  studentId?: string
) => {
  console.log("🧪 داخل moveStudentsFromWaiting");
  console.log("✅ halaqa:", halaqa);
  console.log("✅ studentId:", studentId);

  if (!halaqa || !studentId) {
    console.error("❌ مشكلة: halaqa أو studentId ناقص.");
    throw new Error("بيانات غير كاملة: halaqa أو studentId ناقص.");
  }

  return await db.collection("halaqa").update(halaqaId, {
    ...halaqa,
    waiting_students: deleteStudents ?? [],
    students: [...(halaqa.students || []), studentId],
  });
};

// remove studentd from waiting

export const removeStudentsFromWaiting = async (halaqaId: string, halaqa?: halaqa, deleteStudents?: string[]) => {
  return await db.collection("halaqa").update(halaqaId, {
    ...halaqa,
    waiting_students: [...(deleteStudents || [])],
  });
}