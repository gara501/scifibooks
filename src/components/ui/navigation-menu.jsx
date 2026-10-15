import { NavigationMenu as Primitive } from 'radix-ui'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

function NavigationMenu({ className, ...props }) {
  return <Primitive.Root className={cn('relative z-10', className)} {...props} />
}
function NavigationMenuList({ className, ...props }) {
  return <Primitive.List className={cn('flex list-none items-center gap-1', className)} {...props} />
}
function NavigationMenuItem(props) {
  return <Primitive.Item {...props} />
}
function NavigationMenuTrigger({ className, children, ...props }) {
  return <Primitive.Trigger className={cn('group inline-flex min-h-11 items-center gap-2 rounded-md px-4 text-xs text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary focus-visible:outline-2 focus-visible:outline-primary data-[state=open]:bg-primary/10 data-[state=open]:text-primary', className)} {...props}>{children}<ChevronDown aria-hidden="true" className="size-3.5 transition-transform group-data-[state=open]:rotate-180" /></Primitive.Trigger>
}
function NavigationMenuContent({ className, ...props }) {
  return <Primitive.Content className={cn('absolute right-0 top-full mt-2 w-[460px] rounded-lg border border-primary/25 bg-background p-3 shadow-[0_20px_70px_#000a] motion-safe:data-[state=open]:animate-in motion-safe:data-[state=open]:fade-in motion-safe:data-[state=open]:slide-in-from-top-2', className)} {...props} />
}
function NavigationMenuLink({ className, ...props }) {
  return <Primitive.Link className={cn('rounded-md transition-colors hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-primary data-[active]:bg-primary/10 data-[active]:text-primary', className)} {...props} />
}
export { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink }
