"use client";
import * as React from "react"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { Link, useNavigate } from "react-router-dom";
import StipLogo from "../../assets/StipLogo";

const components = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description: "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description: "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description: "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
]

export default function ResponsiveNav() {
  const [isOpen, setIsOpen] = React.useState(false)
  const navigate = useNavigate();

  return (
    <header
      className="flex items-center justify-between w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-10 lg:px-20 xl:px-25">
      <div className="flex h-14 items-center justify-between w-full">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <div className="hidden sm:inline-block">
              <StipLogo />
            </div>
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul
                    className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/">
                          <div className="mb-2 mt-4 text-lg font-medium">shadcn/ui</div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Beautifully designed components built with Radix UI and Tailwind CSS.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/docs" title="Introduction">
                      Re-usable components built using Radix UI and Tailwind CSS.
                    </ListItem>
                    <ListItem href="/docs/installation" title="Installation">
                      How to install dependencies and structure your app.
                    </ListItem>
                    <ListItem href="/docs/primitives/typography" title="Typography">
                      Styles for headings, paragraphs, lists...etc
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Components</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul
                    className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {components.map((component) => (
                      <ListItem key={component.title} title={component.title} href={component.href}>
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/docs" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Documentation</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen} >
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
              <Menu className="h-8 w-8" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-5 bg-sky-900">
            <MobileLink href="/" className="flex items-center justify-center" onOpenChange={setIsOpen}>
              <StipLogo />
            </MobileLink>
            <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6 text-white">
              <div className="flex flex-col space-y-3">
                <MobileLink href="/docs" onOpenChange={setIsOpen}>
                  Getting Started
                </MobileLink>
                <MobileLink href="/docs/installation" onOpenChange={setIsOpen}>
                  Installation
                </MobileLink>
                <MobileLink href="/docs/components" onOpenChange={setIsOpen}>
                  Components
                </MobileLink>
                <MobileLink href="/docs" onOpenChange={setIsOpen}>
                  Documentation
                </MobileLink>
              </div>
              <div className="flex flex-col space-y-2 pt-6">
                <h4 className="font-medium">Components</h4>
                {components.map((component) => (
                  <MobileLink
                    key={component.href}
                    href={component.href}
                    onOpenChange={setIsOpen}
                    className="text-white/70">
                    {component.title}
                  </MobileLink>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <div
          className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link href="/" className="flex items-center space-x-2 md:hidden">
              <StipLogo />
            </Link>
          </div>
          <nav className="flex items-center">
            <Button variant="ghost" size="sm" onClick={() => navigate("/signin")}>
              Entrar
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}

const ListItem = React.forwardRef(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}>
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  );
})
ListItem.displayName = "ListItem"

function MobileLink({
  href,
  onOpenChange,
  className,
  ...props
}) {
  return (
    <Link
      href={href}
      onClick={() => {
        onOpenChange?.(false)
      }}
      className={cn(className)}
      {...props}>
      {props.children}
    </Link>
  );
}
