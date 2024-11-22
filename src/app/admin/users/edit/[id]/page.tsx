export default async function UserEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return <div>EDIT PAGE {id}</div>;
}
