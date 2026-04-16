"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/contexts/sidebar-context";
import { useAuth } from "@/contexts/auth-context";
import { getNavigationForRole, type NavItem } from "@/config/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronLeft, GraduationCap, X, LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";

export function AppSidebar() {
  const { isOpen, isCollapsed, close, toggleCollapse } = useSidebar();
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const navigation = getNavigationForRole(user.role);
  const userName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user.email.split('@')[0];

  return (
    <TooltipProvider delayDuration={0}>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out",
          isCollapsed ? "w-[68px]" : "w-64",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-3">
          {!isCollapsed ? (
            <Link href={`/${user.role}`} className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-tight">College ERP</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Management System
                </span>
              </div>
            </Link>
          ) : (
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
          )}
          
          {/* Mobile Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 lg:hidden"
            onClick={close}
          >
            <X className="h-4 w-4" />
          </Button>
          
          {/* Desktop Collapse Button */}
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="hidden h-8 w-8 lg:flex"
              onClick={toggleCollapse}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4 scrollbar-thin">
          <nav className="space-y-6">
            {/* Main Navigation */}
            <div className="space-y-1">
              {!isCollapsed && (
                <p className="mb-2 px-3 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Main Menu
                </p>
              )}
              {navigation.main.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  pathname={pathname}
                  isCollapsed={isCollapsed}
                  onClick={close}
                />
              ))}
            </div>

            {/* Secondary Navigation */}
            {navigation.secondary.length > 0 && (
              <div className="space-y-1">
                {!isCollapsed && (
                  <p className="mb-2 px-3 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Settings
                  </p>
                )}
                {navigation.secondary.map((item) => (
                  <NavLink
                    key={item.href}
                    item={item}
                    pathname={pathname}
                    isCollapsed={isCollapsed}
                    onClick={close}
                  />
                ))}
              </div>
            )}
          </nav>
        </ScrollArea>

        {/* Footer - User Info */}
        <div className="border-t border-sidebar-border p-3">
          <div
            className={cn(
              "flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-sidebar-accent",
              isCollapsed && "justify-center p-2"
            )}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-sm font-medium text-primary-foreground">
              {userName.charAt(0).toUpperCase()}
            </div>
            {!isCollapsed && (
              <div className="flex-1 truncate">
                <p className="truncate text-sm font-medium">{userName}</p>
                <p className="truncate text-xs capitalize text-muted-foreground">
                  {user.role}
                </p>
              </div>
            )}
            {!isCollapsed && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => logout()}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {/* Collapsed expand button */}
          {isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="mt-2 h-8 w-8 w-full"
              onClick={toggleCollapse}
            >
              <ChevronLeft className="h-4 w-4 rotate-180" />
            </Button>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}

interface NavLinkProps {
  item: NavItem;
  pathname: string;
  isCollapsed: boolean;
  onClick?: () => void;
}

function NavLink({ item, pathname, isCollapsed, onClick }: NavLinkProps) {
  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = item.icon;

  const linkContent = (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isCollapsed && "justify-center px-2"
      )}
    >
      <Icon className={cn(
        "h-[18px] w-[18px] shrink-0 transition-transform",
        !isActive && "group-hover:scale-110"
      )} />
      {!isCollapsed && <span className="truncate">{item.title}</span>}
      {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
        <span className={cn(
          "ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold",
          isActive 
            ? "bg-primary-foreground/20 text-primary-foreground" 
            : "bg-primary/10 text-primary"
        )}>
          {item.badge > 99 ? '99+' : item.badge}
        </span>
      )}
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-2">
          {item.title}
          {item.badge !== undefined && item.badge > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
              {item.badge}
            </span>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return linkContent;
}
