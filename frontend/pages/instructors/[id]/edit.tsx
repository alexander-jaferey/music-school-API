import {
  getAccessToken,
  useUser,
  withPageAuthRequired,
} from "@auth0/nextjs-auth0";
import {
  InferGetServerSidePropsType,
  NextApiRequest,
  NextApiResponse,
} from "next";
import {
  CoursesQuery,
  DecodedJwt,
  Instructor,
  InstrumentsQuery,
} from "../../../interfaces";
import jwt_decode from "jwt-decode";
import Error from "next/error";
import Layout from "../../../components/layout";
import InstructorForm from "../../../components/instructorForm";

const dbURL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getServerSideProps(context: {
  params: { id: number };
  req: NextApiRequest;
  res: NextApiResponse;
}) {
  const req = context.req;
  const res = context.res;
  const id = context.params.id;

  const accessToken = (await getAccessToken(req, res)).accessToken;
  const token: DecodedJwt = jwt_decode(accessToken);
  const permissions = token.permissions;

  const error = permissions.includes("get:instructors") ? false : 403;

  if (error) {
    const errorMessage: string = "You don't have permission to view this page";
    return {
      props: {
        error,
        errorMessage,
      },
    };
  }

  const response = await fetch(`${dbURL}/instructors/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data: Instructor = await response.json();

  if (data.success == false) {
    const error = data.error;
    const errorMessage = data.message;

    return {
      props: {
        error,
        errorMessage,
      },
    };
  }

  const instrumentRes = await fetch(`${dbURL}/instruments?per_page=1000`);
  const instrumentData: InstrumentsQuery = await instrumentRes.json();
  const instruments = instrumentData.instruments;

  const courseRes = await fetch(`${dbURL}/courses?per_page=1000`);
  const courseData: CoursesQuery = await courseRes.json();
  const courses = courseData.courses;

  return {
    props: {
      data,
      instruments,
      courses,
    },
  };
}

function Page({
  data,
  instruments,
  courses,
  error,
  errorMessage,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { user, isLoading } = useUser();

  if (error) {
    return (
      <Layout user={user} loading={isLoading}>
        <Error statusCode={error} title={errorMessage} />
      </Layout>
    );
  }

  return (
    <Layout user={user} loading={isLoading}>
      <InstructorForm
        method="PATCH"
        instruments={instruments}
        courses={courses}
        values={data}
      />
    </Layout>
  );
}

export default withPageAuthRequired(Page);
