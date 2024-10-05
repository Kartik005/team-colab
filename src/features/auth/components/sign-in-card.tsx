import React, { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import { useAuthActions } from "@convex-dev/auth/react";

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { TriangleAlert } from "lucide-react"

import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  // CardTitle
} from '@/components/ui/card'


import { SignInFlow } from '../types'

interface SignInCardProps {
  setState: (state: SignInFlow) => void;
}

const SignInCard = ({ setState }: SignInCardProps) => {
  const { signIn } = useAuthActions();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const onPasswordSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setPending(true);
    signIn("password", { email, password, flow: "signIn" })
      .catch(() => {
        setError("Invalid email or password");
      })
      .finally(() => {
        setPending(false);
      })
  }
  const onProviderSignIn = (value: "github" | "google") => {
    setPending(true);
    signIn(value).finally(() => {
      setPending(false);
    })
  }


  return (
    <Card className='h-full p-8 flex-col text-center items-center  justify-center'>
      <CardHeader className='px-0 pt-0'>
        Login to continue
        <CardDescription>
          Use gmail to sign in
        </CardDescription>
      </CardHeader>

      {/* render error */}
      {!!error && (
        <div className='bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6'>
          <TriangleAlert className="size-4" />
          <p>{error}</p>

        </div>
      )}

      <CardContent className='space-y-5 px-0 pb-0'>
        <form onSubmit={onPasswordSignIn} className='space-y-2.5'>
          {/* email */}
          <Input disabled={pending}
            value={email}
            placeholder='Email'
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />

          {/* password */}
          <Input disabled={pending}
            value={password}
            placeholder='Password'
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
          <Button type="submit" className='w-full' size="lg" disabled={pending}>
            Continue
          </Button>

        </form>
        <Separator />

        <div className='flex flex-col gap-y-2.5'>
          {/* google signin button */}
          <Button
            disabled={pending}
            onClick={() => onProviderSignIn("google")}
            variant="outline"
            size="lg"
            className=' w-full relative'
          >
            <FcGoogle className='size-5 absolute top-2.5 left-2.5' />
            Continue with google

          </Button>

          {/* button signin github */}
          <Button
            disabled={pending}
            onClick={() => onProviderSignIn("github")}
            variant="outline"
            size="lg"
            className=' w-full relative'
          >
            <FaGithub className='size-5 absolute top-2.5 left-2.5' />
            Continue with Github
          </Button>
        </div>
        <p className=' text-xs text-muted-foreground'>
        Don&apos;t have an account?
          <span
            onClick={() => setState("signUp")}
            className='text-sky-700 hover:underline cursor-pointer'>Sign Up</span>

        </p>
      </CardContent>

    </Card>
  )
}

export default SignInCard