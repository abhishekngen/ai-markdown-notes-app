'use client';
import { GalleryVerticalEnd } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login, signup } from '@/server/auth/auth-actions';
import React from 'react';
import { toast } from "sonner"
import { useRouter } from 'next/navigation';
import SignInWithGoogleButton from '@/components/auth/google-signin';

interface LoginFormProps extends React.ComponentProps<'div'> {
    isSignUpForm?: boolean;
}

export default function LoginForm({ className, ...props }: LoginFormProps) {
    const router = useRouter();

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <form
                action={
                    props.isSignUpForm
                        ? async (formData: FormData) => {
                              const { data, error } = await signup(formData);
                              if (error) {
                                  toast(`An error occurred: ${error.message}`);
                              } else if (!data.session) {
                                  toast(
                                      `You have been sent an email to verify your account.`
                                  );
                              } else {
                                  toast(
                                      'You have been successfully logged in!'
                                  );
                                  router.push('/');
                              }
                          }
                        : async (formData: FormData) => {
                              const { error } = await login(formData);
                              if (error) {
                                  toast(`An error occurred: ${error.message}`);
                              } else {
                                  toast(
                                      'You have been successfully logged in!'
                                  );
                                  router.push('/');
                              }
                          }
                }
            >
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center gap-2">
                        <a
                            href="#"
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="flex size-8 items-center justify-center rounded-md">
                                <GalleryVerticalEnd className="size-6" />
                            </div>
                            <span className="sr-only">AI Note Taker</span>
                        </a>
                        <h1 className="text-xl font-bold">
                            Welcome to AI Markdown Notes Editor
                        </h1>
                        {props.isSignUpForm ? (
                            <div className="text-center text-sm">
                                Already have an account?{' '}
                                <a
                                    href="/login"
                                    className="underline underline-offset-4"
                                >
                                    Log In
                                </a>
                            </div>
                        ) : (
                            <div className="text-center text-sm">
                                Don&apos;t have an account?{' '}
                                <a
                                    href="/signup"
                                    className="underline underline-offset-4"
                                >
                                    Sign Up
                                </a>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-3">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="m@example.com"
                                required
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            {props.isSignUpForm ? 'Sign up' : 'Log in'}
                        </Button>
                    </div>
                    <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                        <span className="bg-background text-muted-foreground relative z-10 px-2">
                            Or
                        </span>
                    </div>
                    {/*TODO fix google sign-in*/}
                    <div className="grid gap-4">
                        <SignInWithGoogleButton />
                    </div>
                </div>
            </form>
        </div>
    );
}
