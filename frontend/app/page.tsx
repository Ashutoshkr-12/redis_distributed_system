import { Button } from "@/components/ui/button";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
      <div className="w-full h-screen">
        <div className="w-full h-24 px-6 flex items-center justify-end border-b ">

          <UserButton
      appearance={{
        elements: {
          userButtonAvatarBox: {
            width: "40px",
            height: "40px",
          },
        },
      }}
    />
        </div>
      
    <main className="flex flex-col items-center top-1/2 justify-center gap-6 p-4">
      <h1 className="text-4xl font-bold tracking-tight">
        Welcome User
      </h1>

      <header className="flex items-center gap-4">
        {/* Visible ONLY when user is signed OUT */}
        <Show when="signed-out">
          <SignInButton mode="modal">
            <Button className="rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-5 transition-colors cursor-pointer">
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button className="rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-5 transition-colors cursor-pointer">
              Sign Up
            </Button>
          </SignUpButton>
        </Show>

        {/* Visible ONLY when user is signed IN */}
        <Show when="signed-in">
          <Link href="/upload">
            <Button className="rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-6 cursor-pointer">
              Upload Video
            </Button>
          </Link>
          
        </Show>
      </header>
    </main>
    </div>

  );
}