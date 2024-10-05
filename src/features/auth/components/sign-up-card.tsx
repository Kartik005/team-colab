import React, { useState } from 'react'
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardTitle
} from '@/components/ui/card'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import { SignInFlow } from '../types'
import { TriangleAlert } from "lucide-react"
import { useAuthActions } from '@convex-dev/auth/react'

interface SignUpCardProps {
  setState: (state: SignInFlow) => void;
}


const SignUpCard = ({ setState }: SignUpCardProps) => {
  // method used is always signIn, whether signIn or signUp
  const { signIn } = useAuthActions();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const onPasswordSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords don't match")
      return;
    }

    setPending(true);

    signIn("password", { name, email, password, flow: "signUp" })
      .catch(() => {
        setError("Something went wrong");
      })
      .finally(() => {
        setPending(false);
      })

  }

  const onProviderSignUp = (value: "github" | "google") => {
    setPending(true);
    signIn(value).finally(() => {
      setPending(false);
    })
  }

  return (
    <Card className='h-full p-8 flex-col text-center items-center  justify-center'>

      <CardHeader className='px-0 pt-0'>
        Sign up to continue
        <CardDescription>
          Use gmail to sign up
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
        <form
          onSubmit={onPasswordSignUp}
          className='space-y-2.5'>

            {/* name */}
          <Input disabled={false}
            value={name}
            placeholder='Full name'
            onChange={(e) => setName(e.target.value)}
            
            required
          />

          {/* email */}
          <Input disabled={false}
            value={email}
            placeholder='Email'
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
          {/* passowrd */}
          <Input disabled={pending}
            value={password}
            placeholder='Password'
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />

          {/* confirm password */}
          <Input disabled={pending}
            value={confirmPassword}
            placeholder='Confirm Password'
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            required
          />
          <Button type="submit" className='w-full' size="lg"
            disabled={pending}>
            Continue
          </Button>

        </form>
        <Separator />

        <div className='flex flex-col gap-y-2.5'>
          {/* google sign up */}
          <Button
            disabled={pending}
            onClick={() => onProviderSignUp("google")}
            variant="outline"
            size="lg"
            className=' w-full relative'
          >
            <FcGoogle className='size-5 absolute top-2.5 left-2.5' />
            Continue with google

          </Button>

          {/* github sign up */}
          <Button
            disabled={pending}
            onClick={() => onProviderSignUp("github")}
            variant="outline"
            size="lg"
            className=' w-full relative'
          >
            <FaGithub className='size-5 absolute top-2.5 left-2.5' />
            Continue with Github
          </Button>
        </div>
        <p className=' text-xs text-muted-foreground'>
          Already have an account?
          <span
            onClick={() => setState("signIn")}
            className='text-sky-700 hover:underline cursor-pointer'>Sign In</span>

        </p>
      </CardContent>

    </Card>
  )
}

export default SignUpCard