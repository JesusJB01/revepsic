export default function LogoutButton() {
  return (
    <form action="/auth/sign-out" method="post">
      <button className="py-2 px-4 rounded-md no-underline bg-violet-500 hover:bg-violet-600">
        Logout
      </button>
    </form>
  )
}
