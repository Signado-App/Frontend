export async function registerUser(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { success: true };
}